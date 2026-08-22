export const dynamic = 'force-dynamic'
export const revalidate = 0

import Link from 'next/link'
import { requireAdminPage } from '@/lib/admin'
import { createClient as createAdminClient } from '@supabase/supabase-js'

const adminDb = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function AdminHistoryPage() {
  await requireAdminPage()

  // =====================================================
  // TRANSACTIONS
  // =====================================================

  const { data: transactions, error: transactionsError } =
    await adminDb
      .from('transactions')
      .select('*')
      .order('created_at', {
        ascending: false,
      })

  if (transactionsError) {
    throw new Error(transactionsError.message)
  }

  // =====================================================
  // DEPOSITS
  // =====================================================

  const { data: deposits, error: depositsError } =
    await adminDb
      .from('deposits')
      .select('*')
      .order('created_at', {
        ascending: false,
      })

  if (depositsError) {
    throw new Error(depositsError.message)
  }

  // =====================================================
  // WITHDRAWALS
  // =====================================================

  const { data: withdrawals, error: withdrawalsError } =
    await adminDb
      .from('withdrawals')
      .select('*')
      .order('created_at', {
        ascending: false,
      })

  if (withdrawalsError) {
    throw new Error(withdrawalsError.message)
  }

  // =====================================================
  // SHARED PLANS
  // =====================================================

  const { data: sharedPlans, error: sharedPlansError } =
    await adminDb
      .from('shared_plans')
      .select('*')
      .order('created_at', {
        ascending: false,
      })

  if (sharedPlansError) {
    throw new Error(sharedPlansError.message)
  }

  // =====================================================
  // MINING SESSIONS
  // =====================================================

  const { data: miningSessions, error: miningSessionsError } =
    await adminDb
      .from('mining_sessions')
      .select('*')
      .order('started_at', {
        ascending: false,
      })

  if (miningSessionsError) {
    throw new Error(miningSessionsError.message)
  }

  // =====================================================
  // REFERRAL EARNINGS
  // =====================================================

  const {
    data: referralEarnings,
    error: referralEarningsError,
  } = await adminDb
    .from('referral_earnings')
    .select('*')
    .order('created_at', {
      ascending: false,
    })

  if (referralEarningsError) {
    throw new Error(
      referralEarningsError.message
    )
  }

  // =====================================================
  // PAYMENT METHODS
  // =====================================================

  const paymentMethodIds = [
    ...new Set(
      [
        ...(deposits ?? []).map(
          (deposit) => deposit.method_id
        ),
        ...(withdrawals ?? []).map(
          (withdrawal) => withdrawal.method_id
        ),
      ].filter(
        (id): id is string =>
          typeof id === 'string'
      )
    ),
  ]

  const {
    data: paymentMethods,
    error: paymentMethodsError,
  } =
    paymentMethodIds.length > 0
      ? await adminDb
          .from('payment_methods')
          .select('id, name, type')
          .in(
            'id',
            paymentMethodIds
          )
      : {
          data: [],
          error: null,
        }

  if (paymentMethodsError) {
    throw new Error(
      paymentMethodsError.message
    )
  }

  const paymentMethodMap = new Map(
    (paymentMethods ?? []).map(
      (method) => [
        method.id,
        method,
      ]
    )
  )

  // =====================================================
  // MINING PLAN IDS
  // =====================================================

  const miningPlanIds = [
    ...new Set(
      [
        ...(deposits ?? []).map(
          (deposit) =>
            deposit.mining_plan_id
        ),
        ...(miningSessions ?? []).map(
          (session) =>
            session.mining_plan_id
        ),
      ].filter(
        (id): id is string =>
          typeof id === 'string'
      )
    ),
  ]

  const {
    data: miningPlans,
    error: miningPlansError,
  } =
    miningPlanIds.length > 0
      ? await adminDb
          .from('mining_plans')
          .select(
            'id, name, minimum_amount, maximum_amount, gold_per_dollar, free_daily_gold'
          )
          .in(
            'id',
            miningPlanIds
          )
      : {
          data: [],
          error: null,
        }

  if (miningPlansError) {
    throw new Error(
      miningPlansError.message
    )
  }

  const miningPlanMap = new Map(
    (miningPlans ?? []).map(
      (plan) => [
        plan.id,
        plan,
      ]
    )
  )

  // =====================================================
  // USER IDS
  // =====================================================

  const userIds = [
    ...new Set(
      [
        ...(transactions ?? []).map(
          (transaction) =>
            transaction.user_id
        ),

        ...(deposits ?? []).map(
          (deposit) =>
            deposit.user_id
        ),

        ...(withdrawals ?? []).map(
          (withdrawal) =>
            withdrawal.user_id
        ),

        ...(sharedPlans ?? []).map(
          (plan) =>
            plan.user_id
        ),

        ...(miningSessions ?? []).map(
          (session) =>
            session.user_id
        ),

        ...(referralEarnings ?? []).map(
          (earning) =>
            earning.user_id
        ),

        ...(referralEarnings ?? []).map(
          (earning) =>
            earning.referrer_id
        ),
      ].filter(
        (userId): userId is string =>
          typeof userId === 'string'
      )
    ),
  ]

  // =====================================================
  // PROFILES
  // =====================================================

  const {
    data: profiles,
    error: profilesError,
  } =
    userIds.length > 0
      ? await adminDb
          .from('profiles')
          .select(
            'id, username, email'
          )
          .in(
            'id',
            userIds
          )
      : {
          data: [],
          error: null,
        }

  if (profilesError) {
    throw new Error(
      profilesError.message
    )
  }

  const profileMap = new Map(
    (profiles ?? []).map(
      (profile) => [
        profile.id,
        profile,
      ]
    )
  )

  // =====================================================
  // STATISTICS
  // =====================================================

  const totalDeposits =
    deposits
      ?.filter(
        (deposit) =>
          deposit.status ===
            'completed' ||
          deposit.status ===
            'approve'
      )
      .reduce(
        (sum, deposit) =>
          sum +
          Number(
            deposit.amount || 0
          ),
        0
      ) || 0

  const totalWithdrawals =
    withdrawals
      ?.filter(
        (withdrawal) =>
          withdrawal.status ===
          'approved'
      )
      .reduce(
        (sum, withdrawal) =>
          sum +
          Number(
            withdrawal.amount || 0
          ),
        0
      ) || 0

  const totalROI =
    transactions
      ?.filter(
        (transaction) =>
          transaction.type ===
          'roi'
      )
      .reduce(
        (sum, transaction) =>
          sum +
          Number(
            transaction.amount || 0
          ),
        0
      ) || 0

  const totalPlanProfit =
    sharedPlans?.reduce(
      (sum, plan) =>
        sum +
        Number(
          plan.total_profit_generated ||
            0
        ),
      0
    ) || 0

  const totalMining =
    miningSessions?.reduce(
      (sum, session) =>
        sum +
        Number(
          session.total_earned ||
            session.reward ||
            0
        ),
      0
    ) || 0

  const totalInvested =
    sharedPlans?.reduce(
      (sum, plan) =>
        sum +
        Number(
          plan.amount || 0
        ),
      0
    ) || 0

  const totalReferral =
    referralEarnings?.reduce(
      (sum, earning) =>
        sum +
        Number(
          earning.commission_amount ||
            0
        ),
      0
    ) || 0

  // =====================================================
  // HELPERS
  // =====================================================

  const formatDate = (
    value: string | null
  ) => {
    if (!value) {
      return 'N/A'
    }

    return new Date(
      value
    ).toLocaleString()
  }

  const formatMoney = (
    value: number | null | undefined
  ) =>
    `$${Number(
      value || 0
    ).toLocaleString(
      undefined,
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`

  const getStatusClass = (
    status: string | null
  ) => {
    if (
      status ===
        'completed' ||
      status ===
        'approved'
    ) {
      return 'bg-green-500/20 text-green-400'
    }

    if (
      status ===
        'rejected'
    ) {
      return 'bg-red-500/20 text-red-400'
    }

    return 'bg-yellow-500/20 text-yellow-400'
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 lg:p-10">
      <div className="mx-auto w-full max-w-7xl">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="mb-8 flex flex-col gap-4 sm:mb-10 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <h1 className="text-3xl font-bold text-yellow-400 sm:text-4xl">
              Admin History
            </h1>

            <p className="mt-2 text-sm text-zinc-500 sm:text-base">
              Complete platform activity and audit history
            </p>
          </div>

          <Link
            href="/admin"
            className="inline-flex w-fit text-yellow-400 hover:underline"
          >
            ← Dashboard
          </Link>

        </div>

        {/* ================================================= */}
        {/* STATS */}
        {/* ================================================= */}

        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-3xl bg-zinc-900 p-5 sm:p-6">
            <p className="text-sm text-zinc-400">
              Deposits
            </p>

            <h2 className="mt-2 text-2xl font-bold text-emerald-400 sm:text-3xl">
              {formatMoney(
                totalDeposits
              )}
            </h2>
          </div>

          <div className="rounded-3xl bg-zinc-900 p-5 sm:p-6">
            <p className="text-sm text-zinc-400">
              Withdrawals
            </p>

            <h2 className="mt-2 text-2xl font-bold text-red-400 sm:text-3xl">
              {formatMoney(
                totalWithdrawals
              )}
            </h2>
          </div>

          <div className="rounded-3xl bg-zinc-900 p-5 sm:p-6">
            <p className="text-sm text-zinc-400">
              ROI Paid
            </p>

            <h2 className="mt-2 text-2xl font-bold text-cyan-400 sm:text-3xl">
              {formatMoney(
                totalROI
              )}
            </h2>
          </div>

          <div className="rounded-3xl bg-zinc-900 p-5 sm:p-6">
            <p className="text-sm text-zinc-400">
              Plan Profit Generated
            </p>

            <h2 className="mt-2 text-2xl font-bold text-green-400 sm:text-3xl">
              {formatMoney(
                totalPlanProfit
              )}
            </h2>
          </div>

          <div className="rounded-3xl bg-zinc-900 p-5 sm:p-6">
            <p className="text-sm text-zinc-400">
              Total Invested
            </p>

            <h2 className="mt-2 text-2xl font-bold text-blue-400 sm:text-3xl">
              {formatMoney(
                totalInvested
              )}
            </h2>
          </div>

          <div className="rounded-3xl bg-zinc-900 p-5 sm:p-6">
            <p className="text-sm text-zinc-400">
              Referral Paid
            </p>

            <h2 className="mt-2 text-2xl font-bold text-yellow-400 sm:text-3xl">
              {formatMoney(
                totalReferral
              )}
            </h2>
          </div>

          <div className="rounded-3xl bg-zinc-900 p-5 sm:p-6">
            <p className="text-sm text-zinc-400">
              Mining Rewards
            </p>

            <h2 className="mt-2 text-2xl font-bold text-yellow-400 sm:text-3xl">
              {Number(
                totalMining
              ).toLocaleString(
                undefined,
                {
                  maximumFractionDigits: 4,
                }
              )}{' '}
              Gold
            </h2>
          </div>

        </div>

        {/* ================================================= */}
        {/* DEPOSIT HISTORY */}
        {/* ================================================= */}

        <div className="mb-10 overflow-hidden rounded-3xl bg-zinc-900">

          <div className="border-b border-zinc-800 p-5 sm:p-6">
            <h2 className="text-xl font-bold sm:text-2xl">
              Deposit History
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Shows what each deposit was submitted for.
            </p>
          </div>

          {/* DESKTOP */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full">
              <thead className="bg-zinc-800">
                <tr>
                  <th className="p-4 text-left">
                    Date
                  </th>
                  <th className="p-4 text-left">
                    User
                  </th>
                  <th className="p-4 text-left">
                    Purpose
                  </th>
                  <th className="p-4 text-left">
                    Amount
                  </th>
                  <th className="p-4 text-left">
                    Payment Method
                  </th>
                  <th className="p-4 text-left">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {deposits?.map(
                  (deposit) => {
                    const profile =
                      profileMap.get(
                        deposit.user_id ??
                          ''
                      )

                    const miningPlan =
                      miningPlanMap.get(
                        deposit.mining_plan_id ??
                          ''
                      )

                    const sharedPlan =
                      sharedPlans?.find(
                        (plan) =>
                          plan.id ===
                          deposit.shared_plan_id
                      )

                    const paymentMethod =
                      paymentMethodMap.get(
                        deposit.method_id ??
                          ''
                      )

                    const purpose =
                      deposit.mining_plan_id
                        ? 'Mining Plan'
                        : deposit.shared_plan_id
                        ? 'Shared Plan'
                        : 'Normal Deposit'

                    return (
                      <tr
                        key={
                          deposit.id
                        }
                        className="border-t border-zinc-800"
                      >
                        <td className="p-4 text-sm text-zinc-400">
                          {formatDate(
                            deposit.created_at
                          )}
                        </td>

                        <td className="p-4">
                          <p className="font-medium text-white">
                            {profile?.username ||
                              'No username'}
                          </p>

                          <p className="max-w-[220px] break-all text-xs text-zinc-500">
                            {profile?.email ||
                              'No email'}
                          </p>
                        </td>

                        <td className="p-4">
                          <p className="font-semibold text-yellow-400">
                            {purpose}
                          </p>

                          {miningPlan && (
                            <p className="mt-1 text-sm text-zinc-400">
                              {miningPlan.name}
                            </p>
                          )}

                          {sharedPlan && (
                            <p className="mt-1 text-sm text-zinc-400">
                              {sharedPlan.title}
                            </p>
                          )}
                        </td>

                        <td className="p-4 font-semibold">
                          {formatMoney(
                            deposit.amount
                          )}
                        </td>

                        <td className="p-4">
                          <p className="text-sm text-white">
                            {paymentMethod?.name ||
                              'Unknown'}
                          </p>

                          {paymentMethod?.type && (
                            <p className="text-xs text-zinc-500">
                              {
                                paymentMethod.type
                              }
                            </p>
                          )}
                        </td>

                        <td className="p-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                              deposit.status
                            )}`}
                          >
                            {deposit.status ||
                              'pending'}
                          </span>
                        </td>
                      </tr>
                    )
                  }
                )}
              </tbody>
            </table>
          </div>

          {/* MOBILE */}
          <div className="space-y-3 p-4 lg:hidden">
            {deposits?.map(
              (deposit) => {
                const profile =
                  profileMap.get(
                    deposit.user_id ??
                      ''
                  )

                const miningPlan =
                  miningPlanMap.get(
                    deposit.mining_plan_id ??
                      ''
                  )

                const sharedPlan =
                  sharedPlans?.find(
                    (plan) =>
                      plan.id ===
                      deposit.shared_plan_id
                  )

                const paymentMethod =
                  paymentMethodMap.get(
                    deposit.method_id ??
                      ''
                  )

                const purpose =
                  deposit.mining_plan_id
                    ? 'Mining Plan'
                    : deposit.shared_plan_id
                    ? 'Shared Plan'
                    : 'Normal Deposit'

                return (
                  <div
                    key={
                      deposit.id
                    }
                    className="rounded-2xl border border-zinc-800 bg-black/20 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-lg font-bold text-yellow-400">
                          {formatMoney(
                            deposit.amount
                          )}
                        </p>

                        <p className="mt-1 text-xs text-zinc-500">
                          {formatDate(
                            deposit.created_at
                          )}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                          deposit.status
                        )}`}
                      >
                        {deposit.status ||
                          'pending'}
                      </span>
                    </div>

                    <div className="mt-4 space-y-3 text-sm">

                      <div>
                        <p className="text-xs uppercase tracking-wider text-zinc-600">
                          User
                        </p>

                        <p className="text-white">
                          {profile?.username ||
                            'No username'}
                        </p>

                        <p className="break-all text-xs text-zinc-500">
                          {profile?.email ||
                            'No email'}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wider text-zinc-600">
                          Deposit For
                        </p>

                        <p className="font-semibold text-yellow-400">
                          {purpose}
                        </p>

                        {miningPlan && (
                          <p className="text-zinc-400">
                            {miningPlan.name}
                          </p>
                        )}

                        {sharedPlan && (
                          <p className="text-zinc-400">
                            {sharedPlan.title}
                          </p>
                        )}
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wider text-zinc-600">
                          Payment Method
                        </p>

                        <p className="text-white">
                          {paymentMethod?.name ||
                            'Unknown'}
                        </p>
                      </div>

                    </div>
                  </div>
                )
              }
            )}
          </div>

        </div>

        {/* ================================================= */}
        {/* WITHDRAWAL HISTORY */}
        {/* ================================================= */}

        <div className="mb-10 overflow-hidden rounded-3xl bg-zinc-900">

          <div className="border-b border-zinc-800 p-5 sm:p-6">
            <h2 className="text-xl font-bold sm:text-2xl">
              Withdrawal History
            </h2>
          </div>

          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full">
              <thead className="bg-zinc-800">
                <tr>
                  <th className="p-4 text-left">
                    Date
                  </th>
                  <th className="p-4 text-left">
                    User
                  </th>
                  <th className="p-4 text-left">
                    Amount
                  </th>
                  <th className="p-4 text-left">
                    Payment Method
                  </th>
                  <th className="p-4 text-left">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {withdrawals?.map(
                  (withdrawal) => {
                    const profile =
                      profileMap.get(
                        withdrawal.user_id ??
                          ''
                      )

                    const paymentMethod =
                      paymentMethodMap.get(
                        withdrawal.method_id ??
                          ''
                      )

                    return (
                      <tr
                        key={
                          withdrawal.id
                        }
                        className="border-t border-zinc-800"
                      >
                        <td className="p-4 text-sm text-zinc-400">
                          {formatDate(
                            withdrawal.created_at
                          )}
                        </td>

                        <td className="p-4">
                          <p className="font-medium">
                            {profile?.username ||
                              'No username'}
                          </p>

                          <p className="max-w-[220px] break-all text-xs text-zinc-500">
                            {profile?.email ||
                              'No email'}
                          </p>
                        </td>

                        <td className="p-4 font-semibold text-red-400">
                          {formatMoney(
                            withdrawal.amount
                          )}
                        </td>

                        <td className="p-4">
                          <p>
                            {paymentMethod?.name ||
                              'Unknown'}
                          </p>

                          {paymentMethod?.type && (
                            <p className="text-xs text-zinc-500">
                              {
                                paymentMethod.type
                              }
                            </p>
                          )}
                        </td>

                        <td className="p-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                              withdrawal.status
                            )}`}
                          >
                            {withdrawal.status ||
                              'pending'}
                          </span>
                        </td>
                      </tr>
                    )
                  }
                )}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 p-4 lg:hidden">
            {withdrawals?.map(
              (withdrawal) => {
                const profile =
                  profileMap.get(
                    withdrawal.user_id ??
                      ''
                  )

                const paymentMethod =
                  paymentMethodMap.get(
                    withdrawal.method_id ??
                      ''
                  )

                return (
                  <div
                    key={
                      withdrawal.id
                    }
                    className="rounded-2xl border border-zinc-800 bg-black/20 p-4"
                  >
                    <div className="flex justify-between gap-3">
                      <div>
                        <p className="font-bold text-red-400">
                          {formatMoney(
                            withdrawal.amount
                          )}
                        </p>

                        <p className="mt-1 text-xs text-zinc-500">
                          {formatDate(
                            withdrawal.created_at
                          )}
                        </p>
                      </div>

                      <span
                        className={`h-fit rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                          withdrawal.status
                        )}`}
                      >
                        {withdrawal.status ||
                          'pending'}
                      </span>
                    </div>

                    <div className="mt-4">
                      <p className="font-medium">
                        {profile?.username ||
                          'No username'}
                      </p>

                      <p className="break-all text-xs text-zinc-500">
                        {profile?.email ||
                          'No email'}
                      </p>

                      <p className="mt-3 text-sm text-zinc-400">
                        Method:{' '}
                        <span className="text-white">
                          {paymentMethod?.name ||
                            'Unknown'}
                        </span>
                      </p>
                    </div>
                  </div>
                )
              }
            )}
          </div>

        </div>

        {/* ================================================= */}
        {/* MINING HISTORY */}
        {/* ================================================= */}

        <div className="mb-10 overflow-hidden rounded-3xl bg-zinc-900">

          <div className="border-b border-zinc-800 p-5 sm:p-6">
            <h2 className="text-xl font-bold sm:text-2xl">
              Mining History
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Mining sessions and Gold earned.
            </p>
          </div>

          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full">
              <thead className="bg-zinc-800">
                <tr>
                  <th className="p-4 text-left">
                    User
                  </th>
                  <th className="p-4 text-left">
                    Plan
                  </th>
                  <th className="p-4 text-left">
                    Investment
                  </th>
                  <th className="p-4 text-left">
                    Gold Earned
                  </th>
                  <th className="p-4 text-left">
                    Start
                  </th>
                  <th className="p-4 text-left">
                    End
                  </th>
                  <th className="p-4 text-left">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {miningSessions?.map(
                  (session) => {
                    const profile =
                      profileMap.get(
                        session.user_id ??
                          ''
                      )

                    const plan =
                      miningPlanMap.get(
                        session.mining_plan_id ??
                          ''
                      )

                    return (
                      <tr
                        key={
                          session.id
                        }
                        className="border-t border-zinc-800"
                      >
                        <td className="p-4">
                          <p className="font-medium">
                            {profile?.username ||
                              'No username'}
                          </p>

                          <p className="max-w-[200px] break-all text-xs text-zinc-500">
                            {profile?.email ||
                              'No email'}
                          </p>
                        </td>

                        <td className="p-4">
                          <p className="font-semibold text-yellow-400">
                            {plan?.name ||
                              'Unknown Plan'}
                          </p>

                          {session.active && (
                            <p className="text-xs text-emerald-400">
                              Active
                            </p>
                          )}
                        </td>

                        <td className="p-4">
                          {formatMoney(
                            session.investment_amount
                          )}
                        </td>

                        <td className="p-4 font-semibold text-yellow-400">
                          {Number(
                            session.total_earned ||
                              session.reward ||
                              0
                          ).toLocaleString(
                            undefined,
                            {
                              maximumFractionDigits: 4,
                            }
                          )}{' '}
                          Gold
                        </td>

                        <td className="p-4 text-sm text-zinc-400">
                          {formatDate(
                            session.started_at
                          )}
                        </td>

                        <td className="p-4 text-sm text-zinc-400">
                          {formatDate(
                            session.ends_at
                          )}
                        </td>

                        <td className="p-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                              session.status
                            )}`}
                          >
                            {session.status ||
                              'N/A'}
                          </span>
                        </td>
                      </tr>
                    )
                  }
                )}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 p-4 lg:hidden">
            {miningSessions?.map(
              (session) => {
                const profile =
                  profileMap.get(
                    session.user_id ??
                      ''
                  )

                const plan =
                  miningPlanMap.get(
                    session.mining_plan_id ??
                      ''
                  )

                return (
                  <div
                    key={
                      session.id
                    }
                    className="rounded-2xl border border-zinc-800 bg-black/20 p-4"
                  >
                    <div className="flex justify-between gap-3">
                      <div>
                        <p className="font-medium">
                          {profile?.username ||
                            'No username'}
                        </p>

                        <p className="break-all text-xs text-zinc-500">
                          {profile?.email ||
                            'No email'}
                        </p>
                      </div>

                      <span
                        className={`h-fit rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                          session.status
                        )}`}
                      >
                        {session.status ||
                          'N/A'}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-zinc-600">
                          Plan
                        </p>

                        <p className="text-yellow-400">
                          {plan?.name ||
                            'Unknown Plan'}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-zinc-600">
                          Investment
                        </p>

                        <p>
                          {formatMoney(
                            session.investment_amount
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-zinc-600">
                          Gold Earned
                        </p>

                        <p className="text-yellow-400">
                          {Number(
                            session.total_earned ||
                              session.reward ||
                              0
                          ).toLocaleString(
                            undefined,
                            {
                              maximumFractionDigits: 4,
                            }
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-zinc-600">
                          Rate / Second
                        </p>

                        <p>
                          {Number(
                            session.rate_per_second ||
                              0
                          ).toFixed(8)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-1 text-xs text-zinc-500">
                      <p>
                        Started:{' '}
                        {formatDate(
                          session.started_at
                        )}
                      </p>

                      <p>
                        Ends:{' '}
                        {formatDate(
                          session.ends_at
                        )}
                      </p>
                    </div>
                  </div>
                )
              }
            )}
          </div>

        </div>

        {/* ================================================= */}
        {/* REFERRAL EARNINGS */}
        {/* ================================================= */}

        <div className="mb-10 overflow-hidden rounded-3xl bg-zinc-900">

          <div className="border-b border-zinc-800 p-5 sm:p-6">
            <h2 className="text-xl font-bold sm:text-2xl">
              Referral Earnings History
            </h2>
          </div>

          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full">
              <thead className="bg-zinc-800">
                <tr>
                  <th className="p-4 text-left">
                    Date
                  </th>
                  <th className="p-4 text-left">
                    Referrer
                  </th>
                  <th className="p-4 text-left">
                    Referred User
                  </th>
                  <th className="p-4 text-left">
                    Source Deposit
                  </th>
                  <th className="p-4 text-left">
                    Level
                  </th>
                  <th className="p-4 text-left">
                    Commission
                  </th>
                  <th className="p-4 text-left">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {referralEarnings?.map(
                  (earning) => {
                    const referrer =
                      profileMap.get(
                        earning.referrer_id
                      )

                    const referredUser =
                      profileMap.get(
                        earning.user_id
                      )

                    return (
                      <tr
                        key={
                          earning.id
                        }
                        className="border-t border-zinc-800"
                      >
                        <td className="p-4 text-sm text-zinc-400">
                          {formatDate(
                            earning.created_at
                          )}
                        </td>

                        <td className="p-4">
                          <p className="font-medium">
                            {referrer?.username ||
                              'No username'}
                          </p>

                          <p className="max-w-[180px] break-all text-xs text-zinc-500">
                            {referrer?.email ||
                              'No email'}
                          </p>
                        </td>

                        <td className="p-4">
                          <p className="font-medium">
                            {referredUser?.username ||
                              'No username'}
                          </p>

                          <p className="max-w-[180px] break-all text-xs text-zinc-500">
                            {referredUser?.email ||
                              'No email'}
                          </p>
                        </td>

                        <td className="p-4">
                          {formatMoney(
                            earning.source_amount
                          )}
                        </td>

                        <td className="p-4">
                          Level{' '}
                          {earning.level}
                          <p className="text-xs text-zinc-500">
                            {
                              earning.commission_percent
                            }
                            %
                          </p>
                        </td>

                        <td className="p-4 font-semibold text-yellow-400">
                          {formatMoney(
                            earning.commission_amount
                          )}
                        </td>

                        <td className="p-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                              earning.status
                            )}`}
                          >
                            {earning.status}
                          </span>
                        </td>
                      </tr>
                    )
                  }
                )}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 p-4 lg:hidden">
            {referralEarnings?.map(
              (earning) => {
                const referrer =
                  profileMap.get(
                    earning.referrer_id
                  )

                const referredUser =
                  profileMap.get(
                    earning.user_id
                  )

                return (
                  <div
                    key={
                      earning.id
                    }
                    className="rounded-2xl border border-zinc-800 bg-black/20 p-4"
                  >
                    <div className="flex justify-between gap-3">
                      <div>
                        <p className="font-medium">
                          {referrer?.username ||
                            'No username'}
                        </p>

                        <p className="text-xs text-zinc-500">
                          Referrer
                        </p>
                      </div>

                      <span
                        className={`h-fit rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                          earning.status
                        )}`}
                      >
                        {earning.status}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-zinc-600">
                          Referred User
                        </p>

                        <p>
                          {referredUser?.username ||
                            'No username'}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-zinc-600">
                          Level
                        </p>

                        <p>
                          {earning.level}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-zinc-600">
                          Source Amount
                        </p>

                        <p>
                          {formatMoney(
                            earning.source_amount
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-zinc-600">
                          Commission
                        </p>

                        <p className="font-semibold text-yellow-400">
                          {formatMoney(
                            earning.commission_amount
                          )}
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 text-xs text-zinc-500">
                      {formatDate(
                        earning.created_at
                      )}
                    </p>
                  </div>
                )
              }
            )}
          </div>

        </div>

        {/* ================================================= */}
        {/* TRANSACTIONS */}
        {/* ================================================= */}

        <div className="mb-10 overflow-hidden rounded-3xl bg-zinc-900">

          <div className="border-b border-zinc-800 p-5 sm:p-6">
            <h2 className="text-xl font-bold sm:text-2xl">
              Transactions
            </h2>
          </div>

          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full">
              <thead className="bg-zinc-800">
                <tr>
                  <th className="p-4 text-left">
                    Date
                  </th>
                  <th className="p-4 text-left">
                    User
                  </th>
                  <th className="p-4 text-left">
                    Type
                  </th>
                  <th className="p-4 text-left">
                    Amount
                  </th>
                  <th className="p-4 text-left">
                    Description
                  </th>
                  <th className="p-4 text-left">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {transactions?.map(
                  (tx) => {
                    const profile =
                      profileMap.get(
                        tx.user_id
                      )

                    return (
                      <tr
                        key={tx.id}
                        className="border-t border-zinc-800"
                      >
                        <td className="p-4 text-sm text-zinc-400">
                          {formatDate(
                            tx.created_at
                          )}
                        </td>

                        <td className="p-4">
                          <p className="font-medium text-white">
                            {profile?.username ||
                              'No username'}
                          </p>

                          <p className="max-w-[220px] break-all text-xs text-zinc-500">
                            {profile?.email ||
                              'No email'}
                          </p>
                        </td>

                        <td className="p-4 font-medium">
                          {tx.type}
                        </td>

                        <td className="p-4">
                          {formatMoney(
                            tx.amount
                          )}
                        </td>

                        <td className="max-w-[350px] p-4 text-sm text-zinc-400">
                          {tx.description ||
                            'N/A'}
                        </td>

                        <td className="p-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                              tx.status
                            )}`}
                          >
                            {tx.status ||
                              'N/A'}
                          </span>
                        </td>
                      </tr>
                    )
                  }
                )}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 p-4 lg:hidden">
            {transactions?.map(
              (tx) => {
                const profile =
                  profileMap.get(
                    tx.user_id
                  )

                return (
                  <div
                    key={tx.id}
                    className="rounded-2xl border border-zinc-800 bg-black/20 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">
                          {tx.type}
                        </p>

                        <p className="mt-1 text-xs text-zinc-500">
                          {formatDate(
                            tx.created_at
                          )}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                          tx.status
                        )}`}
                      >
                        {tx.status ||
                          'N/A'}
                      </span>
                    </div>

                    <p className="mt-4 text-lg font-bold text-yellow-400">
                      {formatMoney(
                        tx.amount
                      )}
                    </p>

                    <div className="mt-3">
                      <p className="font-medium">
                        {profile?.username ||
                          'No username'}
                      </p>

                      <p className="break-all text-xs text-zinc-500">
                        {profile?.email ||
                          'No email'}
                      </p>
                    </div>

                    {tx.description && (
                      <p className="mt-3 text-sm text-zinc-400">
                        {tx.description}
                      </p>
                    )}
                  </div>
                )
              }
            )}
          </div>

        </div>

        {/* ================================================= */}
        {/* SHARED PLANS */}
        {/* ================================================= */}

        <div className="overflow-hidden rounded-3xl bg-zinc-900">

          <div className="border-b border-zinc-800 p-5 sm:p-6">
            <h2 className="text-xl font-bold sm:text-2xl">
              Shared Plans
            </h2>
          </div>

          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full">
              <thead className="bg-zinc-800">
                <tr>
                  <th className="p-4 text-left">
                    User
                  </th>
                  <th className="p-4 text-left">
                    Plan
                  </th>
                  <th className="p-4 text-left">
                    Amount
                  </th>
                  <th className="p-4 text-left">
                    Profit
                  </th>
                  <th className="p-4 text-left">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {sharedPlans?.map(
                  (plan) => {
                    const profile =
                      profileMap.get(
                        plan.user_id ??
                          ''
                      )

                    return (
                      <tr
                        key={
                          plan.id
                        }
                        className="border-t border-zinc-800"
                      >
                        <td className="p-4">
                          <p className="font-medium text-white">
                            {profile?.username ||
                              'No username'}
                          </p>

                          <p className="max-w-[220px] break-all text-xs text-zinc-500">
                            {profile?.email ||
                              'No email'}
                          </p>
                        </td>

                        <td className="p-4">
                          {plan.title}
                        </td>

                        <td className="p-4">
                          {formatMoney(
                            plan.amount
                          )}
                        </td>

                        <td className="p-4 text-cyan-400">
                          {formatMoney(
                            plan.total_profit_generated
                          )}
                        </td>

                        <td className="p-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                              plan.status
                            )}`}
                          >
                            {plan.status ||
                              'N/A'}
                          </span>
                        </td>
                      </tr>
                    )
                  }
                )}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 p-4 lg:hidden">
            {sharedPlans?.map(
              (plan) => {
                const profile =
                  profileMap.get(
                    plan.user_id ??
                      ''
                  )

                return (
                  <div
                    key={
                      plan.id
                    }
                    className="rounded-2xl border border-zinc-800 bg-black/20 p-4"
                  >
                    <div className="flex justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white">
                          {plan.title}
                        </p>

                        <p className="mt-1 text-sm text-zinc-400">
                          {profile?.username ||
                            'No username'}
                        </p>
                      </div>

                      <span
                        className={`h-fit rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                          plan.status
                        )}`}
                      >
                        {plan.status ||
                          'N/A'}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-zinc-600">
                          Amount
                        </p>

                        <p>
                          {formatMoney(
                            plan.amount
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-zinc-600">
                          Profit
                        </p>

                        <p className="text-cyan-400">
                          {formatMoney(
                            plan.total_profit_generated
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              }
            )}
          </div>

        </div>

      </div>
    </div>
  )
}