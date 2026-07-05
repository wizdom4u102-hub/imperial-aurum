import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminReferralsPage({
  params,
}: {
  params: Promise<{ Id: string }>
}) {
  const { Id } = await params

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', Id)
    .single()

  const { data: referrals } = await supabase
    .from('referrals')
    .select('*')
    .eq('referrer_id', Id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-black text-white p-8">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold mb-2">
          Referral Network
        </h1>

        <p className="text-zinc-400 mb-8">
          {profile?.email}
        </p>

        <div className="bg-zinc-900 rounded-3xl overflow-hidden">

          <table className="w-full">

            <thead className="bg-zinc-800">
              <tr>
                <th className="p-5 text-left">
                  Referred User
                </th>

                <th className="p-5 text-left">
                  Level
                </th>

                <th className="p-5 text-left">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>

              {referrals?.length ? (
                referrals.map((ref: any) => (
                  <tr
                    key={ref.id}
                    className="border-t border-zinc-800"
                  >
                    <td className="p-5">
                      {ref.referred_id}
                    </td>

                    <td className="p-5">
                      {ref.level}
                    </td>

                    <td className="p-5">
                      {new Date(
                        ref.created_at
                      ).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="p-10 text-center text-zinc-500"
                  >
                    No referrals found
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  )
}