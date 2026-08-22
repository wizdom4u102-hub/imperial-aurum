"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  adjustAdminTradingBot,
  getAdminTradingBotAdjustmentBots,
} from "@/lib/trading-bot/admin-bot-adjustment.api-client";

import type {
  AdminBotAdjustmentInput,
  AdminBotAdjustmentResult,
  AdminTradingBotAdjustmentBot,
} from "@/lib/trading-bot/admin-bot-adjustment.types";


interface AdminBotAdjustmentError {
  code: string;
  message: string;
}


export function useAdminBotAdjustment() {

  const [
    bots,
    setBots,
  ] = useState<
    AdminTradingBotAdjustmentBot[]
  >([]);


  const [
    loading,
    setLoading,
  ] = useState<boolean>(
    true
  );


  const [
    submitting,
    setSubmitting,
  ] = useState<boolean>(
    false
  );


  const [
    error,
    setError,
  ] = useState<
    AdminBotAdjustmentError | null
  >(null);


  const [
    lastAdjustment,
    setLastAdjustment,
  ] = useState<
    AdminBotAdjustmentResult | null
  >(null);


  /* ------------------------------------------------------------------------ */
  /*                              Load Bots                                  */
  /* ------------------------------------------------------------------------ */

  const fetchBots =
    useCallback(
      async () => {

        try {

          setLoading(true);

          setError(null);


          const response =
            await getAdminTradingBotAdjustmentBots();


          if (
            response.error
          ) {

            setError(
              response.error
            );

            return;
          }


          setBots(
            response.data?.bots ??
            []
          );

        } catch (error) {

          setError({
            code:
              "CLIENT_ERROR",

            message:
              error instanceof Error
                ? error.message
                : "Unable to load trading bots.",
          });

        } finally {

          setLoading(false);

        }

      },
      []
    );


  /* ------------------------------------------------------------------------ */
  /*                         Apply Adjustment                                */
  /* ------------------------------------------------------------------------ */

  const adjustBot =
    useCallback(
      async (
        input:
          AdminBotAdjustmentInput & {
            userId: string;

            adjustmentType:
              | "credit"
              | "debit";
          }
      ): Promise<boolean> => {

        try {

          setSubmitting(true);

          setError(null);


          const response =
            await adjustAdminTradingBot(
              input
            );


          if (
            response.error
          ) {

            setError(
              response.error
            );

            return false;
          }


          const adjustment =
            response.data?.adjustment;


          if (
            adjustment
          ) {

            setLastAdjustment(
              adjustment
            );
          }


          await fetchBots();


          return true;

        } catch (error) {

          setError({
            code:
              "CLIENT_ERROR",

            message:
              error instanceof Error
                ? error.message
                : "Unable to adjust trading bot.",
          });

          return false;

        } finally {

          setSubmitting(false);

        }

      },
      [
        fetchBots,
      ]
    );


  /* ------------------------------------------------------------------------ */
  /*                              Initial Load                                */
  /* ------------------------------------------------------------------------ */

  useEffect(
    () => {
      void fetchBots();
    },
    [
      fetchBots,
    ]
  );


  return {
    bots,

    loading,

    submitting,

    error,

    lastAdjustment,

    refresh:
      fetchBots,

    adjustBot,
  };
}