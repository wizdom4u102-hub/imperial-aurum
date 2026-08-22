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
    throw new Error(
      result.error?.message ??
      "Unable to load active trading bots."
    );
  }

  const activeBots: TradingBotRecord[] =
    result.data;

  for (const bot of activeBots) {

    console.log(
      "Processing bot:",
      bot.id
    );

    await closeExpiredTrades(
      bot
    );

    await openTradeIfRequired(
      bot
    );

  }

  await checkExpiredBots();

  await checkRenewalEligibility();

}