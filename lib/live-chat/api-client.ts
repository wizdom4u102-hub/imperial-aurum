import type {
  ChatMessage,
  CreateChatConversationInput,
  SendChatMessageInput,
} from "./types";

const LIVE_CHAT_API = "/api/live-chat";

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

async function request<T>(
  body: unknown,
): Promise<T> {
  const response = await fetch(LIVE_CHAT_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  let result: ApiResponse<T>;

  try {
    result =
      (await response.json()) as ApiResponse<T>;
  } catch {
    throw new Error(
      "Invalid response from live chat service",
    );
  }

  if (!response.ok || !result.success) {
    throw new Error(
      result.error ??
        "Live chat request failed",
    );
  }

  if (result.data === undefined) {
    throw new Error(
      "Live chat response did not contain data",
    );
  }

  return result.data;
}

export async function createChatConversation(
  input: CreateChatConversationInput,
): Promise<string> {
  return request<string>({
    action: "create-conversation",
    input,
  });
}

export async function createChatBusyMessage(
  sessionId: string,
  conversationId: string,
): Promise<string | null> {
  return request<string | null>({
    action: "create-busy-message",
    sessionId,
    conversationId,
  });
}

export async function sendChatMessage(
  input: SendChatMessageInput,
): Promise<string> {
  return request<string>({
    action: "send-message",
    input,
  });
}

export async function getChatMessages(
  sessionId: string,
  conversationId: string,
): Promise<ChatMessage[]> {
  return request<ChatMessage[]>({
    action: "get-messages",
    sessionId,
    conversationId,
  });
}