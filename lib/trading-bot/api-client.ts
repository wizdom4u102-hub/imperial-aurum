import type {
  ApiResponse,
  TradingBotActivationResponse,
  TradingBotDashboardResponse,
  TradingBotDepositResponse,
  TradingBotDetailsResponse,
  TradingBotHistoryResponse,
  TradingBotPerformanceResponse,
} from "./api.types";

import { handleApiError } from "./api.errors";

const API_BASE_URL = "/api/trading-bot";

/* -------------------------------------------------------------------------- */
/*                         Internal API Helper                                */
/* -------------------------------------------------------------------------- */

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        data: null,
        error: handleApiError(response, result),
      };
    }

    return result as ApiResponse<T>;
  } catch (error) {
    return {
      data: null,
      error: {
        code: "NETWORK_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "Unable to complete API request",
      },
    };
  }
}

/* -------------------------------------------------------------------------- */
/*                         Trading Bot Dashboard                              */
/* -------------------------------------------------------------------------- */

export async function getTradingBotDashboard(): Promise<
  ApiResponse<TradingBotDashboardResponse>
> {
  return request<TradingBotDashboardResponse>("/dashboard");
}

/* -------------------------------------------------------------------------- */
/*                         Trading Bot Activation                             */
/* -------------------------------------------------------------------------- */

export async function activateTradingBot(requestBody: {
  botId: string;
  amount: number;
}): Promise<ApiResponse<TradingBotActivationResponse>> {
  return request<TradingBotActivationResponse>("/activate", {
    method: "POST",
    body: JSON.stringify(requestBody),
  });
}

/* -------------------------------------------------------------------------- */
/*                         Trading Bot History                                */
/* -------------------------------------------------------------------------- */

export async function getTradingBotHistory(): Promise<
  ApiResponse<TradingBotHistoryResponse>
> {
  return request<TradingBotHistoryResponse>("/history");
}

/* -------------------------------------------------------------------------- */
/*                         Trading Bot Deposit                                */
/* -------------------------------------------------------------------------- */

export async function depositToTradingBot(requestBody: {
  planId: string;
  depositAmount: number;
  txid: string;
}): Promise<ApiResponse<TradingBotDepositResponse>> {
  return request<TradingBotDepositResponse>("/deposit", {
    method: "POST",
    body: JSON.stringify(requestBody),
  });
}

/* -------------------------------------------------------------------------- */
/*                         Trading Bot Details                                */
/* -------------------------------------------------------------------------- */

export async function getTradingBotDetails(
  botId: string
): Promise<ApiResponse<TradingBotDetailsResponse>> {
  return request<TradingBotDetailsResponse>(
    `/details?id=${encodeURIComponent(botId)}`
  );
}

/* -------------------------------------------------------------------------- */
/*                         Trading Bot Performance                            */
/* -------------------------------------------------------------------------- */

export async function getTradingBotPerformance(): Promise<
  ApiResponse<TradingBotPerformanceResponse>
> {
  return request<TradingBotPerformanceResponse>("/performance");
}