import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function LoginHistoryPage({
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

  const { data: history } = await supabase
    .from('login_history')
    .select('*')
    .eq('user_id', Id)
    .order('created_at', {
      ascending: false,
    })

  return (
    <div className="min-h-screen bg-black text-white p-8">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          Login History
        </h1>

        <div className="bg-zinc-900 rounded-3xl overflow-hidden">

          <table className="w-full">

            <thead className="bg-zinc-800">
              <tr>
                <th className="p-5 text-left">
                  IP Address
                </th>

                <th className="p-5 text-left">
                  Device
                </th>

                <th className="p-5 text-left">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>

              {history?.length ? (
                history.map((row: any) => (
                  <tr
                    key={row.id}
                    className="border-t border-zinc-800"
                  >
                    <td className="p-5">
                      {row.ip_address}
                    </td>

                    <td className="p-5">
                      {row.device}
                    </td>

                    <td className="p-5">
                      {new Date(
                        row.created_at
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
                    No login history found
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