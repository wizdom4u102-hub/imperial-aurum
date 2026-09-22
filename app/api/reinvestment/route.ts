import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ReinvestmentRequest = {
  destination: "mining" | "trading_bot";
  botMode?: "new" | "existing" | null;
  planId?: string | null;
  botId?: string | null;
  amount?: number;
};

type ReinvestmentResult = {
  success: boolean;
  destination: string;
  mode?: string;
  session_id?: string;
  bot_id?: string;
  deposit_id?: string;
  plan_id?: string;
  plan_name?: string;
  amount?: number;
  cash_before?: number;
  cash_after?: number;
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    const body = (await request.json()) as ReinvestmentRequest;

    const destination = body.destination;
    const botMode = body.botMode ?? null;
    const planId = body.planId ?? null;
    const botId = body.botId ?? null;
    const amount = Number(body.amount);

    if (
      destination !== "mining" &&
      destination !== "trading_bot"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid reinvestment destination.",
        },
        {
          status: 400,
        }
      );
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Reinvestment amount must be greater than zero.",
        },
        {
          status: 400,
        }
      );
    }

    if (!planId) {
      return NextResponse.json(
        {
          success: false,
          error: "A plan must be selected.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      destination === "trading_bot" &&
      botMode !== "new" &&
      botMode !== "existing"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Trading Bot mode must be new or existing.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      destination === "trading_bot" &&
      botMode === "existing" &&
      !botId
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "A Trading Bot must be selected.",
        },
        {
          status: 400,
        }
      );
    }

    const { data, error } = await supabase.rpc(
  "reinvest_from_cash",
  {
    p_destination: destination,
    p_bot_mode:
      destination === "trading_bot"
        ? botMode ?? undefined
        : undefined,
    p_plan_id: planId ?? undefined,
    p_bot_id:
      destination === "trading_bot" &&
      botMode === "existing"
        ? botId ?? undefined
        : undefined,
    p_amount: amount,
  }
);

    if (error) {
      console.error(
        "Reinvestment RPC error:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        {
          status: 400,
        }
      );
    }

    const result =
      data as ReinvestmentResult | null;

    if (!result?.success) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Reinvestment could not be completed.",
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error(
      "Reinvestment route error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.",
      },
      {
        status: 500,
      }
    );
  }
}