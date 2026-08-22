import type {
  DashboardTransferResult,
} from "./transfer-dashboard-funds.types";

/* -------------------------------------------------------------------------- */
/*                    Dashboard Funds Transfer API                            */
/* -------------------------------------------------------------------------- */

export async function transferDashboardFunds(

  amount: number,

): Promise<DashboardTransferResult> {

  const response =
    await fetch(

      "/api/trading-bot/dashboard-transfer",

      {

        method: "POST",

        headers: {

          "Content-Type":
            "application/json",

        },

        body: JSON.stringify({

          amount,

        }),

      }

    );

  const result =
    await response.json();

  if (

    !response.ok

  ) {

    throw new Error(

      result.message ??

      "Transfer failed."

    );

  }

  return result;

}