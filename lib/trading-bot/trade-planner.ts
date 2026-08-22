/* -------------------------------------------------------------------------- */
/*                          Trading Bot Trade Planner                         */
/* -------------------------------------------------------------------------- */

import {
  getTradesOpenedToday,
} from "./repository";

import {
  getDailyTradeTarget,
  shouldOpenTradeNow,
} from "./trade-planner.helpers";

import type {
  TradingBotRecord,
} from "./types";

import type {
  TradePlan,
} from "./trade-planner.types";


/* -------------------------------------------------------------------------- */
/*                          Today's Trading Plan                              */
/* -------------------------------------------------------------------------- */

export async function getTodayTradePlan(
  bot: TradingBotRecord
): Promise<TradePlan> {

  const targetTrades =
    getDailyTradeTarget(
      bot
    );

  const openedTradesResult =
    await getTradesOpenedToday(
      bot.id
    );

  const openedTrades =
    openedTradesResult.data?.length ?? 0;

  const shouldOpenTrade =
    shouldOpenTradeNow(
      bot,
      targetTrades,
      openedTrades
    );

  return {

    targetTrades,

    openedTrades,

    shouldOpenTrade,

  };

}