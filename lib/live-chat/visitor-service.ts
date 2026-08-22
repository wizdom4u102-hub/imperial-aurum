import { createClient } from "@/lib/supabase/server";

import type {
  VisitorEventRecord,
  VisitorSessionRecord,
} from "@/lib/visitor-tracking/types";

export async function getVisitorSession(
  sessionId: string,
): Promise<VisitorSessionRecord | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("visitor_sessions")
    .select("*")
    .eq("id", sessionId)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Failed to load visitor session: ${error.message}`,
    );
  }

  return data;
}

export async function getVisitorEvents(
  sessionId: string,
): Promise<VisitorEventRecord[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("visitor_events")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    throw new Error(
      `Failed to load visitor events: ${error.message}`,
    );
  }

  return data;
}