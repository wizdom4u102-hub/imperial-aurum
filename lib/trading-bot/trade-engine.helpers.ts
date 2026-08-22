/* -------------------------------------------------------------------------- */
/*                         Trade Engine Helpers                               */
/* -------------------------------------------------------------------------- */

import type {
  TradeDirection,
  TradeStatus,
} from "./trade-engine.types";

/* -------------------------------------------------------------------------- */
/*                         Random Direction                                   */
/* -------------------------------------------------------------------------- */

export function generateTradeDirection(): TradeDirection {
  return Math.random() < 0.5
    ? "BUY"
    : "SELL";
}

/* -------------------------------------------------------------------------- */
/*                           Trade Status                                     */
/* -------------------------------------------------------------------------- */

export function generateTradeStatus(): TradeStatus {
  return "OPEN";
}

/* -------------------------------------------------------------------------- */
/*                         Entry Price                                        */
/* -------------------------------------------------------------------------- */

export function generateEntryPrice(): number {
  return Number(
    (100 + Math.random() * 900).toFixed(2)
  );
}

/* -------------------------------------------------------------------------- */
/*                         Exit Price                                         */
/* -------------------------------------------------------------------------- */

export function generateExitPrice(
  entryPrice: number
): number {

  const change =
    (Math.random() - 0.5) * 0.1;

  return Number(
    (
      entryPrice *
      (1 + change)
    ).toFixed(2)
  );

}

/* -------------------------------------------------------------------------- */
/*                         Quantity                                            */
/* -------------------------------------------------------------------------- */

export function generateQuantity(): number {

  return Number(
    (0.01 + Math.random() * 2).toFixed(4)
  );

}

/* -------------------------------------------------------------------------- */
/*                         ROI Percentage                                     */
/* -------------------------------------------------------------------------- */

export function calculateROI(
  buyPrice: number,
  sellPrice: number
): number {

  if (buyPrice <= 0) {
    return 0;
  }

  return Number(
    (
      ((sellPrice - buyPrice) / buyPrice) *
      100
    ).toFixed(2)
  );

}

/* -------------------------------------------------------------------------- */
/*                         Gross Profit                                       */
/* -------------------------------------------------------------------------- */

export function calculateGrossProfit(
  buyPrice: number,
  sellPrice: number,
  quantity: number
): number {

  return Number(
    (
      (sellPrice - buyPrice) *
      quantity
    ).toFixed(2)
  );

}

/* -------------------------------------------------------------------------- */
/*                         Trading Fee                                        */
/* -------------------------------------------------------------------------- */

export function calculateTradingFee(
  grossProfit: number
): number {

  return Number(
    (
      Math.abs(grossProfit) * 0.002
    ).toFixed(2)
  );

}

/* -------------------------------------------------------------------------- */
/*                         Net Profit                                         */
/* -------------------------------------------------------------------------- */

export function calculateNetProfit(
  grossProfit: number,
  tradingFee: number
): number {

  return Number(
    (
      grossProfit -
      tradingFee
    ).toFixed(2)
  );

}

/* -------------------------------------------------------------------------- */
/*                         Trade Duration                                     */
/* -------------------------------------------------------------------------- */

export function calculateTradeDuration(
  openedAt: Date
): number {

  return Math.floor(
    (Date.now() - openedAt.getTime()) / 1000
  );

}

/* -------------------------------------------------------------------------- */
/*                     Trade Lifetime Generator                               */
/* -------------------------------------------------------------------------- */

export function generateTradeLifetimeMinutes(): number {

  const minimum = 5;

  const maximum = 30;

  return (
    Math.floor(
      Math.random() *
      (maximum - minimum + 1)
    ) + minimum
  );

}