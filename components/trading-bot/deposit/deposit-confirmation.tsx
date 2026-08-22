"use client";

import React from "react";

import type {
  TradingBotPlan,
} from "@/lib/trading-bot/marketplace.types";

import {
  tradingBotStyles,
} from "../theme";

import DepositSummary from "./deposit-summary";
import PaymentDetails from "./payment-details";
import useTradingBotDeposit from "@/hooks/use-trading-bot-deposit";

interface DepositConfirmationProps {
  bot: TradingBotPlan;
  amount: number;
  onBack: () => void;
  onSuccess: () => void;
}

const DepositConfirmation: React.FC<
  DepositConfirmationProps
> = ({
  bot,
  amount,
  onBack,
  onSuccess,
}) => {

  const {
    txid,
    setTxid,
    loading,
    error,
    success,
    submitDeposit,
    reset,
  } = useTradingBotDeposit();

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        overflow-y-auto
        bg-black/70
      "
    >
      <div
        className="
          flex
          min-h-full
          items-center
          justify-center
          p-4
          sm:p-6
          lg:p-8
        "
      >
        <div
          className={`
            ${tradingBotStyles.glassCard}
            w-full
            max-w-6xl
            rounded-3xl
            p-6
            lg:p-8
          `}
        >
          <div
            className="
              mb-8
              border-b
              border-white/10
              pb-6
            "
          >
            <h2
              className="
                text-3xl
                font-bold
                text-white
              "
            >
              Confirm Deposit
            </h2>

            <p
              className="
                mt-2
                text-sm
                text-[#A1A1AA]
              "
            >
              Review your investment details and
              complete your payment to activate
              your trading bot.
            </p>
          </div>

          <div
            className="
              grid
              gap-6
              lg:grid-cols-[420px_1fr]
            "
          >
            <DepositSummary
              bot={bot}
              amount={amount}
            />

            <PaymentDetails
  bot={bot}
  amount={amount}
  txid={txid}
  setTxid={setTxid}
  loading={loading}
  error={error}
  success={success}
  submit={async () => {
    await submitDeposit(
      bot.id,
      amount
    );
  }}
  reset={reset}
  onSuccess={onSuccess}
/>
          </div>

          <div
            className="
              mt-8
              border-t
              border-white/10
              pt-6
            "
          >
            <button
              type="button"
              onClick={onBack}
              className="
                h-12
                rounded-xl
                border
                border-[rgba(255,255,255,0.10)]
                px-6
                text-white
                transition
                hover:border-[#D4AF37]
              "
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositConfirmation;