import { NextResponse } from "next/server";

import {
  createChatConversation,
  createChatBusyMessage,
  getChatMessages,
  sendChatMessage,
} from "@/lib/live-chat/service";

import type {
  CreateChatConversationInput,
  SendChatMessageInput,
} from "@/lib/live-chat/types";

type LiveChatRequest =
  | {
      action: "create-conversation";
      input: CreateChatConversationInput;
    }
      | {
      action: "create-busy-message";
      sessionId: string;
      conversationId: string;
    }
  | {
      action: "send-message";
      input: SendChatMessageInput;
    }
  | {
      action: "get-messages";
      sessionId: string;
      conversationId: string;
    };

type LiveChatResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function POST(
  request: Request,
): Promise<NextResponse<LiveChatResponse<unknown>>> {
  try {
    const body: LiveChatRequest = await request.json();

    switch (body.action) {
      case "create-conversation": {
        const conversationId =
          await createChatConversation(body.input);

        return NextResponse.json({
          success: true,
          data: conversationId,
        });
      }

            case "create-busy-message": {
        const messageId =
          await createChatBusyMessage(
            body.sessionId,
            body.conversationId,
          );

        return NextResponse.json({
          success: true,
          data: messageId,
        });
      }

      case "send-message": {
        const messageId =
          await sendChatMessage(body.input);

        return NextResponse.json({
          success: true,
          data: messageId,
        });
      }

      case "get-messages": {
        const messages = await getChatMessages(
          body.sessionId,
          body.conversationId,
        );

        return NextResponse.json({
          success: true,
          data: messages,
        });
      }

      default: {
        return NextResponse.json(
          {
            success: false,
            error: "Unsupported live chat action",
          },
          { status: 400 },
        );
      }
    }
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Live chat request failed";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 },
    );
  }
}