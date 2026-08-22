import type {
  ChatMessageAttachment,
  ChatMessageAttachmentRecord,
} from "./attachment-types";

export function mapChatMessageAttachment(
  record: ChatMessageAttachmentRecord,
  publicUrl: string,
): ChatMessageAttachment {
  return {
    id: record.id,
    messageId: record.message_id,
    filePath: record.file_path,
    fileName: record.file_name,
    mimeType: record.mime_type,
    fileSize: record.file_size,
    createdAt: record.created_at,
    publicUrl,
  };
}

export function isChatImageAttachment(
  attachment: ChatMessageAttachment,
): boolean {
  return attachment.mimeType.startsWith(
    "image/",
  );
}