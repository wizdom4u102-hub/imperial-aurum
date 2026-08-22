import {
  getAdminTradingBots as getAdminTradingBotsRepository,
  getAdminBotTrades as getAdminBotTradesRepository,
  getAdminBotStatistics as getAdminBotStatisticsRepository,
  getAdminBotLogs as getAdminBotLogsRepository,
} from "./admin-repository";

import type {
  AdminTradingBotRecord,
} from "./admin-repository";

import type {
  BotTradeRecord,
  BotStatisticsRecord,
  BotLogRecord,
} from "./types";

import type {
  RepositoryResult,
} from "./repository.types";


/* -------------------------------------------------------------------------- */
/*                         Admin Trading Bot Service                          */
/* -------------------------------------------------------------------------- */

export async function getAdminTradingBots(): Promise<
  RepositoryResult<AdminTradingBotRecord[]>
> {

  return getAdminTradingBotsRepository();
}


/* -------------------------------------------------------------------------- */
/*                              Admin Bot Trades                              */
/* -------------------------------------------------------------------------- */

export async function getAdminBotTrades(): Promise<
  RepositoryResult<BotTradeRecord[]>
> {

  return getAdminBotTradesRepository();
}


/* -------------------------------------------------------------------------- */
/*                           Admin Bot Statistics                             */
/* -------------------------------------------------------------------------- */

export async function getAdminBotStatistics(): Promise<
  RepositoryResult<BotStatisticsRecord[]>
> {

  return getAdminBotStatisticsRepository();
}


/* -------------------------------------------------------------------------- */
/*                              Admin Bot Logs                                */
/* -------------------------------------------------------------------------- */

export async function getAdminBotLogs(): Promise<
  RepositoryResult<BotLogRecord[]>
> {

  return getAdminBotLogsRepository();
}