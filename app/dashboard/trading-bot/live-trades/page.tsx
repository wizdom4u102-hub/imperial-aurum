// app/dashboard/trading-bot/live-trades/page.tsx

"use client";

import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import DashboardLayout from "@/components/trading-bot/dashboard-layout";
import DashboardHeader from "@/components/trading-bot/dashboard-header";
import LiveTradesTable from "@/components/trading-bot/tables/live-trades-table";

import type {
  BotTradeRecord,
} from "@/lib/trading-bot/dashboard.types";

import type {
  ApiResponse,
} from "@/lib/trading-bot/api.types";


interface LiveTrade {
  id: string;

  asset: string;

  direction: "BUY" | "SELL";

  status: string;

  result: string;

  timestamp: string;
}



interface LiveTradesResponse {
  trades: BotTradeRecord[];
}



export default function LiveTradesPage() {
  const [
    trades,
    setTrades,
  ] = useState<LiveTrade[]>([]);



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
  ] = useState<string>("");



  const fetchLiveTrades =
    useCallback(
      async () => {
        try {
          setLoading(true);

          setError(null);



          const response =
            await fetch(
              "/api/trading-bot/live-trades",
              {
                method: "GET",
                cache: "no-store",
              }
            );



          const result:
            ApiResponse<LiveTradesResponse> =
              await response.json();
              console.log("LIVE TRADES API RESULT:", result);
console.log("LIVE TRADES ARRAY:", result.data?.trades);



          if (!response.ok || result.error) {
            throw new Error(
              result.error?.message ??
                "Failed to load live trades."
            );
          }



          const formattedTrades =
            (result.data?.trades ?? []).map(
              (
                trade
              ): LiveTrade => ({
                id:
                  trade.id,


                asset:
                  trade.asset,


                direction:
                  trade.trade_type === "SELL"
                    ? "SELL"
                    : "BUY",


                status:
                  trade.status ??
                  "Unknown",


                result:
                  trade.net_profit !== null &&
                  trade.net_profit !== undefined
                    ? String(
                        trade.net_profit
                      )
                    : "Pending",


                timestamp:
                  trade.created_at ??
                  new Date().toISOString(),
              })
            );


          console.log("FORMATTED TRADES:", formattedTrades);

          setTrades(
            formattedTrades
          );


          setLastUpdated(
            new Date().toLocaleString()
          );


        } catch (err) {

          setError(
            err instanceof Error
              ? err.message
              : "Failed to load live trades."
          );

        } finally {

          setLoading(false);

        }
      },
      []
    );



  useEffect(
    () => {
      fetchLiveTrades();
    },
    [
      fetchLiveTrades,
    ]
  );

  console.log("STATE TRADES:", trades);



  return (
    <DashboardLayout>

      <div
        className="
          space-y-6
        "
      >

        <DashboardHeader
          onRefresh={fetchLiveTrades}
          loading={loading}
          lastUpdated={lastUpdated}
          onActivateBot={() => {
            window.location.href =
              "/dashboard/trading-bot/marketplace";
          }}
        />



        <LiveTradesTable
          trades={trades}
          loading={loading}
          error={error}
        />

      </div>

    </DashboardLayout>
  );
}