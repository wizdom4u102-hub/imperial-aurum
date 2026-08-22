/* -------------------------------------------------------------------------- */
/*                         Chat Attachment Types                              */
/* -------------------------------------------------------------------------- */

export interface ChatMessageAttachmentRecord {
  id: string;
  message_id: string;
  file_path: string;
  file_name: string;
  mime_type: string;
  file_size: number;
  created_at: string;
}

/* -------------------------------------------------------------------------- */
/*                          Attachment Upload                                */
/* -------------------------------------------------------------------------- */

export interface UploadChatImageInput {
  sessionId: string;
  conversationId: string;
  messageId: string;
  file: File;
}

/* -------------------------------------------------------------------------- */
/*                          Attachment Response                              */
/* -------------------------------------------------------------------------- */

export interface ChatMessageAttachment {
  id: string;
  messageId: string;
  filePath: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  createdAt: string;
  publicUrl: string;
}