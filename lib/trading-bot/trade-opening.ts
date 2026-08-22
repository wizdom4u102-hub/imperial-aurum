/* -------------------------------------------------------------------------- */
/*                        Trading Bot Trade Opening                           */
/* -------------------------------------------------------------------------- */

import {
  executeTrade,
} from "./trade-engine";

import {
  getTodayTradePlan,
} from "./trade-planner";

import type {
  TradingBotRecord,
} from "./types";

import {
  getOpenTradesByBotId,
} from "./repository";


/* -------------------------------------------------------------------------- */
/*                         Open Trade If Required                             */
/* -------------------------------------------------------------------------- */

export async function openTradeIfRequired(
  bot: TradingBotRecord
): Promise<void> {

  const plan =
    await getTodayTradePlan(
      bot
    );

    const openTradesResult =
  await getOpenTradesByBotId(
    bot.id
  );

if (
  openTradesResult.error
) {
  console.error(
    openTradesResult.error.message
  );
  return;
}

if (
  openTradesResult.data &&
  openTradesResult.data.length > 0
) {
  return;
}

  if (
    !plan.shouldOpenTrade
  ) {
    return;
  }

  const result =
    await executeTrade({
      botId: bot.id,
    });

  if (!result.success) {

    console.error(
      "Trade execution failed:",
      bot.id,
      result.error
    );

  }

}