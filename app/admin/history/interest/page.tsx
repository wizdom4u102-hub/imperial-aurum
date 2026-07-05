'use client';

export default function InterestHistory() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Interest History</h1>
        <p className="text-zinc-500 mt-1">Daily / Monthly interest payouts</p>
      </div>

      <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800">
        <p className="text-zinc-400">Interest payout table will go here...</p>
        {/* Replace with your real table later */}
      </div>
    </div>
  );
}