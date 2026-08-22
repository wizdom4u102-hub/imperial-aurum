import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PremiumPlan() {
  const supabase = await createClient();

  const { data: plans, error } = await supabase
    .from("mining_plans")
    .select("*")
    .eq("is_active", true)
    .eq("is_free", false)
    .order("minimum_amount", {
      ascending: true,
    });

  if (error) {
    console.error("PREMIUM MINING PLANS LOAD ERROR:", error);
  }

  const premiumPlans = plans ?? [];

  return (
    <section className="bg-zinc-950 px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
      <div className="mx-auto w-full max-w-7xl">
        {/* HEADER */}
        <div className="mb-12 text-center sm:mb-16 lg:mb-20">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-yellow-400 sm:text-sm sm:tracking-[0.35em]">
            Premium Mining Plans
          </span>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Increase Your Mining Power
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-sm leading-6 text-zinc-400 sm:text-base sm:leading-7">
            Upgrade your mining power with one of our premium mining
            plans and increase the amount of Gold you can earn every
            24 hours.
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mx-auto max-w-2xl rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-center sm:p-8">
            <p className="font-medium text-red-400">
              Unable to load premium mining plans.
            </p>

            <p className="mt-2 text-sm text-zinc-400">
              Please try again later.
            </p>
          </div>
        )}

        {/* NO PREMIUM PLANS */}
        {!error && premiumPlans.length === 0 && (
          <div className="mx-auto max-w-2xl rounded-3xl border border-zinc-800 bg-black p-8 text-center sm:p-12">
            <h3 className="text-xl font-semibold text-white sm:text-2xl">
              Premium Plans Coming Soon
            </h3>

            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Premium mining plans are currently unavailable.
            </p>
          </div>
        )}

        {/* PREMIUM PLANS */}
        {!error && premiumPlans.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {premiumPlans.map((plan, index) => {
              const isPopular =
                index ===
                Math.floor(premiumPlans.length / 2);

              return (
                <article
                  key={plan.id}
                  className={`group relative flex h-full flex-col rounded-3xl p-6 transition-all duration-500 hover:-translate-y-3 hover:scale-[1.03] sm:p-8 lg:p-10 ${
                    isPopular
                      ? "border border-yellow-400 bg-yellow-500 text-black shadow-[0_20px_70px_rgba(234,179,8,0.18)] hover:shadow-[0_25px_90px_rgba(234,179,8,0.35)]"
                      : "border border-yellow-500/20 bg-black text-white hover:border-yellow-400/60 hover:shadow-[0_20px_70px_rgba(234,179,8,0.18)]"
                  }`}
                >
                  {/* POPULAR BADGE */}
                  {isPopular && (
                    <div className="absolute right-5 top-5 rounded-full bg-black px-3 py-1 text-[10px] font-bold tracking-wide text-yellow-400 sm:right-6 sm:top-6 sm:text-xs">
                      MOST POPULAR
                    </div>
                  )}

                  {/* PLAN NAME */}
                  <div className={isPopular ? "pr-24" : ""}>
                    <p
                      className={`text-xs font-semibold uppercase tracking-[0.2em] ${
                        isPopular
                          ? "text-black/60"
                          : "text-yellow-400"
                      }`}
                    >
                      Premium Plan
                    </p>

                    <h3
                      className={`mt-3 text-2xl font-bold sm:text-3xl ${
                        isPopular
                          ? "text-black"
                          : "text-white"
                      }`}
                    >
                      {plan.name}
                    </h3>

                    {plan.description && (
                      <p
                        className={`mt-3 text-sm leading-6 ${
                          isPopular
                            ? "text-black/70"
                            : "text-zinc-400"
                        }`}
                      >
                        {plan.description}
                      </p>
                    )}
                  </div>

                  {/* INVESTMENT RANGE */}
                  <div className="mt-8">
                    <p
                      className={`text-xs uppercase tracking-wider ${
                        isPopular
                          ? "text-black/50"
                          : "text-zinc-500"
                      }`}
                    >
                      Investment Range
                    </p>

                    <p
                      className={`mt-2 text-2xl font-bold sm:text-3xl ${
                        isPopular
                          ? "text-black"
                          : "text-yellow-400"
                      }`}
                    >
                      $
                      {Number(
                        plan.minimum_amount,
                      ).toLocaleString()}
                      {" - "}
                      $
                      {Number(
                        plan.maximum_amount,
                      ).toLocaleString()}
                    </p>
                  </div>

                  {/* DAILY MINING */}
                  <div
                    className={`mt-6 rounded-2xl border p-5 sm:p-6 ${
                      isPopular
                        ? "border-black/10 bg-black/10"
                        : "border-white/5 bg-zinc-950"
                    }`}
                  >
                    <p
                      className={`text-xs uppercase tracking-wider ${
                        isPopular
                          ? "text-black/50"
                          : "text-zinc-500"
                      }`}
                    >
                      Daily Mining
                    </p>

                    <p
                      className={`mt-2 text-2xl font-bold sm:text-3xl ${
                        isPopular
                          ? "text-black"
                          : "text-yellow-400"
                      }`}
                    >
                      {Number(
                        plan.gold_per_dollar,
                      ).toLocaleString()}{" "}
                      Gold / $1
                    </p>

                    <p
                      className={`mt-2 text-xs ${
                        isPopular
                          ? "text-black/60"
                          : "text-zinc-500"
                      }`}
                    >
                      Calculated from your investment amount
                    </p>

                    <p
                      className={`mt-1 text-sm ${
                        isPopular
                          ? "text-black/70"
                          : "text-zinc-400"
                      }`}
                    >
                      Every 24 hours
                    </p>
                  </div>

                  {/* BENEFITS */}
                  <div className="mt-7 space-y-3">
                    <p
                      className={`text-sm font-semibold ${
                        isPopular
                          ? "text-black"
                          : "text-white"
                      }`}
                    >
                      Plan Benefits
                    </p>

                    <div
                      className={`flex items-start gap-3 text-sm ${
                        isPopular
                          ? "text-black/80"
                          : "text-zinc-300"
                      }`}
                    >
                      <span
                        className={`mt-0.5 shrink-0 ${
                          isPopular
                            ? "text-black"
                            : "text-yellow-400"
                        }`}
                      >
                        ✓
                      </span>

                      <span>
                        Increased mining power
                      </span>
                    </div>

                    <div
                      className={`flex items-start gap-3 text-sm ${
                        isPopular
                          ? "text-black/80"
                          : "text-zinc-300"
                      }`}
                    >
                      <span
                        className={`mt-0.5 shrink-0 ${
                          isPopular
                            ? "text-black"
                            : "text-yellow-400"
                        }`}
                      >
                        ✓
                      </span>

                      <span>
                        Daily Gold mining
                      </span>
                    </div>

                    <div
                      className={`flex items-start gap-3 text-sm ${
                        isPopular
                          ? "text-black/80"
                          : "text-zinc-300"
                      }`}
                    >
                      <span
                        className={`mt-0.5 shrink-0 ${
                          isPopular
                            ? "text-black"
                            : "text-yellow-400"
                        }`}
                      >
                        ✓
                      </span>

                      <span>
                        Mining rewards every 24 hours
                      </span>
                    </div>

                    <div
                      className={`flex items-start gap-3 text-sm ${
                        isPopular
                          ? "text-black/80"
                          : "text-zinc-300"
                      }`}
                    >
                      <span
                        className={`mt-0.5 shrink-0 ${
                          isPopular
                            ? "text-black"
                            : "text-yellow-400"
                        }`}
                      >
                        ✓
                      </span>

                      <span>
                        Upgrade to higher mining power anytime
                      </span>
                    </div>
                  </div>

                  {/* ACTION */}
                  <div className="mt-auto pt-8">
                    <Link
                      href={`/dashboard/mining-plans/${plan.id}`}
                      className={`flex h-12 w-full items-center justify-center rounded-xl px-5 text-sm font-bold transition-all duration-300 group-hover:-translate-y-0.5 ${
                        isPopular
                          ? "bg-black text-yellow-400 hover:bg-zinc-900"
                          : "bg-yellow-400 text-black hover:bg-yellow-300"
                      }`}
                    >
                      Choose {plan.name}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* PREVIEW LINK — KEPT AS REQUESTED */}
        <div className="mt-12 text-center sm:mt-16">
          <Link
            href="/plans"
            className="inline-flex items-center rounded-2xl bg-yellow-500 px-8 py-4 text-sm font-bold text-black transition-all duration-300 hover:-translate-y-1 hover:bg-yellow-400 hover:shadow-[0_15px_40px_rgba(234,179,8,0.25)] sm:px-10 sm:text-base"
          >
            View All Investment Plans
          </Link>
        </div>
      </div>
    </section>
  );
}