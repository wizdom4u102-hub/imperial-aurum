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

export type ProfileRecord =
  Pick<
    Database["public"]["Tables"]["profiles"]["Row"],
    "id" | "email" | "name" | "username"
  >;

/* -------------------------------------------------------------------------- */
/*                           Dashboard Transfer                               */
/* -------------------------------------------------------------------------- */

export interface DashboardTransferRequest {

  amount: number;

}

/* -------------------------------------------------------------------------- */
/*                            Transfer Result                                 */
/* -------------------------------------------------------------------------- */

export interface DashboardTransferResult {

  success: boolean;

  message: string;

}

/* -------------------------------------------------------------------------- */
/*                      Dashboard Available Balance                           */
/* -------------------------------------------------------------------------- */

export interface DashboardAvailableBalance {

  totalAvailableBalance: number;

  activeBots: number;

}