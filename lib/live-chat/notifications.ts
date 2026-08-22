import { createClient } from "@/lib/supabase/server";

interface CreateLiveChatNotificationInput {
  conversationId: string;
  messageId: string;
  userId?: string | null;
  senderType: "visitor" | "admin";
  message: string;
}

export async function createLiveChatNotification(
  input: CreateLiveChatNotificationInput,
): Promise<void> {
  const supabase = await createClient();

  const preview =
    input.message.trim() || "Sent an image";

  if (input.senderType === "visitor") {
    const { error } = await supabase
      .from("admin_notifications")
      .insert({
        title: "New Live Chat Message",
        message: preview,
        type: "live_chat",
        event: "live_chat_message",
        reference_id: input.conversationId,
        reference_table: "chat_conversations",
        priority: "normal",
        is_read: false,
      });

    if (error) {
      throw new Error(
        `Failed to create admin chat notification: ${error.message}`,
      );
    }

    return;
  }

  if (!input.userId) {
    return;
  }

  const { data, error } = await supabase.rpc(
    "create_live_chat_user_notification",
    {
      p_user_id: input.userId,
      p_conversation_id: input.conversationId,
      p_message_id: input.messageId,
      p_message: preview,
    },
  );

  if (error) {
    throw new Error(
      `Failed to create user chat notification: ${error.message}`,
    );
  }

  if (!data) {
    throw new Error(
      "Live chat user notification was not created",
    );
  }
}