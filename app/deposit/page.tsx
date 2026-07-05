import { createClient } from '../../lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AllDepositsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: deposits = [] } = await supabase
    .from('deposits')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between mb-10">
          <div>
            <h1 className="text-4xl font-semibold">All Deposits</h1>
            <p className="text-zinc-400">Your deposit records</p>
          </div>
          <Link href="/deposit/new" className="bg-yellow-500 text-black px-6 py-3 rounded-xl font-medium hover:bg-yellow-400 transition">
            + New Deposit
          </Link>
        </div>

        <div className="bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800">
          <table className="w-full">
            <thead className="bg-zinc-800">
              <tr>
                <th className="p-5 text-left">Date</th>
                <th className="p-5 text-left">Amount</th>
                <th className="p-5 text-left">Status</th>
                <th className="p-5 text-left">Method</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {(deposits || []).map((d: any) => (
                <tr key={d.id} className="hover:bg-zinc-800/50">
                  <td className="p-5 text-sm text-zinc-400">{new Date(d.created_at).toLocaleString()}</td>
                  <td className="p-5 font-medium">${d.amount}</td>
                  <td className="p-5">
                    <span className={`px-4 py-1 text-xs rounded-full ${d.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="p-5 text-zinc-400">{d.payment_method || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {(deposits?.length ?? 0) === 0 && (
          <p className="text-zinc-500 mt-8 text-center">No deposits yet. Make your first deposit above.</p>
        )}
      </div>
    </div>
  );
}