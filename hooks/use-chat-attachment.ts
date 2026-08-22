"use client";

import { useCallback, useState } from "react";

import { uploadChatImage } from "@/lib/live-chat/attachment-api-client";
import type { ChatMessageAttachment } from "@/lib/live-chat/attachment-types";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

interface UploadChatAttachmentInput {
  sessionId: string;
  conversationId: string;
  messageId: string;
  file: File;
}

export function useChatAttachment() {
  const [attachment, setAttachment] =
    useState<ChatMessageAttachment | null>(null);

  const [isUploading, setIsUploading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const upload = useCallback(
    async (
      input: UploadChatAttachmentInput,
    ): Promise<ChatMessageAttachment | null> => {
      setError(null);

      if (!ALLOWED_IMAGE_TYPES.has(input.file.type)) {
        const message =
          "Only JPEG, PNG, WebP, and GIF images are allowed";

        setError(message);

        return null;
      }

      if (input.file.size <= 0) {
        const message = "Image file is empty";

        setError(message);

        return null;
      }

      if (input.file.size > MAX_FILE_SIZE) {
        const message =
          "Image must be 5 MB or smaller";

        setError(message);

        return null;
      }

      setIsUploading(true);

      try {
        const result =
          await uploadChatImage(input);

        setAttachment(result);

        return result;
      } catch (uploadError) {
        const message =
          uploadError instanceof Error
            ? uploadError.message
            : "Failed to upload image";

        setError(message);

        return null;
      } finally {
        setIsUploading(false);
      }
    },
    [],
  );

  const clear = useCallback(() => {
    setAttachment(null);
    setError(null);
  }, []);

  return {
    attachment,
    isUploading,
    error,
    upload,
    clear,
  };
}