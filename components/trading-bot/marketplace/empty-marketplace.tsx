import React from "react";

import {
  tradingBotStyles,
} from "../theme";


const EmptyMarketplace = () => {

  return (

    <div
      className="
        flex
        min-h-[300px]
        items-center
        justify-center
      "
    >

      <div
        className={`
          ${tradingBotStyles.glassCard}
          max-w-md
          w-full
          p-8
          text-center
        `}
      >

        <h2
          className="
            text-xl
            font-semibold
            text-white
          "
        >
          No Trading Bots Available
        </h2>


        <p
          className="
            mt-3
            text-sm
            text-[#A1A1AA]
          "
        >
          New AI powered strategies will
          appear here soon.
        </p>


      </div>

    </div>

  );

};


export default EmptyMarketplace;