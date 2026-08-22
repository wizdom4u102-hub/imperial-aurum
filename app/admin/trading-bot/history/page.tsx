import Link from "next/link";

import { requireAdminPage } from "@/lib/admin";

import {
  getAdminTradingBotHistory,
} from "@/lib/trading-bot/admin-history.service";


export const dynamic = "force-dynamic";
export const revalidate = 0;


function formatAmount(
  amount: number | null
): string {
  return `$${Number(
    amount ?? 0
  ).toFixed(2)}`;
}


function getTransactionLabel(
  transactionType: string | null
): string {
  if (!transactionType) {
    return "Unknown";
  }

  return transactionType
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase()
    );
}


function getTransactionStyle(
  transactionType: string | null
): string {

  if (
    transactionType === "PROFIT" ||
    transactionType === "DAILY_PROFIT"
  ) {
    return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
  }

  if (
    transactionType === "TRADING_LOSS"
  ) {
    return "bg-red-500/10 border-red-500/20 text-red-400";
  }

  if (
    transactionType === "WITHDRAWAL"
  ) {
    return "bg-orange-500/10 border-orange-500/20 text-orange-400";
  }

  if (
    transactionType === "TOP_UP" ||
    transactionType === "INITIAL_DEPOSIT" ||
    transactionType === "ACTIVATION"
  ) {
    return "bg-blue-500/10 border-blue-500/20 text-blue-400";
  }

  return "bg-zinc-800 border-zinc-700 text-zinc-300";
}


export default async function AdminTradingBotHistoryPage() {

  await requireAdminPage();


  const result =
    await getAdminTradingBotHistory();


  if (result.error) {

    throw new Error(
      result.error.message
    );

  }


  const history =
    result.data ?? [];


  const totalRecords =
    history.length;


  const completedRecords =
    history.filter(
      (item) =>
        item.status ===
        "COMPLETED"
    ).length;


  const profitRecords =
    history.filter(
      (item) =>
        item.transaction_type ===
          "PROFIT" ||
        item.transaction_type ===
          "DAILY_PROFIT"
    ).length;


  const lossRecords =
    history.filter(
      (item) =>
        item.transaction_type ===
        "TRADING_LOSS"
    ).length;


  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 lg:p-8">

      <div className="max-w-7xl mx-auto">

        {/* ---------------------------------------------------------------- */}
        {/* Header                                                           */}
        {/* ---------------------------------------------------------------- */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

          <div>

            <p className="text-sm uppercase tracking-[0.25em] text-yellow-400">
              Trading Bot
            </p>

            <h1 className="text-3xl sm:text-4xl font-bold mt-2">
              Bot History
            </h1>

            <p className="text-zinc-400 mt-2">
              Complete trading bot transaction history
              across all users.
            </p>

          </div>


          <Link
            href="/admin/trading-bot"
            className="
              inline-flex
              items-center
              justify-center
              rounded-xl
              border
              border-zinc-700
              bg-zinc-900
              px-5
              py-3
              text-sm
              font-medium
              text-zinc-200
              transition
              hover:border-yellow-500/50
              hover:text-yellow-400
            "
          >
            ← Trading Bot Dashboard
          </Link>

        </div>


        {/* ---------------------------------------------------------------- */}
        {/* Summary Cards                                                    */}
        {/* ---------------------------------------------------------------- */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-8">

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6">

            <p className="text-xs sm:text-sm text-zinc-400">
              Total Records
            </p>

            <p className="text-2xl sm:text-3xl font-bold text-white mt-2">
              {totalRecords}
            </p>

          </div>


          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6">

            <p className="text-xs sm:text-sm text-zinc-400">
              Completed
            </p>

            <p className="text-2xl sm:text-3xl font-bold text-emerald-400 mt-2">
              {completedRecords}
            </p>

          </div>


          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6">

            <p className="text-xs sm:text-sm text-zinc-400">
              Profit Records
            </p>

            <p className="text-2xl sm:text-3xl font-bold text-cyan-400 mt-2">
              {profitRecords}
            </p>

          </div>


          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6">

            <p className="text-xs sm:text-sm text-zinc-400">
              Loss Records
            </p>

            <p className="text-2xl sm:text-3xl font-bold text-red-400 mt-2">
              {lossRecords}
            </p>

          </div>

        </div>


        {/* ---------------------------------------------------------------- */}
        {/* History                                                           */}
        {/* ---------------------------------------------------------------- */}

        <div className="rounded-2xl sm:rounded-3xl border border-zinc-800 bg-zinc-900 overflow-hidden">

          <div className="p-5 sm:p-6 border-b border-zinc-800">

            <h2 className="text-xl sm:text-2xl font-bold">
              Trading Bot Activity
            </h2>

            <p className="text-sm text-zinc-500 mt-1">
              User activity, bot activity and transaction records.
            </p>

          </div>


          {history.length === 0 ? (

            <div className="p-12 text-center">

              <div className="text-4xl mb-4">
                📊
              </div>

              <h3 className="text-lg font-semibold text-zinc-200">
                No Trading Bot History
              </h3>

              <p className="text-zinc-500 mt-2">
                No trading bot transaction records are available yet.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[950px]">

                <thead className="bg-zinc-950">

                  <tr>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Date
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      User
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Bot
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Type
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Amount
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Description
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {history.map(
                    (item) => {

                      const profile =
                        item.profile;

                      const bot =
                        item.bot;


                      return (

                        <tr
                          key={item.id}
                          className="
                            border-t
                            border-zinc-800
                            transition
                            hover:bg-zinc-800/40
                          "
                        >

                          {/* Date */}

                          <td className="px-5 py-5 text-sm text-zinc-400 whitespace-nowrap">

                            {item.created_at
                              ? new Date(
                                  item.created_at
                                ).toLocaleString()
                              : "—"}

                          </td>


                          {/* User */}

                          <td className="px-5 py-5">

                            <div className="min-w-[190px]">

                              <p className="font-semibold text-white">

                                {profile?.name ||
                                  profile?.username ||
                                  "Unknown user"}

                              </p>

                              {profile?.username && (
                                <p className="text-sm text-yellow-400 mt-0.5">
                                  @{profile.username}
                                </p>
                              )}

                              <p className="text-xs text-zinc-500 break-all mt-1">
                                {profile?.email ||
                                  "No email"}
                              </p>

                            </div>

                          </td>


                          {/* Bot */}

                          <td className="px-5 py-5">

                            <span className="text-sm font-medium text-zinc-200">

                              {bot?.bot_name ||
                                "Unknown bot"}

                            </span>

                          </td>


                          {/* Transaction Type */}

                          <td className="px-5 py-5">

                            <span
                              className={`
                                inline-flex
                                items-center
                                rounded-full
                                border
                                px-3
                                py-1
                                text-xs
                                font-semibold
                                whitespace-nowrap
                                ${getTransactionStyle(
                                  item.transaction_type
                                )}
                              `}
                            >
                              {getTransactionLabel(
                                item.transaction_type
                              )}
                            </span>

                          </td>


                          {/* Amount */}

                          <td className="px-5 py-5">

                            <span className="font-semibold text-white whitespace-nowrap">

                              {formatAmount(
                                item.amount
                              )}

                            </span>

                          </td>


                          {/* Status */}

                          <td className="px-5 py-5">

                            <span className="text-sm text-zinc-300">

                              {item.status ||
                                "—"}

                            </span>

                          </td>


                          {/* Description */}

                          <td className="px-5 py-5">

                            <p className="text-sm text-zinc-400 max-w-[280px]">

                              {item.description ||
                                "—"}

                            </p>

                          </td>

                        </tr>

                      );

                    }
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}