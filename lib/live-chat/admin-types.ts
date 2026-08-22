import type {
  ChatConversationRecord,
  ChatMessageRecord,
} from "./types";

/* -------------------------------------------------------------------------- */
/*                         Admin Conversation                                */
/* -------------------------------------------------------------------------- */

export interface AdminChatConversation {
  conversation: ChatConversationRecord;
  latestMessage: ChatMessageRecord | null;
  unreadMessageCount: number;
}

/* -------------------------------------------------------------------------- */
/*                              Admin Message                                 */
/* -------------------------------------------------------------------------- */

export interface AdminChatMessage {
  message: ChatMessageRecord;
  isVisitorMessage: boolean;
  isAdminMessage: boolean;
}

/* -------------------------------------------------------------------------- */
/*                           Conversation List                                */
/* -------------------------------------------------------------------------- */

export interface AdminChatConversationList {
  conversations: AdminChatConversation[];
  total: number;
}

/* -------------------------------------------------------------------------- */
/*                            Admin Chat State                                */
/* -------------------------------------------------------------------------- */

export interface AdminChatState {
  conversations: AdminChatConversation[];
  selectedConversationId: string | null;
  messages: ChatMessageRecord[];
  isLoading: boolean;
  isLoadingMessages: boolean;
  isSending: boolean;
  error: string | null;
}