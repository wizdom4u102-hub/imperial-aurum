// app/dashboard/mining-plans/page.tsx

import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function MiningPlansPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-8 text-center">
          <h1 className="text-2xl font-bold text-red-400">
            Unauthorized
          </h1>

          <p className="mt-3 text-zinc-400">
            Please sign in to view mining plans.
          </p>

          <Link
            href="/login"
            className="mt-6 inline-flex rounded-xl bg-yellow-400 px-6 py-3 font-semibold text-black transition hover:bg-yellow-300"
          >
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

    // =====================================================
  // CURRENT MINING PLAN
  // =====================================================

  const {
    data: currentSession,
    error: currentSessionError,
  } = await supabase
    .from('mining_sessions')
    .select('mining_plan_id')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .eq('active', true)
    .order('started_at', {
      ascending: false,
    })
    .limit(1)
    .maybeSingle()

  if (currentSessionError) {
    console.error(
      'CURRENT MINING SESSION ERROR:',
      currentSessionError
    )
  }

  const currentPlanId =
    currentSession?.mining_plan_id ?? null

  const {
    data: plans,
    error,
  } = await supabase
    .from('mining_plans')
    .select('*')
    .eq('is_active', true)
    .order('minimum_amount', {
      ascending: true,
    })

  if (error) {
    console.error(
      'MINING PLANS LOAD ERROR:',
      error
    )
  }

  const availablePlans = plans ?? []

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">

        {/* HEADER */}
        <div className="mb-10 text-center sm:mb-12">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-yellow-400">
            Imperial Aurum Mining
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Choose Your Mining Plan
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
            Choose a mining plan and increase your daily Gold earning.
            Your selected investment determines the amount of Gold you
            can earn every 24 hours.
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
        {!error && availablePlans.length === 0 && (
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
        {availablePlans.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {availablePlans.map((plan) => (
              <article
                key={plan.id}
                                className={`relative flex h-full flex-col rounded-3xl border p-6 transition sm:p-7 ${
                  plan.id === currentPlanId
                    ? 'border-yellow-400 bg-yellow-400/5 ring-1 ring-yellow-400/40'
                    : plan.is_free
                      ? 'border-zinc-700 bg-zinc-900'
                      : 'border-yellow-500/30 bg-zinc-900 hover:border-yellow-400/60'
                }`}
              >
                {/* PLAN BADGE */}
{plan.id === currentPlanId ? (
  <div className="absolute right-5 top-5 rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold text-black">
    YOUR CURRENT PLAN
  </div>
) : plan.is_free ? (
  <div className="absolute right-5 top-5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
    FREE
  </div>
) : null}

                {/* PLAN NAME */}
                <div className="pr-16">
                  <h2 className="text-2xl font-bold text-white">
                    {plan.name}
                  </h2>

                  {plan.description && (
                    <p className="mt-2 text-sm leading-5 text-zinc-400">
                      {plan.description}
                    </p>
                  )}
                </div>

                {/* INVESTMENT RANGE */}
                <div className="mt-7">
                  <p className="text-xs uppercase tracking-wider text-zinc-500">
                    Investment Range
                  </p>

                  {plan.is_free ? (
                    <p className="mt-2 text-2xl font-bold text-emerald-400">
                      Free
                    </p>
                  ) : (
                    <p className="mt-2 text-2xl font-bold text-yellow-400">
                      ${Number(plan.minimum_amount).toLocaleString()}
                      {' - '}
                      ${Number(plan.maximum_amount).toLocaleString()}
                    </p>
                  )}
                </div>

                {/* DAILY GOLD */}
                <div className="mt-6 rounded-2xl border border-white/5 bg-black/30 p-5">
                  <p className="text-xs uppercase tracking-wider text-zinc-500">
                    Daily Mining
                  </p>

                  {plan.is_free ? (
                    <p className="mt-2 text-2xl font-bold text-yellow-400">
                      {Number(
                        plan.free_daily_gold
                      ).toLocaleString()}{' '}
                      Gold
                    </p>
                  ) : (
                    <>
                      <p className="mt-2 text-2xl font-bold text-yellow-400">
                        {Number(
                          plan.gold_per_dollar
                        ).toLocaleString()}{' '}
                        Gold / $1
                      </p>

                      <p className="mt-2 text-xs text-zinc-500">
                        Calculated from your investment amount
                      </p>
                    </>
                  )}

                  <p className="mt-1 text-sm text-zinc-400">
                    Every 24 hours
                  </p>
                </div>

                {/* ACTION */}
                <div className="mt-auto pt-7">
                  {plan.is_free ? (
                    <Link
                      href="/dashboard/mining"
                      className="flex h-12 w-full items-center justify-center rounded-xl bg-emerald-500 px-5 font-semibold text-black transition hover:bg-emerald-400"
                    >
                      Start Free Mining
                    </Link>
                  ) : (
                    <Link
                      href={`/dashboard/mining-plans/${plan.id}`}
                      className="flex h-12 w-full items-center justify-center rounded-xl bg-yellow-400 px-5 font-semibold text-black transition hover:bg-yellow-300"
                    >
                      Choose {plan.name}
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {/* BACK */}
        <div className="mt-10 text-center sm:mt-12">
          <Link
            href="/dashboard"
            className="text-sm text-zinc-400 transition hover:text-yellow-400"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </main>
  )
}