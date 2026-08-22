import type {
  Database,
} from "@/lib/supabase/database.types";


/* -------------------------------------------------------------------------- */
/*                         Database Record Types                              */
/* -------------------------------------------------------------------------- */

export type AdminAdjustmentBotRecord =
  Database["public"]["Tables"]["user_trading_bots"]["Row"];


export type AdminAdjustmentStatisticsRecord =
  Database["public"]["Tables"]["bot_statistics"]["Row"];


/* -------------------------------------------------------------------------- */
/*                         Admin Bot Information                              */
/* -------------------------------------------------------------------------- */

export interface AdminTradingBotAdjustmentBot {
  id: string;

  userId: string;

  userName: string;

  userEmail: string | null;

  botName: string;

  planId: string | null;

  status: string | null;

  investmentCapital: number;

  availableBalance: number;

  currentValue: number;

  accumulatedProfit: number;

  totalProfit: number;

  roiPercentage: number;

  totalTrades: number;

  winningTrades: number;

  losingTrades: number;

  winRate: number;

  todayProfit: number;

  weeklyProfit: number;

  monthlyProfit: number;

  yearlyProfit: number;

  runningDays: number;

  remainingDays: number;

  activatedAt: string | null;

  expiresAt: string | null;
}


/* -------------------------------------------------------------------------- */
/*                         Adjustment Request                                 */
/* -------------------------------------------------------------------------- */

export interface AdminBotAdjustmentInput {
  botId: string;

  amount: number;

  reason: string;
}


/* -------------------------------------------------------------------------- */
/*                         Adjustment Result                                  */
/* -------------------------------------------------------------------------- */

export interface AdminBotAdjustmentResult {
  botId: string;

  userId: string;

  adjustmentType: "credit" | "debit";

  amount: number;

  balanceBefore: number;

  balanceAfter: number;

  currentValueBefore: number;

  currentValueAfter: number;

  adjustedAt: string;
}


/* -------------------------------------------------------------------------- */
/*                         Repository Result                                  */
/* -------------------------------------------------------------------------- */

export interface AdminBotAdjustmentError {
  code: string;

  message: string;
}


export interface AdminBotAdjustmentRepositoryResult<T> {
  data: T | null;

  error: AdminBotAdjustmentError | null;
}