/* -------------------------------------------------------------------------- */
/*                         Trading Bot Scheduler                              */
/* -------------------------------------------------------------------------- */

import {
  getActiveTradingBots,
} from "./repository";

import {
  checkExpiredBots,
} from "./expiry";

import {
  checkRenewalEligibility,
} from "./renewal";

import {
  openTradeIfRequired,
} from "./trade-opening";

import {
  closeExpiredTrades,
} from "./trade-closing";

import type {
  TradingBotRecord,
} from "./types";


/* -------------------------------------------------------------------------- */
/*                         Trading Bot Scheduler                              */
/* -------------------------------------------------------------------------- */

export async function runTradingBotScheduler(): Promise<void> {

  console.log(
    "Trading Bot Scheduler Started"
  );

  const result =
    await getActiveTradingBots();

  if (
    result.error ||
    !result.data
  ) {

    console.error(
      "[TRADING BOT] Unable to load active trading bots:",
      result.error?.message
    );

    throw new Error(
      result.error?.message ??
      "Unable to load active trading bots."
    );
  }

  const activeBots: TradingBotRecord[] =
    result.data;

  console.log(
    "[TRADING BOT] Active bots found:",
    activeBots.length
  );

  for (const bot of activeBots) {

    console.log(
      "[TRADING BOT] Processing bot:",
      bot.id
    );

    await closeExpiredTrades(
      bot
    );

    console.log(
      "[TRADING BOT] Finished closing expired trades:",
      bot.id
    );

    await openTradeIfRequired(
      bot
    );

    console.log(
      "[TRADING BOT] Finished trade-opening check:",
      bot.id
    );
  }

  console.log(
    "[TRADING BOT] Checking expired bots"
  );

  await checkExpiredBots();

  console.log(
    "[TRADING BOT] Checking renewal eligibility"
  );

  await checkRenewalEligibility();

  console.log(
    "[TRADING BOT] Scheduler Completed"
  );
}