/* -------------------------------------------------------------------------- */
/*                      Trading Bot Top Up Approval                           */
/* -------------------------------------------------------------------------- */

import {
  supabaseAdmin,
} from "@/lib/supabase/admin";

import {
  createBotTransaction,
} from "./repository";

/* -------------------------------------------------------------------------- */
/*                           Approve Top Up                                   */
/* -------------------------------------------------------------------------- */

export async function approveTopUpDeposit(
  input: {
    deposit: any;
    adminId: string;
  }
) {

  const supabase =
    supabaseAdmin;

  const deposit =
    input.deposit;

  if (!deposit.bot_id) {
    throw new Error(
      "Top-up deposit has no trading bot."
    );
  }

  const {
    data: bot,
    error: botError,
  } =
    await supabase
      .from("user_trading_bots")
      .select("*")
      .eq(
        "id",
        deposit.bot_id
      )
      .single();

  if (
    botError ||
    !bot
  ) {
    throw new Error(
      botError?.message ??
      "Trading bot not found."
    );
  }

  const now =
    new Date().toISOString();

  const investmentCapital =
    Number(bot.investment_capital ?? 0) +
    Number(deposit.investment_amount);

  const currentValue =
    Number(bot.current_value ?? 0) +
    Number(deposit.investment_amount);

  const {
    error: updateBotError,
  } =
    await supabase
      .from("user_trading_bots")
      .update({

        investment_capital:
          investmentCapital,

        current_value:
          currentValue,

        updated_at:
          now,

      })
      .eq(
        "id",
        bot.id
      );

  if (updateBotError) {
    throw new Error(
      updateBotError.message
    );
  }

  const {
    data: statistics,
    error: statisticsError,
  } =
    await supabase
      .from("bot_statistics")
      .select("*")
      .eq(
        "bot_id",
        bot.id
      )
      .single();

  if (
    statisticsError ||
    !statistics
  ) {
    throw new Error(
      statisticsError?.message ??
      "Statistics not found."
    );
  }

  const {
    error: updateStatisticsError,
  } =
    await supabase
      .from("bot_statistics")
      .update({

        investment_capital:
          investmentCapital,

        current_value:
          currentValue,

        current_portfolio_value:
          currentValue,

        last_updated_at:
          now,

      })
      .eq(
        "bot_id",
        bot.id
      );

  if (
    updateStatisticsError
  ) {
    throw new Error(
      updateStatisticsError.message
    );
  }

  const {
    error: depositError,
  } =
    await supabase
      .from("bot_deposits")
      .update({

        status:
          "approved",

        approved_at:
          now,

        approved_by:
          input.adminId,

        reviewed_at:
          now,

        reviewed_by:
          input.adminId,

      })
      .eq(
        "id",
        deposit.id
      );

  if (depositError) {
    throw new Error(
      depositError.message
    );
  }

  await supabase
    .from("transactions")
    .insert({

      user_id:
        deposit.user_id,

      type:
        "trading_bot_top_up",

      amount:
        deposit.investment_amount,

      asset_type:
        "cash",

      currency:
        "USD",

      status:
        "approved",

      description:
        "Trading bot top-up approved",

      reference_id:
        deposit.id,

    });

  await supabase
    .from("bot_logs")
    .insert({

      user_id:
        deposit.user_id,

      bot_id:
        bot.id,

      deposit_id:
        deposit.id,

      action:
        "BOT_TOP_UP",

      log_type:
        "top_up",

      severity:
        "info",

      performed_by:
        input.adminId,

      message:
        `Trading bot topped up with $${deposit.investment_amount}.`,

    });

    await createBotTransaction({

  user_id:
    deposit.user_id,

  bot_id:
    bot.id,

  transaction_type:
    "TOP_UP",

  amount:
    Number(
      deposit.investment_amount
    ),

  balance_before:
    Number(
      bot.current_value ?? 0
    ),

  balance_after:
    currentValue,

  status:
    "COMPLETED",

  reference_id:
    deposit.id,

  description:
    "Trading Bot top-up approved.",

  metadata: {

    deposit_id:
      deposit.id,

    approved_by:
      input.adminId,

    top_up: true,

  },

});

  await supabase
    .from("user_notifications")
    .insert({

      user_id:
        deposit.user_id,

      subject:
        "Trading Bot Top Up Approved",

      message:
        `Your trading bot has been credited with $${deposit.investment_amount}.`,

      sent_by:
        input.adminId,

    });

  return {
    depositId:
      deposit.id,

    userBotId: bot.id,
  };

}