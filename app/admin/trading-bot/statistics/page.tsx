import Link from "next/link";

import {
  getAdminBotStatistics,
} from "@/lib/trading-bot/admin-service";

export default async function AdminBotStatisticsPage() {
  const result =
    await getAdminBotStatistics();

  if (result.error) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div>
          <h1 className="text-2xl font-bold">
            Bot Statistics
          </h1>

          <p className="text-sm text-zinc-400">
            View statistics for all trading bots.
          </p>
        </div>

        <div className="
          rounded-2xl
          border
          border-red-500/30
          bg-red-500/10
          p-6
          text-center
          text-red-400
        ">
          {result.error.message}
        </div>
      </div>
    );
  }

  const statistics =
    result.data ?? [];

  const totalBots =
    statistics.length;

  const runningBots =
    statistics.filter(
      (stat) =>
        stat.server_status === "running"
    ).length;

  const totalTrades =
    statistics.reduce(
      (total, stat) =>
        total +
        Number(
          stat.total_trades ?? 0
        ),
      0
    );

  const totalProfit =
    statistics.reduce(
      (total, stat) =>
        total +
        Number(
          stat.total_profit ?? 0
        ),
      0
    );

  return (
    <div className="space-y-6 p-4 md:p-6">

      {/* Header */}

      <div className="
        flex
        flex-col
        gap-4
        md:flex-row
        md:items-center
        md:justify-between
      ">
        <div>
          <h1 className="text-2xl font-bold">
            Bot Statistics
          </h1>

          <p className="text-sm text-zinc-400">
            View statistics for all trading bots.
          </p>
        </div>

        <Link
          href="/admin/trading-bot"
          className="
            rounded-xl
            border
            border-yellow-400
            px-4
            py-2
            text-sm
            text-yellow-400
            transition
            hover:bg-yellow-400
            hover:text-black
          "
        >
          Trading Bot Dashboard
        </Link>
      </div>


      {/* Summary */}

      <div className="
        grid
        grid-cols-1
        gap-4
        sm:grid-cols-2
        lg:grid-cols-4
      ">

        <div className="
          rounded-2xl
          border
          border-zinc-800
          bg-zinc-900
          p-5
        ">
          <p className="text-sm text-zinc-400">
            Total Bot Statistics
          </p>

          <p className="
            mt-2
            text-2xl
            font-bold
            text-white
          ">
            {totalBots}
          </p>
        </div>


        <div className="
          rounded-2xl
          border
          border-zinc-800
          bg-zinc-900
          p-5
        ">
          <p className="text-sm text-zinc-400">
            Running Bots
          </p>

          <p className="
            mt-2
            text-2xl
            font-bold
            text-green-400
          ">
            {runningBots}
          </p>
        </div>


        <div className="
          rounded-2xl
          border
          border-zinc-800
          bg-zinc-900
          p-5
        ">
          <p className="text-sm text-zinc-400">
            Total Trades
          </p>

          <p className="
            mt-2
            text-2xl
            font-bold
            text-white
          ">
            {totalTrades.toLocaleString()}
          </p>
        </div>


        <div className="
          rounded-2xl
          border
          border-zinc-800
          bg-zinc-900
          p-5
        ">
          <p className="text-sm text-zinc-400">
            Total Profit
          </p>

          <p className={`
            mt-2
            text-2xl
            font-bold
            ${
              totalProfit >= 0
                ? "text-green-400"
                : "text-red-400"
            }
          `}>
            ${totalProfit.toFixed(2)}
          </p>
        </div>

      </div>


      {/* Statistics Table */}

      <div className="
        overflow-hidden
        rounded-2xl
        border
        border-zinc-800
        bg-zinc-900
      ">

        <div className="
          border-b
          border-zinc-800
          p-6
        ">
          <h2 className="
            text-xl
            font-bold
            text-white
          ">
            All Bot Statistics
          </h2>

          <p className="
            mt-1
            text-sm
            text-zinc-400
          ">
            {statistics.length} statistics record
            {statistics.length === 1 ? "" : "s"} found.
          </p>
        </div>


        {statistics.length === 0 ? (

          <div className="
            p-8
            text-center
            text-zinc-400
          ">
            No bot statistics found.
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="min-w-full text-sm">

              <thead className="
                border-b
                border-zinc-800
                bg-zinc-950
                text-zinc-400
              ">
                <tr>

                  <th className="px-5 py-4 text-left">
                    Bot ID
                  </th>

                  <th className="px-5 py-4 text-left">
                    Investment
                  </th>

                  <th className="px-5 py-4 text-left">
                    Current Value
                  </th>

                  <th className="px-5 py-4 text-left">
                    Profit
                  </th>

                  <th className="px-5 py-4 text-left">
                    ROI
                  </th>

                  <th className="px-5 py-4 text-left">
                    Trades
                  </th>

                  <th className="px-5 py-4 text-left">
                    Win Rate
                  </th>

                  <th className="px-5 py-4 text-left">
                    Server
                  </th>

                </tr>
              </thead>


              <tbody>

                {statistics.map((stat) => (

                  <tr
                    key={stat.id}
                    className="
                      border-b
                      border-zinc-800
                      text-zinc-300
                      hover:bg-zinc-950
                    "
                  >

                    <td className="
                      px-5
                      py-4
                      font-medium
                      text-white
                    ">
                      {stat.bot_id}
                    </td>


                    <td className="px-5 py-4">
                      $
                      {Number(
                        stat.investment_capital ?? 0
                      ).toLocaleString()}
                    </td>


                    <td className="px-5 py-4">
                      $
                      {Number(
                        stat.current_value ?? 0
                      ).toLocaleString()}
                    </td>


                    <td className={`
                      px-5
                      py-4
                      font-semibold
                      ${
                        Number(
                          stat.total_profit ?? 0
                        ) >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    `}>
                      $
                      {Number(
                        stat.total_profit ?? 0
                      ).toFixed(2)}
                    </td>


                    <td className={`
                      px-5
                      py-4
                      font-semibold
                      ${
                        Number(
                          stat.roi_percentage ?? 0
                        ) >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    `}>
                      {Number(
                        stat.roi_percentage ?? 0
                      ).toFixed(2)}
                      %
                    </td>


                    <td className="px-5 py-4">
                      {Number(
                        stat.total_trades ?? 0
                      ).toLocaleString()}
                    </td>


                    <td className="px-5 py-4">
                      {Number(
                        stat.win_rate ?? 0
                      ).toFixed(2)}
                      %
                    </td>


                    <td className="px-5 py-4">

                      <span
                        className={`
                          inline-flex
                          rounded-full
                          px-3
                          py-1
                          text-xs
                          font-semibold
                          ${
                            stat.server_status === "running"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-zinc-800 text-zinc-400"
                          }
                        `}
                      >
                        {stat.server_status ?? "-"}
                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}