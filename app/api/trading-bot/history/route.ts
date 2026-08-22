import {
  NextResponse,
} from "next/server";

import {
  createClient,
} from "@/lib/supabase/server";

import {
  getTradingHistory,
} from "@/lib/trading-bot/service";

import type {
  ApiResponse,
} from "@/lib/trading-bot/api.types";

import type {
  BotTransactionWithBot,
} from "@/lib/trading-bot/types";

/* -------------------------------------------------------------------------- */
/*                         GET Trading History                                */
/* -------------------------------------------------------------------------- */

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
            code: "UNAUTHORIZED",
            message: "Unauthorized",
          },
        } satisfies ApiResponse<BotTransactionWithBot[]>,

        {
          status: 401,
        }

      );

    }

    const history =
      await getTradingHistory(
        user.id
      );

    if (
      history.error
    ) {

      return NextResponse.json(

        {
          data: null,
          error: {
            code: "HISTORY_FETCH_FAILED",
            message:
              history.error.message,
          },
        } satisfies ApiResponse<BotTransactionWithBot[]>,

        {
          status: 500,
        }

      );

    }

    return NextResponse.json(

      {
        data:
          history.data ?? [],
        error:
          null,
      } satisfies ApiResponse<BotTransactionWithBot[]>,

      {
        status: 200,
      }

    );

  } catch (error) {

    console.error(
      "Trading history route:",
      error
    );

    return NextResponse.json(

      {
        data: null,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Unexpected server error.",
        },
      } satisfies ApiResponse<BotTransactionWithBot[]>,

      {
        status: 500,
      }

    );

  }

}