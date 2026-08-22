import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

import {
  getAdminBotStatistics,
} from "@/lib/trading-bot/admin-service";


export async function GET() {

  try {

    const supabase =
      await createClient();

    const {
      data: {
        user,
      },
      error: authError,
    } =
      await supabase.auth.getUser();

    if (
      authError ||
      !user
    ) {

      return NextResponse.json(
        {
          data: null,

          error: {
            code:
              "UNAUTHORIZED",

            message:
              "Unauthorized",
          },
        },
        {
          status: 401,
        }
      );

    }

    const {
      data: profile,
      error: profileError,
    } =
      await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

    if (
      profileError ||
      !profile?.is_admin
    ) {

      return NextResponse.json(
        {
          data: null,

          error: {
            code:
              "FORBIDDEN",

            message:
              "Admin access required.",
          },
        },
        {
          status: 403,
        }
      );

    }

    const result =
      await getAdminBotStatistics();

    if (result.error) {

      return NextResponse.json(
        {
          data: null,

          error:
            result.error,
        },
        {
          status: 500,
        }
      );

    }

    return NextResponse.json(
      {
        data:
          result.data ?? [],

        error:
          null,
      },
      {
        status: 200,
      }
    );

  } catch (error) {

    console.error(
      "Admin bot statistics API error:",
      error
    );

    return NextResponse.json(
      {
        data: null,

        error: {
          code:
            "INTERNAL_SERVER_ERROR",

          message:
            error instanceof Error
              ? error.message
              : "Internal server error.",
        },
      },
      {
        status: 500,
      }
    );

  }

}