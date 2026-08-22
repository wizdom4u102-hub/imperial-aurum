import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function FreePlan() {
  const supabase = await createClient();

  const { data: freePlan, error } = await supabase
    .from("mining_plans")
    .select("*")
    .eq("is_free", true)
    .eq("is_active", true)
    .order("minimum_amount", {
      ascending: true,
    })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error(
      "FREE MINING PLAN LOAD ERROR:",
      error,
    );
  }

  return (
    <section className="bg-black px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
      <div className="mx-auto w-full max-w-7xl">

        {/* HEADER / INTRO */}
        <div className="mb-12 text-center lg:hidden">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-yellow-400 sm:text-sm sm:tracking-[0.35em]">
            Plan One
          </span>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {freePlan?.name ?? "Free Mining Plan"}
          </h2>
        </div>

        <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">

          {/* LEFT CONTENT */}
          <div>

            <span className="hidden text-sm font-semibold uppercase tracking-[0.3em] text-yellow-400 lg:block lg:tracking-[0.35em]">
              Plan One
            </span>

            <h2 className="mt-0 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:mt-5 lg:text-5xl xl:text-6xl">
              {freePlan?.name ?? "Free Mining Plan"}
            </h2>

            <p className="mt-5 text-sm leading-7 text-zinc-300 sm:mt-6 sm:text-base sm:leading-8 lg:max-w-2xl">
              {freePlan?.description ??
                `The Free Plan is designed for new members who want to
                experience Imperial Aurum without making an initial
                investment.`}

              <br />
              <br />

              Every registered member receives free cloud mining
              access and begins earning daily digital gold rewards.

              <br />
              <br />

              This plan is perfect for learning how the platform
              works before upgrading to a higher mining package.
            </p>

            {/* STAT CARDS */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5">

              {/* DAILY MINING */}
              <div className="group rounded-2xl border border-yellow-500/20 bg-zinc-900/80 p-5 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.03] hover:border-yellow-400/60 hover:shadow-[0_20px_50px_rgba(234,179,8,0.15)] sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Daily Mining
                </p>

                <p className="mt-3 text-2xl font-bold text-yellow-400 sm:text-3xl">
                  {freePlan
                    ? Number(
                        freePlan.free_daily_gold,
                      ).toLocaleString()
                    : "0"}{" "}
                  Gold
                </p>

                <p className="mt-2 text-xs text-zinc-500">
                  Every 24 hours
                </p>
              </div>

              {/* COST */}
              <div className="group rounded-2xl border border-yellow-500/20 bg-zinc-900/80 p-5 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.03] hover:border-yellow-400/60 hover:shadow-[0_20px_50px_rgba(234,179,8,0.15)] sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Investment
                </p>

                <p className="mt-3 text-2xl font-bold text-emerald-400 sm:text-3xl">
                  FREE
                </p>

                <p className="mt-2 text-xs text-zinc-500">
                  No initial investment
                </p>
              </div>

            </div>

            {/* CTA */}
            <div className="mt-8 sm:mt-10">
              <Link
                href="/signup"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-yellow-500 px-8 py-4 text-sm font-bold text-black shadow-lg shadow-yellow-500/10 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:bg-yellow-400 hover:shadow-yellow-500/20 sm:w-auto sm:px-10 sm:text-base"
              >
                Create Free Account
                <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>

          </div>

          {/* RIGHT BENEFITS CARD */}
          <div className="group relative overflow-hidden rounded-3xl border border-yellow-500/20 bg-zinc-950 p-6 shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:scale-[1.02] hover:border-yellow-400/50 hover:shadow-[0_25px_80px_rgba(234,179,8,0.16)] sm:p-8 lg:p-10">

            {/* GOLD GLOW */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-yellow-500/10 blur-3xl transition-all duration-500 group-hover:bg-yellow-500/20" />

            {/* TOP ACCENT */}
            <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-yellow-600 via-yellow-300 to-yellow-600" />

            <div className="relative">

              <div className="mb-7 sm:mb-8">
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-yellow-400">
                  Included
                </span>

                <h3 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                  What's Included
                </h3>

                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  Everything you need to get started with
                  Imperial Aurum Mining.
                </p>
              </div>

              {/* BENEFITS */}
              <div className="space-y-3 sm:space-y-4">

                <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3.5 transition-all duration-300 hover:translate-x-1 hover:border-yellow-500/20 sm:p-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-yellow-400/10 text-sm text-yellow-400">
                    ✓
                  </span>

                  <span className="text-sm text-zinc-300">
                    Daily cloud mining rewards
                  </span>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3.5 transition-all duration-300 hover:translate-x-1 hover:border-yellow-500/20 sm:p-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-yellow-400/10 text-sm text-yellow-400">
                    ✓
                  </span>

                  <span className="text-sm text-zinc-300">
                    Personal dashboard
                  </span>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3.5 transition-all duration-300 hover:translate-x-1 hover:border-yellow-500/20 sm:p-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-yellow-400/10 text-sm text-yellow-400">
                    ✓
                  </span>

                  <span className="text-sm text-zinc-300">
                    Deposit & Withdrawal access
                  </span>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3.5 transition-all duration-300 hover:translate-x-1 hover:border-yellow-500/20 sm:p-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-yellow-400/10 text-sm text-yellow-400">
                    ✓
                  </span>

                  <span className="text-sm text-zinc-300">
                    Referral program access
                  </span>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3.5 transition-all duration-300 hover:translate-x-1 hover:border-yellow-500/20 sm:p-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-yellow-400/10 text-sm text-yellow-400">
                    ✓
                  </span>

                  <span className="text-sm text-zinc-300">
                    Secure wallet management
                  </span>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3.5 transition-all duration-300 hover:translate-x-1 hover:border-yellow-500/20 sm:p-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-yellow-400/10 text-sm text-yellow-400">
                    ✓
                  </span>

                  <span className="text-sm text-zinc-300">
                    Real-time statistics
                  </span>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3.5 transition-all duration-300 hover:translate-x-1 hover:border-yellow-500/20 sm:p-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-yellow-400/10 text-sm text-yellow-400">
                    ✓
                  </span>

                  <span className="text-sm text-zinc-300">
                    Upgrade anytime
                  </span>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}