import { NextRequest, NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  createBotTransaction,
} from "@/lib/trading-bot/repository";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const {
      data: profile,
    } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const { botId } = await request.json();

    if (!botId) {
      return NextResponse.json(
        { error: "Bot ID required." },
        { status: 400 }
      );
    }

    const {
      data: bot,
      error: botError,
    } = await supabaseAdmin
      .from("user_trading_bots")
      .select("*")
      .eq("id", botId)
      .single();

    if (botError || !bot) {
      return NextResponse.json(
        { error: "Bot not found." },
        { status: 404 }
      );
    }

    if (bot.status !== "pending_activation") {
      return NextResponse.json(
        {
          error: `Bot is already ${bot.status}`,
        },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    const { error: updateError } =
      await supabaseAdmin
        .from("user_trading_bots")
        .update({
          status: "active",
          activated_at: now,
          updated_at: now,
        })
        .eq("id", bot.id);

    if (updateError) {
      throw updateError;
    }

    await supabaseAdmin
      .from("bot_statistics")
      .update({
        server_status: "running",
        last_updated_at: now,
      })
      .eq("bot_id", bot.id);

    await supabaseAdmin
      .from("bot_logs")
      .insert({
        user_id: bot.user_id,
        bot_id: bot.id,
        action: "BOT_ACTIVATED",
        log_type: "activation",
        severity: "info",
        message: "Trading bot activated.",
        performed_by: user.id,
      });


      await createBotTransaction({

  user_id:
    bot.user_id,

  bot_id:
    bot.id,

  transaction_type:
    "ACTIVATION",

  amount:
    Number(
      bot.investment_amount ?? 0
    ),

  balance_before:
    0,

  balance_after:
    Number(
      bot.investment_amount ?? 0
    ),

  status:
    "COMPLETED",

  reference_id:
    crypto.randomUUID(),

  description:
    "Trading Bot activated.",

  metadata: {

    plan_id:
      bot.plan_id,

    activated_by:
      user.id,

  },

});

    return NextResponse.json({
      success: true,
      message: "Bot activated successfully.",
    });

  } catch (error: any) {

    console.error(
      "Bot activation error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error.message ??
          "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}