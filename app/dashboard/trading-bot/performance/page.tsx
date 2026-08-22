// app/dashboard/trading-bot/performance/page.tsx

"use client";

import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import DashboardLayout from "@/components/trading-bot/dashboard-layout";
import DashboardHeader from "@/components/trading-bot/dashboard-header";

import BotPerformanceCharts from "@/components/trading-bot/charts/bot-performance-charts";


interface PerformanceResponse {
  profitData: Array<{
    date: string;
    value: number;
  }>;

  roiData: Array<{
    date: string;
    percentage: number;
  }>;
}



export default function PerformancePage() {

  const [
    performance,
    setPerformance,
  ] = useState<PerformanceResponse>({
    profitData: [],
    roiData: [],
  });



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



  const fetchPerformance =
    useCallback(
      async () => {

        try {

          setLoading(true);

          setError(null);



          const response =
            await fetch(
              "/api/trading-bot/performance",
              {
                cache:
                  "no-store",
              }
            );



          const result =
            await response.json();



          if (!response.ok) {

            throw new Error(
              result?.error ??
              "Failed to load performance."
            );

          }



          setPerformance({

            profitData:
              result?.profitData ?? [],


            roiData:
              result?.roiData ?? [],

          });



          setLastUpdated(
            new Date().toLocaleString()
          );


        } catch(err) {

          setError(
            err instanceof Error
              ? err.message
              : "Failed to load performance."
          );

        } finally {

          setLoading(false);

        }

      },
      []
    );



  useEffect(
    () => {
      fetchPerformance();
    },
    [
      fetchPerformance,
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
            fetchPerformance
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



        {error && (

          <div
            className="
              rounded-2xl
              border
              border-red-500/30
              bg-red-500/10
              p-6
              text-center
              text-red-400
            "
          >
            {error}
          </div>

        )}



        <BotPerformanceCharts

          profitData={
            performance.profitData
          }

          roiData={
            performance.roiData
          }

        />


      </div>

    </DashboardLayout>

  );

}