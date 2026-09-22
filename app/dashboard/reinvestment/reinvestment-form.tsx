"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Coins,
  Loader2,
  Wallet,
  XCircle,
} from "lucide-react";

import type { Database } from "@/lib/supabase/database.types";

type MiningPlan =
  Database["public"]["Tables"]["mining_plans"]["Row"];

type TradingBotPlan =
  Database["public"]["Tables"]["trading_bot_plans"]["Row"];

type ActiveBot =
  Database["public"]["Tables"]["user_trading_bots"]["Row"];

type ReinvestmentFormProps = {
  cashBalance: number;
  miningPlans: MiningPlan[];
  tradingBotPlans: TradingBotPlan[];
  activeBots: ActiveBot[];
};

type Destination = "mining" | "trading_bot";
type BotMode = "new" | "existing";

type ReinvestmentResponse = {
  success?: boolean;
  result?: {
    success?: boolean;
    destination?: string;
    mode?: string;
    session_id?: string;
    bot_id?: string;
    deposit_id?: string;
    plan_id?: string;
    plan_name?: string;
    amount?: number;
    cash_before?: number;
    cash_after?: number;
  };
  error?: string;
  message?: string;
};

export default function ReinvestmentForm({
  cashBalance,
  miningPlans,
  tradingBotPlans,
  activeBots,
}: ReinvestmentFormProps) {
  const router = useRouter();

  const [destination, setDestination] =
    useState<Destination>("mining");

  const [botMode, setBotMode] = useState<BotMode>("new");

  const [planId, setPlanId] = useState("");

  const [botId, setBotId] = useState("");

  const [amount, setAmount] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [confirming, setConfirming] = useState(false);

  const selectedMiningPlan = useMemo(
    () =>
      miningPlans.find((plan) => plan.id === planId) ?? null,
    [miningPlans, planId]
  );

  const selectedTradingBotPlan = useMemo(
    () =>
      tradingBotPlans.find((plan) => plan.id === planId) ?? null,
    [tradingBotPlans, planId]
  );

  const selectedBot = useMemo(
    () => activeBots.find((bot) => bot.id === botId) ?? null,
    [activeBots, botId]
  );

  const numericAmount = Number(amount);

  const selectedPlan =
    destination === "mining"
      ? selectedMiningPlan
      : selectedTradingBotPlan;

  const minimumAmount =
    destination === "mining"
      ? Number(selectedMiningPlan?.minimum_amount ?? 0)
      : Number(selectedTradingBotPlan?.minimum_investment ?? 0);

  const maximumAmount =
    destination === "mining"
      ? Number(selectedMiningPlan?.maximum_amount ?? 0)
      : Number(selectedTradingBotPlan?.maximum_investment ?? 0);

  const amountExceedsCash =
    Number.isFinite(numericAmount) &&
    numericAmount > cashBalance;

  const amountBelowMinimum =
    Number.isFinite(numericAmount) &&
    numericAmount > 0 &&
    minimumAmount > 0 &&
    numericAmount < minimumAmount;

  const amountAboveMaximum =
    Number.isFinite(numericAmount) &&
    numericAmount > 0 &&
    maximumAmount > 0 &&
    numericAmount > maximumAmount;

  function handleDestinationChange(
    value: Destination
  ) {
    setDestination(value);
    setPlanId("");
    setBotId("");
    setAmount("");
    setError("");
    setSuccess("");
    setConfirming(false);
  }

  function handleBotModeChange(value: BotMode) {
    setBotMode(value);
    setPlanId("");
    setBotId("");
    setAmount("");
    setError("");
    setSuccess("");
    setConfirming(false);
  }

  function handleBotChange(value: string) {
    setBotId(value);
    setAmount("");
    setError("");
    setSuccess("");
    setConfirming(false);

    const bot = activeBots.find(
      (item) => item.id === value
    );

    if (bot) {
      setPlanId(bot.plan_id);
    }
  }

  function validateForm(): string | null {
    if (!planId) {
      return "Please select a plan.";
    }

    if (
      destination === "trading_bot" &&
      botMode === "existing" &&
      !botId
    ) {
      return "Please select an active Trading Bot.";
    }

    if (
      destination === "trading_bot" &&
      botMode === "existing" &&
      !selectedBot
    ) {
      return "The selected Trading Bot could not be found.";
    }

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return "Please enter a valid reinvestment amount.";
    }

    if (numericAmount > cashBalance) {
      return "The reinvestment amount cannot exceed your available cash balance.";
    }

    if (
      minimumAmount > 0 &&
      numericAmount < minimumAmount
    ) {
      return `The minimum investment for this plan is $${minimumAmount.toFixed(
        2
      )}.`;
    }

    if (
      maximumAmount > 0 &&
      numericAmount > maximumAmount
    ) {
      return `The maximum investment for this plan is $${maximumAmount.toFixed(
        2
      )}.`;
    }

    return null;
  }

  function handleReview() {
    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setConfirming(true);
  }

  async function handleSubmit() {
    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      setConfirming(false);
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/reinvestment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destination,
          botMode:
            destination === "trading_bot"
              ? botMode
              : undefined,
          planId,
          botId:
            destination === "trading_bot" &&
            botMode === "existing"
              ? botId
              : undefined,
          amount: numericAmount,
        }),
      });

      const result =
        (await response.json()) as ReinvestmentResponse;

      if (!response.ok) {
        throw new Error(
          result.error ??
            result.message ??
            "Reinvestment failed."
        );
      }

      setSuccess(
        destination === "mining"
          ? "Your cash has been successfully reinvested into the mining plan."
          : botMode === "existing"
            ? "Your cash has been successfully added to the Trading Bot."
            : "Your Trading Bot has been successfully activated using your cash balance."
      );

      setAmount("");
      setPlanId("");
      setBotId("");
      setConfirming(false);

      window.dispatchEvent(
        new Event("wallet-refresh")
      );

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to complete reinvestment."
      );
      setConfirming(false);
    } finally {
      setLoading(false);
    }
  }

  const estimatedDailyGold =
    destination === "mining" &&
    selectedMiningPlan &&
    Number.isFinite(numericAmount)
      ? numericAmount *
        Number(selectedMiningPlan.gold_per_dollar ?? 0)
      : 0;

  return (
    <div className="space-y-6">
      {/* Destination */}
      <section className="rounded-2xl border border-white/10 bg-black/20 p-5">
        <h2 className="mb-4 text-lg font-semibold text-white">
          Choose where to reinvest
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() =>
              handleDestinationChange("mining")
            }
            className={`rounded-xl border p-5 text-left transition ${
              destination === "mining"
                ? "border-yellow-500/60 bg-yellow-500/10"
                : "border-white/10 bg-white/5 hover:border-white/20"
            }`}
          >
            <Coins className="mb-3 h-7 w-7 text-yellow-400" />

            <div className="font-semibold text-white">
              Mining
            </div>

            <p className="mt-1 text-sm text-white/60">
              Reinvest your cash into a paid mining plan.
            </p>
          </button>

          <button
            type="button"
            onClick={() =>
              handleDestinationChange("trading_bot")
            }
            className={`rounded-xl border p-5 text-left transition ${
              destination === "trading_bot"
                ? "border-yellow-500/60 bg-yellow-500/10"
                : "border-white/10 bg-white/5 hover:border-white/20"
            }`}
          >
            <Bot className="mb-3 h-7 w-7 text-yellow-400" />

            <div className="font-semibold text-white">
              Trading Bot
            </div>

            <p className="mt-1 text-sm text-white/60">
              Activate a new bot or add funds to an active bot.
            </p>
          </button>
        </div>
      </section>

      {/* Trading Bot mode */}
      {destination === "trading_bot" && (
        <section className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Trading Bot option
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() =>
                handleBotModeChange("new")
              }
              className={`rounded-xl border p-4 text-left transition ${
                botMode === "new"
                  ? "border-yellow-500/60 bg-yellow-500/10"
                  : "border-white/10 bg-white/5"
              }`}
            >
              <div className="font-medium text-white">
                New Bot
              </div>

              <p className="mt-1 text-sm text-white/60">
                Create and activate a new Trading Bot.
              </p>
            </button>

            <button
              type="button"
              onClick={() =>
                handleBotModeChange("existing")
              }
              className={`rounded-xl border p-4 text-left transition ${
                botMode === "existing"
                  ? "border-yellow-500/60 bg-yellow-500/10"
                  : "border-white/10 bg-white/5"
              }`}
            >
              <div className="font-medium text-white">
                Existing Bot
              </div>

              <p className="mt-1 text-sm text-white/60">
                Add your cash to an active Trading Bot.
              </p>
            </button>
          </div>
        </section>
      )}

      {/* Existing bot */}
      {destination === "trading_bot" &&
        botMode === "existing" && (
          <section className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <label
              htmlFor="existing-bot"
              className="mb-2 block text-sm font-medium text-white"
            >
              Select active Trading Bot
            </label>

            <select
              id="existing-bot"
              value={botId}
              onChange={(event) =>
                handleBotChange(event.target.value)
              }
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-yellow-500/60"
            >
              <option value="">
                Select an active bot
              </option>

              {activeBots.map((bot) => {
                const plan = tradingBotPlans.find(
                  (item) => item.id === bot.plan_id
                );

                return (
                  <option key={bot.id} value={bot.id}>
                    {bot.bot_name}
                    {plan ? ` — ${plan.name}` : ""}
                  </option>
                );
              })}
            </select>

            {selectedBot && (
              <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm text-white/60">
                  Selected Bot
                </div>

                <div className="mt-1 font-medium text-white">
                  {selectedBot.bot_name}
                </div>

                <div className="mt-2 text-sm text-white/60">
                  Current investment:{" "}
                  <span className="text-white">
                    $
                    {Number(
                      selectedBot.investment_capital ?? 0
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </section>
        )}

      {/* Plan */}
      <section className="rounded-2xl border border-white/10 bg-black/20 p-5">
        <label
          htmlFor="reinvestment-plan"
          className="mb-2 block text-sm font-medium text-white"
        >
          {destination === "mining"
            ? "Mining Plan"
            : botMode === "existing"
              ? "Trading Bot Plan"
              : "Trading Bot Plan"}
        </label>

        {destination === "trading_bot" &&
        botMode === "existing" ? (
          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white">
            {selectedTradingBotPlan?.name ??
              "Select an active Trading Bot first."}
          </div>
        ) : (
          <select
            id="reinvestment-plan"
            value={planId}
            onChange={(event) => {
              setPlanId(event.target.value);
              setAmount("");
              setError("");
              setSuccess("");
              setConfirming(false);
            }}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-yellow-500/60"
          >
            <option value="">
              Select a plan
            </option>

            {destination === "mining"
              ? miningPlans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name} — $
                    {Number(
                      plan.minimum_amount ?? 0
                    ).toFixed(2)}
                    minimum
                  </option>
                ))
              : tradingBotPlans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name} — $
                    {Number(
                      plan.minimum_investment ?? 0
                    ).toFixed(2)}
                    minimum
                  </option>
                ))}
          </select>
        )}

        {selectedPlan && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-white/5 p-4">
              <div className="text-xs text-white/50">
                Minimum
              </div>
              <div className="mt-1 text-white">
                $
                {minimumAmount.toFixed(2)}
              </div>
            </div>

            <div className="rounded-xl bg-white/5 p-4">
              <div className="text-xs text-white/50">
                Maximum
              </div>
              <div className="mt-1 text-white">
                $
                {maximumAmount.toFixed(2)}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Amount */}
      <section className="rounded-2xl border border-white/10 bg-black/20 p-5">
        <div className="mb-4 flex items-center justify-between gap-4">
          <label
            htmlFor="reinvestment-amount"
            className="text-sm font-medium text-white"
          >
            Reinvestment Amount
          </label>

          <span className="text-sm text-white/60">
            Available: $
            {cashBalance.toFixed(2)}
          </span>
        </div>

        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
            $
          </span>

          <input
            id="reinvestment-amount"
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(event) => {
              setAmount(event.target.value);
              setError("");
              setSuccess("");
              setConfirming(false);
            }}
            placeholder="0.00"
            className="w-full rounded-xl border border-white/10 bg-black/40 py-3 pl-9 pr-4 text-white outline-none focus:border-yellow-500/60"
          />
        </div>

        {destination === "mining" &&
          selectedMiningPlan &&
          numericAmount > 0 && (
            <div className="mt-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
              <div className="text-sm text-white/60">
                Estimated daily gold
              </div>

              <div className="mt-1 text-lg font-semibold text-yellow-400">
                {estimatedDailyGold.toFixed(2)} GOLD
              </div>
            </div>
          )}

        {amountBelowMinimum && (
          <p className="mt-2 text-sm text-red-400">
            Amount is below the minimum for this plan.
          </p>
        )}

        {amountAboveMaximum && (
          <p className="mt-2 text-sm text-red-400">
            Amount exceeds the maximum for this plan.
          </p>
        )}

        {amountExceedsCash && (
          <p className="mt-2 text-sm text-red-400">
            Amount exceeds your available cash balance.
          </p>
        )}
      </section>

      {/* Messages */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
          <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-300">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Confirmation */}
      {confirming && (
        <section className="rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-5">
          <h3 className="font-semibold text-white">
            Confirm Reinvestment
          </h3>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-white/60">
                Destination
              </span>
              <span className="text-white">
                {destination === "mining"
                  ? "Mining"
                  : "Trading Bot"}
              </span>
            </div>

            {destination === "trading_bot" && (
              <div className="flex justify-between gap-4">
                <span className="text-white/60">
                  Option
                </span>
                <span className="text-white">
                  {botMode === "new"
                    ? "New Bot"
                    : "Existing Bot"}
                </span>
              </div>
            )}

            {destination === "trading_bot" &&
              botMode === "existing" &&
              selectedBot && (
                <div className="flex justify-between gap-4">
                  <span className="text-white/60">
                    Bot
                  </span>
                  <span className="text-white">
                    {selectedBot.bot_name}
                  </span>
                </div>
              )}

            <div className="flex justify-between gap-4">
              <span className="text-white/60">
                Plan
              </span>
              <span className="text-right text-white">
                {selectedPlan?.name ?? "Selected plan"}
              </span>
            </div>

            <div className="flex justify-between gap-4 border-t border-white/10 pt-2">
              <span className="text-white/60">
                Amount
              </span>
              <span className="font-semibold text-yellow-400">
                ${numericAmount.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setConfirming(false)}
              disabled={loading}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-yellow-500 px-4 py-3 font-semibold text-black transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Confirm Reinvestment
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </section>
      )}

      {/* Review button */}
      {!confirming && (
        <button
          type="button"
          onClick={handleReview}
          disabled={
            loading ||
            !planId ||
            !amount ||
            (destination === "trading_bot" &&
              botMode === "existing" &&
              !botId)
          }
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-500 px-5 py-3.5 font-semibold text-black transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Wallet className="h-5 w-5" />
          Review Reinvestment
          <ArrowRight className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}