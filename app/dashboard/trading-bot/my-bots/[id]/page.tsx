"use client";

import { useParams } from "next/navigation";

import DashboardLayout from "@/components/trading-bot/dashboard-layout";
import TradingBotDetails from "@/components/trading-bot/trading-bot-details";

import { useTradingBotDetails } from "@/hooks/use-trading-bot-details";

export default function TradingBotDetailsPage() {
  const params = useParams();

  const botId =
    typeof params.id === "string"
      ? params.id
      : "";

  const {
    bot,
    data,
    loading,
    error,
  } = useTradingBotDetails(botId);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8 text-white">
          Loading trading bot...
        </div>
      </DashboardLayout>
    );
  }

  if (error || !bot || !data) {
    return (
      <DashboardLayout>
        <div className="p-8 text-red-400">
          {error ?? "Trading bot not found."}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <TradingBotDetails
        data={data}
      />
    </DashboardLayout>
  );
}