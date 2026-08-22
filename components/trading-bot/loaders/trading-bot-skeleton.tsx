import React from "react";

import StatCardSkeleton from "./stat-card-skeleton";
import BotCardSkeleton from "./bot-card-skeleton";

const TradingBotSkeleton: React.FC = () => {
  return (
    <div className="p-4 bg-[#050505] min-h-screen">

      <div className="mb-6">
        <div className="h-8 w-1/2 bg-[#1F1B12] rounded-lg animate-pulse mb-2" />

        <div className="h-6 w-3/4 bg-[#1F1B12] rounded-lg animate-pulse" />
      </div>


      <h2 className="text-lg font-bold mb-4 text-[#D4AF37]">
        Statistics
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>


      <h2 className="text-lg font-bold mb-4 text-[#D4AF37]">
        Active Bots
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BotCardSkeleton />
        <BotCardSkeleton />
        <BotCardSkeleton />
      </div>


      <h2 className="text-lg font-bold mb-4 text-[#D4AF37]">
        Trades
      </h2>

      <div className="flex flex-col gap-2">

        <div className="h-8 w-full bg-[#1F1B12] rounded-lg animate-pulse" />

        <div className="h-8 w-full bg-[#1F1B12] rounded-lg animate-pulse" />

        <div className="h-8 w-full bg-[#1F1B12] rounded-lg animate-pulse" />

      </div>

    </div>
  );
};

export default TradingBotSkeleton;