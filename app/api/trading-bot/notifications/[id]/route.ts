import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

/* -------------------------------------------------------------------------- */
/*                         Mark Notification Read                             */
/* -------------------------------------------------------------------------- */

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
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

  const { id } =
    await context.params;

  const {
    error,
  } =
    await supabase
      .from("user_notifications")
      .update({
        is_read: true,
      })
      .eq("id", id)
      .eq("user_id", user.id);

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
    },
    {
      status: 200,
    }
  );
}