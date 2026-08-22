import React from "react";

import type {
  TradingBotPlan,
} from "@/lib/trading-bot/marketplace.types";

import {
  tradingBotStyles,
} from "../theme";


interface BotMarketplaceCardProps {

  bot: TradingBotPlan;

  onViewDetails?: (
    bot: TradingBotPlan
  ) => void;

}



const BotMarketplaceCard: React.FC<
  BotMarketplaceCardProps
> = ({
  bot,
  onViewDetails,
}) => {


  return (

    <div
      className={`
        ${tradingBotStyles.glassCard}
        p-5
        flex
        flex-col
        min-h-[360px]
      `}
    >

      <div
        className="
          flex
          items-start
          justify-between
          gap-3
        "
      >

        <h3
          className="
            text-lg
            font-semibold
            text-white
          "
        >
          {bot.name}
        </h3>


        {
          (bot.badge ||
            bot.is_featured ||
            bot.is_popular) && (

            <span
              className="
                rounded-full
                border
                border-[rgba(212,175,55,0.30)]
                bg-[rgba(212,175,55,0.12)]
                px-3
                py-1
                text-xs
                text-[#F5D76E]
                whitespace-nowrap
              "
            >
              {
                bot.badge ??
                (
                  bot.is_featured
                    ? "Featured"
                    : "Popular"
                )
              }
            </span>

          )
        }


      </div>



      <p
        className="
          mt-4
          text-sm
          leading-6
          text-[#A1A1AA]
          flex-1
        "
      >
        {bot.description}
      </p>



      <div
        className="
          mt-5
          grid
          grid-cols-2
          gap-3
        "
      >

        <Metric
          label="Daily ROI"
          value={`${bot.expected_daily_roi}%`}
        />


        <Metric
          label="Monthly ROI"
          value={`${bot.expected_monthly_roi}%`}
        />


        <Metric
          label="Duration"
          value={`${bot.duration_days} Days`}
        />


        <Metric
          label="Minimum"
          value={`$${bot.minimum_investment}`}
        />

      </div>



      <button
        type="button"
        onClick={() =>
          onViewDetails?.(bot)
        }
        className={`
          mt-6
          h-11
          w-full
          ${tradingBotStyles.goldButton}
        `}
      >
        View Details
      </button>


    </div>

  );

};



function Metric({
  label,
  value,
}: {
  label:string;
  value:string;
}) {

  return (

    <div>

      <p
        className="
          text-xs
          text-[#A1A1AA]
        "
      >
        {label}
      </p>


      <p
        className="
          mt-1
          text-sm
          font-semibold
          text-white
        "
      >
        {value}
      </p>


    </div>

  );

}



export default BotMarketplaceCard;