"use client";

import React from "react";

interface LiveTradesTableProps {
  trades: {
    id: string;
    asset: string;
    direction: "BUY" | "SELL";
    status: string;
    result: string;
    timestamp: string;
  }[];
  loading: boolean;
  error: string | null;
}

const LiveTradesTable: React.FC<LiveTradesTableProps> = ({
  trades,
  loading,
  error,
}) => {

  console.log("TABLE RECEIVED:", trades);
console.log("TABLE LENGTH:", trades.length);

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#0b1020]/80 p-8 text-center text-gray-400">
        Loading live trades...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center text-red-400">
        {error}
      </div>
    );
  }

  if (trades.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#0b1020]/80 p-8 text-center text-gray-400">
        No Current Trades
      </div>
    );
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-[#0b1020]/80 backdrop-blur-xl p-6 shadow-xl">
      <h2 className="mb-6 bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 bg-clip-text text-xl font-bold text-transparent">
        Live Trades
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="border-b border-white/10 bg-white/5 text-yellow-400">
            <tr>
              <th className="px-4 py-3 text-left">Asset</th>
              <th className="px-4 py-3 text-left">Direction</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Result</th>
              <th className="px-4 py-3 text-left">Timestamp</th>
            </tr>
          </thead>

          <tbody>
            {trades.map((trade) => (
              <tr
                key={trade.id}
                className="border-b border-white/5 text-gray-300 transition hover:bg-white/5"
              >
                <td className="px-4 py-3 text-white">
                  {trade.asset}
                </td>

                <td
                  className={`px-4 py-3 font-semibold ${
                    trade.direction === "BUY"
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {trade.direction}
                </td>

                <td className="px-4 py-3 text-yellow-400">
                  {trade.status}
                </td>

                <td className="px-4 py-3 text-white">
                  {trade.result}
                </td>

                <td className="px-4 py-3 text-gray-400">
                  {new Date(trade.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default LiveTradesTable;