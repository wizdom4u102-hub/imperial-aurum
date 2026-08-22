import React from "react";

import type {
  TradingBotPlan,
} from "@/lib/trading-bot/marketplace.types";


import {
  tradingBotStyles,
} from "../theme";



interface BotDetailsModalProps {

  bot:
    TradingBotPlan | null;

  open:
    boolean;

  onClose:
    () => void;

  onStartInvestment:
    (
      bot: TradingBotPlan
    ) => void;

}



const BotDetailsModal: React.FC<
  BotDetailsModalProps
> = ({
  bot,
  open,
  onClose,
  onStartInvestment,
}) => {


  if (!open || !bot) {

    return null;

  }



  return (

    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/70
        px-4
        py-6
      "
    >

      <div
        className={`
          ${tradingBotStyles.glassCard}
          w-full
          max-w-2xl
          max-h-[90vh]
          overflow-y-auto
          p-6
        `}
      >


        <div
          className="
            flex
            items-start
            justify-between
            gap-4
          "
        >

          <div>

            <h2
              className="
                text-2xl
                font-bold
                text-white
              "
            >
              {bot.name}
            </h2>


            {
              bot.badge && (

                <span
                  className="
                    mt-3
                    inline-flex
                    rounded-full
                    border
                    border-[rgba(212,175,55,0.30)]
                    bg-[rgba(212,175,55,0.12)]
                    px-3
                    py-1
                    text-xs
                    text-[#F5D76E]
                  "
                >
                  {bot.badge}
                </span>

              )
            }


          </div>


          <button

            type="button"

            onClick={
              onClose
            }

            className="
              text-[#A1A1AA]
              hover:text-white
            "

          >
            ✕
          </button>


        </div>



        <p
          className="
            mt-6
            text-sm
            leading-6
            text-[#A1A1AA]
          "
        >
          {bot.description}
        </p>



        <div
          className="
            mt-6
            grid
            grid-cols-1
            sm:grid-cols-2
            gap-4
          "
        >

          <Info
            label="Daily ROI"
            value={`${bot.expected_daily_roi}%`}
          />


          <Info
            label="Monthly ROI"
            value={`${bot.expected_monthly_roi}%`}
          />


          <Info
            label="Duration"
            value={`${bot.duration_days} Days`}
          />


          <Info
            label="Investment Range"
            value={`$${bot.minimum_investment} - $${bot.maximum_investment}`}
          />

        </div>



        <section
          className="mt-8"
        >

          <h3
            className="
              text-lg
              font-semibold
              text-white
            "
          >
            Supported Assets
          </h3>


          <div
            className="
              mt-3
              flex
              flex-wrap
              gap-2
            "
          >

            {
              bot.supported_assets.map(
                (asset) => (

                  <span

                    key={
                      asset
                    }

                    className="
                      rounded-full
                      border
                      border-[rgba(255,255,255,0.10)]
                      bg-[rgba(255,255,255,0.04)]
                      px-3
                      py-1
                      text-xs
                      text-[#A1A1AA]
                    "

                  >

                    {asset}

                  </span>

                )
              )
            }

          </div>


        </section>



        <section
          className="mt-8"
        >

          <h3
            className="
              text-lg
              font-semibold
              text-white
            "
          >
            Features
          </h3>


          <ul
            className="
              mt-3
              space-y-2
            "
          >

            {
              bot.features.map(
                (feature) => (

                  <li

                    key={
                      feature
                    }

                    className="
                      text-sm
                      text-[#A1A1AA]
                    "

                  >
                    ✓ {feature}
                  </li>

                )
              )
            }

          </ul>


        </section>



        <button

          type="button"

          onClick={() =>
            onStartInvestment(bot)
          }

          className={`
            mt-8
            h-12
            w-full
            ${tradingBotStyles.goldButton}
          `}

        >

          Start Investment

        </button>


      </div>


    </div>

  );

};



function Info({
  label,
  value,
}: {
  label: string;
  value: string;
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


export default BotDetailsModal;