export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

import { createClient as createAdminClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { requireAdminPage } from '@/lib/admin'

const adminDb = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function AdminDashboard() {
  try {
    console.log('================ ADMIN DASHBOARD ================')

const { supabase } =
  await requireAdminPage()

    console.log('ADMIN PAGE STARTED')

    const { data: allDeposits } =
  await supabase
    .from('deposits')
    .select('*')

console.log(
  'TOTAL DEPOSITS FOUND:',
  allDeposits?.length
)

    // ================= USERS =================
    const {
      count: totalUsers,
      error: usersError,
    } = await supabase
      .from('profiles')
      .select('*', {
        count: 'exact',
        head: true,
      })

      console.log('TOTAL USERS:', totalUsers)

    if (usersError) {
      console.error(
        'USERS ERROR:',
        JSON.stringify(usersError, null, 2)
      )
    }

    // ================= BALANCES =================
    const {
      data: balances,
      error: balancesError,
    } = await supabase
      .from('balances')
      .select('*')

      console.log(
  'BALANCES ROWS:',
  balances?.length
)

    if (balancesError) {
      console.error(
        'BALANCES ERROR:',
        JSON.stringify(balancesError, null, 2)
      )
    }

    const totalCash =
      balances?.reduce(
        (sum, item) =>
          sum + Number(item.cash || 0),
        0
      ) || 0

    const totalGold =
      balances?.reduce(
        (sum, item) =>
          sum + Number(item.gold || 0),
        0
      ) || 0

    const totalShares =
      balances?.reduce(
        (sum, item) =>
          sum + Number(item.shares || 0),
        0
      ) || 0

      // ================= DEPOSITS =================

const { data: deposits } = await adminDb
  .from('deposits')
  .select('amount,status')

const totalDeposits =
  deposits
    ?.filter(
      d =>
        d.status === 'completed' ||
        d.status === 'approve'
    )
    .reduce(
      (sum, d) =>
        sum + Number(d.amount || 0),
      0
    ) || 0

// ================= WITHDRAWALS =================

const { data: withdrawals } = await adminDb
  .from('withdrawals')
  .select('amount,status')

const totalWithdrawals =
  withdrawals
    ?.filter(
      w =>
        w.status === 'approved'
    )
    .reduce(
      (sum, w) =>
        sum + Number(w.amount || 0),
      0
    ) || 0

// ================= SHARED PLANS =================

const { data: plans } = await adminDb
  .from('shared_plans')
  .select(
    'amount,total_profit_generated'
  )

const totalInvested =
  plans?.reduce(
    (sum, p) =>
      sum + Number(p.amount || 0),
    0
  ) || 0

const totalPlanProfit =
  plans?.reduce(
    (sum, p) =>
      sum +
      Number(
        p.total_profit_generated || 0
      ),
    0
  ) || 0

// ================= MINING =================

const { data: mining } = await adminDb
  .from('transactions')
  .select('amount')
  .eq('type', 'mining')

const totalMining =
  mining?.reduce(
    (sum, m) =>
      sum + Number(m.amount || 0),
    0
  ) || 0

// ================= ROI =================

const { data: roi } = await adminDb
  .from('transactions')
  .select('amount')
  .eq('type', 'roi')

const totalROI =
  roi?.reduce(
    (sum, r) =>
      sum + Number(r.amount || 0),
    0
  ) || 0

// ================= REFERRALS =================

const { data: referrals } = await adminDb
  .from('referral_earnings')
  .select('commission_amount')

const totalReferral =
  referrals?.reduce(
    (sum, r) =>
      sum +
      Number(
        r.commission_amount || 0
      ),
    0
  ) || 0

    return (
      <div className="min-h-screen bg-black text-white p-10">
        <div className="max-w-7xl mx-auto">

          {/* HEADER */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-yellow-400">
              Admin Dashboard
            </h1>

            <p className="text-zinc-400 mt-2">
              Imperial Aurum Control Center
            </p>
          </div>

          {/* PLATFORM STATS */}

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

  <div className="bg-zinc-900 rounded-3xl p-8">
    <p className="text-zinc-400 mb-2">
      Total Deposits
    </p>

    <h2 className="text-4xl font-bold text-emerald-400">
      ${totalDeposits.toFixed(2)}
    </h2>
  </div>

  <div className="bg-zinc-900 rounded-3xl p-8">
    <p className="text-zinc-400 mb-2">
      Total Withdrawals
    </p>

    <h2 className="text-4xl font-bold text-red-400">
      ${totalWithdrawals.toFixed(2)}
    </h2>
  </div>

  <div className="bg-zinc-900 rounded-3xl p-8">
    <p className="text-zinc-400 mb-2">
      ROI Paid
    </p>

    <h2 className="text-4xl font-bold text-cyan-400">
      ${totalROI.toFixed(2)}
    </h2>
  </div>

  <div className="bg-zinc-900 rounded-3xl p-8">
    <p className="text-zinc-400 mb-2">
      Mining Rewards
    </p>

    <h2 className="text-4xl font-bold text-yellow-400">
      ${totalMining.toFixed(2)}
    </h2>
  </div>

  <div className="bg-zinc-900 rounded-3xl p-8">
    <p className="text-zinc-400 mb-2">
      Shared Plans Invested
    </p>

    <h2 className="text-4xl font-bold text-blue-400">
      ${totalInvested.toFixed(2)}
    </h2>
  </div>

  <div className="bg-zinc-900 rounded-3xl p-8">
    <p className="text-zinc-400 mb-2">
      Plan Profit Generated
    </p>

    <h2 className="text-4xl font-bold text-green-400">
      ${totalPlanProfit.toFixed(2)}
    </h2>
  </div>

  <div className="bg-zinc-900 rounded-3xl p-8">
    <p className="text-zinc-400 mb-2">
      Referral Earnings
    </p>

    <h2 className="text-4xl font-bold text-yellow-400">
      ${totalReferral.toFixed(2)}
    </h2>
  </div>

  <div className="bg-zinc-900 rounded-3xl p-8">
    <p className="text-zinc-400 mb-2">
      Total Users
    </p>

    <h2 className="text-4xl font-bold">
      {totalUsers || 0}
    </h2>
  </div>

</div>

          {/* ACTIONS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            <Link
              href="/admin/deposits"
              className="bg-zinc-900 p-8 rounded-3xl hover:bg-zinc-800"
            >
              <h3 className="text-xl font-bold mb-2">
                Deposits
              </h3>

              <p className="text-zinc-400">
                Manage deposits
              </p>
            </Link>

            <Link
              href="/admin/withdrawals"
              className="bg-zinc-900 p-8 rounded-3xl hover:bg-zinc-800"
            >
              <h3 className="text-xl font-bold mb-2">
                Withdrawals
              </h3>

              <p className="text-zinc-400">
                Manage withdrawals
              </p>
            </Link>

            <Link
              href="/admin/users"
              className="bg-zinc-900 p-8 rounded-3xl hover:bg-zinc-800"
            >
              <h3 className="text-xl font-bold mb-2">
                Users
              </h3>

              <p className="text-zinc-400">
                View users
              </p>
            </Link>

            <Link
              href="/admin/transactions"
              className="bg-zinc-900 p-8 rounded-3xl hover:bg-zinc-800"
            >
              <h3 className="text-xl font-bold mb-2">
                Transactions
              </h3>

              <p className="text-zinc-400">
                Transaction history
              </p>
            </Link>
          </div>

        </div>
      </div>
    )

  } catch (err: any) {

  console.error('================ ERROR =================')
  console.error(err)
  console.error('MESSAGE:', err?.message)
  console.error('STACK:', err?.stack)

  return (
    <div className="min-h-screen bg-black text-red-500 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">
        Admin Dashboard Error
      </h1>

      <p className="mt-4">
        {err?.message || 'Unknown error'}
      </p>
    </div>
  )
}
}