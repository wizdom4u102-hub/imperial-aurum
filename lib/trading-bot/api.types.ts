// lib/trading-bot/api.types.ts

import type { Database } from "@/lib/supabase/database.types";

import type {
  TradingBotRecord,
  BotTradeRecord,
  BotStatisticsRecord,
  BotProfitHistoryRecord,
  BotLogRecord,
  BotDepositRecord,
} from "./types";

export type {
  TradingBotDashboardResponse,
  TradingBotPerformance,
  TradingBotPerformancePoint,
  TradingBotRoiPoint,
} from "./dashboard.types";

/* -------------------------------------------------------------------------- */
/*                              Generic API Types                             */
/* -------------------------------------------------------------------------- */

export interface ApiError {
  code: string;

  message: string;
}

export interface ApiResponse<T> {
  data: T | null;

  error: ApiError | null;
}

export interface ApiErrorResponse {
  error: string;

  message?: string;

  status: number;

  code?: string;
}

/* -------------------------------------------------------------------------- */
/*                         Dashboard Performance API                          */
/* -------------------------------------------------------------------------- */

import type {
  TradingBotPerformance,
} from "./dashboard.types";

export interface TradingBotPerformanceResponse {
  performance: TradingBotPerformance;
}

/* -------------------------------------------------------------------------- */
/*                         Trading Bot Activation API                         */
/* -------------------------------------------------------------------------- */

export interface TradingBotActivationResponse {
  message: string;

  data: {
    botId: string;

    activated: boolean;
  };
}

/* -------------------------------------------------------------------------- */
/*                            Trading Bot Deposit API                         */
/* -------------------------------------------------------------------------- */

export interface TradingBotDepositResponse {
  message: string;

  data: {
    depositId: string;

    status: string;
  };
}

/* -------------------------------------------------------------------------- */
/*                            Trading History API                             */
/* -------------------------------------------------------------------------- */

export interface TradingBotHistoryResponse {
  trades: BotTradeRecord[]
}

/* -------------------------------------------------------------------------- */
/*                              Bot Details API                               */
/* -------------------------------------------------------------------------- */

export interface TradingBotDetailsResponse {

  bot: TradingBotRecord;

  statistics:
    BotStatisticsRecord | null;

  trades:
    BotTradeRecord[];

  history:
    BotProfitHistoryRecord[];

  logs:
    BotLogRecord[];

  deposits:
    BotDepositRecord[];

}

/* -------------------------------------------------------------------------- */
/*                          API Request Payloads                              */
/* -------------------------------------------------------------------------- */

export interface ActivateTradingBotRequest {
  botId: string;
}

export interface CreateTradingBotDepositRequest {
  botId: string;

  amount: number;

  paymentMethod?: string;
}

/* -------------------------------------------------------------------------- */
/*                         Paginated Responses                                */
/* -------------------------------------------------------------------------- */

export interface TradingBotTradesResponse {
  trades: BotTradeRecord[]

  total?: number;
}

/* -------------------------------------------------------------------------- */
/*                           API Utility Types                                */
/* -------------------------------------------------------------------------- */

export type TradingBotApiResult<T> =
  | ApiResponse<T>
  | ApiErrorResponse;

/* -------------------------------------------------------------------------- */
/*                         Trading Bot Settings API                           */
/* -------------------------------------------------------------------------- */

export type TradingBotSettings =
  Database["public"]["Tables"]["trading_bot_settings"]["Row"];

export type TradingBotSettingsResponse =
  ApiResponse<TradingBotSettings>;

export interface UpdateTradingBotSettingsRequest {
  auto_reinvest: boolean;

  auto_renew: boolean;

  email_notifications: boolean;

  notifications_enabled: boolean;

  preferred_currency: string;

  push_notifications: boolean;

  risk_level: string;

  timezone: string;
}