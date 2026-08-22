/* -------------------------------------------------------------------------- */
/*                        Trading Bot Trade Settlement                        */
/* -------------------------------------------------------------------------- */

import {
  getTradeById,
  getTradingBotById,
  getBotStatistics,
  updateTradingBot,
  updateBotStatistics,
  createBotLog,
  createBotTransaction,
} from "./repository";

/* -------------------------------------------------------------------------- */
/*                           Finalize Closed Trade                            */
/* -------------------------------------------------------------------------- */

export async function finalizeTrade(
  tradeId: string
): Promise<void> {

  const tradeResult =
    await getTradeById(tradeId);

  if (
    tradeResult.error ||
    !tradeResult.data
  ) {
    return;
  }

  const trade =
    tradeResult.data;

  const botResult =
    await getTradingBotById(
      trade.bot_id
    );

  if (
    botResult.error ||
    !botResult.data
  ) {
    return;
  }

  const bot =
    botResult.data;

  const statisticsResult =
    await getBotStatistics(
      bot.id
    );

  if (
    statisticsResult.error ||
    !statisticsResult.data
  ) {
    return;
  }

  const stats =
    statisticsResult.data;

  const now =
    new Date().toISOString();

  const profit = Number(trade.net_profit ?? 0);

const closedAt =
  trade.closed_at ??
  now;

  const totalTrades =
    (stats.total_trades ?? 0) + 1;

  const winningTrades =
    (stats.winning_trades ?? 0) +
    (profit > 0 ? 1 : 0);

  const losingTrades =
    (stats.losing_trades ?? 0) +
    (profit <= 0 ? 1 : 0);

  const accumulatedProfit =
  Number(bot.accumulated_profit ?? 0) +
  profit;

const availableBalance =
  profit > 0
    ? Number(bot.available_balance ?? 0) + profit
    : Math.max(
        0,
        Number(bot.available_balance ?? 0) + profit
      );

const currentValue =
  Number(bot.investment_capital) +
  accumulatedProfit;

  const roi =
    bot.investment_capital > 0
      ? Number(
          (
            accumulatedProfit /
            bot.investment_capital *
            100
          ).toFixed(2)
        )
      : 0;

  const winRate =
    totalTrades > 0
      ? Number(
          (
            winningTrades /
            totalTrades *
            100
          ).toFixed(2)
        )
      : 0;

  await updateTradingBot(
  bot.id,
  {
    accumulated_profit:
      accumulatedProfit,

    available_balance:
      availableBalance,

    current_value:
      currentValue,

    last_trade_at:
      closedAt,

    last_profit_at:
      closedAt,

    updated_at:
      now,
  }
);

  await updateBotStatistics(
    bot.id,
    {
      total_trades:
        totalTrades,

      winning_trades:
        winningTrades,

      losing_trades:
        losingTrades,

      total_profit:
        accumulatedProfit,

      accumulated_profit:
        accumulatedProfit,

      today_profit:
        Number(stats.today_profit ?? 0) +
        profit,

      weekly_profit:
        Number(stats.weekly_profit ?? 0) +
        profit,

      monthly_profit:
        Number(stats.monthly_profit ?? 0) +
        profit,

      yearly_profit:
        Number(stats.yearly_profit ?? 0) +
        profit,

      current_value:
        currentValue,

      current_portfolio_value:
        currentValue,

      roi_percentage:
        roi,

      win_rate:
        winRate,

      latest_trade_id:
        trade.id,

      last_trade_at:
        closedAt,

      last_profit_at:
        closedAt,

      last_updated_at:
        now,
    }
  );

  await createBotTransaction({
  user_id:
    bot.user_id,

  bot_id:
    bot.id,

  transaction_type:
    "PROFIT",
  amount:
    Math.abs(profit),

  balance_before:
    Number(
      bot.available_balance ?? 0
    ),

  balance_after:
    availableBalance,

  status:
    "COMPLETED",

  reference_id:
    trade.id,

  description:
    profit >= 0
      ? "Daily trading profit credited."
      : "Trading loss recorded.",

  metadata: {
    trade_id:
      trade.id,

    trade_number:
      trade.trade_number,

    asset:
      trade.asset,

    roi:
      trade.roi_percentage,

    gross_profit:
      trade.gross_profit,

    trading_fee:
      trade.trading_fee,

    net_profit:
      trade.net_profit,
  },
});

  const profitLogResult =
  await createBotLog({
    action: "PROFIT_CREDITED",

    bot_id: bot.id,

    trade_id: trade.id,

    user_id: bot.user_id,

    log_type: "profit",

    message:
      profit >= 0
        ? `Profit of $${profit.toFixed(2)} credited to trading bot.`
        : `Loss of $${Math.abs(profit).toFixed(2)} recorded.`,

    metadata: {
      profit,
      accumulated_profit: accumulatedProfit,
      current_value: currentValue,
      roi,
      total_trades: totalTrades,
      winning_trades: winningTrades,
      losing_trades: losingTrades,
    },

    severity:
      profit >= 0
        ? "info"
        : "warning",
  });

if (profitLogResult.error) {
  console.error(
    "Unable to write profit log:",
    profitLogResult.error.message
  );
}

}