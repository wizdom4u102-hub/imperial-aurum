import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const { data, error } = await supabase
    .from("user_notifications")
    .select(`
      id,
      subject,
      message,
      is_read,
      created_at,
      user_id,
      sent_by
    `)
    .eq("user_id", user.id)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }

  const notifications = (data ?? []).map((item) => ({
    id: item.id,

    title: item.subject ?? "Notification",

    message: item.message ?? "",

    type: "info",

    timestamp: item.created_at ?? new Date().toISOString(),

    is_read: item.is_read,
  }));

  return NextResponse.json(
    {
      notifications,

      unreadCount: notifications.filter(
        (item) => !item.is_read
      ).length,
    },
    {
      status: 200,
    }
  );
}