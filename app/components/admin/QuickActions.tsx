'use client';

type Props = {
  userId: string;
};

export default function UserActions({ userId }: Props) {
  return (
    <div className="w-64 bg-zinc-950 border-r border-zinc-800 p-4 space-y-3">

      <h3 className="text-white font-bold mb-4">User Actions</h3>

      {/* MAIN */}
      <ActionBtn label="🔥 Credit Account" />
      <ActionBtn label="💸 Debit Account" />
      <ActionBtn label="🎁 Give Bonus" />
      <ActionBtn label="📈 Manual Investment" />
      <ActionBtn label="📋 Transactions" />

      {/* EXTRA */}
      <div className="pt-4 border-t border-zinc-800">
        <p className="text-xs text-zinc-500 mb-2 uppercase">Extra</p>

        <SubBtn label="✉️ Send Email" />
        <SubBtn label="🔗 Referral" />
        <SubBtn label="📜 Login History" />
      </div>

      {/* ACCESS */}
      <div className="pt-4 border-t border-zinc-800">
        <p className="text-xs text-zinc-500 mb-2 uppercase">Access</p>

        <SubBtn label="⛔ Block User" red />
        <SubBtn label="⏸ Suspend User" />
        <SubBtn label="🗑 Delete User" red />
      </div>
    </div>
  );
}

/* BUTTONS */

function ActionBtn({ label }: { label: string }) {
  return (
    <button className="w-full text-left bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-2 rounded-xl transition">
      {label}
    </button>
  );
}

function SubBtn({ label, red }: { label: string; red?: boolean }) {
  return (
    <button
      className={`w-full text-left px-3 py-2 rounded-lg transition ${
        red
          ? 'text-red-400 hover:bg-red-500/10'
          : 'text-zinc-300 hover:bg-zinc-800'
      }`}
    >
      {label}
    </button>
  );
}