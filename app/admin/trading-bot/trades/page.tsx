import Link from "next/link";

import {
  getAdminBotTrades,
} from "@/lib/trading-bot/admin-service";


export default async function AdminBotTradesPage() {

  const result =
    await getAdminBotTrades();

  if (result.error) {

    return (
      <div className="space-y-6 p-4 md:p-6">

        <div>
          <h1 className="text-2xl font-bold">
            Bot Trades
          </h1>

          <p className="text-sm text-zinc-400">
            View and monitor all trading bot trades.
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

  const trades =
    result.data ?? [];

  const openTrades =
    trades.filter(
      (trade) =>
        trade.status === "OPEN"
    );

  const closedTrades =
    trades.filter(
      (trade) =>
        trade.status === "CLOSED"
    );

  const totalProfit =
    trades.reduce(
      (total, trade) =>
        total +
        Number(
          trade.net_profit ?? 0
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
            Bot Trades
          </h1>

          <p className="text-sm text-zinc-400">
            View and monitor all trading bot trades.
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
            Total Trades
          </p>

          <p className="mt-2 text-2xl font-bold text-white">
            {trades.length}
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
            Open Trades
          </p>

          <p className="mt-2 text-2xl font-bold text-yellow-400">
            {openTrades.length}
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
            Closed Trades
          </p>

          <p className="mt-2 text-2xl font-bold text-green-400">
            {closedTrades.length}
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
            Net Profit
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
            ${totalProfit.toLocaleString()}
          </p>

        </div>

      </div>


      {/* Trades Table */}

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

          <h2 className="text-xl font-bold text-white">
            All Bot Trades
          </h2>

          <p className="mt-1 text-sm text-zinc-400">
            {trades.length} trade
            {trades.length === 1 ? "" : "s"} found.
          </p>

        </div>


        {trades.length === 0 ? (

          <div className="
            p-8
            text-center
            text-zinc-400
          ">
            No bot trades found.
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
                    Trade
                  </th>

                  <th className="px-5 py-4 text-left">
                    Asset
                  </th>

                  <th className="px-5 py-4 text-left">
                    Type
                  </th>

                  <th className="px-5 py-4 text-left">
                    Buy Price
                  </th>

                  <th className="px-5 py-4 text-left">
                    Sell Price
                  </th>

                  <th className="px-5 py-4 text-left">
                    ROI
                  </th>

                  <th className="px-5 py-4 text-left">
                    Net Profit
                  </th>

                  <th className="px-5 py-4 text-left">
                    Status
                  </th>

                </tr>

              </thead>


              <tbody>

                {trades.map((trade) => (

                  <tr
                    key={trade.id}
                    className="
                      border-b
                      border-zinc-800
                      text-zinc-300
                      hover:bg-zinc-950
                    "
                  >

                    <td className="
                      whitespace-nowrap
                      px-5
                      py-4
                      font-medium
                      text-white
                    ">
                      #{trade.trade_number}
                    </td>


                    <td className="px-5 py-4">
                      {trade.asset}
                    </td>


                    <td className="px-5 py-4">

                      <span className="
                        rounded-full
                        bg-yellow-500/20
                        px-3
                        py-1
                        text-xs
                        font-semibold
                        text-yellow-400
                      ">
                        {trade.trade_type}
                      </span>

                    </td>


                    <td className="px-5 py-4">
                      ${Number(
                        trade.buy_price ?? 0
                      ).toLocaleString()}
                    </td>


                    <td className="px-5 py-4">
                      {trade.sell_price === null
                        ? "-"
                        : `$${Number(
                            trade.sell_price
                          ).toLocaleString()}`}
                    </td>


                    <td className={`
                      px-5
                      py-4
                      font-semibold
                      ${
                        Number(
                          trade.roi_percentage ?? 0
                        ) >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    `}>
                      {Number(
                        trade.roi_percentage ?? 0
                      ).toFixed(2)}
                      %
                    </td>


                    <td className={`
                      px-5
                      py-4
                      font-semibold
                      ${
                        Number(
                          trade.net_profit ?? 0
                        ) >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    `}>
                      $
                      {Number(
                        trade.net_profit ?? 0
                      ).toFixed(2)}
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
                            trade.status === "OPEN"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : trade.status === "CLOSED"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-zinc-800 text-zinc-400"
                          }
                        `}
                      >
                        {trade.status}
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