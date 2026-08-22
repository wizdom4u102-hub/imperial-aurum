import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type AdminAttachmentResponse = {
  success: boolean;
  data?: {
    id: string;
    messageId: string;
    filePath: string;
    fileName: string;
    mimeType: string;
    fileSize: number;
    createdAt: string;
    publicUrl: string;
  };
  error?: string;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export async function POST(
  request: Request,
): Promise<
  NextResponse<AdminAttachmentResponse>
> {
  let uploadedFilePath: string | null = null;

  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: "Admin authentication required",
        },
        { status: 401 },
      );
    }

    const formData = await request.formData();

    const conversationId =
      formData.get("conversationId");

    const messageId =
      formData.get("messageId");

    const file = formData.get("file");

    if (
      typeof conversationId !== "string" ||
      typeof messageId !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Conversation and message are required",
        },
        { status: 400 },
      );
    }

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error: "Image file is required",
        },
        { status: 400 },
      );
    }

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Only JPEG, PNG, WebP, and GIF images are allowed",
        },
        { status: 400 },
      );
    }

    if (file.size <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Image file is empty",
        },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Image must be 5 MB or smaller",
        },
        { status: 400 },
      );
    }

    const { data: message, error: messageError } =
      await supabase
        .from("chat_messages")
        .select(
          "id, conversation_id, sender_id, sender_type",
        )
        .eq("id", messageId)
        .eq(
          "conversation_id",
          conversationId,
        )
        .eq("sender_id", user.id)
        .eq("sender_type", "admin")
        .single();

    if (messageError || !message) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Admin message could not be verified",
        },
        { status: 403 },
      );
    }

    const extension =
      file.name.split(".").pop()?.toLowerCase() ??
      "jpg";

    const filePath = [
      conversationId,
      messageId,
      `${crypto.randomUUID()}.${extension}`,
    ].join("/");

    uploadedFilePath = filePath;

    const fileBuffer = await file.arrayBuffer();

    const { error: uploadError } =
      await supabase.storage
        .from("chat-images")
        .upload(filePath, fileBuffer, {
          contentType: file.type,
          cacheControl: "3600",
          upsert: false,
        });

    if (uploadError) {
      throw new Error(
        `Failed to upload chat image: ${uploadError.message}`,
      );
    }

    const { data: attachment, error: attachmentError } =
      await supabase
        .from("chat_message_attachments")
        .insert({
          message_id: message.id,
          file_path: filePath,
          file_name: file.name,
          mime_type: file.type,
          file_size: file.size,
        })
        .select("*")
        .single();

    if (attachmentError) {
      await supabase.storage
        .from("chat-images")
        .remove([filePath]);

      uploadedFilePath = null;

      throw new Error(
        `Failed to create chat attachment: ${attachmentError.message}`,
      );
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("chat-images")
      .getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      data: {
        id: attachment.id,
        messageId: attachment.message_id,
        filePath: attachment.file_path,
        fileName: attachment.file_name,
        mimeType: attachment.mime_type,
        fileSize: attachment.file_size,
        createdAt: attachment.created_at,
        publicUrl,
      },
    });
  } catch (error) {
    if (uploadedFilePath) {
      try {
        const supabase =
          await createClient();

        await supabase.storage
          .from("chat-images")
          .remove([uploadedFilePath]);
      } catch {
        // Preserve the original error.
      }
    }

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to upload admin chat image",
      },
      { status: 500 },
    );
  }
}