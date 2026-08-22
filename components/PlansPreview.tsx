import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PlansPreview() {
  const supabase = await createClient();

  const { data: plans, error } = await supabase
    .from("mining_plans")
    .select("*")
    .eq("is_active", true)
    .order("minimum_amount", {
      ascending: true,
    });

  if (error) {
    console.error(
      "MINING PLANS PREVIEW LOAD ERROR:",
      error,
    );
  }

  const availablePlans = plans ?? [];

  /*
   * Show only the first few plans on the homepage.
   * The full list remains available through /plans.
   */
  const previewPlans = availablePlans.slice(0, 3);

  return (
    <section
      id="plans"
      className="bg-black px-6 py-24"
    >
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-14 text-center">

          <span className="text-sm uppercase tracking-[6px] text-yellow-400">
            Investment Plans
          </span>

          <h2 className="mt-4 text-4xl font-bold sm:text-5xl">
            Choose Your Mining Plan
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-zinc-400">
            Choose a mining plan that matches your investment
            goals and start earning daily Gold rewards.
          </p>

        </div>

        {/* ERROR */}
        {error && (
          <div className="mx-auto mb-8 max-w-2xl rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-center">
            <p className="font-medium text-red-400">
              Unable to load mining plans.
            </p>

            <p className="mt-2 text-sm text-zinc-400">
              Please try again later.
            </p>
          </div>
        )}

        {/* NO PLANS */}
        {!error && previewPlans.length === 0 && (
          <div className="mx-auto max-w-2xl rounded-3xl border border-zinc-800 bg-zinc-900 p-8 text-center sm:p-12">
            <h2 className="text-xl font-semibold text-white">
              No Mining Plans Available
            </h2>

            <p className="mt-3 text-sm text-zinc-400">
              Mining plans are currently unavailable.
            </p>
          </div>
        )}

        {/* PLANS */}
        {previewPlans.length > 0 && (
          <div className="grid gap-8 md:grid-cols-3">

            {previewPlans.map((plan, index) => (
              <article
                key={plan.id}
                className={`group relative flex h-full flex-col rounded-3xl p-8 transition-all duration-500 hover:-translate-y-3 ${
                  index === 1
                    ? "border border-yellow-400 bg-gradient-to-b from-yellow-500 to-yellow-400 text-black shadow-2xl hover:shadow-[0_0_60px_rgba(234,179,8,0.6)]"
                    : "border border-yellow-500/20 bg-white/5 text-white backdrop-blur-xl hover:scale-105 hover:border-yellow-400 hover:shadow-[0_0_40px_rgba(234,179,8,0.35)]"
                }`}
              >

                {/* POPULAR BADGE */}
                {index === 1 && (
                  <span className="absolute right-5 top-5 rounded-full bg-black px-4 py-1 text-xs font-bold text-yellow-400">
                    MOST POPULAR
                  </span>
                )}

                {/* FREE BADGE */}
                {plan.is_free && (
                  <span
                    className={`absolute right-5 top-5 rounded-full px-4 py-1 text-xs font-bold ${
                      index === 1
                        ? "bg-black text-emerald-400"
                        : "bg-emerald-500/10 text-emerald-400"
                    }`}
                  >
                    FREE
                  </span>
                )}

                {/* PLAN NAME */}
                <div
                  className={
                    index === 1
                      ? "pr-24"
                      : "pr-16"
                  }
                >
                  <h3 className="text-3xl font-bold">
                    {plan.name}
                  </h3>

                  {plan.description && (
                    <p
                      className={`mt-3 text-sm leading-6 ${
                        index === 1
                          ? "text-black/70"
                          : "text-zinc-400"
                      }`}
                    >
                      {plan.description}
                    </p>
                  )}
                </div>

                {/* INVESTMENT RANGE */}
                <div className="mt-7">

                  <p
                    className={`text-xs uppercase tracking-wider ${
                      index === 1
                        ? "text-black/60"
                        : "text-zinc-500"
                    }`}
                  >
                    Investment Range
                  </p>

                  {plan.is_free ? (
                    <p
                      className={`mt-2 text-3xl font-bold ${
                        index === 1
                          ? "text-black"
                          : "text-emerald-400"
                      }`}
                    >
                      Free
                    </p>
                  ) : (
                    <p
                      className={`mt-2 text-2xl font-bold ${
                        index === 1
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
                  )}

                </div>

                {/* DAILY MINING */}
                <div
                  className={`mt-6 rounded-2xl p-5 ${
                    index === 1
                      ? "bg-black/10"
                      : "border border-white/5 bg-black/30"
                  }`}
                >

                  <p
                    className={`text-xs uppercase tracking-wider ${
                      index === 1
                        ? "text-black/60"
                        : "text-zinc-500"
                    }`}
                  >
                    Daily Mining
                  </p>

                  {plan.is_free ? (
                    <p
                      className={`mt-2 text-2xl font-bold ${
                        index === 1
                          ? "text-black"
                          : "text-yellow-400"
                      }`}
                    >
                      {Number(
                        plan.free_daily_gold,
                      ).toLocaleString()}{" "}
                      Gold
                    </p>
                  ) : (
                    <>
                      <p
                        className={`mt-2 text-2xl font-bold ${
                          index === 1
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
                          index === 1
                            ? "text-black/60"
                            : "text-zinc-500"
                        }`}
                      >
                        Calculated from your
                        investment amount
                      </p>
                    </>
                  )}

                  <p
                    className={`mt-1 text-sm ${
                      index === 1
                        ? "text-black/60"
                        : "text-zinc-400"
                    }`}
                  >
                    Every 24 hours
                  </p>

                </div>

                {/* ACTION */}
                <div className="mt-auto pt-7">

                  <Link
                    href="/plans"
                    className={`flex h-12 w-full items-center justify-center rounded-xl px-5 font-semibold transition ${
                      index === 1
                        ? "bg-black text-yellow-400 hover:bg-zinc-900"
                        : "bg-yellow-400 text-black hover:bg-yellow-300"
                    }`}
                  >
                    View {plan.name}
                  </Link>

                </div>

              </article>
            ))}

          </div>
        )}

        {/* EXISTING PREVIEW LINK — KEPT EXACTLY */}
        <div className="mt-16 text-center">

          <Link
            href="/plans"
            className="inline-block rounded-2xl bg-yellow-500 px-12 py-4 font-bold text-black transition hover:bg-yellow-400"
          >
            View All Investment Plans
          </Link>

        </div>

      </div>
    </section>
  );
}