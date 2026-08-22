import { createClient } from "@/lib/supabase/server";

export async function connectVisitorEmail(
  conversationId: string,
  visitorEmail: string,
): Promise<void> {
  const supabase = await createClient();

  const email = visitorEmail.trim().toLowerCase();

  if (!email) {
    throw new Error("Visitor email is required");
  }

  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    throw new Error("Please enter a valid email address");
  }

  const { error } = await supabase
    .from("chat_conversations")
    .update({
      visitor_email: email,
      email_connected_at: new Date().toISOString(),
    })
    .eq("id", conversationId);

  if (error) {
    throw new Error(
      `Failed to connect visitor email: ${error.message}`,
    );
  }
}