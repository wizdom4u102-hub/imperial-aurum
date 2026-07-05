'use client';

import { useEffect, useState } from 'react';

type Transaction = {
  id: string;
  type: string;
  amount: number;
  currency?: string;
  description?: string;
  created_at: string;
};

export default function UserTransactions({ userId }: { userId: string }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ================= */
  const fetchTransactions = async () => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/transactions`, {
        cache: 'no-store',
      });

      if (!res.ok) {
        console.error('Failed to fetch transactions');
        return;
      }

      const data = await res.json();

      // ✅ Always ensure array
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Transaction fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= INITIAL LOAD + AUTO REFRESH ================= */
  useEffect(() => {
    if (!userId) return;

    fetchTransactions();

    // ✅ AUTO REFRESH EVERY 5s
    const interval = setInterval(() => {
      fetchTransactions();
    }, 5000);

    return () => clearInterval(interval);
  }, [userId]);

  /* ================= UI ================= */
  if (loading) {
    return (
      <p className="text-zinc-400 mt-6 animate-pulse">
        Loading transactions...
      </p>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-white text-lg mb-4">Transactions</h3>

      {transactions.length === 0 ? (
        <p className="text-zinc-500">No transactions yet</p>
      ) : (
        <div className="space-y-3">

          {transactions.map((t) => {
            const isCredit =
              t.type === 'credit' ||
              t.type === 'bonus' ||
              t.type === 'referral' ||
              t.type === 'deposit' ||
              t.type === 'mining';

            const isDebit =
              t.type === 'debit' ||
              t.type === 'withdrawal';

            return (
              <div
                key={t.id}
                className="bg-zinc-800 p-4 rounded-xl border border-zinc-700 flex justify-between items-center"
              >
                {/* LEFT */}
                <div>
                  <p className="text-white capitalize">
                    {t.description || t.type}
                  </p>

                  <p className="text-zinc-400 text-xs">
                    {new Date(t.created_at).toLocaleString()}
                  </p>
                </div>

                {/* RIGHT */}
                <p
                  className={`font-bold text-lg ${
                    isCredit
                      ? 'text-emerald-400'
                      : isDebit
                      ? 'text-red-400'
                      : 'text-yellow-400'
                  }`}
                >
                  t.currency === 'GOLD'
                    ? `${isCredit ? '+' : isDebit ? '-' : ''}${Number(t.amount).toLocaleString()}G`
                     : `${isCredit ? '+' : isDebit ? '-' : ''}$${Number(t.amount).toLocaleString()}`
                </p>
              </div>
            );
          })}

        </div>
      )}
    </div>
  );
}