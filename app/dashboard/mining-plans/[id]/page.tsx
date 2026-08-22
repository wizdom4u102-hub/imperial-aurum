import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

import MiningPlanPurchase from './MiningPlanPurchase'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface MiningPlanPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function MiningPlanPage({
  params,
}: MiningPlanPageProps) {
  const { id } = await params

  const supabase = await createClient()

  // =====================================================
  // AUTH
  // =====================================================

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // =====================================================
  // GET SELECTED MINING PLAN
  // =====================================================

  const {
    data: plan,
    error,
  } = await supabase
    .from('mining_plans')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .maybeSingle()

  if (error) {
    console.error(
      'MINING PLAN QUERY ERROR:',
      error
    )

    return (
      <main className="min-h-screen bg-black text-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[70vh] w-full max-w-2xl items-center justify-center">
          <div className="w-full rounded-3xl border border-red-500/20 bg-zinc-900 p-6 text-center sm:p-10">
            <h1 className="text-2xl font-bold text-red-400">
              Unable to Load Mining Plan
            </h1>

            <p className="mt-3 text-sm text-zinc-400">
              We could not load this mining plan.
              Please try again later.
            </p>

            <Link
              href="/dashboard/mining-plans"
              className="mt-6 inline-flex rounded-xl bg-yellow-400 px-6 py-3 font-semibold text-black transition hover:bg-yellow-300"
            >
              Back to Mining Plans
            </Link>
          </div>
        </div>
      </main>
    )
  }

  if (!plan) {
    notFound()
  }

  // =====================================================
  // FREE PLAN
  // =====================================================
  //
  // Free mining does not require a deposit.
  // The existing /api/mining/start route handles it.
  //
  // We therefore do not allow the paid purchase screen
  // to be used for a free plan.
  // =====================================================

  if (plan.is_free) {
    return (
      <main className="min-h-screen bg-black text-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[70vh] w-full max-w-2xl items-center justify-center">
          <div className="w-full rounded-3xl border border-zinc-800 bg-zinc-900 p-6 text-center sm:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-3xl">
              ⛏
            </div>

            <h1 className="mt-6 text-2xl font-bold text-white">
              {plan.name}
            </h1>

            <p className="mt-3 text-zinc-400">
              This is the free mining plan.
            </p>

            <p className="mt-6 text-3xl font-bold text-yellow-400">
              {Number(
                plan.free_daily_gold
              ).toLocaleString()}{' '}
              Gold
            </p>

            <p className="mt-2 text-sm text-zinc-500">
              Every 24 hours
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/dashboard/mining"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-emerald-500 px-6 font-semibold text-black transition hover:bg-emerald-400"
              >
                Go to Mining
              </Link>

              <Link
                href="/dashboard/mining-plans"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/10 px-6 font-semibold text-white transition hover:border-yellow-400"
              >
                View Plans
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // =====================================================
  // PAID PLAN
  // =====================================================

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12">

        {/* BACK */}
        <div className="mb-6">
          <Link
            href="/dashboard/mining-plans"
            className="text-sm text-zinc-400 transition hover:text-yellow-400"
          >
            ← Back to Mining Plans
          </Link>
        </div>

        {/* HEADER */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-400">
            Mining Investment
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            {plan.name}
          </h1>

          {plan.description && (
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
              {plan.description}
            </p>
          )}
        </div>

        <MiningPlanPurchase plan={plan} />
      </div>
    </main>
  )
}