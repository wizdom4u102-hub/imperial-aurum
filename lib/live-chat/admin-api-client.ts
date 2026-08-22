import type {
  ChatConversationRecord,
  ChatMessageRecord,
} from "./types";

import type {
  AdminChatConversation,
} from "./admin-types";

const ADMIN_LIVE_CHAT_API =
  "/api/admin/live-chat";

type AdminApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

async function request<T>(
  body: unknown,
): Promise<T> {
  const response = await fetch(
    ADMIN_LIVE_CHAT_API,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  const result:
    AdminApiResponse<T> =
    await response.json();

  if (
    !response.ok ||
    !result.success
  ) {
    throw new Error(
      result.error ??
        "Admin live chat request failed",
    );
  }

  if (
    result.data === undefined
  ) {
    throw new Error(
      "Admin live chat response did not contain data",
    );
  }

  return result.data;
}

/* -------------------------------------------------------------------------- */
/*                         Conversations                                     */
/* -------------------------------------------------------------------------- */

export async function getAdminChatConversations(): Promise<
  AdminChatConversation[]
> {
  return request<
    AdminChatConversation[]
  >({
    action:
      "get-conversations",
  });
}

/* -------------------------------------------------------------------------- */
/*                              Messages                                     */
/* -------------------------------------------------------------------------- */

export async function getAdminChatMessages(
  conversationId: string,
): Promise<ChatMessageRecord[]> {
  return request<
    ChatMessageRecord[]
  >({
    action:
      "get-messages",
    conversationId,
  });
}

/* -------------------------------------------------------------------------- */
/*                         Send Message                                      */
/* -------------------------------------------------------------------------- */

export async function sendAdminChatMessage(
  conversation:
    ChatConversationRecord,
  message: string,
): Promise<ChatMessageRecord> {
  return request<
    ChatMessageRecord
  >({
    action:
      "send-message",
    conversation,
    message,
  });
}

/* -------------------------------------------------------------------------- */
/*                         Connect Visitor Email                             */
/* -------------------------------------------------------------------------- */

export async function connectVisitorEmail(
  conversationId: string,
  visitorEmail: string,
): Promise<boolean> {
  return request<boolean>({
    action: "connect-email",
    conversationId,
    visitorEmail,
  });
}

/* -------------------------------------------------------------------------- */
/*                         Mark As Read                                       */
/* -------------------------------------------------------------------------- */

export async function markAdminChatMessagesAsRead(
  conversationId: string,
): Promise<boolean> {
  return request<boolean>({
    action: "mark-read",
    conversationId,
  });
}

/* -------------------------------------------------------------------------- */
/*                         Close Conversation                                */
/* -------------------------------------------------------------------------- */

export async function closeAdminChatConversation(
  conversationId: string,
): Promise<boolean> {
  return request<boolean>({
    action:
      "close-conversation",
    conversationId,
  });
}

/* -------------------------------------------------------------------------- */
/*                         Reopen Conversation                               */
/* -------------------------------------------------------------------------- */

export async function reopenAdminChatConversation(
  conversationId: string,
): Promise<boolean> {
  return request<boolean>({
    action:
      "reopen-conversation",
    conversationId,
  });
}