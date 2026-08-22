"use client";

import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import DashboardLayout from "@/components/trading-bot/dashboard-layout";
import DashboardHeader from "@/components/trading-bot/dashboard-header";
import TradingHistory from "@/components/trading-bot/tables/trading-history";
import type {
  BotTransactionWithBot,
} from "@/lib/trading-bot/types";

import type {
  ApiResponse,
} from "@/lib/trading-bot/api.types";

interface HistoryTrade {

  id: string;

  transactionType: string;

  botName?: string;

  amount: number;

  status: string;

  description: string;

  createdAt: string;

}



export default function TradingHistoryPage() {

  const [
    history,
    setHistory,
  ] = useState<HistoryTrade[]>([]);



  const [
    loading,
    setLoading,
  ] = useState(true);



  const [
    error,
    setError,
  ] = useState<string | null>(null);



  const [
    lastUpdated,
    setLastUpdated,
  ] = useState("");



  const fetchHistory =
    useCallback(
      async () => {

        try {

          setLoading(true);

          setError(null);



          const response =
  await fetch(
    "/api/trading-bot/history",
    {
      cache: "no-store",
    }
  );

const result =
  (await response.json()) as ApiResponse<BotTransactionWithBot[]>;



          if (
            !response.ok ||
            result.error
          ) {

            throw new Error(
              result.error?.message ??
              "Failed to load trading history."
            );

          }



         const formatted =
  (result.data ?? []).map(
    (
      transaction
    ): HistoryTrade => ({

      id:
        transaction.id,

      transactionType:
        transaction.transaction_type,

      botName:
        transaction.bot?.bot_name ??
        undefined,

      amount:
        Number(
          transaction.amount ?? 0
        ),

      status:
        transaction.status ??
        "COMPLETED",

      description:
        transaction.description ??
        "No description available.",

      createdAt:
        transaction.created_at ??
        new Date().toISOString(),

    })
  );



          setHistory(
            formatted
          );


          setLastUpdated(
            new Date().toLocaleString()
          );


        } catch (err: unknown) {

  setError(
    err instanceof Error
      ? err.message
      : "Failed to load history."
  );

}

finally {

          setLoading(false);

        }

      },
      []
    );



  useEffect(
    () => {
      fetchHistory();
    },
    [
      fetchHistory,
    ]
  );



  return (

    <DashboardLayout>

      <div
        className="
          space-y-6
        "
      >

        <DashboardHeader

          onRefresh={
            fetchHistory
          }

          loading={
            loading
          }

          lastUpdated={
            lastUpdated
          }

          onActivateBot={() => {
            window.location.href =
              "/dashboard/trading-bot/marketplace";
          }}

        />


        <TradingHistory

          history={
            history
          }

          loading={
            loading
          }

          error={
            error
          }

        />


      </div>

    </DashboardLayout>

  );

}