export const dynamic = 'force-dynamic'
export const revalidate = 0

import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { requireAdminPage } from '@/lib/admin'
import { createClient as createAdminClient } from '@supabase/supabase-js'

const adminDb = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function AdminHistoryPage() {
  await requireAdminPage()


  const { data: transactions } = await adminDb
  .from('transactions')
  .select('*')
  .order('created_at', {
    ascending: false,
  })

  const { data: deposits } = await adminDb
  .from('deposits')
  .select('amount,status')

const { data: withdrawals } = await adminDb
  .from('withdrawals')
  .select('amount,status')

const { data: sharedPlans } = await adminDb
  .from('shared_plans')
  .select('*')

const { data: miningTx } = await adminDb
  .from('transactions')
  .select('amount,type')
  .eq('type', 'mining')

const { data: roiTx } = await adminDb
  .from('transactions')
  .select('amount,type')
  .eq('type', 'roi')

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

const totalWithdrawals =
  withdrawals
    ?.filter(
      w => w.status === 'approved'
    )
    .reduce(
      (sum, w) =>
        sum + Number(w.amount || 0),
      0
    ) || 0

const totalROI =
  roiTx?.reduce(
    (sum, tx) =>
      sum + Number(tx.amount || 0),
    0
  ) || 0

  const totalPlanProfit =
  sharedPlans?.reduce(
    (sum, item) =>
      sum +
      Number(
        item.total_profit_generated || 0
      ),
    0
  ) || 0

const totalMining =
  miningTx?.reduce(
    (sum, item) =>
      sum + Number(item.amount || 0),
    0
  ) || 0

const totalInvested =
  sharedPlans?.reduce(
    (sum, item) =>
      sum + Number(item.amount || 0),
    0
  ) || 0

  const { data: referralEarnings } = await adminDb
  .from('referral_earnings')
  .select('commission_amount')

const totalReferral =
  referralEarnings?.reduce(
    (sum, item) =>
      sum +
      Number(item.commission_amount || 0),
    0
  ) || 0

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="flex justify-between items-center mb-10">

          <div>
            <h1 className="text-4xl font-bold text-yellow-400">
              Admin History
            </h1>

            <p className="text-zinc-500 mt-2">
              Complete platform activity
            </p>
          </div>

          <Link
            href="/admin"
            className="text-yellow-400 hover:underline"
          >
            ← Dashboard
          </Link>

        </div>

        {/* STATS */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

          <div className="bg-zinc-900 rounded-3xl p-6">
            <p className="text-zinc-400">
              Deposits
            </p>

            <h2 className="text-3xl font-bold text-emerald-400 mt-2">
              $
              {totalDeposits.toFixed(
                2
              )}
            </h2>
          </div>

          <div className="bg-zinc-900 rounded-3xl p-6">
            <p className="text-zinc-400">
              Withdrawals
            </p>

            <h2 className="text-3xl font-bold text-red-400 mt-2">
              $
              {totalWithdrawals.toFixed(
                2
              )}
            </h2>
          </div>

          <div className="bg-zinc-900 rounded-3xl p-6">
            <p className="text-zinc-400">
              ROI Paid
            </p>

            <h2 className="text-3xl font-bold text-cyan-400 mt-2">
              $
              {totalROI.toFixed(2)}
            </h2>
          </div>

          <div className="bg-zinc-900 rounded-3xl p-6">
            <p className="text-zinc-400">
               Plan Profit Generated
            </p>

             <h2 className="text-3xl font-bold text-green-400 mt-2">
              $
             {totalPlanProfit.toFixed(2)}
              </h2>
          </div>
          <div className="bg-zinc-900 rounded-3xl p-6">
  <p className="text-zinc-400">
    Total Invested
  </p>

  <h2 className="text-3xl font-bold text-blue-400 mt-2">
    ${totalInvested.toFixed(2)}
  </h2>
</div>

          <div className="bg-zinc-900 rounded-3xl p-6">
            <p className="text-zinc-400">
              Referral Paid
            </p>

            <h2 className="text-3xl font-bold text-yellow-400 mt-2">
              $
              {totalReferral.toFixed(
                2
              )}
            </h2>
          </div>

          <div className="bg-zinc-900 rounded-3xl p-6">
  <p className="text-zinc-400">
    Mining Rewards
  </p>

  <h2 className="text-3xl font-bold text-yellow-400 mt-2">
    ${totalMining.toFixed(2)}
  </h2>
</div>

        </div>

        {/* TRANSACTIONS */}

        <div className="bg-zinc-900 rounded-3xl overflow-hidden mb-10">

          <div className="p-6 border-b border-zinc-800">
            <h2 className="text-2xl font-bold">
              Transactions
            </h2>
          </div>

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
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {transactions?.map(
                (tx: any) => (
                  <tr
                    key={tx.id}
                    className="border-t border-zinc-800"
                  >

                    <td className="p-4 text-zinc-400">
                      {new Date(
                        tx.created_at
                      ).toLocaleString()}
                    </td>

                    <td className="p-4 font-mono text-xs">
                      {tx.user_id}
                    </td>

                    <td className="p-4">
                      {tx.type}
                    </td>

                    <td className="p-4">
                      $
                      {Number(
                        tx.amount || 0
                      ).toFixed(2)}
                    </td>

                    <td className="p-4">
                      {tx.status}
                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>

        {/* SHARED PLANS */}

        <div className="bg-zinc-900 rounded-3xl overflow-hidden">

          <div className="p-6 border-b border-zinc-800">
            <h2 className="text-2xl font-bold">
              Shared Plans
            </h2>
          </div>

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
                (plan: any) => (
                  <tr
                    key={plan.id}
                    className="border-t border-zinc-800"
                  >

                    <td className="p-4 font-mono text-xs">
                      {plan.user_id}
                    </td>

                    <td className="p-4">
                      {plan.title}
                    </td>

                    <td className="p-4">
                      $
                      {Number(
                        plan.amount || 0
                      ).toFixed(2)}
                    </td>

                    <td className="p-4 text-cyan-400">
                      $
                      {Number(
                        plan.total_profit_generated || 0
                      ).toFixed(2)}
                    </td>

                    <td className="p-4">
                      {plan.status}
                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>

      </div>
    </div>
  )
}