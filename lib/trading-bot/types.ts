import type { Database } from "@/lib/supabase/database.types";

/* -------------------------------------------------------------------------- */
/*                              Database Records                              */
/* -------------------------------------------------------------------------- */

export type TradingBotRecord =
  Database["public"]["Tables"]["user_trading_bots"]["Row"];

export type TradingBotInsert =
  Database["public"]["Tables"]["user_trading_bots"]["Insert"];

export type TradingBotUpdate =
  Database["public"]["Tables"]["user_trading_bots"]["Update"];

export type BotTradeRecord =
  Database["public"]["Tables"]["bot_trades"]["Row"];

export type BotTradeInsert =
  Database["public"]["Tables"]["bot_trades"]["Insert"];

export type BotTradeUpdate =
  Database["public"]["Tables"]["bot_trades"]["Update"];

  export type BotStatisticsRecord =
  Database["public"]["Tables"]["bot_statistics"]["Row"];

export type BotProfitHistoryRecord =
  Database["public"]["Tables"]["bot_profit_history"]["Row"];

  export type BotTransactionRecord =
  Database["public"]["Tables"]["bot_transactions"]["Row"];

export type BotTransactionInsert =
  Database["public"]["Tables"]["bot_transactions"]["Insert"];

export type BotTransactionUpdate =
  Database["public"]["Tables"]["bot_transactions"]["Update"];

export type BotLogRecord =
  Database["public"]["Tables"]["bot_logs"]["Row"];

export type BotDepositRecord =
  Database["public"]["Tables"]["bot_deposits"]["Row"];

/* -------------------------------------------------------------------------- */
/*                            Trading Bot Requests                            */
/* -------------------------------------------------------------------------- */

export interface TradingBotActivationRequest {
  botId: string;
  amount: number;
}

export interface TradingBotDepositRequest {
  botId: string;
  depositAmount: number;
}

export interface TradingBotHistoryRequest {
  botId: string;
  page?: number;
  limit?: number;
}

/* -------------------------------------------------------------------------- */
/*                              Domain Models                                 */
/* -------------------------------------------------------------------------- */

export interface TradingBotSummary {
  id: string;

  botName: string;

  tradingAsset: string;

  investmentCapital: number;

  accumulatedProfit: number | null;

  currentValue: number | null;

  status: string | null;

  activatedAt: string | null;

  expiresAt: string | null;
}

/* -------------------------------------------------------------------------- */
/*                    Bot Transaction With Bot Name                           */
/* -------------------------------------------------------------------------- */

export interface BotTransactionWithBot
  extends BotTransactionRecord {

  bot: {

    bot_name: string;

  } | null;

}