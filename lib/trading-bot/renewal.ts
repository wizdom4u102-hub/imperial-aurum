import {
  getExpiredTradingBots,
  updateTradingBot,
  createBotLog,
} from "./repository";

import {
  createBusinessError,
  BOT_NOT_ACTIVE,
} from "./service.errors";

import type {
  TradingBotRecord,
} from "./types";

/* -------------------------------------------------------------------------- */
/*                     Check Bots Eligible For Renewal                        */
/* -------------------------------------------------------------------------- */

export async function checkRenewalEligibility(): Promise<void> {

  const result =
    await getExpiredTradingBots();

  if (
    result.error ||
    !result.data
  ) {
    return;
  }

  for (const bot of result.data) {

    if (
      isRenewalEligible(bot)
    ) {

      await processBotRenewal(
        bot
      );

    }

  }

}

/* -------------------------------------------------------------------------- */
/*                         Renewal Eligibility                                */
/* -------------------------------------------------------------------------- */

function isRenewalEligible(
  bot: TradingBotRecord
): boolean {

  return (
    bot.status === "expired"
  );

}

/* -------------------------------------------------------------------------- */
/*                          Renew One Trading Bot                             */
/* -------------------------------------------------------------------------- */

export async function processBotRenewal(
  bot: TradingBotRecord
): Promise<void> {

  const now = new Date();

  const activatedAt =
    now.toISOString();

  const expiresAt =
    new Date(
      now.getTime() +
      bot.duration_days *
        24 *
        60 *
        60 *
        1000
    ).toISOString();

  const result =
    await updateTradingBot(
      bot.id,
      {
        status: "active",

        activated_at:
          activatedAt,

        expires_at:
          expiresAt,

        updated_at:
          activatedAt,

        renewal_count:
          (bot.renewal_count ?? 0) + 1,
      }
    );

  if (result.error) {

    throw createBusinessError(
      BOT_NOT_ACTIVE,
      "Failed to renew trading bot."
    );

  }

  const logResult =
    await createBotLog({
      action: "BOT_RENEWED",

      bot_id: bot.id,

      user_id: bot.user_id,

      log_type: "lifecycle",

      message:
        `Trading bot "${bot.bot_name}" has been renewed and reactivated.`,

      metadata: {
        renewed_at:
          activatedAt,

        previous_expiry:
          bot.expires_at,

        new_expiry:
          expiresAt,

        renewal_count:
          (bot.renewal_count ?? 0) + 1,
      },

      severity: "info",
    });

  if (logResult.error) {

    console.error(
      "Unable to create renewal log:",
      logResult.error.message
    );

  }

}