// lib/trading-bot/service.types.ts

/* -------------------------------------------------------------------------- */
/*                         Service Result Types                               */
/* -------------------------------------------------------------------------- */

export interface ServiceResult<T> {
  data: T | null;
  error: ServiceError | null;
}


export interface ServiceError {
  code: string;
  message: string;
}


export interface ServiceSuccess {
  message: string;
}


export interface ServiceFailure {
  code: string;
  message: string;
}


/* -------------------------------------------------------------------------- */
/*                         Trading Bot Summary                                */
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
/*                           Trading Bot Filters                              */
/* -------------------------------------------------------------------------- */

export interface TradingBotFilters {
  status?: string;

  strategy?: string;
}


/* -------------------------------------------------------------------------- */
/*                            Pagination                                      */
/* -------------------------------------------------------------------------- */

export interface TradingBotPagination {
  page: number;

  pageSize: number;
}