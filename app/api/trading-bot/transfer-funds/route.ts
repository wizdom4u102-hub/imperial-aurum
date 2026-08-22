import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

import {
  transferBotProfit,
} from "@/lib/trading-bot/transfer-funds.service";

/* -------------------------------------------------------------------------- */
/*                           POST                                              */
/* -------------------------------------------------------------------------- */

export async function POST(
  request: Request
) {

  try {

    const supabase =
      await createClient();

    const {

      data: {

        user,

      },

      error: authError,

    } = await supabase.auth.getUser();

    if (
      authError ||
      !user
    ) {

      return NextResponse.json(

        {

          success: false,

          message:
            "Unauthorized.",

        },

        {

          status: 401,

        }

      );

    }

    const body =
      await request.json();

    const result =
      await transferBotProfit(

        user.id,

        {

          botId:
            body.botId,

          amount:
            Number(
              body.amount
            ),

        }

      );

    return NextResponse.json(

      result,

      {

        status: 200,

      }

    );

 } catch (error) {

  console.error(
    "Transfer Funds Error:",
    error
  );

  return NextResponse.json(
    {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Transfer failed.",
    },
    {
      status: 500,
    }
  );

}
}