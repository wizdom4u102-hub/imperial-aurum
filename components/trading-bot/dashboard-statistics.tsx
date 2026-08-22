"use client";

import React from "react";

import type {
  TradingBotDashboardStatistics,
} from "@/lib/trading-bot/statistics.types";

interface DashboardStatisticsProps {
  statistics: TradingBotDashboardStatistics;

  totalAvailableBalance: number;

  activeBotsCount: number;

  onTransferFunds: () => void;
}

const DashboardStatistics: React.FC<DashboardStatisticsProps> = ({
  statistics,
  totalAvailableBalance,
  activeBotsCount,
  onTransferFunds,
}) => {
  const cards = [
    {
      title: "Total Bots",
      value: statistics.totalBots ?? 0,
      valueClass: "text-white",
    },
    {
      title: "Active Bots",
      value: statistics.activeBots ?? 0,
      valueClass: "text-emerald-400",
    },
    {
      title: "Total Trades",
      value: statistics.totalTrades ?? 0,
      valueClass: "text-white",
    },
    {
      title: "Win Rate",
      value: `${statistics.winRate ?? 0}%`,
      valueClass: "text-yellow-400",
    },
    {
      title: "Total Profit",
      value: `$${(statistics.totalProfit ?? 0).toFixed(2)}`,
      valueClass:
        (statistics.totalProfit ?? 0) >= 0
          ? "text-emerald-400"
          : "text-red-400",
    },
    {
      title: "Total ROI",
      value: `${statistics.totalROI ?? 0}%`,
      valueClass:
        (statistics.totalROI ?? 0) >= 0
          ? "text-yellow-400"
          : "text-red-400",
    },

    {
  title: "Available Bot Balance",

  value: `$${totalAvailableBalance.toFixed(2)}`,

  valueClass:
    totalAvailableBalance > 0
      ? "text-emerald-400"
      : "text-white",

  subtitle:
  totalAvailableBalance > 0
    ? `Transferable • ${activeBotsCount} Active Bot${
        activeBotsCount === 1 ? "" : "s"
      }`
    : "No transferable profit available",

  highlight: true,
},

  ];

  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <div
  key={card.title}
  className={`
    rounded-2xl
    border
    backdrop-blur-xl
    p-6
    shadow-xl
    transition-all
    duration-300
    hover:-translate-y-1
    ${
      "highlight" in card && card.highlight
        ? `
          border-emerald-500/30
          bg-gradient-to-br
          from-emerald-900/20
          to-[#0b1020]
          shadow-[0_0_40px_rgba(16,185,129,0.12)]
        `
        : `
          border-white/10
          bg-[#0b1020]/80
          hover:border-yellow-400/20
          hover:shadow-[0_0_30px_rgba(250,204,21,0.08)]
        `
    }
  `}
>
          <p className="text-sm font-medium uppercase tracking-wider text-gray-400">
            {card.title}
          </p>

          <h3 className={`mt-4 text-4xl font-bold ${card.valueClass}`}>
            {card.value}
          </h3>

          {"subtitle" in card && (
  <>
    <p className="mt-2 text-sm text-gray-400">
      {card.subtitle}
    </p>

    {"highlight" in card && card.highlight && (
      <button
  type="button"
  onClick={onTransferFunds}
  className="
    mt-4
    w-full
    rounded-lg
    bg-emerald-500
    px-4
    py-2
    text-sm
    font-semibold
    text-white
    transition
    hover:bg-emerald-400
  "
>
        Transfer Funds
      </button>
    )}
  </>
)}
        </div>
      ))}
    </section>
  );
};

export default DashboardStatistics;