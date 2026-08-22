import type {
  BotTradeRecord,
} from "./types";


/* -------------------------------------------------------------------------- */
/*                            Trade Types                                     */
/* -------------------------------------------------------------------------- */

export type TradeDirection =
  | "BUY"
  | "SELL";


export type TradeStatus =
  | "OPEN"
  | "WON"
  | "LOST"
  | "CLOSED";



/* -------------------------------------------------------------------------- */
/*                         Trade Execution Request                            */
/* -------------------------------------------------------------------------- */

export interface TradeExecutionRequest {

  botId: string;

  metadata?: {

    direction?: TradeDirection;

    asset?: string;

  };

}



/* -------------------------------------------------------------------------- */
/*                         Trade Execution Result                             */
/* -------------------------------------------------------------------------- */

export interface TradeExecutionResult {

  success: boolean;

  tradeInfo?: BotTradeRecord;

  error?: string;

}