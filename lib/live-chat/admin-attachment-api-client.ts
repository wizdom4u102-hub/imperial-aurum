import type { ChatMessageAttachment } from "./attachment-types";

interface UploadAdminChatImageResponse {
  success: boolean;
  data?: ChatMessageAttachment;
  error?: string;
}

export async function uploadAdminChatImage(
  input: {
    conversationId: string;
    messageId: string;
    file: File;
  },
): Promise<ChatMessageAttachment> {
  const formData = new FormData();

  formData.append(
    "conversationId",
    input.conversationId,
  );

  formData.append(
    "messageId",
    input.messageId,
  );

  formData.append("file", input.file);

  const response = await fetch(
    "/api/admin/live-chat/attachments",
    {
      method: "POST",
      body: formData,
    },
  );

  let result: UploadAdminChatImageResponse;

  try {
    result =
      (await response.json()) as UploadAdminChatImageResponse;
  } catch {
    throw new Error(
      "Invalid response from admin image upload service",
    );
  }

  if (!response.ok || !result.success) {
    throw new Error(
      result.error ??
        "Failed to upload admin chat image",
    );
  }

  if (!result.data) {
    throw new Error(
      "Image upload succeeded without attachment data",
    );
  }

  return result.data;
}