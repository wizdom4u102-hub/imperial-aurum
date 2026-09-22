// app/dashboard/reinvestment/page.tsx

import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ReinvestmentForm from "./reinvestment-form";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ReinvestmentPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [
    { data: balance, error: balanceError },
    { data: miningPlans, error: miningPlansError },
    { data: tradingBotPlans, error: tradingBotPlansError },
    { data: activeBots, error: activeBotsError },
  ] = await Promise.all([
    supabase
      .from("balances")
      .select("cash")
      .eq("user_id", user.id)
      .maybeSingle(),

    supabase
      .from("mining_plans")
      .select("*")
      .eq("is_active", true)
      .eq("is_free", false)
      .order("minimum_amount", {
        ascending: true,
      }),

    supabase
      .from("trading_bot_plans")
      .select("*")
      .eq("status", "active")
      .order("minimum_investment", {
        ascending: true,
      }),

    supabase
      .from("user_trading_bots")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("created_at", {
        ascending: false,
      }),
  ]);

  if (balanceError) {
    console.error(
      "REINVESTMENT BALANCE LOAD ERROR:",
      balanceError
    );
  }

  if (miningPlansError) {
    console.error(
      "REINVESTMENT MINING PLANS LOAD ERROR:",
      miningPlansError
    );
  }

  if (tradingBotPlansError) {
    console.error(
      "REINVESTMENT TRADING BOT PLANS LOAD ERROR:",
      tradingBotPlansError
    );
  }

  if (activeBotsError) {
    console.error(
      "REINVESTMENT ACTIVE BOTS LOAD ERROR:",
      activeBotsError
    );
  }

  const cashBalance = Number(balance?.cash ?? 0);
  const availableMiningPlans = miningPlans ?? [];
  const availableTradingBotPlans = tradingBotPlans ?? [];
  const availableActiveBots = activeBots ?? [];

  const loadError =
    Boolean(balanceError) ||
    Boolean(miningPlansError) ||
    Boolean(tradingBotPlansError) ||
    Boolean(activeBotsError);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
        {/* HEADER */}
        <div className="mb-8 text-center sm:mb-10 lg:mb-12">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-yellow-400 sm:text-sm">
            Imperial Aurum Mining
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Reinvest Your Cash
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:mt-4 sm:text-base">
            Use your available cash balance to grow your Mining or
            Trading Bot investment without making a new deposit.
          </p>
        </div>

        {/* CASH BALANCE */}
        <section className="mx-auto mb-6 max-w-5xl rounded-3xl border border-yellow-500/20 bg-zinc-900 p-5 shadow-2xl shadow-yellow-500/5 sm:mb-8 sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Available Cash Balance
              </p>

              <p className="mt-2 text-3xl font-bold text-yellow-400 sm:text-4xl">
                $
                {cashBalance.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>

            <div className="rounded-2xl border border-yellow-500/20 bg-black/40 px-5 py-4 text-left sm:min-w-[220px]">
              <p className="text-xs text-zinc-500">
                Reinvestment
              </p>

              <p className="mt-1 text-sm font-medium text-zinc-200">
                Mining or Trading Bot
              </p>
            </div>
          </div>
        </section>

        {/* LOAD ERROR */}
        {loadError && (
          <div className="mx-auto mb-6 max-w-5xl rounded-2xl border border-red-500/30 bg-red-500/10 p-5 sm:mb-8">
            <p className="font-semibold text-red-400">
              Some reinvestment information could not be loaded.
            </p>

            <p className="mt-2 text-sm text-zinc-400">
              Please refresh the page and try again.
            </p>
          </div>
        )}

        {/* FORM */}
        <ReinvestmentForm
          cashBalance={cashBalance}
          miningPlans={availableMiningPlans}
          tradingBotPlans={availableTradingBotPlans}
          activeBots={availableActiveBots}
        />

        {/* BACK */}
        <div className="mt-8 text-center sm:mt-10">
          <Link
            href="/dashboard"
            className="text-sm text-zinc-400 transition hover:text-yellow-400"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}