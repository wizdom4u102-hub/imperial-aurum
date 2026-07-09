import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function ReferralsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

// ✅ User is confirmed to be logged in
const { data: profile } = await supabase
  .from("profiles")
  .select("username")
  .eq("id", user.id)
  .single();

const referralLink = profile?.username
  ? `${process.env.NEXT_PUBLIC_APP_URL}/signup?ref=${profile.username}`
  : "";

  const {
    data: earnings,
    error,
  } = await supabase
    .from('referral_earnings')
    .select('*')
    .eq('referrer_id', user.id)
    .order('created_at', {
      ascending: false,
    })

  if (error) {
    console.error(error)
  }

  const totalCommission =
    earnings?.reduce(
      (sum, item) =>
        sum +
        Number(
          item.commission_amount || 0
        ),
      0
    ) || 0

  const totalReferrals =
    new Set(
      earnings?.map(
        (item) => item.user_id
      )
    ).size || 0

  return (
    <div className="min-h-screen bg-black text-white p-6">

      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">
            Referral Earnings
          </h1>

          <Link
            href="/dashboard"
            className="text-yellow-400 hover:underline"
          >
            ← Dashboard
          </Link>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-8">
  <h2 className="text-xl font-bold text-yellow-400 mb-4">
    Your Referral Link
  </h2>

  <div className="bg-zinc-800 rounded-xl p-4 break-all text-sm">
    {referralLink}
  </div>

  <div className="mt-4 flex flex-col sm:flex-row gap-3">
    <button
      onClick={() => navigator.clipboard.writeText(referralLink)}
      className="bg-yellow-500 hover:bg-yellow-400 text-black px-5 py-3 rounded-xl font-bold"
    >
      Copy Referral Link
    </button>

    <a
      href={`https://wa.me/?text=${encodeURIComponent(
        `Join Imperial Aurum Mining using my referral link:\n\n${referralLink}`
      )}`}
      target="_blank"
      className="bg-green-600 hover:bg-green-500 px-5 py-3 rounded-xl text-center font-bold"
    >
      Share on WhatsApp
    </a>
  </div>
</div>

        {/* SUMMARY */}

        <div className="grid md:grid-cols-3 gap-6 mb-8">

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <p className="text-zinc-400 text-sm">
              Total Referrals
            </p>

            <p className="text-4xl font-bold text-cyan-400 mt-2">
              {totalReferrals}
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <p className="text-zinc-400 text-sm">
              Total Commission
            </p>

            <p className="text-4xl font-bold text-emerald-400 mt-2">
              $
              {totalCommission.toFixed(
                2
              )}
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <p className="text-zinc-400 text-sm">
              Referral Records
            </p>

            <p className="text-4xl font-bold text-yellow-400 mt-2">
              {earnings?.length || 0}
            </p>
          </div>

        </div>

        {/* TABLE */}

        {!earnings ||
        earnings.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 text-zinc-500">
            No referral commissions earned yet.
          </div>
        ) : (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">

            <table className="w-full">

              <thead className="bg-zinc-800">
                <tr>

                  <th className="p-5 text-left">
                    Date
                  </th>

                  <th className="p-5 text-left">
                    Level
                  </th>

                  <th className="p-5 text-left">
                    Deposit
                  </th>

                  <th className="p-5 text-left">
                    %
                  </th>

                  <th className="p-5 text-left">
                    Commission
                  </th>

                  <th className="p-5 text-left">
                    Status
                  </th>

                </tr>
              </thead>

              <tbody>

                {earnings.map(
                  (item: any) => (
                    <tr
                      key={item.id}
                      className="border-t border-zinc-800"
                    >

                      <td className="p-5 text-zinc-400">
                        {new Date(
                          item.created_at
                        ).toLocaleString()}
                      </td>

                      <td className="p-5 text-cyan-400 font-bold">
                        Level {item.level}
                      </td>

                      <td className="p-5">
                        $
                        {Number(
                          item.source_amount || 0
                        ).toFixed(2)}
                      </td>

                      <td className="p-5 text-yellow-400 font-bold">
                        {
                          item.commission_percent
                        }
                        %
                      </td>

                      <td className="p-5 text-emerald-400 font-bold">
                        $
                        {Number(
                          item.commission_amount || 0
                        ).toFixed(2)}
                      </td>

                      <td className="p-5">
                        <span className="px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                          {
                            item.status ||
                            'paid'
                          }
                        </span>
                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  )
}