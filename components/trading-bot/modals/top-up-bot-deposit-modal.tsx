"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import TopUpPaymentDetails from "../deposit/top-up-payment-details";

import type {
  TradingBotRecord,
} from "@/lib/trading-bot/types";

interface Props {
  open: boolean;

  bot: TradingBotRecord | null;

  onClose: () => void;

  onSuccess?: () => void;
}

export default function TopUpBotDepositModal({
  open,
  bot,
  onClose,
  onSuccess,
}: Props) {
  const [amount, setAmount] =
    useState("");

  if (!open || !bot) {
    return null;
  }

  const numericAmount =
    Number(amount);

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
        backdrop-blur-sm
      "
    >
      <div
        className="
          w-full
          max-w-xl
          rounded-2xl
          border
          border-white/10
          bg-[#111827]
          p-6
          shadow-2xl
        "
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Add Funds
            </h2>

            <p className="mt-1 text-sm text-[#A1A1AA]">
              {bot.bot_name}
            </p>
          </div>

          <Button
            variant="ghost"
            onClick={onClose}
          >
            ✕
          </Button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-sm text-[#A1A1AA]">
              Amount (USD)
            </label>

            <input
              type="number"
              min={1}
              value={amount}
              onChange={(event) =>
                setAmount(
                  event.target.value
                )
              }
              className="
                mt-2
                h-12
                w-full
                rounded-xl
                border
                border-white/10
                bg-transparent
                px-4
                text-white
                outline-none
              "
              placeholder="100"
            />
          </div>

          {numericAmount > 0 && (
           <TopUpPaymentDetails
             botId={bot.id}
             amount={numericAmount}
              onSuccess={() => {
              onSuccess?.();

              onClose();

              setAmount("");
              }}
             />
           )}
        </div>
      </div>
    </div>
  );
}