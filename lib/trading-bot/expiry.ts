import {
  getActiveTradingBots,
  updateTradingBot,
  createBotLog,
   createBotTransaction,
} from "./repository";

import {
  
createUserNotification,
} from "./transfer-funds.repository";

import {
  createBusinessError,
  BOT_NOT_ACTIVE,
} from "./service.errors";

import type {
  TradingBotRecord,
} from "./types";

/* -------------------------------------------------------------------------- */
/*                         Check All Expired Bots                             */
/* -------------------------------------------------------------------------- */

export async function checkExpiredBots(): Promise<void> {

  const result =
    await getActiveTradingBots();

  if (
    result.error ||
    !result.data
  ) {
    return;
  }

  const now =
    Date.now();

  for (const bot of result.data) {

    if (
      isBotExpired(bot, now)
    ) {

      await processBotExpiration(
        bot
      );

    }

  }

}

/* -------------------------------------------------------------------------- */
/*                          Expiration Checker                                */
/* -------------------------------------------------------------------------- */

function isBotExpired(
  bot: TradingBotRecord,
  now: number
): boolean {

  if (!bot.expires_at) {
    return false;
  }

  return (
    new Date(
      bot.expires_at
    ).getTime() <= now
  );

}

/* -------------------------------------------------------------------------- */
/*                        Expire One Trading Bot                              */
/* -------------------------------------------------------------------------- */

export async function processBotExpiration(
  bot: TradingBotRecord
): Promise<void> {

  const result =
    await updateTradingBot(
      bot.id,
      {

        status:
          "expired",

        updated_at:
          new Date().toISOString(),

      }
    );

  if (result.error) {

    throw createBusinessError(
      BOT_NOT_ACTIVE,
      "Failed to expire trading bot."
    );

  }


  await createBotTransaction({

  user_id:
    bot.user_id,

  bot_id:
    bot.id,

  transaction_type:
    "ADMIN_ADJUSTMENT",

  amount:
    Number(
      bot.current_value ?? 0
    ),

  balance_before:
    Number(
      bot.current_value ?? 0
    ),

  balance_after:
    Number(
      bot.current_value ?? 0
    ),

  status:
    "COMPLETED",

  reference_id:
    bot.id,

  description:
    "Trading bot expired after completing its investment duration.",

  metadata: {

    action:
      "BOT_EXPIRED",

    expired_at:
      new Date().toISOString(),

    expires_at:
      bot.expires_at,

  },

});

  const logResult =
  await createBotLog({
    action: "BOT_EXPIRED",

    bot_id: bot.id,

    user_id: bot.user_id,

    log_type: "lifecycle",

    message: `Trading bot "${bot.bot_name}" has reached the end of its trading period.`,

    metadata: {
      expired_at: new Date().toISOString(),
      expires_at: bot.expires_at,
      investment_capital: bot.investment_capital,
      accumulated_profit: bot.accumulated_profit,
      current_value: bot.current_value,
    },

    severity: "info",
  });


  await createUserNotification({

  user_id:
    bot.user_id,

  subject:
    "Trading Bot Expired",

  message:
    `Your trading bot "${bot.bot_name}" has completed its investment period.`,

  is_read:
    false,

});

if (logResult.error) {
  console.error(
    "Unable to write bot expired log:",
    logResult.error.message
  );
}

}