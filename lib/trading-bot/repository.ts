// lib/trading-bot/repository.ts

import { createClient } from "@/lib/supabase/server";

import type {
  TradingBotRecord,
  TradingBotInsert,
  TradingBotUpdate,
  BotTradeRecord,
  BotTradeInsert,
  BotTradeUpdate,
  BotTransactionInsert,
BotTransactionRecord,
BotTransactionWithBot,
} from "./types";

import type { RepositoryResult } from "./repository.types";
import { supabaseAdmin } from "@/lib/supabase/admin";

import type { Database } from "@/lib/supabase/database.types";


import {
  DATABASE_QUERY_FAILED,
  RECORD_NOT_FOUND,
  INSERT_FAILED,
  UPDATE_FAILED,
  DELETE_FAILED,
} from "./repository.errors";


  type AdminMessageRecord =
  Database["public"]["Tables"]["user_notifications"]["Row"];

/* -------------------------------------------------------------------------- */
/*                              Trading Bots                                  */
/* -------------------------------------------------------------------------- */

export const getTradingBotById = async (
  id: string
): Promise<RepositoryResult<TradingBotRecord>> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_trading_bots")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return {
      data: null,
      error: {
        code: RECORD_NOT_FOUND,
        message: error.message,
      },
    };
  }

  return {
    data,
    error: null,
  };
};

export const getTradingBotsByUserId = async (
  userId: string
): Promise<RepositoryResult<TradingBotRecord[]>> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_trading_bots")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    return {
      data: null,
      error: {
        code: DATABASE_QUERY_FAILED,
        message: error.message,
      },
    };
  }

  return {
    data,
    error: null,
  };
};

export const getActiveTradingBots = async (): Promise<
  RepositoryResult<TradingBotRecord[]>
> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_trading_bots")
    .select("*")
    .eq("status", "active");

  if (error) {
    return {
      data: null,
      error: {
        code: DATABASE_QUERY_FAILED,
        message: error.message,
      },
    };
  }

  return {
    data,
    error: null,
  };
};

export const getExpiredTradingBots = async (): Promise<
  RepositoryResult<TradingBotRecord[]>
> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_trading_bots")
    .select("*")
    .eq("status", "expired");

  if (error) {
    return {
      data: null,
      error: {
        code: DATABASE_QUERY_FAILED,
        message: error.message,
      },
    };
  }

  return {
    data,
    error: null,
  };
};

export const createTradingBot = async (
  bot: TradingBotInsert
): Promise<RepositoryResult<TradingBotRecord>> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_trading_bots")
    .insert(bot)
    .select()
    .single();

  if (error) {
    return {
      data: null,
      error: {
        code: INSERT_FAILED,
        message: error.message,
      },
    };
  }

  return {
    data,
    error: null,
  };
};

export const updateTradingBot = async (
  id: string,
  updates: TradingBotUpdate
): Promise<RepositoryResult<TradingBotRecord>> => {
  const supabase = supabaseAdmin;

  const { data, error } = await supabase
    .from("user_trading_bots")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return {
      data: null,
      error: {
        code: UPDATE_FAILED,
        message: error.message,
      },
    };
  }

  return {
    data,
    error: null,
  };
};

export const deleteTradingBot = async (
  id: string
): Promise<RepositoryResult<null>> => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("user_trading_bots")
    .delete()
    .eq("id", id);

  if (error) {
    return {
      data: null,
      error: {
        code: DELETE_FAILED,
        message: error.message,
      },
    };
  }

  return {
    data: null,
    error: null,
  };
};

/* -------------------------------------------------------------------------- */
/*                              Bot Trades                                    */
/* -------------------------------------------------------------------------- */

export const getTradesByBotId = async (
  botId: string
): Promise<RepositoryResult<BotTradeRecord[]>> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bot_trades")
    .select("*")
    .eq("bot_id", botId);

  if (error) {
    return {
      data: null,
      error: {
        code: DATABASE_QUERY_FAILED,
        message: error.message,
      },
    };
  }

  return {
    data,
    error: null,
  };
};


export const getTradesByUserId = async (
  userId: string
): Promise<RepositoryResult<BotTradeRecord[]>> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bot_trades")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    return {
      data: null,
      error: {
        code: DATABASE_QUERY_FAILED,
        message: error.message,
      },
    };
  }

  return {
    data,
    error: null,
  };
};

export const getOpenTradesByBotId = async (
  botId: string
): Promise<RepositoryResult<BotTradeRecord[]>> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bot_trades")
    .select("*")
    .eq("bot_id", botId)
    .eq("status", "OPEN")
    .order("opened_at", {
      ascending: true,
    });

  if (error) {
    return {
      data: null,
      error: {
        code: DATABASE_QUERY_FAILED,
        message: error.message,
      },
    };
  }

  return {
    data,
    error: null,
  };
};

/* -------------------------------------------------------------------------- */
/*                     Trades Opened Today                                    */
/* -------------------------------------------------------------------------- */

export const getTradesOpenedToday = async (
  botId: string
): Promise<RepositoryResult<BotTradeRecord[]>> => {

  const supabase = await createClient();

  const startOfDay = new Date();

  startOfDay.setHours(
    0,
    0,
    0,
    0
  );

  const { data, error } =
    await supabase
      .from("bot_trades")
      .select("*")
      .eq("bot_id", botId)
      .gte(
        "opened_at",
        startOfDay.toISOString()
      );

  if (error) {
    return {
      data: null,
      error: {
        code: DATABASE_QUERY_FAILED,
        message: error.message,
      },
    };
  }

  return {
    data,
    error: null,
  };

};

// continuation of lib/trading-bot/repository.ts

export const getTradeById = async (
  id: string
): Promise<RepositoryResult<BotTradeRecord>> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bot_trades")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return {
      data: null,
      error: {
        code: RECORD_NOT_FOUND,
        message: error.message,
      },
    };
  }

  return {
    data,
    error: null,
  };
};

export const createTrade = async (
  trade: BotTradeInsert
): Promise<RepositoryResult<BotTradeRecord>> => {
  const supabase = supabaseAdmin;

  const { data, error } = await supabase
    .from("bot_trades")
    .insert(trade)
    .select()
    .single();

  if (error) {
    return {
      data: null,
      error: {
        code: INSERT_FAILED,
        message: error.message,
      },
    };
  }

  return {
    data,
    error: null,
  };
};

export const updateTrade = async (
  id: string,
  updates: BotTradeUpdate
): Promise<RepositoryResult<BotTradeRecord>> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bot_trades")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return {
      data: null,
      error: {
        code: UPDATE_FAILED,
        message: error.message,
      },
    };
  }

  return {
    data,
    error: null,
  };
};

export const deleteTrade = async (
  id: string
): Promise<RepositoryResult<null>> => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("bot_trades")
    .delete()
    .eq("id", id);

  if (error) {
    return {
      data: null,
      error: {
        code: DELETE_FAILED,
        message: error.message,
      },
    };
  }

  return {
    data: null,
    error: null,
  };
};


/* -------------------------------------------------------------------------- */
/*                      Close        Trades                                   */
/* -------------------------------------------------------------------------- */

export const closeTrade = async (
  tradeId: string,
  closedAt: string
): Promise<RepositoryResult<BotTradeRecord>> => {
  const supabase = supabaseAdmin;

  const { data, error } = await supabase
    .from("bot_trades")
    .update({
      status: "CLOSED",
      closed_at: closedAt,
      updated_at: closedAt,
    })
    .eq("id", tradeId)
    .select()
    .single();

  if (error) {
    return {
      data: null,
      error: {
        code: UPDATE_FAILED,
        message: error.message,
      },
    };
  }

  return {
    data,
    error: null,
  };
};

/* -------------------------------------------------------------------------- */
/*                          Trading Bot Deposits                              */
/* -------------------------------------------------------------------------- */

type BotDepositRecord =
  Database["public"]["Tables"]["bot_deposits"]["Row"];

export type BotDepositInsert =
  Database["public"]["Tables"]["bot_deposits"]["Insert"];

type BotDepositUpdate =
  Database["public"]["Tables"]["bot_deposits"]["Update"];


export const getBotDepositById = async (
  id: string
): Promise<RepositoryResult<BotDepositRecord>> => {

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bot_deposits")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return {
      data: null,
      error: {
        code: RECORD_NOT_FOUND,
        message: error.message,
      },
    };
  }

  return {
    data,
    error: null,
  };
};


export const getBotDepositsByUserId = async (
  userId: string
): Promise<RepositoryResult<BotDepositRecord[]>> => {

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bot_deposits")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    return {
      data: null,
      error: {
        code: DATABASE_QUERY_FAILED,
        message: error.message,
      },
    };
  }

  return {
    data,
    error: null,
  };
};


export const getBotDepositsByBotId = async (
  botId: string
): Promise<RepositoryResult<BotDepositRecord[]>> => {

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bot_deposits")
    .select("*")
    .eq("bot_id", botId)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    return {
      data: null,
      error: {
        code: DATABASE_QUERY_FAILED,
        message: error.message,
      },
    };
  }

  return {
    data,
    error: null,
  };

};


export const createBotDeposit = async (
  deposit: BotDepositInsert
): Promise<RepositoryResult<BotDepositRecord>> => {

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bot_deposits")
    .insert(deposit)
    .select()
    .single();

  if (error) {
    return {
      data: null,
      error: {
        code: INSERT_FAILED,
        message: error.message,
      },
    };
  }

  return {
    data,
    error: null,
  };
};

export const createTopUpDeposit = async (
  deposit: BotDepositInsert
): Promise<RepositoryResult<BotDepositRecord>> => {

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bot_deposits")
    .insert({
      ...deposit,
      deposit_type: "top_up",
    })
    .select()
    .single();

  if (error) {
    return {
      data: null,
      error: {
        code: INSERT_FAILED,
        message: error.message,
      },
    };
  }

  return {
    data,
    error: null,
  };

};


export const updateBotDeposit = async (
  id: string,
  updates: BotDepositUpdate
): Promise<RepositoryResult<BotDepositRecord>> => {

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bot_deposits")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return {
      data: null,
      error: {
        code: UPDATE_FAILED,
        message: error.message,
      },
    };
  }

  return {
    data,
    error: null,
  };
};


export const deleteBotDeposit = async (
  id: string
): Promise<RepositoryResult<null>> => {

  const supabase = await createClient();

  const { error } = await supabase
    .from("bot_deposits")
    .delete()
    .eq("id", id);

  if (error) {
    return {
      data: null,
      error: {
        code: DELETE_FAILED,
        message: error.message,
      },
    };
  }

  return {
    data: null,
    error: null,
  };
};

/* -------------------------------------------------------------------------- */
/*                               Bot Logs                                     */
/* -------------------------------------------------------------------------- */

type BotLogRecord =
  Database["public"]["Tables"]["bot_logs"]["Row"];

type BotLogInsert =
  Database["public"]["Tables"]["bot_logs"]["Insert"];


export const createBotLog = async (
  log: BotLogInsert
): Promise<RepositoryResult<BotLogRecord>> => {

  const { data, error } = await supabaseAdmin
    .from("bot_logs")
    .insert(log)
    .select()
    .single();

  if (error) {
    return {
      data: null,
      error: {
        code: INSERT_FAILED,
        message: error.message,
      },
    };
  }

  return {
    data,
    error: null,
  };
};

// continuation of lib/trading-bot/repository.ts

export const getBotLogById = async (
  id: string
): Promise<RepositoryResult<BotLogRecord>> => {

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bot_logs")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return {
      data: null,
      error: {
        code: RECORD_NOT_FOUND,
        message: error.message,
      },
    };
  }

  return {
    data,
    error: null,
  };
};


export const getBotLogsByBotId = async (
  botId: string
): Promise<RepositoryResult<BotLogRecord[]>> => {

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bot_logs")
    .select("*")
    .eq("bot_id", botId)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    return {
      data: null,
      error: {
        code: DATABASE_QUERY_FAILED,
        message: error.message,
      },
    };
  }

  return {
    data,
    error: null,
  };
};


export const getBotLogsByUserId = async (
  userId: string
): Promise<RepositoryResult<BotLogRecord[]>> => {

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bot_logs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    return {
      data: null,
      error: {
        code: DATABASE_QUERY_FAILED,
        message: error.message,
      },
    };
  }

  return {
    data,
    error: null,
  };
};


export const getLatestBotLog = async (
  botId: string
): Promise<RepositoryResult<BotLogRecord>> => {

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bot_logs")
    .select("*")
    .eq("bot_id", botId)
    .order("created_at", {
      ascending: false,
    })
    .limit(1)
    .single();

  if (error) {
    return {
      data: null,
      error: {
        code: RECORD_NOT_FOUND,
        message: error.message,
      },
    };
  }

  return {
    data,
    error: null,
  };
};


export const deleteBotLog = async (
  id: string
): Promise<RepositoryResult<null>> => {

  const supabase = await createClient();

  const { error } = await supabase
    .from("bot_logs")
    .delete()
    .eq("id", id);

  if (error) {
    return {
      data: null,
      error: {
        code: DELETE_FAILED,
        message: error.message,
      },
    };
  }

  return {
    data: null,
    error: null,
  };
};

export const getAdminMessagesByUserId = async (
  userId: string
): Promise<RepositoryResult<AdminMessageRecord[]>> => {
  const supabase = await createClient();

  console.log("Loading notifications for user:", userId);

  const { data, error } = await supabase
  .from("user_notifications")
  .select("*")
  .eq("user_id", userId)
  .order("created_at", {
    ascending: false,
  });

console.log("Loading notifications for user:", userId);
console.log("Admin messages:", data);
console.log("Admin messages error:", error);

  if (error) {
    return {
      data: null,
      error: {
        code: DATABASE_QUERY_FAILED,
        message: error.message,
      },
    };
  }

  return {
    data,
    error: null,
  };
};

/* -------------------------------------------------------------------------- */
/*                          Bot Profit History                                */
/* -------------------------------------------------------------------------- */

type BotProfitHistoryRecord =
  Database["public"]["Tables"]["bot_profit_history"]["Row"];

type BotProfitHistoryInsert =
  Database["public"]["Tables"]["bot_profit_history"]["Insert"];

type BotProfitHistoryUpdate =
  Database["public"]["Tables"]["bot_profit_history"]["Update"];


export const createBotProfitHistory = async (
  profit: BotProfitHistoryInsert
): Promise<RepositoryResult<BotProfitHistoryRecord>> => {

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bot_profit_history")
    .insert(profit)
    .select()
    .single();

  if (error) {
    return {
      data: null,
      error: {
        code: INSERT_FAILED,
        message: error.message,
      },
    };
  }

  return {
    data,
    error: null,
  };
};


export const updateBotProfitHistory = async (
  id: string,
  updates: BotProfitHistoryUpdate
): Promise<RepositoryResult<BotProfitHistoryRecord>> => {

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bot_profit_history")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return {
      data: null,
      error: {
        code: UPDATE_FAILED,
        message: error.message,
      },
    };
  }

  return {
    data,
    error: null,
  };
};


export const getBotProfitHistoryByBotId = async (
  botId: string
): Promise<RepositoryResult<BotProfitHistoryRecord[]>> => {

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bot_profit_history")
    .select("*")
    .eq("bot_id", botId)
    .order("profit_date", {
      ascending: false,
    });

  if (error) {
    return {
      data: null,
      error: {
        code: DATABASE_QUERY_FAILED,
        message: error.message,
      },
    };
  }

  return {
    data,
    error: null,
  };
};


export const getBotProfitHistoryByUserId = async (
  userId: string
): Promise<RepositoryResult<BotProfitHistoryRecord[]>> => {

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bot_profit_history")
    .select("*")
    .eq("user_id", userId)
    .order("profit_date", {
      ascending: false,
    });

  if (error) {
    return {
      data: null,
      error: {
        code: DATABASE_QUERY_FAILED,
        message: error.message,
      },
    };
  }

  return {
    data,
    error: null,
  };
};


export const deleteBotProfitHistory = async (
  id: string
): Promise<RepositoryResult<null>> => {

  const supabase = await createClient();

  const { error } = await supabase
    .from("bot_profit_history")
    .delete()
    .eq("id", id);

  if (error) {
    return {
      data: null,
      error: {
        code: DELETE_FAILED,
        message: error.message,
      },
    };
  }

  return {
    data: null,
    error: null,
  };
};

// continuation of lib/trading-bot/repository.ts

/* -------------------------------------------------------------------------- */
/*                           Bot Statistics                                   */
/* -------------------------------------------------------------------------- */

type BotStatisticsRecord =
  Database["public"]["Tables"]["bot_statistics"]["Row"];

type BotStatisticsInsert =
  Database["public"]["Tables"]["bot_statistics"]["Insert"];

type BotStatisticsUpdate =
  Database["public"]["Tables"]["bot_statistics"]["Update"];


export const getBotStatistics = async (
  botId: string
): Promise<RepositoryResult<BotStatisticsRecord>> => {

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bot_statistics")
    .select("*")
    .eq("bot_id", botId)
    .single();

  if (error) {
    return {
      data: null,
      error: {
        code: RECORD_NOT_FOUND,
        message: error.message,
      },
    };
  }

  return {
    data,
    error: null,
  };
};


/* -------------------------------------------------------------------------- */
/*                          Compatibility Alias                               */
/* -------------------------------------------------------------------------- */

export const getBotStatisticsByBotId =
  getBotStatistics;


export const getUserBotStatistics = async (
  userId: string
): Promise<RepositoryResult<BotStatisticsRecord[]>> => {

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bot_statistics")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    return {
      data: null,
      error: {
        code: DATABASE_QUERY_FAILED,
        message: error.message,
      },
    };
  }

  return {
    data,
    error: null,
  };
};


export const createBotStatistics = async (
  statistics: BotStatisticsInsert
): Promise<RepositoryResult<BotStatisticsRecord>> => {

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bot_statistics")
    .insert(statistics)
    .select()
    .single();

  if (error) {
    return {
      data: null,
      error: {
        code: INSERT_FAILED,
        message: error.message,
      },
    };
  }

  return {
    data,
    error: null,
  };
};


export const updateBotStatistics = async (
  botId: string,
  updates: BotStatisticsUpdate
): Promise<RepositoryResult<BotStatisticsRecord>> => {

  const supabase = supabaseAdmin;

  const { data, error } = await supabase
    .from("bot_statistics")
    .update(updates)
    .eq("bot_id", botId)
    .select()
    .single();

  if (error) {
    return {
      data: null,
      error: {
        code: UPDATE_FAILED,
        message: error.message,
      },
    };
  }

  return {
    data,
    error: null,
  };
};


export const getLatestBotStatistics = async (
  botId: string
): Promise<RepositoryResult<BotStatisticsRecord>> => {

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bot_statistics")
    .select("*")
    .eq("bot_id", botId)
    .order("created_at", {
      ascending: false,
    })
    .limit(1)
    .single();

  if (error) {
    return {
      data: null,
      error: {
        code: RECORD_NOT_FOUND,
        message: error.message,
      },
    };
  }

  return {
    data,
    error: null,
  };
};


export const deleteBotStatistics = async (
  id: string
): Promise<RepositoryResult<null>> => {

  const supabase = await createClient();

  const { error } = await supabase
    .from("bot_statistics")
    .delete()
    .eq("id", id);

  if (error) {
    return {
      data: null,
      error: {
        code: DELETE_FAILED,
        message: error.message,
      },
    };
  }

  return {
    data: null,
    error: null,
  };
};

/* -------------------------------------------------------------------------- */
/*                         Admin Notifications                                */
/* -------------------------------------------------------------------------- */

export const createAdminNotification = async (
  notification: Database["public"]["Tables"]["admin_notifications"]["Insert"]
): Promise<
  RepositoryResult<
    Database["public"]["Tables"]["admin_notifications"]["Row"]
  >
> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("admin_notifications")
    .insert(notification)
    .select()
    .single();

  if (error) {
    return {
      data: null,
      error: {
        code: INSERT_FAILED,
        message: error.message,
      },
    };
  }

  return {
    data,
    error: null,
  };
};

/* -------------------------------------------------------------------------- */
/*                     Create Bot Transaction                                 */
/* -------------------------------------------------------------------------- */

export async function createBotTransaction(
  transaction: BotTransactionInsert,
): Promise<BotTransactionRecord> {

  const supabase =
    supabaseAdmin;

  /*
   * Prevent the same business event from creating
   * more than one bot transaction.
   *
   * Activation / top-up:
   *   reference_id = deposit.id
   *
   * Profit / loss:
   *   reference_id = trade.id
   *
   * Transfers:
   *   reference_id = generated transfer reference
   *
   * Expiry:
   *   reference_id = generated lifecycle reference
   */
  if (
    transaction.reference_id
  ) {

    const {
      data: existingTransaction,
      error: existingTransactionError,
    } = await supabase
      .from("bot_transactions")
      .select("*")
      .eq(
        "reference_id",
        transaction.reference_id,
      )
      .eq(
        "transaction_type",
        transaction.transaction_type,
      )
      .maybeSingle();

    if (
      existingTransactionError
    ) {

      throw existingTransactionError;

    }

    if (
      existingTransaction
    ) {

      return existingTransaction;

    }

  }

  const {
    data,
    error,
  } = await supabase
    .from("bot_transactions")
    .insert(
      transaction
    )
    .select()
    .single();

  if (error) {

    throw error;

  }

  return data;

}
/* -------------------------------------------------------------------------- */
/*                    Get User Bot Transactions                               */
/* -------------------------------------------------------------------------- */

export async function getUserBotTransactions(
  userId: string,
): Promise<{
  data: BotTransactionWithBot[] | null;
  error: Error | null;
}> {

  const supabase =
    await createClient();

  const {
    data,
    error,
  } = await supabase

    .from("bot_transactions")

    .select(`
      *,
      bot:user_trading_bots(
        bot_name
      )
    `)

    .eq("user_id", userId)

    .order("created_at", {
      ascending: false,
    });

  if (error) {

    return {

      data: null,

      error,

    };

  }

  return {

    data:
      (data ?? []) as BotTransactionWithBot[],

    error: null,

  };

}