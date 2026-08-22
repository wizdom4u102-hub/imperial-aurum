import React from "react";

import type {
  TradingBotPlan,
} from "@/lib/trading-bot/marketplace.types";


import BotMarketplaceCard from "./bot-marketplace-card";



interface BotGridProps {

  bots: TradingBotPlan[];

  onViewDetails:
  (
    bot: TradingBotPlan
  ) => void;

}



const BotGrid: React.FC<
  BotGridProps
> = ({
  bots,
  onViewDetails,
}) => {


  return (

    <div
      className="
        grid
        grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-3
        gap-5
      "
    >

      {
        bots.map(
          (bot) => (

            <BotMarketplaceCard

              key={
                bot.id
              }

              bot={
                bot
              }

              onViewDetails={
                onViewDetails
              }

            />

          )
        )
      }


    </div>

  );

};


export default BotGrid;