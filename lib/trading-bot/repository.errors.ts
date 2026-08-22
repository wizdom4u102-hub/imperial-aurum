// lib/trading-bot/repository.errors.ts

import type { RepositoryError } from "./repository.types";

/* -------------------------------------------------------------------------- */
/*                         Repository Error Codes                             */
/* -------------------------------------------------------------------------- */

export const DATABASE_QUERY_FAILED = "DATABASE_QUERY_FAILED";

export const RECORD_NOT_FOUND = "RECORD_NOT_FOUND";

export const INSERT_FAILED = "INSERT_FAILED";

export const UPDATE_FAILED = "UPDATE_FAILED";

export const DELETE_FAILED = "DELETE_FAILED";

export const INVALID_DATABASE_RESPONSE =
  "INVALID_DATABASE_RESPONSE";

export const INVALID_INPUT =
  "INVALID_INPUT";

export const DUPLICATE_RECORD =
  "DUPLICATE_RECORD";

export const UNAUTHORIZED_ACCESS =
  "UNAUTHORIZED_ACCESS";

export const FORBIDDEN_OPERATION =
  "FORBIDDEN_OPERATION";

export const TRANSACTION_FAILED =
  "TRANSACTION_FAILED";

export const PAGINATION_ERROR =
  "PAGINATION_ERROR";

export const FILTER_ERROR =
  "FILTER_ERROR";

export const SORT_ERROR =
  "SORT_ERROR";

export const BOT_NOT_FOUND =
  "BOT_NOT_FOUND";

export const BOT_ALREADY_ACTIVE =
  "BOT_ALREADY_ACTIVE";

export const BOT_ALREADY_PAUSED =
  "BOT_ALREADY_PAUSED";

export const BOT_ALREADY_STOPPED =
  "BOT_ALREADY_STOPPED";

export const BOT_ALREADY_EXPIRED =
  "BOT_ALREADY_EXPIRED";

export const TRADE_NOT_FOUND =
  "TRADE_NOT_FOUND";

export const INVALID_TRADE_STATE =
  "INVALID_TRADE_STATE";

export const DEPOSIT_NOT_FOUND =
  "DEPOSIT_NOT_FOUND";

export const PLAN_NOT_FOUND =
  "PLAN_NOT_FOUND";

export const LOG_NOT_FOUND =
  "LOG_NOT_FOUND";

export const STATISTICS_NOT_FOUND =
  "STATISTICS_NOT_FOUND";

export const PROFIT_HISTORY_NOT_FOUND =
  "PROFIT_HISTORY_NOT_FOUND";

/* -------------------------------------------------------------------------- */
/*                         Repository Error Factory                           */
/* -------------------------------------------------------------------------- */

export function createRepositoryError(
  code: string,
  message: string,
  details?: string
): RepositoryError {
  return {
    code,
    message,
    details,
  };
}

/* -------------------------------------------------------------------------- */
/*                          Type Guard                                         */
/* -------------------------------------------------------------------------- */

export function isRepositoryError(
  value: unknown
): value is RepositoryError {
  return (
    typeof value === "object" &&
    value !== null &&
    "code" in value &&
    "message" in value
  );
}