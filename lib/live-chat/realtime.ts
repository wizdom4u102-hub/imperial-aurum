import { createClient } from "@/lib/supabase/client";

import type {
  ChatMessage,
  ChatMessageRecord,
} from "./types";

function mapChatMessage(
  record: ChatMessageRecord,
): ChatMessage {
  return {
    id: record.id,
    conversationId: record.conversation_id,
    sessionId: record.session_id,
    senderType:
      record.sender_type === "admin"
        ? "admin"
        : "visitor",
    senderId: record.sender_id,
    message: record.message,
    isRead: record.is_read,
    createdAt: record.created_at,
    attachments: [],
  };
}

export function subscribeToChatMessages(
  conversationId: string,
  onMessage: (message: ChatMessage) => void,
): () => void {
  const supabase = createClient();

  const channel = supabase
    .channel(
      `chat-conversation-${conversationId}`,
    )
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "chat_messages",
        filter:
          `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        const record =
          payload.new as ChatMessageRecord;

        onMessage(
          mapChatMessage(record),
        );
      },
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}