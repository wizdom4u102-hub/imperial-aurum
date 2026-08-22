/* -------------------------------------------------------------------------- */
/*                         Trading Bot Trade Lifecycle                        */
/* -------------------------------------------------------------------------- */

import {
  getOpenTradesByBotId,
  closeTrade,
} from "./repository";

import type {
  BotTradeRecord,
} from "./types";


/* -------------------------------------------------------------------------- */
/*                     Process Open Trades                                    */
/* -------------------------------------------------------------------------- */

export async function processOpenTrades(
  botId: string
): Promise<void> {

  const result =
    await getOpenTradesByBotId(
      botId
    );

  if (
    result.error ||
    !result.data
  ) {
    return;
  }

  const now =
    new Date();

  for (const trade of result.data) {

    if (
      !trade.expires_at
    ) {
      continue;
    }

    const expiresAt =
      new Date(
        trade.expires_at
      );

    if (
      expiresAt > now
    ) {
      continue;
    }

    await closeTrade(
      trade.id,
      now.toISOString()
    );

  }

}