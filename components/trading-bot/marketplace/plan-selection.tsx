"use client";

import React, {
  useState,
} from "react";

import type {
  TradingBotPlan,
} from "@/lib/trading-bot/marketplace.types";

import {
  tradingBotStyles,
} from "../theme";


interface PlanSelectionProps {

  bot:
    TradingBotPlan;

  onContinue:
    (
      amount: number
    ) => void;

  onBack:
    () => void;

}


const PlanSelection: React.FC<
  PlanSelectionProps
> = ({
  bot,
  onContinue,
  onBack,
}) => {

  const [
    amount,
    setAmount,
  ] = useState<number>(
    bot.minimum_investment
  );


  const [
    error,
    setError,
  ] = useState<string>(
    ""
  );


  function handleContinue() {

    if (
      amount <
      bot.minimum_investment
    ) {

      setError(
        `Minimum investment is $${bot.minimum_investment}`
      );

      return;

    }


    if (
      amount >
      bot.maximum_investment
    ) {

      setError(
        `Maximum investment is $${bot.maximum_investment}`
      );

      return;

    }


    setError("");

    onContinue(
      amount
    );

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
        overflow-y-auto
        bg-black/70
        px-4
        py-6
      "
    >

      <div
        className={`
          ${tradingBotStyles.glassCard}
          w-full
          max-w-lg
          p-6
        `}
      >

        <div>

          <h2
            className="
              text-2xl
              font-bold
              text-white
            "
          >
            Select Investment
          </h2>


          <p
            className="
              mt-2
              text-sm
              text-[#A1A1AA]
            "
          >
            {bot.name}
          </p>

        </div>


        <div
          className="
            mt-6
            rounded-xl
            border
            border-[rgba(212,175,55,0.20)]
            bg-[rgba(212,175,55,0.06)]
            p-4
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
              gap-4
            "
          >

            <div>

              <p
                className="
                  text-xs
                  text-[#A1A1AA]
                "
              >
                Investment Range
              </p>


              <p
                className="
                  mt-1
                  text-lg
                  font-semibold
                  text-[#F5D76E]
                "
              >
                $
                {bot.minimum_investment.toLocaleString()}
                {" - "}
                $
                {bot.maximum_investment.toLocaleString()}
              </p>

            </div>


            <div
              className="
                text-right
              "
            >

              <p
                className="
                  text-xs
                  text-[#A1A1AA]
                "
              >
                Duration
              </p>


              <p
                className="
                  mt-1
                  text-sm
                  font-semibold
                  text-white
                "
              >
                {bot.duration_days} Days
              </p>

            </div>

          </div>

        </div>


        <div
          className="
            mt-6
          "
        >

          <label
            htmlFor="investment-amount"
            className="
              text-sm
              text-[#A1A1AA]
            "
          >
            Investment Amount
          </label>


          <div
            className="
              relative
              mt-2
            "
          >

            <span
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-sm
                font-semibold
                text-[#F5D76E]
              "
            >
              $
            </span>


            <input
              id="investment-amount"
              type="number"
              min={
                bot.minimum_investment
              }
              max={
                bot.maximum_investment
              }
              step="0.01"
              value={
                amount
              }
              onChange={(
                event
              ) => {

                setAmount(
                  Number(
                    event.target.value
                  )
                );

                setError("");

              }}
              className="
                h-12
                w-full
                rounded-xl
                border
                border-[rgba(255,255,255,0.10)]
                bg-[rgba(255,255,255,0.04)]
                pl-9
                pr-4
                text-white
                outline-none
                transition
                focus:border-[#D4AF37]
              "
            />

          </div>


          <p
            className="
              mt-2
              text-xs
              text-[#71717A]
            "
          >
            Enter an amount between $
            {bot.minimum_investment.toLocaleString()}
            {" and "}
            $
            {bot.maximum_investment.toLocaleString()}.
          </p>

        </div>


        <div
          className="
            mt-5
            grid
            grid-cols-2
            gap-4
          "
        >

          <div
            className="
              rounded-xl
              border
              border-[rgba(255,255,255,0.08)]
              bg-[rgba(255,255,255,0.03)]
              p-4
            "
          >

            <p
              className="
                text-xs
                text-[#A1A1AA]
              "
            >
              Daily ROI
            </p>


            <p
              className="
                mt-1
                text-lg
                font-semibold
                text-[#F5D76E]
              "
            >
              {bot.expected_daily_roi}%
            </p>

          </div>


          <div
            className="
              rounded-xl
              border
              border-[rgba(255,255,255,0.08)]
              bg-[rgba(255,255,255,0.03)]
              p-4
            "
          >

            <p
              className="
                text-xs
                text-[#A1A1AA]
              "
            >
              Monthly ROI
            </p>


            <p
              className="
                mt-1
                text-lg
                font-semibold
                text-[#F5D76E]
              "
            >
              {bot.expected_monthly_roi}%
            </p>

          </div>

        </div>


        {error && (

          <p
            className="
              mt-4
              text-sm
              text-[#EF4444]
            "
          >
            {error}
          </p>

        )}


        <div
          className="
            mt-8
            flex
            flex-col-reverse
            gap-3
            sm:flex-row
          "
        >

          <button
            type="button"
            onClick={
              onBack
            }
            className="
              h-12
              flex-1
              rounded-xl
              border
              border-[rgba(255,255,255,0.10)]
              bg-[rgba(255,255,255,0.03)]
              text-white
              transition
              hover:bg-[rgba(255,255,255,0.08)]
            "
          >
            Back
          </button>


          <button
            type="button"
            onClick={
              handleContinue
            }
            className={`
              h-12
              flex-1
              ${tradingBotStyles.goldButton}
            `}
          >
            Continue
          </button>

        </div>

      </div>

    </div>

  );

};


export default PlanSelection;