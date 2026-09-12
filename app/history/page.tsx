import { createClient } from '../../lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

interface HistoryEntry {
  id: string;
  type: string;
  amount: number | null;
  description: string | null;
  status: string | null;
  created_at: string | null;
  currency: string | null;
}

export default async function AllHistoryPage() {
  const supabase = await createClient();

  // GET USER
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // FETCH ALL TRANSACTIONS
  const {
    data: transactions,
    error: transactionError,
  } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (transactionError) {
    console.error(
      'History transaction fetch error:',
      transactionError
    );
  }

  // FETCH REFERRAL COMMISSIONS
  const {
    data: referralEarnings,
    error: referralError,
  } = await supabase
    .from('referral_earnings')
    .select('*')
    .eq('referrer_id', user.id)
    .order('created_at', { ascending: false });

  if (referralError) {
    console.error(
      'History referral earnings fetch error:',
      referralError
    );
  }

  const transactionEntries: HistoryEntry[] = (
    transactions ?? []
  ).map((tx) => ({
    id: tx.id,
    type: tx.type,
    amount: tx.amount,
    description: tx.description,
    status: tx.status,
    created_at: tx.created_at,
    currency: tx.currency,
  }));

  const referralEntries: HistoryEntry[] = (
    referralEarnings ?? []
  ).map((earning) => ({
    id: `referral-${earning.id}`,
    type: 'referral_commission',
    amount: earning.commission_amount,
    description: `Level ${earning.level} referral commission`,
    status: earning.status,
    created_at: earning.created_at,
    currency: 'USD',
  }));

  // COMBINE AND SORT ALL HISTORY
  const history: HistoryEntry[] = [
    ...transactionEntries,
    ...referralEntries,
  ].sort(
    (a, b) =>
      new Date(b.created_at ?? 0).getTime() -
      new Date(a.created_at ?? 0).getTime()
  );

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-10">
      <div className="max-w-6xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <h1 className="text-2xl md:text-4xl font-semibold">
            All History
          </h1>

          <Link
            href="/dashboard"
            className="text-yellow-400 hover:underline"
          >
            ← Dashboard
          </Link>
        </div>

        <HistoryTable data={history} />

      </div>
    </div>
  );
}

function HistoryTable({
  data,
}: {
  data: HistoryEntry[];
}) {
  const safeData = Array.isArray(data) ? data : [];

  if (safeData.length === 0) {
    return (
      <p className="text-zinc-500">
        No activity yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-3xl border border-zinc-800 bg-zinc-900">
      <table className="min-w-[850px] w-full">

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
          {safeData.map((tx) => {
            const isNegative =
              tx.type === 'withdrawal' ||
              tx.type === 'debit' ||
              tx.type === 'shared_plan';

            const isReferralCommission =
              tx.type === 'referral_commission';

            const amount =
              isReferralCommission
                ? `+$${Number(tx.amount ?? 0).toFixed(2)}`
                : tx.type === 'mining' ||
                    tx.currency === 'GOLD'
                  ? `${isNegative ? '-' : '+'}${tx.amount ?? 0}G`
                  : `${isNegative ? '-' : '+'}$${tx.amount ?? 0}`;

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
                    : isReferralCommission
                      ? 'text-emerald-400'
                      : tx.currency === 'GOLD'
                        ? 'text-yellow-400'
                        : tx.type === 'mining'
                          ? 'text-yellow-400'
                          : tx.type === 'shared_plan'
                            ? 'text-purple-400'
                            : tx.type === 'roi'
                              ? 'text-cyan-400'
                              : 'text-blue-400';

            return (
              <tr
                key={tx.id}
                className="hover:bg-zinc-800/50"
              >
                <td className="p-5 text-sm text-zinc-400">
                  {tx.created_at
                    ? new Date(
                        tx.created_at
                      ).toLocaleString()
                    : '-'}
                </td>

                <td
                  className={`p-5 font-medium capitalize ${typeColor}`}
                >
                  {isReferralCommission
                    ? 'Referral Commission'
                    : tx.type.replace(/_/g, ' ')}
                </td>

                <td
                  className={`p-5 font-bold ${
                    isNegative
                      ? 'text-red-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {amount}
                </td>

                <td className="p-5">
                  <span
                    className={`px-4 py-1 text-xs rounded-full ${statusColor}`}
                  >
                    {tx.status || 'unknown'}
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