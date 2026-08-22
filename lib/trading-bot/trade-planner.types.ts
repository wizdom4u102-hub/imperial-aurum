/* -------------------------------------------------------------------------- */
/*                        Trading Bot Planner Types                           */
/* -------------------------------------------------------------------------- */

export interface TradePlan {
  targetTrades: number;

  openedTrades: number;

  shouldOpenTrade: boolean;
}


/* -------------------------------------------------------------------------- */
/*                      Trade Planning Statistics                             */
/* -------------------------------------------------------------------------- */

export interface DailyTradeStatistics {

  targetTrades: number;

  openedTrades: number;

  remainingTrades: number;

}


/* -------------------------------------------------------------------------- */
/*                         Trade Lifetime                                     */
/* -------------------------------------------------------------------------- */

export interface TradeLifetime {

  openedAt: string;

  expiresAt: string;

  expired: boolean;

}