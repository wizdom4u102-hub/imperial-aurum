import type { Database } from "@/lib/supabase/database.types";


/* -------------------------------------------------------------------------- */
/*                         Database Record Types                              */
/* -------------------------------------------------------------------------- */


export type TradingBotRecord =
  Database["public"]["Tables"]["user_trading_bots"]["Row"];


export type BotStatisticsRecord =
  Database["public"]["Tables"]["bot_statistics"]["Row"];


export type BotTradeRecord =
  Database["public"]["Tables"]["bot_trades"]["Row"];


export type BotProfitHistoryRecord =
  Database["public"]["Tables"]["bot_profit_history"]["Row"];

  export type BotTransactionRecord =
  Database["public"]["Tables"]["bot_transactions"]["Row"];


export type BotLogRecord =
  Database["public"]["Tables"]["bot_logs"]["Row"];


export type AdminMessageRecord =
  Database["public"]["Tables"]["user_notifications"]["Row"];


  export interface BotTransactionWithBot
  extends BotTransactionRecord {

  bot: {

    bot_name: string;

  } | null;

}



/* -------------------------------------------------------------------------- */
/*                         Dashboard Statistics                               */
/* -------------------------------------------------------------------------- */


export interface TradingBotStatistics {

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
/*                         Dashboard Performance                              */
/* -------------------------------------------------------------------------- */


export interface TradingBotPerformancePoint {

  date: string;

  value: number;

}


export interface TradingBotRoiPoint {

  date: string;

  percentage: number;

}



export interface TradingBotPerformance {


  profit_data: TradingBotPerformancePoint[];


  roi_data: TradingBotRoiPoint[];


}



/* -------------------------------------------------------------------------- */
/*                         Performance Cards                                  */
/* -------------------------------------------------------------------------- */


export interface PerformanceSummaryCard {


  bot_name: string;


  performance_value: number;


  trade_count: number;


  win_rate: number;


}



/* -------------------------------------------------------------------------- */
/*                         Dashboard Response                                 */
/* -------------------------------------------------------------------------- */


export interface TradingBotDashboardResponse {


  statistics:
    TradingBotStatistics;

   totalAvailableBalance:
    number;

   activeBotsCount:
    number;



  performance:
    TradingBotPerformance;



  activeBots:
    TradingBotRecord[];



  performanceSummary:
    PerformanceSummaryCard[];



  recentTrades:
    BotTradeRecord[];



  history:
     BotTransactionWithBot[];



  notifications:
    AdminMessageRecord[];



  activities:
    BotLogRecord[];



}