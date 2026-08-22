/* -------------------------------------------------------------------------- */
/*                         Trading Bot Dashboard Stats                        */
/* -------------------------------------------------------------------------- */

export interface TradingBotDashboardStatistics {
  totalBots: number;

  activeBots: number;

  totalTrades: number;

  winningTrades: number;

  losingTrades: number;

  winRate: number;

  totalProfit: number;

  totalROI: number;

  averagePerformance: number;
}


/* -------------------------------------------------------------------------- */
/*                       Trading Bot Performance Summary                      */
/* -------------------------------------------------------------------------- */

export interface TradingBotPerformanceSummary {
  botId: string;

  botName: string;

  tradeCount: number;

  winRate: number;

  performanceValue: number;
}


/* -------------------------------------------------------------------------- */
/*                         Performance Chart Data                             */
/* -------------------------------------------------------------------------- */

export interface TradingBotPerformancePoint {
  date: string;

  value: number;
}

export interface TradingBotRoiPoint {
  date: string;

  percentage: number;
}


/* -------------------------------------------------------------------------- */
/*                         Trade Statistics                                   */
/* -------------------------------------------------------------------------- */

export interface TradeStatistics {
  totalTrades: number;

  successfulTrades: number;

  failedTrades: number;

  pendingTrades: number;

  winRate: number;
}


/* -------------------------------------------------------------------------- */
/*                         Dashboard Supporting Data                          */
/* -------------------------------------------------------------------------- */

export interface TradingBotActivity {
  id?: string;

  title: string;

  description?: string;

  timestamp?: string;
}


export interface TradingBotNotification {
  id: string;

  type:
    | "success"
    | "warning"
    | "info"
    | "error"
    | "profit"
    | "trade"
    | "deposit";

  title: string;

  message: string;

  timestamp: string;

  read: boolean;
}