// lib/trading-bot/repository.types.ts

import type {
  BotTradeInsert,
  BotTradeRecord,
  BotTradeUpdate,
  TradingBotInsert,
  TradingBotRecord,
  TradingBotUpdate,
} from "./types";

/* -------------------------------------------------------------------------- */
/*                              Repository Result                             */
/* -------------------------------------------------------------------------- */

export interface RepositoryResult<T> {
  data: T | null;
  error: RepositoryError | null;
}

export interface RepositoryError {
  code: string;
  message: string;
  details?: string;
}

export interface RepositorySuccess {
  success: true;
  message: string;
}

/* -------------------------------------------------------------------------- */
/*                            Pagination & Filters                            */
/* -------------------------------------------------------------------------- */

export interface PaginationOptions {
  page?: number;
  pageSize?: number;
}

export interface QueryOptions extends PaginationOptions {
  orderBy?: string;
  ascending?: boolean;
}

export interface TradingBotFilterOptions
  extends QueryOptions {
  userId: string;

  status?: string;

  planId?: string;

  tradingAsset?: string;

  botName?: string;

  search?: string;
}

export interface BotTradeFilterOptions
  extends QueryOptions {
  userId: string;

  botId?: string;

  planId?: string;

  status?: string;

  asset?: string;

  tradeType?: string;

  marketType?: string;
}

/* -------------------------------------------------------------------------- */
/*                       Trading Bot Repository DTOs                          */
/* -------------------------------------------------------------------------- */

export interface CreateTradingBotRepositoryInput {
  bot: TradingBotInsert;
}

export interface UpdateTradingBotRepositoryInput {
  botId: string;

  updates: TradingBotUpdate;
}

export interface DeleteTradingBotRepositoryInput {
  botId: string;
}

export interface TradingBotByIdInput {
  botId: string;
}

export interface TradingBotsByUserInput
  extends TradingBotFilterOptions {}

export interface PauseTradingBotInput {
  botId: string;

  pausedAt: string;
}

export interface ResumeTradingBotInput {
  botId: string;

  resumedAt: string;
}

export interface StopTradingBotInput {
  botId: string;

  stoppedAt: string;
}

export interface RenewTradingBotInput {
  botId: string;

  expiresAt: string;

  renewalCount: number;
}

export interface UpdateBotTradeTimestampInput {
  botId: string;

  lastTradeAt: string;
}

export interface UpdateBotProfitTimestampInput {
  botId: string;

  lastProfitAt: string;
}

/* -------------------------------------------------------------------------- */
/*                          Bot Trades Repository DTOs                        */
/* -------------------------------------------------------------------------- */

export interface CreateBotTradeInput {
  trade: BotTradeInsert;
}

export interface UpdateBotTradeInput {
  tradeId: string;

  updates: BotTradeUpdate;
}

export interface CloseBotTradeInput {
  tradeId: string;

  sellPrice?: number;

  grossProfit?: number;

  tradingFee?: number;

  netProfit?: number;

  roiPercentage?: number;

  closedAt: string;

  status: string;
}

export interface BotTradeByIdInput {
  tradeId: string;
}

export interface BotTradesByUserInput
  extends BotTradeFilterOptions {}

export interface BotTradesByBotInput
  extends BotTradeFilterOptions {
  botId: string;
}

/* -------------------------------------------------------------------------- */
/*                         Repository Response Types                          */
/* -------------------------------------------------------------------------- */

export type TradingBotRepositoryResult =
  RepositoryResult<TradingBotRecord>;

export type TradingBotsRepositoryResult =
  RepositoryResult<TradingBotRecord[]>;

export type BotTradeRepositoryResult =
  RepositoryResult<BotTradeRecord>;

export type BotTradesRepositoryResult =
  RepositoryResult<BotTradeRecord[]>;

export type RepositorySuccessResult =
  RepositoryResult<RepositorySuccess>;