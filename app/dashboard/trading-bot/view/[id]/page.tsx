"use client";

import { useParams } from "next/navigation";

import DashboardLayout from "@/components/trading-bot/dashboard-layout";
import DashboardHeader from "@/components/trading-bot/dashboard-header";

import { useTradingBotDetails } from "@/hooks/use-trading-bot-details";

export default function TradingBotViewPage() {
  const params = useParams();

  const botId =
    typeof params.id === "string"
      ? params.id
      : "";

  const {
    bot,
    loading,
    error,
      reload,
  } = useTradingBotDetails(botId);

  return (
    <DashboardLayout>
      <div className="space-y-6">

        <DashboardHeader
          loading={loading}
          lastUpdated={
            new Date().toLocaleString()
          }
           onRefresh={reload}
          onActivateBot={() => {}}
        />

        {loading && (
          <div
            className="
              rounded-2xl
              border
              border-white/10
              bg-white/5
              p-8
              text-center
              text-white
            "
          >
            Loading trading bot...
          </div>
        )}

        {!loading && error && (
          <div
            className="
              rounded-2xl
              border
              border-red-500/20
              bg-red-500/10
              p-8
              text-center
              text-red-400
            "
          >
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          bot && (
            <div
              className="
                rounded-2xl
                border
                border-white/10
                bg-white/5
                p-8
              "
            >
              <h1 className="text-3xl font-bold text-white">
                {bot.bot_name}
              </h1>

              <p className="mt-2 text-zinc-400">
                {bot.strategy}
              </p>

              <div
                className="
                  mt-8
                  grid
                  gap-6
                  md:grid-cols-2
                  xl:grid-cols-4
                "
              >
                <Card
                  title="Status"
                  value={bot.status ?? "-"}
                />

                <Card
                  title="Investment"
                  value={`$${Number(
                    bot.investment_capital
                  ).toLocaleString()}`}
                />

                <Card
                  title="Current Value"
                  value={`$${Number(
                    bot.current_value ?? 0
                  ).toLocaleString()}`}
                />

                <Card
                  title="Profit"
                  value={`$${Number(
                    bot.accumulated_profit ?? 0
                  ).toLocaleString()}`}
                />
              </div>
            </div>
          )}

      </div>
    </DashboardLayout>
  );
}

interface CardProps {
  title: string;
  value: string;
}

function Card({
  title,
  value,
}: CardProps) {
  return (
    <div
      className="
        rounded-xl
        border
        border-white/10
        bg-white/5
        p-5
      "
    >
      <p className="text-sm text-zinc-400">
        {title}
      </p>

      <h2 className="mt-3 text-2xl font-bold text-white">
        {value}
      </h2>
    </div>
  );
}