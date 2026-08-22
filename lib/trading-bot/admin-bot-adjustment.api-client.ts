import type {
  AdminBotAdjustmentInput,
  AdminBotAdjustmentResult,
  AdminTradingBotAdjustmentBot,
} from "./admin-bot-adjustment.types";


interface AdminBotAdjustmentApiResponse<T> {
  data: T | null;
  error: {
    code: string;
    message: string;
  } | null;
}


/* -------------------------------------------------------------------------- */
/*                         Internal API Helper                                */
/* -------------------------------------------------------------------------- */

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<AdminBotAdjustmentApiResponse<T>> {
  try {
    const response =
      await fetch(
        endpoint,
        {
          headers: {
            "Content-Type":
              "application/json",
          },

          ...options,
        }
      );


    const result =
      await response.json();


    if (!response.ok) {
      return {
        data: null,

        error: {
          code:
            typeof result?.code === "string"
              ? result.code
              : "API_ERROR",

          message:
            typeof result?.error === "string"
              ? result.error
              : "Unable to complete request.",
        },
      };
    }


    return {
      data:
        result as T,

      error:
        null,
    };

  } catch (error) {

    return {
      data: null,

      error: {
        code:
          "NETWORK_ERROR",

        message:
          error instanceof Error
            ? error.message
            : "Unable to complete request.",
      },
    };
  }
}


/* -------------------------------------------------------------------------- */
/*                         Get Admin Bot List                                 */
/* -------------------------------------------------------------------------- */

export async function getAdminTradingBotAdjustmentBots(): Promise<
  AdminBotAdjustmentApiResponse<{
    bots: AdminTradingBotAdjustmentBot[];
  }>
> {
  return request<{
    bots: AdminTradingBotAdjustmentBot[];
  }>(
    "/api/admin/trading-bot/adjustment"
  );
}


/* -------------------------------------------------------------------------- */
/*                         Credit / Debit Bot                                 */
/* -------------------------------------------------------------------------- */

export async function adjustAdminTradingBot(
  input: AdminBotAdjustmentInput & {
    userId: string;
    adjustmentType:
      | "credit"
      | "debit";
  }
): Promise<
  AdminBotAdjustmentApiResponse<{
    success: boolean;
    adjustment:
      AdminBotAdjustmentResult;
  }>
> {
  return request<{
    success: boolean;
    adjustment:
      AdminBotAdjustmentResult;
  }>(
    "/api/admin/trading-bot/adjustment",
    {
      method: "POST",

      body:
        JSON.stringify(
          input
        ),
    }
  );
}