import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

import { executeTrade } from "@/lib/trading-bot/trade-engine";

export async function GET() {
  try {
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

    const { data: bots, error } = await supabase
      .from("user_trading_bots")
      .select("id")
      .eq("status", "active");

    if (error) {
      throw error;
    }

    if (!bots || bots.length === 0) {
      return NextResponse.json({
        success: true,
        executedBots: 0,
        totalBots: 0,
        message: "No active bots found.",
      });
    }

    const results = [];

    let executedBots = 0;

    for (const bot of bots) {
      const result = await executeTrade({
        botId: bot.id,
      });

      results.push({
        botId: bot.id,
        success: result.success,
        error: result.error ?? null,
      });

      if (result.success) {
        executedBots++;
      }
    }

    return NextResponse.json({
      success: true,
      executedBots,
      totalBots: bots.length,
      results,
    });
  } catch (error) {
    console.error(
      "Trading engine error:",
      error
    );

    return NextResponse.json(
      {
        error: "Internal server error.",
      },
      {
        status: 500,
      }
    );
  }
}