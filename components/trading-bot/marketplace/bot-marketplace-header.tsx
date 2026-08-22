import React from "react";

import {
  tradingBotStyles,
} from "../theme";


const BotMarketplaceHeader = () => {

  return (

    <div
      className="mb-8"
    >

      <h1
        className={`
          ${tradingBotStyles.heading}
          text-2xl
          sm:text-3xl
          lg:text-4xl
        `}
      >
        Trading Bot Marketplace
      </h1>


      <p
        className="
          mt-3
          max-w-2xl
          text-sm
          sm:text-base
          text-[#A1A1AA]
        "
      >
        Explore AI powered trading strategies
        designed to help automate your trading
        experience.
      </p>

    </div>

  );

};


export default BotMarketplaceHeader;