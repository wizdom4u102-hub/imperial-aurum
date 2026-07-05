'use client';

import { useState } from 'react';

type Props = {
  userId: string;
  status: string;
  onActionComplete?: () => void;
};

export default function UserActions({ userId, status, onActionComplete }: Props) {
  const [loading, setLoading] = useState(false);

  // ✅ MAIN ACTION HANDLER (FIXED + GOLD ADDED)
  const handleAction = async (
    type: 'credit' | 'debit' | 'bonus' | 'investment' | 'gold'
  ) => {
    const labelMap: any = {
      credit: 'Credit Amount',
      debit: 'Debit Amount',
      bonus: 'Bonus Amount',
      investment: 'Investment Amount',
      gold: 'Gold Amount',
    };

    const amount = prompt(`Enter ${labelMap[type]}`);
    if (!amount) return;

    try {
      setLoading(true);

      const endpoint =
        type === 'gold'
          ? `/api/admin/users/${userId}/credit-gold`
          : `/api/admin/users/${userId}/${type}`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(amount) }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || `${type} failed`);
        return;
      }

      alert(`${type} successful ✅`);
      onActionComplete?.();

    } catch (err) {
      console.error(err);
      alert('Error occurred');
    } finally {
      setLoading(false);
    }
  };

  // ✅ ACCESS ACTION HANDLER
  const handleAccessAction = async (
    type: 'block' | 'suspend' | 'delete' | 'unblock' | 'unsuspend'
  ) => {
    if (!confirm(`Are you sure you want to ${type} this user?`)) return;

    try {
      setLoading(true);

      const res = await fetch(`/api/admin/users/${userId}/${type}`, {
        method: 'POST',
      });

      let data = null

try {
  data = await res.json()
} catch {
  console.error('Invalid JSON response')
}

      if (!res.ok) {
        alert(data.error || `${type} failed`);
        return;
      }

      alert(`User ${type}ed successfully ✅`);

onActionComplete?.();

// force refresh user data
window.location.reload();

    } catch (err) {
      console.error(err);
      alert('Error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-64 bg-zinc-950 border-r border-zinc-800 p-4 space-y-3">

      <h3 className="text-white font-bold mb-4">User Actions</h3>

      {/* MAIN */}
      <ActionBtn label="💰 Credit Account" onClick={() => handleAction('credit')} />
      <ActionBtn label="🪙 Credit Gold" onClick={() => handleAction('gold')} />
      <ActionBtn label="💸 Debit Account" onClick={() => handleAction('debit')} />
      <ActionBtn label="🎁 Give Bonus" onClick={() => handleAction('bonus')} />
      <ActionBtn label="📈 Manual Investment" onClick={() => handleAction('investment')} />
      <ActionBtn
        label="📋 Transactions"
        onClick={() => window.dispatchEvent(new Event('show-transactions'))}
      />

      {/* EXTRA */}
      <div className="pt-4 border-t border-zinc-800">
        <p className="text-xs text-zinc-500 mb-2 uppercase">Extra</p>

        <SubBtn
  label="✉️ Send Email"
  onClick={() =>
    window.open(
      `/admin/messages/${userId}`,
      '_blank'
    )
  }
/>

<SubBtn
  label="🔗 Referral"
  onClick={() =>
    window.open(
      `/admin/referrals/${userId}`,
      '_blank'
    )
  }
/>

<SubBtn
  label="📜 Login History"
  onClick={() =>
    window.open(
      `/admin/login-history/${userId}`,
      '_blank'
    )
  }
/>
      </div>

      {/* ACCESS */}
      <div className="pt-4 border-t border-zinc-800">
        <p className="text-xs text-zinc-500 mb-2 uppercase">Access</p>

        {status === 'active' && (
          <>
            <SubBtn
              label="⛔ Block User"
              red
              onClick={() => handleAccessAction('block')}
            />
            <SubBtn
              label="⏸ Suspend User"
              onClick={() => handleAccessAction('suspend')}
            />
          </>
        )}

        {status === 'blocked' && (
          <SubBtn
            label="✅ Unblock User"
            onClick={() => handleAccessAction('unblock')}
          />
        )}

        {status === 'suspended' && (
          <SubBtn
            label="▶️ Unsuspend User"
            onClick={() => handleAccessAction('unsuspend')}
          />
        )}

        <SubBtn
          label="🗑 Delete User"
          red
          onClick={() => handleAccessAction('delete')}
        />
      </div>

      {loading && (
        <p className="text-xs text-yellow-400">Processing...</p>
      )}
    </div>
  );
}

/* BUTTONS */

function ActionBtn({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-2 rounded-xl transition"
    >
      {label}
    </button>
  );
}

function SubBtn({
  label,
  red,
  onClick,
}: {
  label: string;
  red?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-lg ${
        red ? 'text-red-400' : 'text-zinc-300'
      }`}
    >
      {label}
    </button>
  );
}