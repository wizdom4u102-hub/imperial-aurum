import { supabaseAdmin } from '@/lib/supabase/admin'
import { requireAdminPage } from '@/lib/admin'
import DepositActions from './DepositActions'

export default async function ManageDeposits({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>
}) {
  // ✅ fix Next.js 16 searchParams
  const params = await searchParams

  // 🔐 protect route
  // await requireAdminPage()

  const supabase = supabaseAdmin

  const filter = params?.filter || 'all'

let query = supabase
  .from('deposits')
  .select('*')
  .order('created_at', { ascending: false })

if (filter === 'pending') {
  query = query.eq('status', 'pending')
}

if (filter === 'approved') {
  query = query.eq('status', 'approved')
}

const { data: deposits, error } = await query

console.log('DEPOSITS:', deposits)
console.log('DEPOSITS ERROR:', error)

if (error) {
  throw new Error(error.message)
}

  return (
    <div className="p-10">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold">Manage Deposits</h1>

          <div className="flex gap-4">
            <a href="/admin/deposits?filter=all" className="px-4 py-2 bg-zinc-800 rounded-xl text-sm">
              All
            </a>
            <a href="/admin/deposits?filter=pending" className="px-4 py-2 bg-zinc-800 rounded-xl text-sm">
              Pending
            </a>
            <a href="/admin/deposits?filter=approved" className="px-4 py-2 bg-zinc-800 rounded-xl text-sm">
              Approved
            </a>
          </div>
        </div>

        {/* LIST */}
        <div className="space-y-4">

          {deposits && deposits.length > 0 ? (
            deposits.map((deposit: any) => (
              <div key={deposit.id} className="bg-zinc-900 p-6 rounded-2xl">

                {/* AMOUNT */}
                <p className="text-xl font-bold text-yellow-400">
                  ${deposit.amount}
                </p>

                {/* METHOD */}
                <p className="text-zinc-400">
                  Method ID: {deposit.method_id || 'N/A'}
                </p>

                {/* STATUS */}
                <p className="text-sm text-zinc-500">
  Status: {deposit.status}
</p>

<p className="text-xs text-red-400">
  USER ID: {deposit.user_id}
</p>

<div className="flex gap-3 mt-4">
  <DepositActions id={deposit.id} />

  <a
    href={`/admin/users/${deposit.user_id}`}
    className="bg-blue-600 px-4 py-2 rounded-xl text-white text-sm"
  >
    View User
  </a>
</div>

              </div>
            ))
          ) : (
            <p className="text-zinc-400 text-center py-20">
              No deposits found
            </p>
          )}

        </div>

      </div>
    </div>
  )
}