import {
  sendAdminPushNotification,
} from "@/lib/push-notifications/service";

/* -------------------------------------------------------------------------- */
/*                         New Visitor                                       */
/* -------------------------------------------------------------------------- */

export async function notifyAdminOfNewVisitor(
  sessionId: string,
  visitNumber: number,
): Promise<void> {
  try {
    const result =
      await sendAdminPushNotification({
        title:
          visitNumber === 1
            ? "New Visitor"
            : "Visitor Returned",

        body:
          visitNumber === 1
            ? "A new visitor is currently on your website."
            : `A visitor has returned to your website. Visit #${visitNumber}.`,

        /*
         * A visitor session does not have the same
         * ID as a live-chat conversation.
         *
         * Therefore, do not navigate directly to
         * /admin/live-chat/[conversationId].
         *
         * The admin can open the visitor/conversation
         * from the existing live-chat dashboard and
         * then access Visitor Tracking.
         */
        url: "/admin/live-chat",

        tag:
          `visitor-${sessionId}-visit-${visitNumber}`,

        data: {
          type: "new_visitor",
          sessionId,
          visitNumber:
            String(visitNumber),
        },
      });

    console.log(
      "ADMIN PUSH RESULT:",
      result,
    );
  } catch (error) {
    console.error(
      "FAILED ADMIN PUSH:",
      error,
    );
  }
}

/* -------------------------------------------------------------------------- */
/*                         New Chat Message                                  */
/* -------------------------------------------------------------------------- */

export async function notifyAdminOfNewChatMessage(
  conversationId: string,
  message: string,
): Promise<void> {
  const trimmedMessage =
    message.trim();

  const body =
    trimmedMessage.length > 0
      ? trimmedMessage
      : "A visitor sent an image.";

  try {
    const result =
      await sendAdminPushNotification({
        title:
          "New Visitor Message",

        body:
          body,

        url:
          `/admin/live-chat/${conversationId}`,

        tag:
          `chat-${conversationId}`,

        data: {
          type:
            "new_chat_message",
          conversationId,
        },
      });

    console.log(
      "ADMIN CHAT PUSH RESULT:",
      result,
    );
  } catch (error) {
    console.error(
      "FAILED ADMIN CHAT PUSH:",
      error,
    );
  }
}