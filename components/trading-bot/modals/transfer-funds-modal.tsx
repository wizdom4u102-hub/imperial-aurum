"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import useTransferFunds from "@/hooks/use-transfer-funds";

interface TransferFundsModalProps {
  open: boolean;
  bot: {
    id: string;
    bot_name: string;
    accumulated_profit: number | null;
  } | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function TransferFundsModal({

  open,

  bot,

  onClose,

  onSuccess,

}: TransferFundsModalProps) {

  const {

    executeTransfer,

    loading,

    error,

  } = useTransferFunds();

  const [

    amount,

    setAmount,

  ] = useState("");

  useEffect(() => {

    if (open) {

      setAmount("");

    }

  }, [open]);

  if (!open || !bot) {

    return null;

  }

  // TypeScript now knows this is never null.
  const currentBot = bot;

  const available = Number(
    currentBot.accumulated_profit ?? 0
  );

  async function handleTransfer() {

    try {

      await executeTransfer({

        botId: currentBot.id,

        amount: Number(amount),

      });

      onSuccess();

      onClose();

    } catch {

      // Error is already handled by the hook.

    }

  }

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">

      <div className="w-full max-w-md rounded-2xl bg-zinc-900 p-6">

        <h2 className="text-2xl font-bold text-white">

          Transfer Funds

        </h2>

        <p className="mt-2 text-zinc-400">

          {currentBot.bot_name}

        </p>

        <div className="mt-6">

          <label className="text-sm text-zinc-400">

            Available Profit

          </label>

          <div className="mt-1 text-2xl font-bold text-emerald-400">

            ${available.toFixed(2)}

          </div>

        </div>

        <div className="mt-6">

          <label className="text-sm text-zinc-400">

            Transfer Amount

          </label>

          <input

            type="number"

            min="0"

            step="0.01"

            value={amount}

            onChange={(e) =>

              setAmount(e.target.value)

            }

            className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white"

          />

        </div>

        <button

          type="button"

          className="mt-3 text-sm text-yellow-400"

          onClick={() =>

            setAmount(String(available))

          }

        >

          Transfer All

        </button>

        {error && (

          <div className="mt-4 text-sm text-red-400">

            {error}

          </div>

        )}

        <div className="mt-8 flex justify-end gap-3">

          <Button

            variant="outline"

            onClick={onClose}

            disabled={loading}
            
            className="border-zinc-600 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white"

          >

            Cancel

          </Button>

          <Button

            onClick={handleTransfer}

            disabled={loading}

          >

            {loading

              ? "Transferring..."

              : "Transfer Funds"}

          </Button>

        </div>

      </div>

    </div>

  );

}