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

  console.log(
    "[TRADING BOT] Checking trade opening for bot:",
    bot.id
  );

  const plan =
    await getTodayTradePlan(
      bot
    );

  console.log(
    "[TRADING BOT] Trade plan:",
    {
      botId: bot.id,
      status: bot.status,
      targetTrades: plan.targetTrades,
      openedTrades: plan.openedTrades,
      shouldOpenTrade: plan.shouldOpenTrade,
    }
  );

  const openTradesResult =
    await getOpenTradesByBotId(
      bot.id
    );

  if (
    openTradesResult.error
  ) {
    console.error(
      "[TRADING BOT] Unable to check open trades:",
      bot.id,
      openTradesResult.error.message
    );

    return;
  }

  console.log(
    "[TRADING BOT] Open trades found:",
    {
      botId: bot.id,
      count: openTradesResult.data?.length ?? 0,
    }
  );

  if (
    openTradesResult.data &&
    openTradesResult.data.length > 0
  ) {
    console.log(
      "[TRADING BOT] Trade opening skipped because an open trade already exists:",
      bot.id
    );

    return;
  }

  if (
    !plan.shouldOpenTrade
  ) {
    console.log(
      "[TRADING BOT] Trade opening skipped by planner:",
      {
        botId: bot.id,
        targetTrades: plan.targetTrades,
        openedTrades: plan.openedTrades,
      }
    );

    return;
  }

  console.log(
    "[TRADING BOT] Attempting to execute trade:",
    bot.id
  );

  const result =
    await executeTrade({
      botId: bot.id,
    });

  if (!result.success) {

    console.error(
      "[TRADING BOT] Trade execution failed:",
      {
        botId: bot.id,
        error: result.error,
      }
    );

    return;
  }

  console.log(
    "[TRADING BOT] Trade opened successfully:",
    {
      botId: bot.id,
      tradeId: result.tradeInfo?.id,
    }
  );

}