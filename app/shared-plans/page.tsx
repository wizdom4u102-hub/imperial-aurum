import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function SharedPlansPage() {

  // use normal client ONLY for auth
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // use admin AFTER auth succeeds
  const admin = supabaseAdmin

  // ================= BALANCE =================
  const { data: balance } =
    await admin
      .from('balances')
      .select('*')
      .eq('user_id', user.id)
      .single()

  // ================= SHARED PLANS =================
  const {
  data: plans,
  error: plansError
} =
  await admin
    .from('shared_plans')
    .select('*')
    .eq('user_id', user.id)
    .order(
      'created_at',
      { ascending:false }
    )

// ================= ROI PROFITS =================
const {
  data: profits,
  error: profitsError,
} = await supabase
  .from('shared_plan_profits')
  .select(`
    id,
    user_id,
    shared_plan_id,
    amount,
    roi_percent,
    credited,
    created_at
  `)
  .eq('user_id', user.id)
  .order('created_at', {
    ascending: false,
  })

console.log(
  'ROI PROFITS:',
  profits
)

console.log(
  'ROI PROFITS ERROR:',
  profitsError
)

const safePlans = Array.isArray(plans)
  ? plans
  : []

const safeProfits = Array.isArray(profits)
  ? profits
  : []


// ================= ACTIVE / COMPLETED =================
const activePlans =
  safePlans.filter(
    (item:any)=>
      item.status==="active"
  )

const completedPlans =
  safePlans.filter(
    (item:any)=>
      item.status==="completed"
  )

// ================= TOTAL LOCKED =================
const lockedShares =
  activePlans.reduce(
    (sum:number,item:any)=>
      sum + Number(item.amount||0),
    0
  )

// ================= TOTAL INVESTED =================
const totalInvested =
  activePlans.reduce(
    (sum:number,item:any)=>
      sum + Number(item.amount||0),
    0
  )

// ================= TOTAL ROI EARNED =================
const totalProfitEarned =
  safeProfits.reduce(
    (
      sum:number,
      item:any
    ) => {

      const amount =
        Number(item?.amount || 0)

      return sum + amount

    },
    0
  )

console.log(
  'TOTAL ROI:',
  totalProfitEarned
)

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">

          <div>
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-yellow-500/20 bg-yellow-500/10 text-yellow-400 text-sm mb-5">
              Premium Investment Module
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Shared Plans
            </h1>

            <p className="text-zinc-400 mt-4 text-lg max-w-2xl">
              Invest your funds into premium company share plans and earn
              automated ROI directly into your cash balance.
            </p>
          </div>

          <Link
            href="/shared-plans/new"
            className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-black font-bold transition"
          >
            Buy Shares
          </Link>

        </div>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

          {/* CASH */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8">

            <p className="text-zinc-500 text-sm uppercase tracking-wider">
              Cash Balance
            </p>

            <h2 className="text-4xl font-bold mt-5 text-emerald-400">
              ${Number(balance?.cash || 0).toFixed(2)}
            </h2>

            <p className="text-zinc-500 mt-4 text-sm">
              Withdrawable funds available.
            </p>
          </div>

          {/* SHARES */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8">

            <p className="text-zinc-500 text-sm uppercase tracking-wider">
              Locked Shares
            </p>

            <h2 className="text-4xl font-bold mt-5 text-yellow-400">
              ${lockedShares.toFixed(2)}
            </h2>

            <p className="text-zinc-500 mt-4 text-sm">
              Investment capital currently active.
            </p>
          </div>

          {/* ROI */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8">

            <p className="text-zinc-500 text-sm uppercase tracking-wider">
              Total ROI Earned
            </p>

            <h2 className="text-4xl font-bold mt-5 text-blue-400">
              ${totalProfitEarned.toFixed(2)}
            </h2>

            <p className="text-zinc-500 mt-4 text-sm">
              Automatically credited profits.
            </p>
          </div>

          {/* ACTIVE */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8">

            <p className="text-zinc-500 text-sm uppercase tracking-wider">
              Active Investments
            </p>

            <h2 className="text-4xl font-bold mt-5 text-purple-400">
              {activePlans.length}
            </h2>

            <p className="text-zinc-500 mt-4 text-sm">
              Running investment plans.
            </p>
          </div>

        </div>

        {/* ================= HERO SECTION ================= */}
        <div className="relative overflow-hidden bg-gradient-to-br from-yellow-900/30 via-zinc-900 to-black border border-yellow-500/20 rounded-[2.5rem] p-10 mb-10">

          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/10 blur-3xl rounded-full" />

          <div className="relative z-10 max-w-4xl">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-500/20 bg-yellow-500/10 text-yellow-400 text-sm mb-6">
              Imperial Aurum Investment Program
            </div>

            <h2 className="text-4xl md:text-5xl font-bold leading-tight text-white mb-6">
              Build passive income through automated investment profits.
            </h2>

            <p className="text-zinc-300 text-lg leading-relaxed mb-8">
              Invest from your cash balance into premium company share plans.
              Your investment capital becomes securely locked while ROI profits
              are credited automatically into your wallet balance.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-zinc-300 mb-10">

              <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5">
                • Minimum investment starts from $1000
              </div>

              <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5">
                • Automated ROI crediting system
              </div>

              <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5">
                • Principal returned after maturity
              </div>

              <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5">
                • Full wallet accounting integration
              </div>

            </div>

            <Link
              href="/shared-plans/new"
              className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-black font-bold transition"
            >
              Start Investing
            </Link>

          </div>
        </div>

        {/* ================= ACTIVE INVESTMENTS ================= */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] overflow-hidden mb-10">

          <div className="p-8 border-b border-zinc-800">

            <h3 className="text-2xl font-bold text-white">
              Active Investments
            </h3>

            <p className="text-zinc-500 mt-3">
              Your currently running investment plans and ROI performance.
            </p>

          </div>

          {plansError ? (
            <div className="p-10 text-red-400">
              Failed to load investment plans.
            </div>
          ) : activePlans.length === 0 ? (
            <div className="p-14 text-center">

              <div className="text-6xl mb-5">
                📈
              </div>

              <h4 className="text-2xl font-bold text-white mb-4">
                No active investments
              </h4>

              <p className="text-zinc-500 max-w-xl mx-auto mb-8">
                Start your first investment plan and begin earning automated
                profits directly into your cash balance.
              </p>

              <Link
                href="/shared-plans/new"
                className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-black font-bold transition"
              >
                Buy Shares
              </Link>

            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-zinc-800 text-zinc-300">
                  <tr>
                    <th className="p-6 text-left">Investment</th>
                    <th className="p-6 text-left">ROI</th>
                    <th className="p-6 text-left">Profit Generated</th>
                    <th className="p-6 text-left">Progress</th>
                    <th className="p-6 text-left">Status</th>
                  </tr>
                </thead>

                <tbody>

                  {activePlans.map((plan: any) => (
                    <tr
                      key={plan.id}
                      className="border-t border-zinc-800 hover:bg-zinc-800/30 transition"
                    >

                      <td className="p-6">

                        <div className="font-bold text-yellow-400 text-xl">
                          ${Number(plan.amount || 0).toFixed(2)}
                        </div>

                        <div className="text-zinc-500 text-sm mt-2">
                          {new Date(
                            plan.created_at
                          ).toLocaleString()}
                        </div>

                      </td>

                      <td className="p-6">

                        <div className="text-emerald-400 font-bold">
                          {Number(plan.daily_roi || 0)}% Daily
                        </div>

                      </td>

                      <td className="p-6">

                        <div className="text-blue-400 font-bold">
                          $
                          {Number(
                            plan.total_profit_generated || 0
                          ).toFixed(2)}
                        </div>

                      </td>

                      <td className="p-6">

                        <div className="text-zinc-300 font-semibold">
                          {Number(plan.days_completed || 0)} /{' '}
                          {Number(plan.duration_days || 0)} Days
                        </div>

                        <div className="w-full h-2 bg-zinc-800 rounded-full mt-3 overflow-hidden">
                          <div
                            className="h-full bg-yellow-400 rounded-full"
                            style={{
                              width: `${
                                (Number(plan.days_completed || 0) /
                                  Number(plan.duration_days || 1)) *
                                100
                              }%`,
                            }}
                          />
                        </div>

                      </td>

                      <td className="p-6">

                        <span className="px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold">
                          Active
                        </span>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>

        {/* ================= ROI HISTORY ================= */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] overflow-hidden mb-10">

          <div className="p-8 border-b border-zinc-800">

            <h3 className="text-2xl font-bold text-white">
              ROI Credit History
            </h3>

            <p className="text-zinc-500 mt-3">
              Automatically credited investment profits.
            </p>

          </div>

          {safeProfits.length === 0 ? (
            <div className="p-10 text-zinc-500">
              No ROI profits credited yet.
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-zinc-800 text-zinc-300">
                  <tr>
                    <th className="p-6 text-left">Date</th>
                    <th className="p-6 text-left">Amount</th>
                    <th className="p-6 text-left">ROI</th>
                    <th className="p-6 text-left">Status</th>
                  </tr>
                </thead>

                <tbody>

                  {safeProfits.map((profit: any) => (
                    <tr
                      key={profit.id}
                      className="border-t border-zinc-800 hover:bg-zinc-800/30 transition"
                    >

                      <td className="p-6 text-zinc-400">
                        {new Date(
                          profit.created_at
                        ).toLocaleString()}
                      </td>

                      <td className="p-6 text-emerald-400 font-bold">
                        ${Number(profit.amount || 0).toFixed(2)}
                      </td>

                      <td className="p-6 text-blue-400 font-semibold">
                        {Number(profit.roi_percent || 0)}%
                      </td>

                      <td className="p-6">

                        <span className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold">
                          Credited
                        </span>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>

        {/* ================= COMPLETED INVESTMENTS ================= */}
        {completedPlans.length > 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] overflow-hidden">

            <div className="p-8 border-b border-zinc-800">

              <h3 className="text-2xl font-bold text-white">
                Completed Investments
              </h3>

              <p className="text-zinc-500 mt-3">
                Successfully matured investment plans.
              </p>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-zinc-800 text-zinc-300">
                  <tr>
                    <th className="p-6 text-left">Investment</th>
                    <th className="p-6 text-left">Profit Earned</th>
                    <th className="p-6 text-left">Completed</th>
                    <th className="p-6 text-left">Status</th>
                  </tr>
                </thead>

                <tbody>

                  {completedPlans.map((plan: any) => (
                    <tr
                      key={plan.id}
                      className="border-t border-zinc-800"
                    >

                      <td className="p-6 text-yellow-400 font-bold">
                        ${Number(plan.amount || 0).toFixed(2)}
                      </td>

                      <td className="p-6 text-emerald-400 font-bold">
                        $
                        {Number(
                          plan.total_profit_generated || 0
                        ).toFixed(2)}
                      </td>

                      <td className="p-6 text-zinc-400">
                        {new Date(
                          plan.updated_at
                        ).toLocaleString()}
                      </td>

                      <td className="p-6">

                        <span className="px-4 py-2 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm font-semibold">
                          Completed
                        </span>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

          </div>
        )}

      </div>
    </div>
  )
}