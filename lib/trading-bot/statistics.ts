import { createClient } from "@/lib/supabase/server";

import type {
  TradingBotStatistics,
} from "./dashboard.types";


export async function getTradingBotStatistics(
  userId: string
): Promise<TradingBotStatistics> {
  const supabase = await createClient();


  const [
    botsResponse,
    statisticsResponse,
    tradesResponse,
  ] = await Promise.all([
    supabase
      .from("user_trading_bots")
      .select(
        `
          id,
          status
        `
      )
      .eq("user_id", userId),


    supabase
      .from("bot_statistics")
      .select(
        `
          total_profit,
          roi_percentage,
          total_trades,
          win_rate,
          winning_trades,
          losing_trades
        `
      )
      .eq("user_id", userId),


    supabase
      .from("bot_trades")
      .select(
        `
          id,
          status
        `
      )
      .eq("user_id", userId),
  ]);



  if (botsResponse.error) {
    throw new Error(
      botsResponse.error.message
    );
  }


  if (statisticsResponse.error) {
    throw new Error(
      statisticsResponse.error.message
    );
  }


  if (tradesResponse.error) {
    throw new Error(
      tradesResponse.error.message
    );
  }

  console.log("=== TRADING BOT STATISTICS DEBUG ===");

console.log(
  "User ID:",
  userId
);

console.log(
  "Bots response:",
  botsResponse.data
);

console.log(
  "Statistics response:",
  statisticsResponse.data
);

console.log(
  "Statistics error:",
  statisticsResponse.error
);

console.log(
  "Trades response:",
  tradesResponse.data
);

console.log(
  "Trades error:",
  tradesResponse.error
);

console.log(
  "====================================="
);



  const bots =
    botsResponse.data ?? [];


  const statistics =
    statisticsResponse.data ?? [];

    console.log(
  "BOT STATISTICS ROWS:",
  statistics
);


  const trades =
    tradesResponse.data ?? [];



  const totalBots =
    bots.length;



  const activeBots =
  bots.filter(
    (bot) =>
      bot.status?.toLowerCase() === "active" ||
      bot.status?.toLowerCase() === "running"
  ).length;



  const totalProfit =
    statistics.reduce(
      (
        sum,
        item
      ) =>
        sum +
        Number(
          item.total_profit ?? 0
        ),
      0
    );



  const totalROI =
    statistics.reduce(
      (
        sum,
        item
      ) =>
        sum +
        Number(
          item.roi_percentage ?? 0
        ),
      0
    );



  const totalTrades =
    trades.length;



  const winningTrades =
    statistics.reduce(
      (
        sum,
        item
      ) =>
        sum +
        Number(
          item.winning_trades ?? 0
        ),
      0
    );



  const losingTrades =
    statistics.reduce(
      (
        sum,
        item
      ) =>
        sum +
        Number(
          item.losing_trades ?? 0
        ),
      0
    );



  const winRate =
    totalTrades > 0
      ? Number(
          (
            (winningTrades /
              totalTrades) *
            100
          ).toFixed(2)
        )
      : 0;



  return {
    totalBots,

    activeBots,

    totalTrades,

    winRate,

    totalProfit,

    totalROI,

    winningTrades,

    losingTrades,
    averagePerformance: totalROI,
  };
}