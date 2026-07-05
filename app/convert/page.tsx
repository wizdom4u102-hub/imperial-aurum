import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function ConvertPage() {
  const supabase = await createClient()

  // ================= USER =================
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // ================= FETCH CONVERSIONS =================
  const { data: conversions, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .eq('type', 'convert')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('❌ Convert history error:', error)
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="max-w-6xl mx-auto">

        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-semibold">
              Convert History
            </h1>

            <p className="text-zinc-400 mt-2">
              Gold to Cash conversion history
            </p>
          </div>

          <Link
            href="/convert/new"
            className="bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-3 rounded-2xl font-semibold"
          >
            New Convert
          </Link>
        </div>

        {!conversions || conversions.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 text-center">
            <p className="text-zinc-500">
              No conversion history yet.
            </p>
          </div>
        ) : (
          <div className="bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800">
            <table className="w-full">

              <thead className="bg-zinc-800">
                <tr>
                  <th className="p-5 text-left">Date</th>
                  <th className="p-5 text-left">Gold Used</th>
                  <th className="p-5 text-left">Cash Received</th>
                  <th className="p-5 text-left">Status</th>
                  <th className="p-5 text-left">Details</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-800">
                {conversions.map((tx: any) => (
                  <tr key={tx.id} className="hover:bg-zinc-800/50">

                    <td className="p-5 text-sm text-zinc-400">
                      {new Date(tx.created_at).toLocaleString()}
                    </td>

                    <td className="p-5 font-bold text-yellow-400">
                      {Number(tx.amount * 500 || 0).toFixed(2)} GOLD
                    </td>

                    <td className="p-5 font-bold text-emerald-400">
                      ${Number(tx.amount || 0).toFixed(2)}
                    </td>

                    <td className="p-5">
                      <span className="px-4 py-1 text-xs rounded-full bg-emerald-500/20 text-emerald-400">
                        completed
                      </span>
                    </td>

                    <td className="p-5 text-zinc-400 text-sm">
                      {tx.description || 'Gold converted to cash'}
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}

      </div>
    </div>
  )
}