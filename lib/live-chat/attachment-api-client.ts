import type { ChatMessageAttachment } from "./attachment-types";

interface UploadChatImageResponse {
  success: boolean;
  data?: ChatMessageAttachment;
  error?: string;
}

export async function uploadChatImage(
  input: {
    sessionId: string;
    conversationId: string;
    messageId: string;
    file: File;
  },
): Promise<ChatMessageAttachment> {
  const formData = new FormData();

  formData.append("sessionId", input.sessionId);
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
    "/api/live-chat/attachments",
    {
      method: "POST",
      body: formData,
    },
  );

  let result: UploadChatImageResponse;

  try {
    result =
      (await response.json()) as UploadChatImageResponse;
  } catch {
    throw new Error(
      "Invalid response from image upload service",
    );
  }

  if (!response.ok || !result.success) {
    throw new Error(
      result.error ??
        "Failed to upload chat image",
    );
  }

  if (!result.data) {
    throw new Error(
      "Image upload succeeded without attachment data",
    );
  }

  return result.data;
}