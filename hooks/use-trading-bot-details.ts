"use client";

import { useCallback, useEffect, useState } from "react";

import { getTradingBotDetails } from "@/lib/trading-bot/api-client";

import type {
  TradingBotDetailsResponse,
} from "@/lib/trading-bot/api.types";

/* -------------------------------------------------------------------------- */
/*                         Trading Bot Details Hook                           */
/* -------------------------------------------------------------------------- */

export function useTradingBotDetails(
  botId: string | null
) {
  const [data, setData] =
    useState<TradingBotDetailsResponse | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  /* ---------------------------------------------------------------------- */
  /*                              Load Details                              */
  /* ---------------------------------------------------------------------- */

  const loadBot =
    useCallback(async () => {

      if (!botId) {
        return;
      }

      setLoading(true);

      setError(null);

      const result =
        await getTradingBotDetails(botId);

      if (
        result.error ||
        !result.data
      ) {

        setError(
          result.error?.message ??
          "Unable to load trading bot."
        );

        setData(null);

        setLoading(false);

        return;
      }

      setData(result.data);

      setLoading(false);

    }, [botId]);

  /* ---------------------------------------------------------------------- */
  /*                               Auto Load                                */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {

    void loadBot();

  }, [loadBot]);

  /* ---------------------------------------------------------------------- */
  /*                                Return                                  */
  /* ---------------------------------------------------------------------- */

  return {

    bot:
      data?.bot ?? null,

    data,

    loading,

    error,

    reload:
      loadBot,

  };

}