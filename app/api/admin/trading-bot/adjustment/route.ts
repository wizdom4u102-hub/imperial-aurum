import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  createClient,
} from "@/lib/supabase/server";

import {
  getAdminTradingBotAdjustmentBotsService,
  creditTradingBot,
  debitTradingBot,
} from "@/lib/trading-bot/admin-bot-adjustment.service";


/* -------------------------------------------------------------------------- */
/*                         GET Admin Trading Bots                             */
/* -------------------------------------------------------------------------- */

export async function GET() {
  try {
    const supabase =
      await createClient();


    /* ---------------------------------------------------------------------- */
    /*                         Authenticate Admin                             */
    /* ---------------------------------------------------------------------- */

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
          error:
            "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }


    /* ---------------------------------------------------------------------- */
    /*                            Verify Admin                                */
    /* ---------------------------------------------------------------------- */

    const {
      data: profile,
      error: profileError,
    } =
      await supabase
        .from("profiles")
        .select(
          "is_admin"
        )
        .eq(
          "id",
          user.id
        )
        .single();


    if (
      profileError ||
      !profile ||
      profile.is_admin !== true
    ) {
      return NextResponse.json(
        {
          error:
            "Forbidden",
        },
        {
          status: 403,
        }
      );
    }


    /* ---------------------------------------------------------------------- */
    /*                         Load Trading Bots                              */
    /* ---------------------------------------------------------------------- */

    const result =
      await getAdminTradingBotAdjustmentBotsService();


    if (result.error) {
      return NextResponse.json(
        {
          error:
            result.error.message,
        },
        {
          status: 500,
        }
      );
    }


    return NextResponse.json(
      {
        bots:
          result.data ?? [],
      },
      {
        status: 200,
      }
    );

  } catch (error) {

    console.error(
      "Admin trading bot adjustment GET error:",
      error
    );


    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load trading bots.",
      },
      {
        status: 500,
      }
    );
  }
}


/* -------------------------------------------------------------------------- */
/*                         POST Bot Adjustment                                */
/* -------------------------------------------------------------------------- */

export async function POST(
  request: NextRequest
) {
  try {

    const supabase =
      await createClient();


    /* ---------------------------------------------------------------------- */
    /*                         Authenticate Admin                             */
    /* ---------------------------------------------------------------------- */

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
          error:
            "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }


    /* ---------------------------------------------------------------------- */
    /*                            Verify Admin                                */
    /* ---------------------------------------------------------------------- */

    const {
      data: profile,
      error: profileError,
    } =
      await supabase
        .from("profiles")
        .select(
          "is_admin"
        )
        .eq(
          "id",
          user.id
        )
        .single();


    if (
      profileError ||
      !profile ||
      profile.is_admin !== true
    ) {
      return NextResponse.json(
        {
          error:
            "Forbidden",
        },
        {
          status: 403,
        }
      );
    }


    /* ---------------------------------------------------------------------- */
    /*                              Request                                   */
    /* ---------------------------------------------------------------------- */

    const body =
      await request.json();


    const botId =
      typeof body.botId === "string"
        ? body.botId.trim()
        : "";


    const userId =
      typeof body.userId === "string"
        ? body.userId.trim()
        : "";


    const amount =
      Number(
        body.amount
      );


    const reason =
      typeof body.reason === "string"
        ? body.reason.trim()
        : "";


    const adjustmentType =
      body.adjustmentType;


    /* ---------------------------------------------------------------------- */
    /*                            Basic Validation                            */
    /* ---------------------------------------------------------------------- */

    if (!botId) {
      return NextResponse.json(
        {
          error:
            "Trading bot is required.",
        },
        {
          status: 400,
        }
      );
    }


    if (!userId) {
      return NextResponse.json(
        {
          error:
            "User is required.",
        },
        {
          status: 400,
        }
      );
    }


    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "Adjustment amount must be greater than zero.",
        },
        {
          status: 400,
        }
      );
    }


    if (!reason) {
      return NextResponse.json(
        {
          error:
            "Adjustment reason is required.",
        },
        {
          status: 400,
        }
      );
    }


    if (
      adjustmentType !== "credit" &&
      adjustmentType !== "debit"
    ) {
      return NextResponse.json(
        {
          error:
            "Adjustment type must be credit or debit.",
        },
        {
          status: 400,
        }
      );
    }


    /* ---------------------------------------------------------------------- */
    /*                         Apply Adjustment                               */
    /* ---------------------------------------------------------------------- */

    const result =
      adjustmentType === "credit"
        ? await creditTradingBot(
            {
              botId,

              amount,

              reason,
            },
            userId,
            user.id
          )
        : await debitTradingBot(
            {
              botId,

              amount,

              reason,
            },
            userId,
            user.id
          );


    /* ---------------------------------------------------------------------- */
    /*                              Error                                     */
    /* ---------------------------------------------------------------------- */

    if (result.error) {

      const status =
        result.error.code ===
        "INSUFFICIENT_BOT_BALANCE"
          ? 400
          : result.error.code ===
              "VALIDATION_ERROR"
            ? 400
            : 500;


      return NextResponse.json(
        {
          error:
            result.error.message,

          code:
            result.error.code,
        },
        {
          status,
        }
      );
    }


    /* ---------------------------------------------------------------------- */
    /*                              Success                                   */
    /* ---------------------------------------------------------------------- */

    return NextResponse.json(
      {
        success: true,

        adjustment:
          result.data,
      },
      {
        status: 200,
      }
    );

  } catch (error) {

    console.error(
      "Admin trading bot adjustment POST error:",
      error
    );


    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to adjust trading bot balance.",
      },
      {
        status: 500,
      }
    );
  }
}