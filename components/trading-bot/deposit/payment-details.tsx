"use client";

import React, {
  useEffect,
  useState,
} from "react";

import { Button } from "@/components/ui/button";

import type {
  TradingBotPlan,
} from "@/lib/trading-bot/marketplace.types";


interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  details: string;
}

interface PaymentDetailsProps {
  bot: TradingBotPlan;

  amount: number;

  txid: string;

  setTxid: (
    value: string
  ) => void;

  loading: boolean;

  error: string | null;

  success: boolean;

  submit: (
    paymentMethodId: string
  ) => Promise<void>;

  reset: () => void;

  buttonText?: string;

  onSuccess: () => void;
}

const PaymentDetails: React.FC<
  PaymentDetailsProps
> = ({
  bot,
  amount,

  txid,

  setTxid,

  loading,

  error,

  success,

  submit,

  reset,

  buttonText = "Submit Deposit",

  onSuccess,
}) => {


  const [
  wallets,
  setWallets,
] = useState<PaymentMethod[]>([]);

const [
  wallet,
  setWallet,
] = useState<PaymentMethod | null>(null);
  const [
    copied,
    setCopied,
  ] = useState(false);

  useEffect(() => {

    async function loadWallet() {

      try {

        const response =
          await fetch("/api/payment-methods");

        const data =
          await response.json();

        if (data.methods?.length) {

  const methods: PaymentMethod[] =
    data.methods.map((method: any) => ({
      id: method.id,
      name: method.name,
      type: method.type,
      details:
        typeof method.details === "string"
          ? method.details
          : JSON.stringify(method.details),
    }));

  setWallets(methods);

  setWallet(methods[0]);

}

      } catch (error) {

        console.error(
          "Failed to load payment methods",
          error
        );

      }

    }

    loadWallet();

  }, []);

  useEffect(() => {

    if (!success) return;

    onSuccess();

    reset();

  }, [
    success,
    onSuccess,
    reset,
  ]);

 async function handleSubmit() {

  if (!wallet) {
    return;
  }

  await submit(
    wallet.id
  );

}

  async function copyWallet() {

    if (!wallet) return;

    await navigator.clipboard.writeText(
      wallet.details
    );

    setCopied(true);

    setTimeout(
      () => setCopied(false),
      2000
    );

  }

  return (

    <div className="space-y-6">

      <div>

        <h3 className="text-2xl font-bold text-white">
          Payment Details
        </h3>

        <p className="mt-2 text-sm text-[#A1A1AA]">
          Send exactly
          <span className="ml-1 font-semibold text-[#F5D76E]">
            ${amount.toLocaleString()}
          </span>
          using the wallet below.
        </p>

      </div>

      {wallet && (

        <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.04)] p-5 space-y-5">

          <div>

            <div>
  <label className="text-xs uppercase tracking-wide text-[#A1A1AA]">
    Payment Method
  </label>

  <select
    value={wallet.id}
    onChange={(event) => {
      const selected = wallets.find(
        (item) => item.id === event.target.value
      );

      if (selected) {
        setWallet(selected);
      }
    }}
    className="
      mt-2
      h-11
      w-full
      rounded-xl
      border
      border-white/10
      bg-[rgba(255,255,255,0.04)]
      px-4
      text-white
      outline-none
    "
  >
    {wallets.map((method) => (
      <option
        key={method.id}
        value={method.id}
        className="bg-[#111827] text-white"
      >
        {method.name} ({method.type})
      </option>
    ))}
  </select>
</div>

            <p className="text-xs uppercase tracking-wide text-[#A1A1AA]">
              Network
            </p>

            <span className="mt-2 inline-flex rounded-full bg-[#D4AF37]/20 px-3 py-1 text-sm text-[#F5D76E]">
              {wallet.type}
            </span>

          </div>

          <div>

            <p className="text-xs uppercase tracking-wide text-[#A1A1AA]">
              Wallet Address
            </p>

            <div className="mt-2 break-all rounded-xl bg-black/20 p-4 text-sm text-white">
              {wallet.details}
            </div>

          </div>

          <Button
  type="button"
  onClick={copyWallet}
  className="
    bg-[#D4AF37]
    text-black
    hover:bg-[#C9A227]
    font-semibold
  "
>
  {copied ? "Copied!" : "Copy Address"}
</Button>

        </div>

      )}

      <div>

        <label className="text-sm text-[#A1A1AA]">
          Transaction Hash (TXID)
        </label>

        <input
          value={txid}
          onChange={(event) =>
            setTxid(
              event.target.value
            )
          }
          placeholder="Paste your transaction hash"
          className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-transparent px-4 text-white outline-none"
        />

      </div>

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}

      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="h-12 w-full"
      >
        {loading
          ? "Submitting..."
          : buttonText}
      </Button>

    </div>

  );

};

export default PaymentDetails;