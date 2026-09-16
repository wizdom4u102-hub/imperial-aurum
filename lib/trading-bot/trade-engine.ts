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

  console.log(
    "[TRADING BOT] Execute trade started:",
    request.botId
  );


  /* ------------------------------------------------------------------------ */
  /*                              Validation                                  */
  /* ------------------------------------------------------------------------ */

  const validation =
    validateTradingBotId(
      request.botId
    );

  if (!validation.valid) {

    console.error(
      "[TRADING BOT] Trade validation failed:",
      request.botId,
      validation.errors
    );

    return {
      success: false,
      error: validation.errors.join(", "),
    };

  }


  /* ------------------------------------------------------------------------ */
  /*                              Load Bot                                    */
  /* ------------------------------------------------------------------------ */

  const botResult =
    await getTradingBotById(
      request.botId
    );

  if (
    botResult.error ||
    !botResult.data
  ) {

    const errorMessage =
      botResult.error?.message ??
      "Trading bot not found";

    console.error(
      "[TRADING BOT] Unable to load bot:",
      request.botId,
      errorMessage
    );

    return {
      success: false,
      error: errorMessage,
    };

  }

  const bot =
    botResult.data;


  console.log(
    "[TRADING BOT] Bot loaded:",
    {
      botId: bot.id,
      status: bot.status,
      userId: bot.user_id,
      planId: bot.plan_id,
    }
  );


  /* ------------------------------------------------------------------------ */
  /*                         Verify Bot Is Active                             */
  /* ------------------------------------------------------------------------ */

  if (
    bot.status !== "active"
  ) {

    console.log(
      "[TRADING BOT] Bot is not active:",
      bot.id
    );

    return {
      success: false,
      error:
        "Trading bot is not active",
    };

  }


  /* ------------------------------------------------------------------------ */
  /*                       Check Existing Open Trade                          */
  /* ------------------------------------------------------------------------ */

  const openTradesResult =
    await getOpenTradesByBotId(
      bot.id
    );

  if (
    openTradesResult.error
  ) {

    console.error(
      "[TRADING BOT] Failed to check open trades:",
      {
        botId: bot.id,
        error: openTradesResult.error.message,
      }
    );

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

    console.log(
      "[TRADING BOT] Open trade already exists:",
      {
        botId: bot.id,
        tradeId:
          openTradesResult.data[0].id,
      }
    );

    return {
      success: true,
      tradeInfo:
        openTradesResult.data[0],
    };

  }


  console.log(
    "[TRADING BOT] No open trade found. Generating new trade:",
    bot.id
  );


  /* ------------------------------------------------------------------------ */
  /*                       Generate Trade Values                              */
  /* ------------------------------------------------------------------------ */

  const tradeType =
    generateTradeDirection();

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


  /* ------------------------------------------------------------------------ */
  /*                              Timestamps                                  */
  /* ------------------------------------------------------------------------ */

  const now =
    new Date().toISOString();

  const lifetimeMinutes =
    generateTradeLifetimeMinutes();

  const expiresAt =
    new Date(
      Date.now() +
        lifetimeMinutes *
          60 *
          1000
    ).toISOString();


  /* ------------------------------------------------------------------------ */
  /*                           Trade Number                                   */
  /* ------------------------------------------------------------------------ */

  const tradeNumber =
    Date.now();


  /* ------------------------------------------------------------------------ */
  /*                           Trade Record                                   */
  /* ------------------------------------------------------------------------ */

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
      tradeType,

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


  console.log(
    "[TRADING BOT] Trade record generated:",
    {
      botId: bot.id,
      tradeNumber,
      asset: trade.asset,
      direction: trade.trade_type,
      buyPrice,
      sellPrice,
      quantity,
      roi,
      grossProfit,
      tradingFee,
      netProfit,
      lifetimeMinutes,
      expiresAt,
    }
  );


  /* ------------------------------------------------------------------------ */
  /*                         Create Trade                                     */
  /* ------------------------------------------------------------------------ */

  console.log(
    "[TRADING BOT] Inserting trade into bot_trades:",
    {
      botId: bot.id,
      tradeNumber,
    }
  );

  const result =
    await createTradeRecord(
      trade
    );


  if (
    result.error ||
    !result.data
  ) {

    const errorMessage =
      result.error?.message ??
      "Unable to create trade";

    console.error(
      "[TRADING BOT] Trade INSERT failed:",
      {
        botId: bot.id,
        tradeNumber,
        error: errorMessage,
      }
    );

    return {
      success: false,
      error: errorMessage,
    };

  }


  console.log(
    "[TRADING BOT] Trade created successfully:",
    {
      botId: bot.id,
      tradeId: result.data.id,
      tradeNumber: result.data.trade_number,
    }
  );


  /* ------------------------------------------------------------------------ */
  /*                         Create Trade Log                                 */
  /* ------------------------------------------------------------------------ */

  const logResult =
    await createBotLog({
      action: "TRADE_OPENED",

      bot_id:
        bot.id,

      trade_id:
        result.data.id,

      user_id:
        bot.user_id,

      log_type:
        "trade",

      message:
        `Trade #${tradeNumber} opened (${tradeType}).`,

      metadata: {
        asset:
          trade.asset,

        direction:
          trade.trade_type,

        quantity:
          trade.quantity,

        buy_price:
          trade.buy_price,

        sell_price:
          trade.sell_price,

        roi:
          trade.roi_percentage,

      },

      severity:
        "info",
    });


  if (
    logResult.error
  ) {

    /*
     * The trade has already been created successfully.
     *
     * Do NOT report the entire trade execution as failed,
     * because that would make the scheduler believe no trade
     * exists even though the trade was inserted.
     */

    console.error(
      "[TRADING BOT] Trade created but trade log failed:",
      {
        botId: bot.id,
        tradeId: result.data.id,
        error: logResult.error.message,
      }
    );

  }


  /* ------------------------------------------------------------------------ */
  /*                              Complete                                    */
  /* ------------------------------------------------------------------------ */

  console.log(
    "[TRADING BOT] Trade execution completed:",
    {
      botId: bot.id,
      tradeId: result.data.id,
      tradeNumber: result.data.trade_number,
    }
  );


  return {
    success: true,
    tradeInfo:
      result.data,
  };

}