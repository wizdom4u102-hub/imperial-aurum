import type {
  Database,
} from "@/lib/supabase/database.types";

/* -------------------------------------------------------------------------- */
/*                               Database Types                               */
/* -------------------------------------------------------------------------- */

export type TradingBotRecord =
  Database["public"]["Tables"]["user_trading_bots"]["Row"];

export type TradingBotUpdate =
  Database["public"]["Tables"]["user_trading_bots"]["Update"];

export type BalanceRecord =
  Database["public"]["Tables"]["balances"]["Row"];

export type BalanceUpdate =
  Database["public"]["Tables"]["balances"]["Update"];

export type TransactionInsert =
  Database["public"]["Tables"]["transactions"]["Insert"];

export type BotLogInsert =
  Database["public"]["Tables"]["bot_logs"]["Insert"];

export type NotificationInsert =
  Database["public"]["Tables"]["user_notifications"]["Insert"];

/* -------------------------------------------------------------------------- */
/*                            Transfer Request                                */
/* -------------------------------------------------------------------------- */

export interface TransferFundsRequest {

  botId: string;

  amount: number;

}

/* -------------------------------------------------------------------------- */
/*                           Transfer Validation                              */
/* -------------------------------------------------------------------------- */

export interface TransferValidationResult {

  valid: boolean;

  message?: string;

}

/* -------------------------------------------------------------------------- */
/*                            Transfer Result                                 */
/* -------------------------------------------------------------------------- */

export interface TransferFundsResult {

  success: boolean;

  message: string;

}

/* -------------------------------------------------------------------------- */
/*                         Available Balance                                  */
/* -------------------------------------------------------------------------- */

export interface TransferBalance {

  investmentCapital: number;

  currentValue: number;

  accumulatedProfit: number;

  transferableProfit: number;

}