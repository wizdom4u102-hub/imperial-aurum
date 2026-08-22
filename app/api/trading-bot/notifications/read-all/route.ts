import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

/* -------------------------------------------------------------------------- */
/*                     Mark All Notifications As Read                         */
/* -------------------------------------------------------------------------- */

export async function PATCH() {
  const supabase =
    await createClient();

  const {
    data: { user },
    error: authError,
  } =
    await supabase.auth.getUser();

  if (
    authError ||
    !user
  ) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const {
    error,
  } =
    await supabase
      .from("user_notifications")
      .update({
        is_read: true,
      })
      .eq(
        "user_id",
        user.id
      )
      .eq(
        "is_read",
        false
      );

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

  return NextResponse.json(
    {
      success: true,
      message:
        "All notifications marked as read.",
    },
    {
      status: 200,
    }
  );
}