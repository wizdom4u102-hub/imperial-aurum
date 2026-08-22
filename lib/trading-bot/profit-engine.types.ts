import type {
  BotTradeRecord,
  BotStatisticsRecord,
} from "./dashboard.types";

/* -------------------------------------------------------------------------- */
/*                        Profit Calculation Types                            */
/* -------------------------------------------------------------------------- */

export interface ProfitCalculationInput {
  botId: string;

  tradeInformation: BotTradeRecord;

  performanceInformation: BotStatisticsRecord;
}

export interface ProfitCalculationResult {
  calculatedValue: number;

  percentageInfo: number;

  status: string;
}

/* -------------------------------------------------------------------------- */
/*                           Profit Dashboard                                */
/* -------------------------------------------------------------------------- */

export interface ProfitSummary {
  totalProfit: number;

  dailyProfit: number;

  weeklyProfit: number;

  monthlyProfit: number;

  overallPerformance: number;
}

/* -------------------------------------------------------------------------- */
/*                                ROI Types                                  */
/* -------------------------------------------------------------------------- */

export interface ROIData {
  currentROI: number;

  targetROI: number;

  progressValue: number;
}