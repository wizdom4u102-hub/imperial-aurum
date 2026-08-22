"use client";

import {
  useState,
} from "react";

import {
  transferDashboardFunds,
} from "@/lib/trading-bot/transfer-dashboard.api";

interface DashboardTransferModalProps {

  open: boolean;

  availableBalance: number;

  onClose: () => void;

  onSuccess: () => void;

}

export default function DashboardTransferModal({

  open,

  availableBalance,

  onClose,

  onSuccess,

}: DashboardTransferModalProps) {

  const [

    amount,

    setAmount,

  ] = useState("");

  const [

    loading,

    setLoading,

  ] = useState(false);

  const [

    error,

    setError,

  ] = useState("");

  if (!open) {

    return null;

  }

  async function handleTransfer() {

    try {

      setLoading(true);

      setError("");

      const value =
        Number(amount);

      if (

        value <= 0 ||

        Number.isNaN(value)

      ) {

        throw new Error(
          "Enter a valid amount."
        );

      }

      if (

        value >

        availableBalance

      ) {

        throw new Error(
          "Amount exceeds available balance."
        );

      }

      await transferDashboardFunds(
        value
      );

      onSuccess();

      onClose();

    } catch (err) {

      setError(

        err instanceof Error

          ? err.message

          : "Transfer failed."

      );

    } finally {

      setLoading(false);

    }

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
        p-4
      "
    >

      <div
        className="
          w-full
          max-w-md
          rounded-2xl
          border
          border-white/10
          bg-[#0b1020]
          p-6
          shadow-2xl
        "
      >

        <h2
          className="
            text-2xl
            font-bold
            text-white
          "
        >
          Transfer Funds
        </h2>

        <p
          className="
            mt-2
            text-sm
            text-gray-400
          "
        >
          Transfer your trading bot profits to your dashboard cash balance.
        </p>

        <div
          className="
            mt-6
            rounded-xl
            border
            border-emerald-500/20
            bg-emerald-500/10
            p-4
          "
        >

          <p
            className="
              text-sm
              text-gray-300
            "
          >
            Available Balance
          </p>

          <h3
            className="
              mt-2
              text-3xl
              font-bold
              text-emerald-400
            "
          >
            $
            {availableBalance.toFixed(2)}
          </h3>

        </div>

        <div className="mt-6">

          <label
            className="
              mb-2
              block
              text-sm
              text-gray-300
            "
          >
            Transfer Amount
          </label>

          <input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) =>
              setAmount(
                e.target.value
              )
            }
            className="
              w-full
              rounded-xl
              border
              border-white/10
              bg-black/20
              px-4
              py-3
              text-white
              outline-none
              focus:border-emerald-400
            "
          />

        </div>

        {error && (

          <p
            className="
              mt-4
              text-sm
              text-red-400
            "
          >
            {error}
          </p>

        )}

        <div
          className="
            mt-6
            flex
            gap-3
          "
        >

          <button
            type="button"
            onClick={() =>
              setAmount(
                availableBalance.toFixed(2)
              )
            }
            className="
              flex-1
              rounded-xl
              border
              border-yellow-500
              px-4
              py-3
              font-medium
              text-yellow-400
              transition
              hover:bg-yellow-500/10
            "
          >
            Transfer All
          </button>

          <button
            type="button"
            onClick={onClose}
            className="
              flex-1
              rounded-xl
              border
              border-white/10
              px-4
              py-3
              font-medium
              text-white
              transition
              hover:bg-white/10
            "
          >
            Cancel
          </button>

        </div>

        <button
          type="button"
          disabled={loading}
          onClick={handleTransfer}
          className="
            mt-4
            w-full
            rounded-xl
            bg-emerald-500
            px-4
            py-3
            font-semibold
            text-white
            transition
            hover:bg-emerald-400
            disabled:opacity-50
          "
        >
          {loading
            ? "Transferring..."
            : "Transfer Funds"}
        </button>

      </div>

    </div>

  );

}