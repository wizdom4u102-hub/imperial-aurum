import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function ConvertHistoryPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .eq('type', 'convert')
    .order('created_at', {
      ascending: false,
    })

  if (error) {
    console.log(error)
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="max-w-6xl mx-auto">

        <div className="flex items-center justify-between mb-10">
          <h1 className="text-4xl font-bold">
            Convert History
          </h1>

          <Link
            href="/history"
            className="text-yellow-400 hover:underline"
          >
            ← Back
          </Link>
        </div>

        {!data || data.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 text-zinc-500">
            No convert history found.
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
                    Amount
                  </th>

                  <th className="p-5 text-left">
                    Status
                  </th>

                  <th className="p-5 text-left">
                    Description
                  </th>
                </tr>
              </thead>

              <tbody>

                {data.map((item: any) => (
                  <tr
                    key={item.id}
                    className="border-t border-zinc-800"
                  >

                    <td className="p-5 text-zinc-400">
                      {new Date(
                        item.created_at
                      ).toLocaleString()}
                    </td>

                    <td className="p-5 text-yellow-400 font-bold">
                      +${Number(
                        item.amount || 0
                      ).toFixed(2)}
                    </td>

                    <td className="p-5">
                      <span className="px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                        {item.status || 'completed'}
                      </span>
                    </td>

                    <td className="p-5 text-zinc-400">
                      {item.description || 'Gold conversion'}
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