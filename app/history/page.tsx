import { createClient } from '../../lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AllHistoryPage() {
  const supabase = await createClient();

  // ✅ GET USER
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ✅ CORRECT REDIRECT (NO return)
  if (!user) {
    redirect('/login');
  }

  // ✅ FETCH ALL TRANSACTIONS (THIS IS YOUR REAL HISTORY)
  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('History fetch error:', error);
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="max-w-6xl mx-auto">

        <div className="flex items-center justify-between mb-10">
          <h1 className="text-4xl font-semibold">All History</h1>
          <Link href="/dashboard" className="text-yellow-400 hover:underline">
            ← Dashboard
          </Link>
        </div>

        <HistoryTable data={transactions || []} />

      </div>
    </div>
  );
}

// ✅ TABLE COMPONENT
function HistoryTable({ data }: { data: any[] }) {
  const safeData = Array.isArray(data) ? data : [];

  if (safeData.length === 0) {
    return <p className="text-zinc-500">No activity yet.</p>;
  }

  return (
    <div className="bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800">
      <table className="w-full">

        <thead className="bg-zinc-800">
          <tr>
            <th className="p-5 text-left">Date</th>
            <th className="p-5 text-left">Type</th>
            <th className="p-5 text-left">Amount</th>
            <th className="p-5 text-left">Status</th>
            <th className="p-5 text-left">Details</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-zinc-800">
          {safeData.map((tx: any) => {
            const isNegative =
  tx.type === 'withdrawal' ||
  tx.type === 'debit' ||
  tx.type === 'shared_plan'

            const amount =
  tx.currency === 'GOLD'
    ? `${isNegative ? '-' : '+'}${tx.amount}G`
    : `${isNegative ? '-' : '+'}$${tx.amount}`;

            const statusColor =
              tx.status === 'completed'
                ? 'bg-emerald-500/20 text-emerald-400'
                : tx.status === 'pending'
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-zinc-700 text-zinc-300';

            const typeColor =
  tx.type === 'deposit'
    ? 'text-emerald-400'
    : tx.type === 'withdrawal'
    ? 'text-red-400'
    : tx.type === 'credit'
    ? 'text-emerald-400'
    : tx.currency === 'GOLD'
    ? 'text-yellow-400'
    : tx.type === 'mining'
    ? 'text-yellow-400'
    : tx.type === 'shared_plan'
    ? 'text-purple-400'
    : tx.type === 'roi'
    ? 'text-cyan-400'
    : 'text-blue-400'

            return (
              <tr key={tx.id} className="hover:bg-zinc-800/50">

                <td className="p-5 text-sm text-zinc-400">
                  {new Date(tx.created_at).toLocaleString()}
                </td>

                <td className={`p-5 font-medium capitalize ${typeColor}`}>
                  {tx.type}
                </td>

                <td className={`p-5 font-bold ${
                  isNegative ? 'text-red-400' : 'text-emerald-400'
                }`}>
                  {amount}
                </td>

                <td className="p-5">
                  <span className={`px-4 py-1 text-xs rounded-full ${statusColor}`}>
                    {tx.status}
                  </span>
                </td>

                <td className="p-5 text-zinc-400 text-sm">
                  {tx.description || '-'}
                </td>

              </tr>
            );
          })}
        </tbody>

      </table>
    </div>
  );
}