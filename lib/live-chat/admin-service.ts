import { createClient } from "@/lib/supabase/server";

import type {
  ChatMessageAttachment,
} from "./attachment-types";

import { createLiveChatNotification } from "./notifications";

import type {
  ChatConversationRecord,
  ChatMessageRecord,
} from "./types";

import type {
  AdminChatConversation,
} from "./admin-types";

export type AdminChatMessageRecord =
  ChatMessageRecord & {
    attachments: ChatMessageAttachment[];
  };

/* -------------------------------------------------------------------------- */
/*                         Admin Conversations                               */
/* -------------------------------------------------------------------------- */

export async function getAdminChatConversations(): Promise<
  AdminChatConversation[]
> {
  const supabase = await createClient();

  const {
    data: conversations,
    error: conversationsError,
  } = await supabase
    .from("chat_conversations")
    .select("*")
    .order("last_message_at", {
      ascending: false,
    });

  if (conversationsError) {
    throw new Error(
      `Failed to load chat conversations: ${conversationsError.message}`,
    );
  }

  /*
   * Load all unread visitor messages in one
   * query instead of querying each conversation
   * separately.
   */
  const {
    data: unreadMessages,
    error: unreadMessagesError,
  } = await supabase
    .from("chat_messages")
    .select("conversation_id")
    .eq("sender_type", "visitor")
    .eq("is_read", false);

  if (unreadMessagesError) {
    throw new Error(
      `Failed to load unread chat messages: ${unreadMessagesError.message}`,
    );
  }

  const unreadCounts =
    new Map<string, number>();

  for (const message of unreadMessages) {
    const currentCount =
      unreadCounts.get(
        message.conversation_id,
      ) ?? 0;

    unreadCounts.set(
      message.conversation_id,
      currentCount + 1,
    );
  }

  return conversations.map(
    (
      conversation: ChatConversationRecord,
    ) => ({
      conversation,
      latestMessage: null,
      unreadMessageCount:
        unreadCounts.get(
          conversation.id,
        ) ?? 0,
    }),
  );
}

/* -------------------------------------------------------------------------- */
/*                         Admin Messages                                    */
/* -------------------------------------------------------------------------- */

export async function getAdminChatMessages(
  conversationId: string,
): Promise<AdminChatMessageRecord[]> {
  const supabase = await createClient();

  const {
    data: messages,
    error: messagesError,
  } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", {
      ascending: true,
    });

  if (messagesError) {
    throw new Error(
      `Failed to load chat messages: ${messagesError.message}`,
    );
  }

  if (messages.length === 0) {
    return [];
  }

  const messageIds = messages.map(
    (message) => message.id,
  );

  const {
    data: attachmentRecords,
    error: attachmentsError,
  } = await supabase
    .from("chat_message_attachments")
    .select("*")
    .in("message_id", messageIds)
    .order("created_at", {
      ascending: true,
    });

  if (attachmentsError) {
    throw new Error(
      `Failed to load chat attachments: ${attachmentsError.message}`,
    );
  }

  const attachmentsByMessageId =
    new Map<
      string,
      ChatMessageAttachment[]
    >();

  for (const attachment of attachmentRecords) {
    const { data } =
      supabase.storage
        .from("chat-images")
        .getPublicUrl(
          attachment.file_path,
        );

    const mappedAttachment:
      ChatMessageAttachment = {
      id: attachment.id,
      messageId:
        attachment.message_id,
      filePath:
        attachment.file_path,
      fileName:
        attachment.file_name,
      mimeType:
        attachment.mime_type,
      fileSize:
        attachment.file_size,
      createdAt:
        attachment.created_at,
      publicUrl: data.publicUrl,
    };

    const existing =
      attachmentsByMessageId.get(
        attachment.message_id,
      );

    if (existing) {
      existing.push(
        mappedAttachment,
      );
    } else {
      attachmentsByMessageId.set(
        attachment.message_id,
        [mappedAttachment],
      );
    }
  }

  return messages.map(
    (message) => ({
      ...message,
      attachments:
        attachmentsByMessageId.get(
          message.id,
        ) ?? [],
    }),
  );
}

/* -------------------------------------------------------------------------- */
/*                         Send Admin Message                                */
/* -------------------------------------------------------------------------- */

export async function sendAdminChatMessage(
  conversation: ChatConversationRecord,
  message: string,
): Promise<ChatMessageRecord> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error(
      "Admin authentication required",
    );
  }

  const trimmedMessage =
    message.trim();

  if (!trimmedMessage) {
    throw new Error(
      "Message cannot be empty",
    );
  }

  if (conversation.status === "closed") {
    throw new Error(
      "Cannot send a message in a closed conversation",
    );
  }

  const { data, error } =
    await supabase
      .from("chat_messages")
      .insert({
        conversation_id:
          conversation.id,
        session_id:
          conversation.session_id,
        sender_type: "admin",
        sender_id: user.id,
        message: trimmedMessage,
        is_read: false,
      })
      .select("*")
      .single();

  if (error) {
    throw new Error(
      `Failed to send admin chat message: ${error.message}`,
    );
  }

  const now =
    new Date().toISOString();

  const {
    error: conversationError,
  } = await supabase
    .from("chat_conversations")
    .update({
      last_message_at: now,
      updated_at: now,
    })
    .eq("id", conversation.id);

  if (conversationError) {
    throw new Error(
      `Failed to update conversation: ${conversationError.message}`,
    );
  }

  try {
    await createLiveChatNotification({
      conversationId:
        conversation.id,
      messageId: data.id,
      userId:
        conversation.user_id,
      senderType: "admin",
      message: trimmedMessage,
    });
  } catch (notificationError) {
    console.error(
      "Failed to create admin chat notification:",
      notificationError,
    );
  }

  return data;
}

/* -------------------------------------------------------------------------- */
/*                         Mark Messages Read                                */
/* -------------------------------------------------------------------------- */

export async function markAdminChatMessagesAsRead(
  conversationId: string,
): Promise<void> {
  const supabase = await createClient();

  const { error } =
    await supabase
      .from("chat_messages")
      .update({
        is_read: true,
      })
      .eq(
        "conversation_id",
        conversationId,
      )
      .eq(
        "sender_type",
        "visitor",
      )
      .eq(
        "is_read",
        false,
      );

  if (error) {
    throw new Error(
      `Failed to mark chat messages as read: ${error.message}`,
    );
  }
}

/* -------------------------------------------------------------------------- */
/*                         Close Conversation                                */
/* -------------------------------------------------------------------------- */

export async function closeAdminChatConversation(
  conversationId: string,
): Promise<void> {
  const supabase = await createClient();

  const now =
    new Date().toISOString();

  const { error } =
    await supabase
      .from("chat_conversations")
      .update({
        status: "closed",
        closed_at: now,
        updated_at: now,
      })
      .eq("id", conversationId);

  if (error) {
    throw new Error(
      `Failed to close chat conversation: ${error.message}`,
    );
  }
}

/* -------------------------------------------------------------------------- */
/*                         Reopen Conversation                               */
/* -------------------------------------------------------------------------- */

export async function reopenAdminChatConversation(
  conversationId: string,
): Promise<void> {
  const supabase = await createClient();

  const now =
    new Date().toISOString();

  const { error } =
    await supabase
      .from("chat_conversations")
      .update({
        status: "open",
        closed_at: null,
        updated_at: now,
      })
      .eq("id", conversationId);

  if (error) {
    throw new Error(
      `Failed to reopen chat conversation: ${error.message}`,
    );
  }
}

export async function getAdminUnreadChatMessageCount(): Promise<number> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("chat_messages")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("sender_type", "visitor")
    .eq("is_read", false);

  if (error) {
    throw new Error(
      `Failed to load unread chat message count: ${error.message}`,
    );
  }

  return count ?? 0;
}