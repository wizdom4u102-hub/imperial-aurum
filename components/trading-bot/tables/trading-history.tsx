"use client";

import React from "react";

interface TradingHistoryItem {
  id: string;

  transactionType: string;

  botName?: string;

  amount: number;

  status: string;

  description: string;

  createdAt: string;
}

interface TradingHistoryProps {
  history: TradingHistoryItem[];

  loading: boolean;

  error: string | null;
}



const getTransactionBadge = (
  type: string
) => {

  switch (type.toUpperCase()) {

    case "ACTIVATION":
      return {
        label: "Activation",
        className:
          "bg-violet-500/20 text-violet-400",
      };

    case "TOP_UP":
      return {
        label: "Top-up",
        className:
          "bg-blue-500/20 text-blue-400",
      };

    case "DAILY_PROFIT":
      return {
        label: "Daily Profit",
        className:
          "bg-emerald-500/20 text-emerald-400",
      };

    case "TRADING_LOSS":
      return {
        label: "Trading Loss",
        className:
          "bg-red-500/20 text-red-400",
      };

    case "BOT_PROFIT_TRANSFER":
      return {
        label: "Profit Transfer",
        className:
          "bg-amber-500/20 text-amber-400",
      };

    case "DASHBOARD_TRANSFER":
      return {
        label: "Dashboard Transfer",
        className:
          "bg-cyan-500/20 text-cyan-400",
      };

    default:
      return {
        label: type,
        className:
          "bg-white/10 text-gray-300",
      };

  }

};

const getStatusBadge = (
  status: string
) => {

  switch (status.toUpperCase()) {

    case "COMPLETED":
      return {
        className:
          "bg-emerald-500/20 text-emerald-400",
      };

    case "PENDING":
      return {
        className:
          "bg-yellow-500/20 text-yellow-400",
      };

    case "FAILED":
      return {
        className:
          "bg-red-500/20 text-red-400",
      };

    default:
      return {
        className:
          "bg-white/10 text-gray-300",
      };

  }

};

const TradingHistory: React.FC<TradingHistoryProps> = ({
  history,
  loading,
  error,
}) => {
  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#0b1020]/80 p-8 text-center text-gray-400">
        Loading trading history...
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

  if (history.length === 0) {
    return (
     <>
  <p className="text-lg font-semibold text-white">
    No Activity Yet
  </p>

  <p className="mt-2 text-sm text-gray-500">
    Your trading bot transactions will appear here after
    activation, profits, transfers, or top-ups.
  </p>
</>
    );
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-[#0b1020]/80 backdrop-blur-xl p-6 shadow-xl">

      <div className="mb-6 flex items-center justify-between">

  <div>

    <h2 className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 bg-clip-text text-xl font-bold text-transparent">

      Trading Bot Financial Ledger

    </h2>

    <p className="mt-1 text-sm text-gray-500">

      Complete record of every financial activity performed by your trading bots.

    </p>

  </div>

  <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-400">

    {history.length} Records

  </span>

</div>

      <div className="overflow-x-auto">

        <table className="min-w-full text-sm">

          <thead className="border-b border-white/10 bg-white/5 text-yellow-400">

            <tr>

              <th className="px-4 py-3 text-left">
                Date
              </th>

              <th className="px-4 py-3 text-left">
                Transaction
              </th>

              <th className="px-4 py-3 text-left">
                Bot
              </th>

              <th className="px-4 py-3 text-left">
                Amount
              </th>

              <th className="px-4 py-3 text-left">
                Status
              </th>

              <th className="px-4 py-3 text-left">
                Description
              </th>

            </tr>

          </thead>

          <tbody>

            {history.map((item) => (

              <tr
                key={item.id}
                className="
  border-b
  border-white/5
  text-gray-300
  transition-all
  duration-200
  hover:bg-white/5
  hover:shadow-lg
"
              >

               <td className="px-4 py-3 text-gray-400">

  <div className="flex flex-col">

    <span>

      {new Date(
        item.createdAt
      ).toLocaleDateString(
        undefined,
        {
          year: "numeric",
          month: "short",
          day: "numeric",
        }
      )}

    </span>

    <span className="text-xs text-gray-500">

      {new Date(
        item.createdAt
      ).toLocaleTimeString(
        undefined,
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      )}

    </span>

  </div>

</td>

                <td className="px-4 py-3">

                  <span
  className={`rounded-full px-3 py-1 text-xs font-semibold ${
    getTransactionBadge(
      item.transactionType
    ).className
  }`}
>
  {
    getTransactionBadge(
      item.transactionType
    ).label
  }
</span>

                </td>

                <td className="px-4 py-3">

  <div className="flex flex-col">

    <span className="font-medium text-white">

      {item.botName ?? "Trading Dashboard"}

    </span>

    <span className="text-xs text-gray-500">

      {item.botName ? "Single Bot" : "Multiple Bots"}

    </span>

  </div>

</td>

                <td
  className={`px-4 py-3 font-semibold ${
    item.transactionType ===
    "TRADING_LOSS"

      ? "text-red-400"

      : item.transactionType ===
        "BOT_PROFIT_TRANSFER"

      ? "text-amber-400"

      : item.transactionType ===
        "DASHBOARD_TRANSFER"

      ? "text-cyan-400"

      : "text-emerald-400"
  }`}
>

  ${
    item.amount.toFixed(2)
  }

</td>

                <td className="px-4 py-3">

                 <span
  className={`rounded-full px-3 py-1 text-xs font-semibold ${
    getStatusBadge(
      item.status
    ).className
  }`}
>
  {item.status}
</span>

                </td>

               <td className="max-w-xs px-4 py-3 text-gray-300">

  <p className="truncate">

    {item.description}

  </p>

</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </section>
  );
};

export default TradingHistory;