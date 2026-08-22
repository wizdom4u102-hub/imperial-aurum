import React from "react";
import Link from "next/link";

import BotCard from "./cards/trading-bot-card";

import type { TradingBotRecord } from "@/lib/trading-bot/types";

interface ActiveBotsSectionProps {
  activeBots: TradingBotRecord[];

  onBotSelect?: (
    botId: string
  ) => void;

  onAddFunds?: (
    bot: TradingBotRecord
  ) => void;

  onTransferFunds?: (
  bot: TradingBotRecord
) => void;
}

const ActiveBotsSection: React.FC<ActiveBotsSectionProps> = ({
  activeBots,
  onBotSelect,
  onAddFunds,
    onTransferFunds,
}) => {
  return (
    <section
      className="
        rounded-2xl
        border
        border-[rgba(255,255,255,0.10)]
        bg-[rgba(255,255,255,0.04)]
        backdrop-blur-xl
        p-6
        transition-all
        duration-300
      "
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">
            Active Trading Bots
          </h2>

          <p className="mt-1 text-sm text-[#A1A1AA]">
            Monitor your automated trading portfolio and bot performance.
          </p>
        </div>

        <div
          className="
            flex
            items-center
            gap-2
            rounded-full
            border
            border-[#22C55E]/20
            bg-[#22C55E]/10
            px-3
            py-1.5
            text-xs
            font-medium
            text-[#22C55E]
          "
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#22C55E]" />

          Live
        </div>
      </div>

      {activeBots.length > 0 ? (
        <div
          className="
            grid
            grid-cols-1
            gap-6
            sm:grid-cols-2
            xl:grid-cols-3
          "
        >
          {activeBots.map((bot) => (
            <BotCard
  key={bot.id}
  id={bot.id}
  name={bot.bot_name}
  status={bot.status ?? "Inactive"}
  strategy={bot.strategy ?? "AI Trading Strategy"}
  tradingAsset={bot.trading_asset ?? undefined}
  investmentCapital={bot.investment_capital ?? undefined}
  currentValue={bot.current_value ?? undefined}
  accumulatedProfit={bot.accumulated_profit ?? undefined}
  availableBalance={bot.available_balance ?? undefined}
  onSelect={onBotSelect}
  onAddFunds={() =>
    onAddFunds?.(bot)
  }
  onTransferFunds={() =>
    onTransferFunds?.(bot)
  }
/>
          ))}
        </div>
      ) : (
        <div
          className="
            flex
            min-h-[320px]
            flex-col
            items-center
            justify-center
            rounded-2xl
            border
            border-dashed
            border-[rgba(212,175,55,0.25)]
            bg-[rgba(255,255,255,0.02)]
            px-6
            py-10
            text-center
          "
        >
          <div
            className="
              mb-6
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-full
              border
              border-[#D4AF37]/30
              bg-[#D4AF37]/10
              text-4xl
            "
          >
            🤖
          </div>

          <span
            className="
              mb-4
              inline-flex
              rounded-full
              border
              border-[#D4AF37]/25
              bg-[#D4AF37]/10
              px-4
              py-1.5
              text-xs
              font-semibold
              uppercase
              tracking-[0.2em]
              text-[#F5D76E]
            "
          >
            Trading Bot Marketplace
          </span>

          <h3
            className="
              max-w-xl
              text-2xl
              font-bold
              text-white
            "
          >
            No Active Trading Bots Yet
          </h3>

          <p
            className="
              mt-4
              max-w-2xl
              text-sm
              leading-7
              text-[#A1A1AA]
              sm:text-base
            "
          >
            You haven't activated any AI trading bots yet. Explore the Imperial
            Aurum Marketplace to discover professionally managed automated
            trading strategies designed for different investment goals and risk
            levels.
          </p>

          <div
            className="
              mt-8
              flex
              w-full
              flex-col
              items-center
              justify-center
              gap-4
              sm:w-auto
              sm:flex-row
            "
          >
            <Link
              href="/dashboard/trading-bot/marketplace"
              className="
                inline-flex
                w-full
                items-center
                justify-center
                rounded-xl
                bg-gradient-to-r
                from-[#D4AF37]
                to-[#F5D76E]
                px-8
                py-3
                text-sm
                font-semibold
                text-[#050816]
                transition
                hover:opacity-90
                sm:w-auto
              "
            >
              Browse Marketplace
            </Link>

            <button
              type="button"
              className="
                inline-flex
                w-full
                items-center
                justify-center
                rounded-xl
                border
                border-[rgba(255,255,255,0.10)]
                bg-[rgba(255,255,255,0.04)]
                px-8
                py-3
                text-sm
                font-medium
                text-white
                transition
                hover:bg-[rgba(255,255,255,0.08)]
                sm:w-auto
              "
            >
              Learn More
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ActiveBotsSection;