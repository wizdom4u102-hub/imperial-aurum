"use client";

import {
  useState,
  useEffect,
  useCallback,
} from "react";

import { getTradingBotDashboard } from "@/lib/trading-bot/api-client";

import type {
  ApiResponse,
  TradingBotDashboardResponse,
} from "@/lib/trading-bot/api.types";

interface TradingBotHookError {
  code: string;
  message: string;
}

export function useTradingBotData() {
  const [data, setData] =
    useState<TradingBotDashboardResponse | null>(null);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [error, setError] =
    useState<TradingBotHookError | null>(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response: ApiResponse<TradingBotDashboardResponse> =
        await getTradingBotDashboard();

      if (response.error) {
        setError(response.error);
        return;
      }

      setData(response.data);
    } catch (err) {
      setError({
        code: "CLIENT_ERROR",
        message:
          err instanceof Error
            ? err.message
            : "Failed to load trading bot dashboard.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    data,
    loading,
    error,
    refresh: fetchDashboard,
  };
}