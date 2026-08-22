import { NextResponse } from "next/server";

import {
  closeAdminChatConversation,
  getAdminChatConversations,
  getAdminChatMessages,
  getAdminUnreadChatMessageCount,
  markAdminChatMessagesAsRead,
  reopenAdminChatConversation,
  sendAdminChatMessage,
} from "@/lib/live-chat/admin-service";

import {
  connectVisitorEmail,
} from "@/lib/live-chat/email-service";

import type {
  ChatConversationRecord,
} from "@/lib/live-chat/types";

type AdminLiveChatRequest =
  | {
      action: "get-conversations";
    }
  | {
      action: "get-messages";
      conversationId: string;
    }
  | {
      action: "get-unread-count";
    }
  | {
      action: "send-message";
      conversation: ChatConversationRecord;
      message: string;
    }
  | {
      action: "connect-email";
      conversationId: string;
      visitorEmail: string;
    }
  | {
      action: "mark-read";
      conversationId: string;
    }
  | {
      action: "close-conversation";
      conversationId: string;
    }
  | {
      action: "reopen-conversation";
      conversationId: string;
    };

type AdminLiveChatResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function POST(
  request: Request,
): Promise<
  NextResponse<AdminLiveChatResponse<unknown>>
> {
  try {
    const body: AdminLiveChatRequest =
      await request.json();

    switch (body.action) {
      case "get-conversations": {
        const conversations =
          await getAdminChatConversations();

        return NextResponse.json({
          success: true,
          data: conversations,
        });
      }

      case "get-messages": {
        const messages =
          await getAdminChatMessages(
            body.conversationId,
          );

        return NextResponse.json({
          success: true,
          data: messages,
        });
      }

      case "get-unread-count": {
        const count =
          await getAdminUnreadChatMessageCount();

        return NextResponse.json({
          success: true,
          data: count,
        });
      }

      case "send-message": {
        const chatMessage =
          await sendAdminChatMessage(
            body.conversation,
            body.message,
          );

        return NextResponse.json({
          success: true,
          data: chatMessage,
        });
      }

      case "connect-email": {
        await connectVisitorEmail(
          body.conversationId,
          body.visitorEmail,
        );

        return NextResponse.json({
          success: true,
          data: true,
        });
      }

      case "mark-read": {
        await markAdminChatMessagesAsRead(
          body.conversationId,
        );

        return NextResponse.json({
          success: true,
          data: true,
        });
      }

      case "close-conversation": {
        await closeAdminChatConversation(
          body.conversationId,
        );

        return NextResponse.json({
          success: true,
          data: true,
        });
      }

      case "reopen-conversation": {
        await reopenAdminChatConversation(
          body.conversationId,
        );

        return NextResponse.json({
          success: true,
          data: true,
        });
      }

      default: {
        return NextResponse.json(
          {
            success: false,
            error:
              "Unsupported admin live chat action",
          },
          { status: 400 },
        );
      }
    }
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Admin live chat request failed";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 },
    );
  }
}