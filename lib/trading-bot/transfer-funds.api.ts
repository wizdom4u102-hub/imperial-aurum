import type {
  TransferFundsRequest,
  TransferFundsResult,
} from "./transfer-funds.types";

/* -------------------------------------------------------------------------- */
/*                      Transfer Bot Profit API                               */
/* -------------------------------------------------------------------------- */

export async function transferFunds(

  request: TransferFundsRequest

): Promise<TransferFundsResult> {

  const response = await fetch(

    "/api/trading-bot/transfer-funds",

    {

      method: "POST",

      headers: {

        "Content-Type":
          "application/json",

      },

      body: JSON.stringify(
        request
      ),

    }

  );

  const result =
    await response.json();

  if (!response.ok) {

    throw new Error(

      result.message ??
      "Transfer failed."

    );

  }

  return result;

}