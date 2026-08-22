/* -------------------------------------------------------------------------- */
/*                          Trading Bot Trade Closing                         */
/* -------------------------------------------------------------------------- */

import {
  getOpenTradesByBotId,
  closeTrade,
  createBotLog,
} from "./repository";

import {
  finalizeTrade,
} from "./trade-settlement";

import type {
  TradingBotRecord,
} from "./types";


/* -------------------------------------------------------------------------- */
/*                         Close Expired Trades                               */
/* -------------------------------------------------------------------------- */

export async function closeExpiredTrades(
  bot: TradingBotRecord
): Promise<void> {

  const tradesResult =
    await getOpenTradesByBotId(
      bot.id
    );

  if (
    tradesResult.error ||
    !tradesResult.data
  ) {
    return;
  }

  const now =
    new Date().toISOString();

  for (const trade of tradesResult.data) {

    if (
      trade.closed_at ||
      !trade.expires_at
    ) {
      continue;
    }

    if (
      new Date(trade.expires_at) >
      new Date()
    ) {
      continue;
    }

    await closeTrade(
      trade.id,
      now
    );

    await finalizeTrade(
      trade.id
    );
    const logResult =
  await createBotLog({
    action: "TRADE_CLOSED",

    bot_id: bot.id,

    trade_id: trade.id,

    user_id: bot.user_id,

    log_type: "trade",

    message: `Trade #${trade.trade_number} closed successfully.`,

    metadata: {
      asset: trade.asset,
      direction: trade.trade_type,
      roi: trade.roi_percentage,
      gross_profit: trade.gross_profit,
      net_profit: trade.net_profit,
    },

    severity: "info",
  });

if (logResult.error) {
  console.error(
    "Unable to write trade closed log:",
    logResult.error.message
  );
}

  }

}