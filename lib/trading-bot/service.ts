import type {
  TradingBotDashboardResponse,
  PerformanceSummaryCard,
} from "./dashboard.types";

import { getTradingBotStatistics } from "./statistics";
import { createClient } from "@/lib/supabase/server";

import {
  getTradingBotById,
  getTradingBotsByUserId,
  getTradesByUserId,
  getBotProfitHistoryByUserId,
  getBotLogsByUserId,
  getUserBotStatistics,
  getAdminMessagesByUserId,
  createTopUpDeposit,
  createBotDeposit,
  createBotLog,
  BotDepositInsert,
  getBotStatistics,
  getTradesByBotId,
  getBotProfitHistoryByBotId,
  getBotLogsByBotId,
  getBotDepositsByBotId,
  getUserBotTransactions,
  } from "./repository";

/* -------------------------------------------------------------------------- */
/*                         Trading Bot Dashboard                              */
/* -------------------------------------------------------------------------- */

export async function getTradingBotDashboard(
  userId: string
): Promise<TradingBotDashboardResponse> {

  const [
    statistics,
    botsResponse,
    statisticsTableResponse,
    recentTradesResponse,
    historyResponse,
    notificationsResponse,
    activitiesResponse,
    performanceResponse,
   ] = await Promise.all([
    getTradingBotStatistics(userId),

    getTradingBotsByUserId(userId),

    getUserBotStatistics(userId),

    getTradesByUserId(userId),

    getUserBotTransactions(userId),

    getAdminMessagesByUserId(userId),

    getBotLogsByUserId(userId),

    getBotPerformanceSummary(userId),
  ]);

  if (botsResponse.error) {
    throw new Error(botsResponse.error.message);
  }

  if (statisticsTableResponse.error) {
    throw new Error(statisticsTableResponse.error.message);
  }

  if (recentTradesResponse.error) {
    throw new Error(recentTradesResponse.error.message);
  }

  if (historyResponse.error) {
    throw new Error(historyResponse.error.message);
  }

  if (notificationsResponse.error) {
    throw new Error(notificationsResponse.error.message);
  }

  if (activitiesResponse.error) {
    throw new Error(activitiesResponse.error.message);
  }

  if (performanceResponse.error) {
    throw new Error(performanceResponse.error.message);
  }

  const statisticsMap = new Map(
    (statisticsTableResponse.data ?? []).map((item) => [
      item.bot_id,
      item,
    ])
  );

  const performanceSummary: PerformanceSummaryCard[] = (
    botsResponse.data ?? []
  ).map((bot) => {
    const botStats = statisticsMap.get(bot.id);

    return {
      bot_name: bot.bot_name,
      performance_value: Number(botStats?.total_profit ?? 0),
      trade_count: Number(botStats?.total_trades ?? 0),
      win_rate: Number(botStats?.win_rate ?? 0),
    };
  });

  const totalAvailableBalance =
  (botsResponse.data ?? []).reduce(
    (total, bot) =>
      total +
      Number(bot.available_balance ?? 0),
    0
  );

const activeBotsCount =
  (botsResponse.data ?? []).filter((bot) => {
    const status =
      bot.status?.toLowerCase();

    return (
      status === "active" ||
      status === "running"
    );
  }).length;

  return {
    statistics,

    totalAvailableBalance,

     activeBotsCount,

    performance: {
      profit_data: performanceResponse.data?.profitData ?? [],
      roi_data: performanceResponse.data?.roiData ?? [],
    },

    activeBots:
  (botsResponse.data ?? []).filter((bot) => {
    const status = bot.status?.toLowerCase();

    return (
      status === "active" ||
      status === "running"
    );
  }),

    performanceSummary,

    recentTrades: recentTradesResponse.data ?? [],

    history: historyResponse.data ?? [],

    notifications: notificationsResponse.data ?? [],

    activities: activitiesResponse.data ?? [],
  };
}

/*-------------------------------------------------------------------*/
/*                       Prepare Bot Deposit                         */
/*-------------------------------------------------------------------*/

export async function prepareBotDeposit(
  input: {
    user_id: string;
    planId: string;
    depositAmount: number;
    txid: string;
  }
) {
  const supabase = await createClient();

  const {
    data: wallet,
    error: walletError,
  } = await supabase
    .from("payment_methods")
    .select("id, name, type, details")
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();

  if (walletError || !wallet) {
    return {
      data: null,
      error: {
        code: "PAYMENT_METHOD_NOT_FOUND",
        message: "No active payment wallet found.",
      },
    };
  }

  // Keep the rest of your existing prepareBotDeposit() code here...

const deposit: BotDepositInsert = {
  user_id: input.user_id,

  bot_id: null,

  plan_id: input.planId,

  investment_amount: input.depositAmount,

  payment_method_id: wallet.id,

  payment_method_name: wallet.name,

  payment_network: wallet.type,

  payment_wallet:
  typeof wallet.details === "string"
    ? wallet.details
    : JSON.stringify(wallet.details),

  transaction_hash: input.txid,

  reference: crypto.randomUUID(),

  status: "pending",
};

  const result = await createBotDeposit(deposit);

  if (result.error) {
    return {
      data: null,
      error: result.error,
    };
  }

  if (!result.data) {
    return {
      data: null,
      error: {
        code: "DEPOSIT_CREATION_FAILED",
        message: "Deposit was created but no data returned.",
      },
    };
  }

  await createBotLog({
  bot_id: null,
  user_id: input.user_id,
  deposit_id: result.data.id,
  log_type: "deposit",
  action: "deposit_submitted",
  message: `Submitted bot deposit of $${input.depositAmount}.`,
  metadata: {
    plan_id: input.planId,
    amount: input.depositAmount,
    txid: input.txid,
  },
});

return {
  data: {
    depositId: result.data.id,
    status: result.data.status,
  },
  error: null,
};
}

export async function prepareBotTopUpDeposit(
  request: {
    user_id: string;

    botId: string;

    depositAmount: number;

    txid: string;

    proofImage?: string | null;

    notes?: string | null;
  }
) {

  const botResult =
    await getTradingBotById(
      request.botId
    );

  if (
    botResult.error ||
    !botResult.data
  ) {
    return {
      data: null,
      error: {
        code: "BOT_NOT_FOUND",
        message:
          "Trading bot not found.",
      },
    };
  }

  const bot =
    botResult.data;

  if (
    bot.user_id !==
    request.user_id
  ) {
    return {
      data: null,
      error: {
        code: "FORBIDDEN",
        message:
          "You do not own this trading bot.",
      },
    };
  }

  const supabase =
    await createClient();

  const {
    data: wallet,
    error: walletError,
  } = await supabase
    .from("payment_methods")
    .select("id, name, type, details")
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();

  if (
    walletError ||
    !wallet
  ) {
    return {
      data: null,
      error: {
        code: "PAYMENT_METHOD_NOT_FOUND",
        message:
          "No active payment wallet found.",
      },
    };
  }

  const result = await createTopUpDeposit({

  user_id:
    request.user_id,

  bot_id:
    request.botId,

  plan_id:
    bot.plan_id,

  investment_amount:
    request.depositAmount,

  payment_method_id:
    wallet.id,

  payment_method_name:
    wallet.name,

  payment_network:
    wallet.type,

  payment_wallet:
    typeof wallet.details === "string"
      ? wallet.details
      : JSON.stringify(wallet.details),

  transaction_hash:
    request.txid,

  proof_image:
    request.proofImage ?? null,

  notes:
    request.notes ?? null,

  reference:
    crypto.randomUUID(),

  status:
    "pending",

  deposit_type:
    "top_up",

});

if (
  result.data &&
  !result.error
) {
  await createBotLog({
    bot_id: request.botId,
    user_id: request.user_id,
    deposit_id: result.data.id,
    log_type: "top_up",
    action: "top_up_submitted",
    message: `Submitted a top-up of $${request.depositAmount}.`,
    metadata: {
      amount: request.depositAmount,
      txid: request.txid,
    },
  });
}

return result;

}

/* -------------------------------------------------------------------------- */
/*                           Trading Bot Details                              */
/* -------------------------------------------------------------------------- */

export async function getTradingBot(
  botId: string,
  userId: string
) {
  const result =
    await getTradingBotById(botId);

  if (
    result.error ||
    !result.data ||
    result.data.user_id !== userId
  ) {
    return {
      data: null,
      error: result.error ?? {
        message: "Trading bot not found",
      },
    };
  }

  return {
    data: result.data,
    error: null,
  };
}

/* -------------------------------------------------------------------------- */
/*                        Trading Bot Details Page                            */
/* -------------------------------------------------------------------------- */

export async function getTradingBotDetails(
  botId: string,
  userId: string
) {
  const botResult =
    await getTradingBot(
      botId,
      userId
    );

  if (
    botResult.error ||
    !botResult.data
  ) {
    return {
      data: null,
      error: botResult.error,
    };
  }

  const [
    statisticsResult,
    tradesResult,
    historyResult,
    logsResult,
    depositsResult,
  ] = await Promise.all([

    getBotStatistics(
      botId
    ),

    getTradesByBotId(
      botId
    ),

    getBotProfitHistoryByBotId(
      botId
    ),

    getBotLogsByBotId(
      botId
    ),

    getBotDepositsByBotId(
      botId
    ),

  ]);

  return {
    data: {
      bot: botResult.data,

      statistics:
        statisticsResult.data,

      trades:
        tradesResult.data ?? [],

      history:
        historyResult.data ?? [],

      logs:
        logsResult.data ?? [],

      deposits:
        depositsResult.data ?? [],
    },

    error:
      statisticsResult.error ??
      tradesResult.error ??
      historyResult.error ??
      logsResult.error ??
      depositsResult.error ??
      null,
  };
}

/* -------------------------------------------------------------------------- */
/*                           Trading History                                  */
/* -------------------------------------------------------------------------- */
export async function getTradingHistory(
  userId: string
) {
  return await getUserBotTransactions(
    userId
  );
}

/* -------------------------------------------------------------------------- */
/*                    Trading Bot Performance Summary                         */
/* -------------------------------------------------------------------------- */

export async function getBotPerformanceSummary(
  userId: string
) {
  const result =
    await getTradesByUserId(userId);

  if (result.error) {
    return {
      data: null,
      error: result.error,
    };
  }

  const trades = result.data ?? [];

  const profitData = trades.map((trade) => ({
    date: trade.created_at ?? "",
    value: Number(trade.net_profit ?? 0),
  }));

  const roiData = trades.map((trade) => ({
    date: trade.created_at ?? "",
    percentage: Number(trade.roi_percentage ?? 0),
  }));

  return {
    data: {
      profitData,
      roiData,
    },
    error: null,
  };
}