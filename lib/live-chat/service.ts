import { createClient } from "@/lib/supabase/server";

import type {
  ChatMessage,
  ChatMessageAttachment,
  CreateChatConversationInput,
  SendChatMessageInput,
} from "./types";

import {
  notifyAdminOfNewChatMessage,
} from "./push-notifications";

import { createLiveChatNotification } from "./notifications";

type VisitorChatMessageRow = {
  id: string;
  conversation_id: string;
  session_id: string;
  sender_type: "visitor" | "admin" | "system";
  sender_id: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
};

type ChatAttachmentRow = {
  id: string;
  message_id: string;
  file_path: string;
  file_name: string;
  mime_type: string;
  file_size: number;
  created_at: string;
};

export async function createChatConversation(
  input: CreateChatConversationInput,
): Promise<string> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "create_visitor_chat",
    {
      p_session_id: input.sessionId,
      p_subject: input.subject ?? undefined,
      p_user_id: input.userId ?? undefined,
    },
  );

  if (error) {
    throw new Error(
      `Failed to create chat conversation: ${error.message}`,
    );
  }

  if (!data) {
    throw new Error(
      "Chat conversation was not created",
    );
  }

  return data;
}

export async function createChatBusyMessage(
  sessionId: string,
  conversationId: string,
): Promise<string | null> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "create_chat_busy_message",
    {
      p_conversation_id: conversationId,
      p_session_id: sessionId,
    },
  );

  if (error) {
    throw new Error(
      `Failed to create chat busy message: ${error.message}`,
    );
  }

  return data ?? null;
}

export async function sendChatMessage(
  input: SendChatMessageInput,
): Promise<string> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "send_visitor_chat_message",
    {
      p_session_id: input.sessionId,
      p_conversation_id: input.conversationId,
      p_message: input.message,
    },
  );

  if (error) {
    throw new Error(
      `Failed to send chat message: ${error.message}`,
    );
  }

  if (!data) {
    throw new Error(
      "Chat message was not created",
    );
  }

  /*
   * Get the conversation user so registered
   * visitors can receive an in-app notification.
   *
   * Anonymous visitors have no user_id, so the
   * notification service will only create the
   * admin notification for them.
   */
const {
  data: conversation,
  error: conversationError,
} = await supabase
  .from("chat_conversations")
  .select("user_id")
  .eq("id", input.conversationId)
  .limit(1)
  .maybeSingle();

 if (conversationError) {
  console.error(
    "Failed to load chat conversation:",
    conversationError,
  );
}

  try {
    await createLiveChatNotification({
      conversationId: input.conversationId,
      messageId: data,
      userId: conversation?.user_id ?? null,
      senderType: "visitor",
      message: input.message,
    });
  } catch (notificationError) {
    console.error(
      "Failed to create visitor chat notification:",
      notificationError,
    );
  }

  /*
   * Notify the admin about the new visitor message.
   *
   * Push notification failure must never cause
   * the visitor's successfully-sent message to fail.
   */
  void notifyAdminOfNewChatMessage(
    input.conversationId,
    input.message,
  );

  return data;
}

export async function getChatMessages(
  sessionId: string,
  conversationId: string,
): Promise<ChatMessage[]> {
  const supabase = await createClient();

  const { data: messageData, error } =
    await supabase.rpc(
      "get_visitor_chat_messages",
      {
        p_session_id: sessionId,
        p_conversation_id: conversationId,
      },
    );

  if (error) {
    throw new Error(
      `Failed to load chat messages: ${error.message}`,
    );
  }

  const messages =
    (messageData ??
      []) as VisitorChatMessageRow[];

  if (messages.length === 0) {
    return [];
  }

  /*
   * Attachments are loaded through the
   * SECURITY DEFINER function so anonymous
   * visitors are validated using their
   * visitor session instead of auth.uid().
   */
  const {
    data: attachmentData,
    error: attachmentError,
  } = await supabase.rpc(
    "get_visitor_chat_attachments",
    {
      p_session_id: sessionId,
      p_conversation_id: conversationId,
    },
  );

  if (attachmentError) {
    throw new Error(
      `Failed to load chat attachments: ${attachmentError.message}`,
    );
  }

  const attachments =
    (attachmentData ??
      []) as ChatAttachmentRow[];

  const attachmentsByMessage =
    new Map<
      string,
      ChatMessageAttachment[]
    >();

  for (const attachment of attachments) {
    const {
      data: { publicUrl },
    } = supabase.storage
      .from("chat-images")
      .getPublicUrl(
        attachment.file_path,
      );

    const mappedAttachment:
      ChatMessageAttachment = {
      id: attachment.id,
      messageId: attachment.message_id,
      filePath: attachment.file_path,
      fileName: attachment.file_name,
      mimeType: attachment.mime_type,
      fileSize: attachment.file_size,
      createdAt: attachment.created_at,
      publicUrl,
    };

    const existing =
      attachmentsByMessage.get(
        attachment.message_id,
      ) ?? [];

    existing.push(mappedAttachment);

    attachmentsByMessage.set(
      attachment.message_id,
      existing,
    );
  }

  return messages.map(
    (message): ChatMessage => ({
      id: message.id,
      conversationId:
        message.conversation_id,
      sessionId: message.session_id,
      senderType: message.sender_type,
      senderId: message.sender_id,
      message: message.message,
      isRead: message.is_read,
      createdAt: message.created_at,
      attachments:
        attachmentsByMessage.get(
          message.id,
        ) ?? [],
    }),
  );
}