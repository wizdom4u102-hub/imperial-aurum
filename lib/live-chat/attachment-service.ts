import { createClient } from "@/lib/supabase/server";

import type {
  ChatMessageAttachmentRecord,
} from "./attachment-types";

export async function getChatMessageAttachments(
  messageId: string,
): Promise<ChatMessageAttachmentRecord[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("chat_message_attachments")
    .select("*")
    .eq("message_id", messageId)
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    throw new Error(
      `Failed to load chat attachments: ${error.message}`,
    );
  }

  return data;
}

export async function getChatConversationAttachments(
  conversationId: string,
): Promise<ChatMessageAttachmentRecord[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("chat_message_attachments")
    .select(
      `
        *,
        chat_messages!inner(
          conversation_id
        )
      `,
    )
    .eq(
      "chat_messages.conversation_id",
      conversationId,
    )
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    throw new Error(
      `Failed to load conversation attachments: ${error.message}`,
    );
  }

  return data.map((record) => {
    const {
      chat_messages: _chatMessage,
      ...attachment
    } = record;

    return attachment;
  });
}