import type { Database } from "@/lib/supabase/database.types";

/* -------------------------------------------------------------------------- */
/*                         Database Record Types                              */
/* -------------------------------------------------------------------------- */

export type ChatConversationRecord =
  Database["public"]["Tables"]["chat_conversations"]["Row"];

export type ChatMessageRecord =
  Database["public"]["Tables"]["chat_messages"]["Row"];

export type ChatConversationInsert =
  Database["public"]["Tables"]["chat_conversations"]["Insert"];

export type ChatConversationUpdate =
  Database["public"]["Tables"]["chat_conversations"]["Update"];

export type ChatMessageInsert =
  Database["public"]["Tables"]["chat_messages"]["Insert"];

export type ChatMessageUpdate =
  Database["public"]["Tables"]["chat_messages"]["Update"];

/* -------------------------------------------------------------------------- */
/*                          Conversation Status                               */
/* -------------------------------------------------------------------------- */

export type ChatConversationStatus =
  | "open"
  | "waiting"
  | "active"
  | "closed";

/* -------------------------------------------------------------------------- */
/*                              Sender Types                                  */
/* -------------------------------------------------------------------------- */

export type ChatSenderType =
  | "visitor"
  | "admin"
  | "system";

/* -------------------------------------------------------------------------- */
/*                         Create Conversation                                */
/* -------------------------------------------------------------------------- */

export interface CreateChatConversationInput {
  sessionId: string;
  userId?: string | null;
  subject?: string | null;
}

/* -------------------------------------------------------------------------- */
/*                           Send Message                                     */
/* -------------------------------------------------------------------------- */

export interface SendChatMessageInput {
  sessionId: string;
  conversationId: string;
  message: string;
}

/* -------------------------------------------------------------------------- */
/*                         Message Attachment                                 */
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

/* -------------------------------------------------------------------------- */
/*                          Chat Message                                      */
/* -------------------------------------------------------------------------- */

export interface ChatMessage {
  id: string;
  conversationId: string;
  sessionId: string;
  senderType: ChatSenderType;
  senderId: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
  attachments: ChatMessageAttachment[];
}

/* -------------------------------------------------------------------------- */
/*                       Chat Conversation                                    */
/* -------------------------------------------------------------------------- */

export interface ChatConversation {
  id: string;
  sessionId: string;
  userId: string | null;
  status: ChatConversationStatus;
  subject: string | null;
  assignedAdminId: string | null;
  startedAt: string;
  lastMessageAt: string;
  closedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/* -------------------------------------------------------------------------- */
/*                         Chat State                                         */
/* -------------------------------------------------------------------------- */

export interface ChatState {
  conversationId: string | null;
  sessionId: string | null;
  messages: ChatMessage[];
  status: ChatConversationStatus | null;
  isOpen: boolean;
  isLoading: boolean;
  isSending: boolean;
  error: string | null;
}