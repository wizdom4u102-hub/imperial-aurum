"use client";

import { useState } from "react";

import {
  transferFunds,
} from "@/lib/trading-bot/transfer-funds.api";

import type {
  TransferFundsRequest,
  TransferFundsResult,
} from "@/lib/trading-bot/transfer-funds.types";

export default function useTransferFunds() {

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function executeTransfer(

    request: TransferFundsRequest

  ): Promise<TransferFundsResult> {

    try {

      setLoading(true);

      setError(null);

      return await transferFunds(
        request
      );

    } catch (err) {

      const message =
        err instanceof Error
          ? err.message
          : "Transfer failed.";

      setError(message);

      throw err;

    } finally {

      setLoading(false);

    }

  }

  return {

    executeTransfer,

    loading,

    error,

  };

}