/* -------------------------------------------------------------------------- */
/*                         Trading Bot Trade Engine                           */
/* -------------------------------------------------------------------------- */

import {
  createTrade as createTradeRecord,
  createBotLog,
  getTradingBotById,
  getOpenTradesByBotId,
} from "./repository";

import {
  generateTradeDirection,
  generateEntryPrice,
  generateQuantity,
  generateExitPrice,
  calculateROI,
  calculateGrossProfit,
  calculateTradingFee,
  calculateNetProfit,
  generateTradeLifetimeMinutes, 
} from "./trade-engine.helpers";


import {
  validateTradingBotId,
} from "./validators";


import type {
  TradeExecutionRequest,
  TradeExecutionResult,
} from "./trade-engine.types";



/* -------------------------------------------------------------------------- */
/*                            Execute Trade                                   */
/* -------------------------------------------------------------------------- */

export async function executeTrade(
  request: TradeExecutionRequest
): Promise<TradeExecutionResult> {


  const validation =
    validateTradingBotId(
      request.botId
    );


  if (!validation.valid) {

    return {
      success: false,
      error: validation.errors.join(", "),
    };

  }



  const botResult =
    await getTradingBotById(
      request.botId
    );


  if (
    botResult.error ||
    !botResult.data
  ) {

    return {
      success: false,
      error:
        botResult.error?.message ??
        "Trading bot not found",
    };

  }



  const bot =
    botResult.data;



  if (
    bot.status !== "active"
  ) {

    return {
      success: false,
      error:
        "Trading bot is not active",
    };

  }

  const openTradesResult =
  await getOpenTradesByBotId(
    bot.id
  );

if (
  openTradesResult.error
) {
  return {
    success: false,
    error:
      openTradesResult.error.message,
  };
}

if (
  openTradesResult.data &&
  openTradesResult.data.length > 0
) {
  return {
    success: true,
    tradeInfo:
      openTradesResult.data[0],
  };
}



  const buyPrice =
    generateEntryPrice();


  const quantity =
    generateQuantity();


  const sellPrice =
    generateExitPrice(
      buyPrice
    );


  const roi =
    calculateROI(
      buyPrice,
      sellPrice
    );


  const grossProfit =
    calculateGrossProfit(
      buyPrice,
      sellPrice,
      quantity
    );


  const tradingFee =
    calculateTradingFee(
      grossProfit
    );


  const netProfit =
    calculateNetProfit(
      grossProfit,
      tradingFee
    );



  const now =
  new Date().toISOString();

const expiresAt =
  new Date(
    Date.now() +
      generateTradeLifetimeMinutes() *
        60 *
        1000
  ).toISOString();

const tradeNumber =
  Date.now();



  const trade = {

    user_id:
      bot.user_id,


    bot_id:
      bot.id,


    plan_id:
      bot.plan_id ?? null,


    asset:
      bot.trading_asset ?? "BTC/USD",


    trade_number:
      tradeNumber,


    trade_type:
      generateTradeDirection(),


    status:
      "OPEN",


    buy_price:
      buyPrice,


    sell_price:
      sellPrice,


    quantity,


    roi_percentage:
      roi,


    gross_profit:
      grossProfit,


    trading_fee:
      tradingFee,


    net_profit:
      netProfit,


    market_type:
      "SIMULATED",


    leverage:
      1,


    stop_loss:
      null,


    take_profit:
      null,


    opened_at:
      now,

    expires_at:
      expiresAt,


    closed_at:
      null,


    engine_version:
      "1.0.0",


    generated_by:
      "trading_engine",


    created_at:
      now,


    updated_at:
      now,

  };



  const result =
  await createTradeRecord(trade);

if (
  result.error ||
  !result.data
) {
  return {
    success: false,
    error:
      result.error?.message ??
      "Unable to create trade",
  };
}
const logResult =
  await createBotLog({
    action: "TRADE_OPENED",

    bot_id: bot.id,

    trade_id: result.data.id,

    user_id: bot.user_id,

    log_type: "trade",

    message: `Trade #${tradeNumber} opened (${trade.trade_type}).`,

    metadata: {
      asset: trade.asset,
      direction: trade.trade_type,
      quantity: trade.quantity,
      buy_price: trade.buy_price,
      sell_price: trade.sell_price,
      roi: trade.roi_percentage,
    },

    severity: "info",
  });

if (logResult.error) {
  return {
    success: false,
    error: logResult.error.message,
  };
}

return {
  success: true,
  tradeInfo: result.data,
};

}