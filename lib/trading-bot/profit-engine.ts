import {
  getTradesByBotId,
  getBotStatistics,
} from "./repository";

import {
  calculateAverageProfit,
  calculateProfitDifference,
  calculateROI,
  normalizeProfitValue,
} from "./profit-engine.helpers";

import type {
  ProfitCalculationInput,
  ProfitCalculationResult,
  ProfitSummary,
} from "./profit-engine.types";

import type {
  BotTradeRecord,
} from "./types";


/* -------------------------------------------------------------------------- */
/*                         Trade Profit Calculation                           */
/* -------------------------------------------------------------------------- */

export async function calculateTradeProfit(
  input: ProfitCalculationInput
): Promise<ProfitCalculationResult> {


  const tradeResult =
    await getTradesByBotId(
      input.botId
    );


  if (
    tradeResult.error ||
    !tradeResult.data ||
    tradeResult.data.length === 0
  ) {

    return {

      calculatedValue: 0,

      percentageInfo: 0,

      status: "NO_TRADES",

    };

  }


  const trades =
    tradeResult.data;


  const totalProfit =
    trades.reduce(
      (
        sum: number,
        trade: BotTradeRecord
      ) =>
        sum +
        normalizeProfitValue(
          trade.net_profit
        ),

      0
    );


  const investment =
    Number(
      input.performanceInformation
        ?.investment_capital ?? 0
    );


  const roi =
    calculateROI(
      investment + totalProfit,
      investment
    );


  return {

    calculatedValue:
      totalProfit,

    percentageInfo:
      roi,

    status:
      "SUCCESS",

  };

}



/* -------------------------------------------------------------------------- */
/*                        Bot Performance Summary                             */
/* -------------------------------------------------------------------------- */

export async function calculateBotPerformance(
  botId: string
): Promise<ProfitSummary> {


  const [
    statisticsResult,
    tradesResult,
  ] =
    await Promise.all([

      getBotStatistics(
        botId
      ),

      getTradesByBotId(
        botId
      ),

    ]);



  if (
    statisticsResult.error ||
    !statisticsResult.data
  ) {

    return {

      totalProfit: 0,

      dailyProfit: 0,

      weeklyProfit: 0,

      monthlyProfit: 0,

      overallPerformance: 0,

    };

  }



  const statistics =
    statisticsResult.data;



  const trades =
    tradesResult.data ?? [];



  const profits =
    trades.map(
      (
        trade: BotTradeRecord
      ) =>
        normalizeProfitValue(
          trade.net_profit
        )
    );



  const averageProfit =
    calculateAverageProfit(
      profits
    );



  const overallPerformance =
    calculateProfitDifference(

      Number(
        statistics.current_value ?? 0
      ),

      Number(
        statistics.investment_capital ?? 0
      )

    );



  return {


    totalProfit:
      Number(
        statistics.total_profit ?? 0
      ),


    dailyProfit:
      Number(
        statistics.today_profit ?? 0
      ),


    weeklyProfit:
      Number(
        statistics.weekly_profit ?? 0
      ),


    monthlyProfit:
      Number(
        statistics.monthly_profit ?? 0
      ),


    overallPerformance:
      averageProfit !== 0
        ? overallPerformance
        : 0,

  };

}



/* -------------------------------------------------------------------------- */
/*                          Profit Dashboard Summary                          */
/* -------------------------------------------------------------------------- */

export async function getProfitSummary(
  botId: string
): Promise<ProfitSummary> {


  return calculateBotPerformance(
    botId
  );

}