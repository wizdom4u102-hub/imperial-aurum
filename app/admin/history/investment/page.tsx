'use client';

export default function InvestmentHistory() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Investment History</h1>
        <p className="text-zinc-500 mt-1">All user investments and plan purchases</p>
      </div>

      <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="border-b border-zinc-700">
              <tr>
                <th className="py-4 px-6 text-zinc-400">User</th>
                <th className="py-4 px-6 text-zinc-400">Plan</th>
                <th className="py-4 px-6 text-zinc-400">Amount</th>
                <th className="py-4 px-6 text-zinc-400">Date</th>
                <th className="py-4 px-6 text-zinc-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              <tr className="hover:bg-zinc-800/50">
                <td className="py-4 px-6 text-white">john@example.com</td>
                <td className="py-4 px-6">Premium Mining</td>
                <td className="py-4 px-6 text-emerald-400">$2,500</td>
                <td className="py-4 px-6 text-zinc-400">Apr 3, 2026</td>
                <td className="py-4 px-6"><span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs">Active</span></td>
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}