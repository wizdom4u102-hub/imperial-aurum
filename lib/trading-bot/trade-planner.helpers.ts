/* -------------------------------------------------------------------------- */
/*                    Trading Bot Planner Helper Functions                    */
/* -------------------------------------------------------------------------- */

import type {
  TradingBotRecord,
  BotTradeRecord,
} from "./types";


/* -------------------------------------------------------------------------- */
/*                       Daily Trade Target                                   */
/* -------------------------------------------------------------------------- */

export function getDailyTradeTarget(
  bot: TradingBotRecord
): number {

  const minimum = 10;

  const maximum = 20;

  return (
    Math.floor(
      Math.random() *
      (maximum - minimum + 1)
    ) + minimum
  );

}


/* -------------------------------------------------------------------------- */
/*                     Decide Whether To Open Trade                           */
/* -------------------------------------------------------------------------- */

export function shouldOpenTradeNow(
  bot: TradingBotRecord,
  targetTrades: number,
  openedTrades: number
): boolean {

  if (bot.status !== "active") {
    return false;
  }

  if (openedTrades >= targetTrades) {
    return false;
  }

  /*
    Later this will also consider:

    • time of day
    • market simulation
    • random spacing

    For now, if today's target
    has not been reached,
    allow another trade.
  */

  return true;

}


/* -------------------------------------------------------------------------- */
/*                         Trade Lifetime                                     */
/* -------------------------------------------------------------------------- */

export function getTradeLifetimeMinutes(): number {

  const minimum = 5;

  const maximum = 30;

  return (
    Math.floor(
      Math.random() *
      (maximum - minimum + 1)
    ) + minimum
  );

}

/* -------------------------------------------------------------------------- */
/*                        Has Trade Expired                                   */
/* -------------------------------------------------------------------------- */

export function hasTradeExpired(
  trade: BotTradeRecord
): boolean {

  if (!trade.expires_at) {
    return false;
  }

  return (
    Date.now() >=
    new Date(
      trade.expires_at
    ).getTime()
  );

}