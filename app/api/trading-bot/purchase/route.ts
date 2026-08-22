import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  createPurchase,
} from "@/lib/trading-bot/purchase.service";

import {
  createClient,
} from "@/lib/supabase/server";

export async function POST(
  request: NextRequest
) {
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
          error:
            "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const body =
      await request.json();

    const botId =
      typeof body.botId === "string"
        ? body.botId
        : "";

    const amount =
      Number(body.amount);

    const paymentMethodId =
      typeof body.paymentMethodId === "string"
        ? body.paymentMethodId
        : "";

    if (!botId) {
      return NextResponse.json(
        {
          error:
            "Bot ID is required.",
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
            "Invalid purchase amount.",
        },
        {
          status: 400,
        }
      );
    }

    if (!paymentMethodId) {
      return NextResponse.json(
        {
          error:
            "Payment method is required.",
        },
        {
          status: 400,
        }
      );
    }

    const {
      data: bot,
      error: botError,
    } =
      await supabase
        .from("user_trading_bots")
        .select(
          "id, user_id, plan_id"
        )
        .eq(
          "id",
          botId
        )
        .eq(
          "user_id",
          user.id
        )
        .single();

    if (
      botError ||
      !bot
    ) {
      return NextResponse.json(
        {
          error:
            botError?.message ??
            "Trading bot not found.",
        },
        {
          status: 404,
        }
      );
    }

    if (!bot.plan_id) {
      return NextResponse.json(
        {
          error:
            "Trading bot plan is missing.",
        },
        {
          status: 400,
        }
      );
    }

    const result =
      await createPurchase({
        userId:
          user.id,

        botId:
          bot.id,

        planId:
          bot.plan_id,

        amount,

        paymentMethodId,

        reference:
          crypto.randomUUID(),
      });

    if (result.error) {
      return NextResponse.json(
        {
          error:
            result.error,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      result.data,
      {
        status: 201,
      }
    );

  } catch (error) {
    console.error(
      "Trading bot purchase error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Internal server error.",
      },
      {
        status: 500,
      }
    );
  }
}