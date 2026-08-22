import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type AttachmentResponse = {
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
): Promise<NextResponse<AttachmentResponse>> {
  let uploadedFilePath: string | null = null;

  try {
    const formData = await request.formData();

    const sessionId = formData.get("sessionId");
    const conversationId =
      formData.get("conversationId");
    const messageId = formData.get("messageId");
    const file = formData.get("file");

    if (
      typeof sessionId !== "string" ||
      typeof conversationId !== "string" ||
      typeof messageId !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Session, conversation, and message are required",
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

    const supabase = await createClient();

    const extension =
      file.name.split(".").pop()?.toLowerCase() ??
      "jpg";

    const filePath = [
      sessionId,
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

    /*
     * The visitor session/conversation/message validation
     * happens inside the SECURITY DEFINER function.
     */
    const { data: attachment, error: attachmentError } =
      await supabase.rpc(
        "create_visitor_chat_attachment",
        {
          p_session_id: sessionId,
          p_conversation_id: conversationId,
          p_message_id: messageId,
          p_file_path: filePath,
          p_file_name: file.name,
          p_mime_type: file.type,
          p_file_size: file.size,
        },
      );

    if (attachmentError) {
      await supabase.storage
        .from("chat-images")
        .remove([filePath]);

      uploadedFilePath = null;

      throw new Error(
        `Failed to create chat attachment: ${attachmentError.message}`,
      );
    }

    if (!attachment) {
      await supabase.storage
        .from("chat-images")
        .remove([filePath]);

      uploadedFilePath = null;

      throw new Error(
        "Chat attachment was not created",
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
        // Cleanup failure must not hide the original error.
      }
    }

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to upload chat image",
      },
      { status: 500 },
    );
  }
}