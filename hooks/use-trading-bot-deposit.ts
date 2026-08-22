import { useState } from "react";

import { depositToTradingBot } from "@/lib/trading-bot/api-client";
import { validateDepositRequest } from "@/lib/trading-bot/validators";

const useTradingBotDeposit = () => {
  const [amount, setAmount] = useState<number | "">("");
  const [txid, setTxid] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [success, setSuccess] = useState(false);

  const submitDeposit = async (
  planId: string,
  depositAmount: number
) => {
    setLoading(true);

    setError(null);

    setSuccess(false);

    const validation =
      validateDepositRequest({
        planId,
        depositAmount,
        txid,
      });

    if (!validation.valid) {
      setError(validation.errors.join(", "));
      setLoading(false);
      return;
    }

    try {
      const response =
        await depositToTradingBot({
          planId,
          depositAmount,
          txid,
        });

      if (response.error) {
        setError(response.error.message);
      } else {
        setSuccess(true);
      }
    } catch {
      setError(
        "An error occurred while processing the deposit."
      );
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setAmount("");
    setTxid("");
    setError(null);
    setSuccess(false);
  };

  return {
    amount,
    setAmount,

    txid,
    setTxid,

    loading,

    error,

    success,

    submitDeposit,

    reset,
  };
};

export default useTradingBotDeposit;