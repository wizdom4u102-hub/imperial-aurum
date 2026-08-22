"use client";

import { useState } from "react";

export default function useTopUpDeposit() {
  const [txid, setTxid] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [success, setSuccess] =
    useState(false);

  const submitTopUp = async (
  botId: string,
  amount: number,
  paymentMethodId: string,
  proofImage?: string | null,
  notes?: string | null
) => {

    setLoading(true);

    setError(null);

    setSuccess(false);

    try {

      const response =
        await fetch(
          "/api/trading-bot/deposit/top-up",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              botId,

              depositAmount:
                amount,

              paymentMethodId,

              txid,

              proofImage:
                proofImage ?? null,

              notes:
                notes ?? null,

            }),

          }
        );

      const data =
        await response.json();

      if (!response.ok) {

        throw new Error(
          data.error ??
            "Unable to submit top-up."
        );

      }

      setSuccess(true);

      return data;

    } catch (error) {

      setError(
        error instanceof Error
          ? error.message
          : "Unknown error."
      );

      return null;

    } finally {

      setLoading(false);

    }

  };

  function reset() {

    setTxid("");

    setError(null);

    setSuccess(false);

  }

  return {

    txid,

    setTxid,

    loading,

    error,

    success,

    submitTopUp,

    reset,

  };

}