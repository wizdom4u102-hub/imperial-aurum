import Link from "next/link";

import {
  getAdminTradingBots,
} from "@/lib/trading-bot/admin-service";


export default async function AdminTradingBotsPage() {

  const result =
    await getAdminTradingBots();

  if (result.error) {

    return (
      <div className="space-y-6 p-4 md:p-6">

        <div>
          <h1 className="text-2xl font-bold">
            User Trading Bots
          </h1>

          <p className="text-sm text-zinc-400">
            View and monitor all user trading bots.
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

  const bots =
    result.data ?? [];

  const activeBots =
    bots.filter(
      (bot) =>
        bot.status === "active"
    );

  const pendingBots =
    bots.filter(
      (bot) =>
        bot.status === "pending_activation"
    );

  const totalInvestment =
    bots.reduce(
      (total, bot) =>
        total +
        Number(
          bot.investment_capital ?? 0
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
            User Trading Bots
          </h1>

          <p className="text-sm text-zinc-400">
            View and monitor all user trading bots.
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
            Total Bots
          </p>

          <p className="mt-2 text-2xl font-bold text-white">
            {bots.length}
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
            Active Bots
          </p>

          <p className="mt-2 text-2xl font-bold text-green-400">
            {activeBots.length}
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
            Pending Activation
          </p>

          <p className="mt-2 text-2xl font-bold text-yellow-400">
            {pendingBots.length}
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
            Total Investment
          </p>

          <p className="mt-2 text-2xl font-bold text-white">
            $
            {totalInvestment.toLocaleString()}
          </p>

        </div>

      </div>


      {/* Bots */}

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
            All User Trading Bots
          </h2>

          <p className="mt-1 text-sm text-zinc-400">
            {bots.length} bot
            {bots.length === 1 ? "" : "s"} found.
          </p>

        </div>


        {bots.length === 0 ? (

          <div className="
            p-8
            text-center
            text-zinc-400
          ">
            No trading bots found.
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
                    User
                  </th>

                  <th className="px-5 py-4 text-left">
                    Bot
                  </th>

                  <th className="px-5 py-4 text-left">
                    Asset
                  </th>

                  <th className="px-5 py-4 text-left">
                    Investment
                  </th>

                  <th className="px-5 py-4 text-left">
                    Status
                  </th>

                  <th className="px-5 py-4 text-left">
                    Created
                  </th>

                </tr>

              </thead>


              <tbody>

                {bots.map((bot) => (

                  <tr
                    key={bot.id}
                    className="
                      border-b
                      border-zinc-800
                      text-zinc-300
                      hover:bg-zinc-950
                    "
                  >

                    <td className="px-5 py-4">

                      <p className="font-medium text-white">
                        {bot.profile?.name ?? "-"}
                      </p>

                      <p className="mt-1 text-xs text-zinc-500">
                        {bot.profile?.email ?? "-"}
                      </p>

                    </td>


                    <td className="px-5 py-4 font-medium text-white">
                      {bot.bot_name}
                    </td>


                    <td className="px-5 py-4">
                      {bot.trading_asset ?? "-"}
                    </td>


                    <td className="px-5 py-4 font-semibold text-white">
                      $
                      {Number(
                        bot.investment_capital ?? 0
                      ).toLocaleString()}
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
                            bot.status === "active"
                              ? "bg-green-500/20 text-green-400"
                              : bot.status === "pending_activation"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-zinc-800 text-zinc-400"
                          }
                        `}
                      >
                        {bot.status}
                      </span>

                    </td>


                    <td className="
                      whitespace-nowrap
                      px-5
                      py-4
                      text-zinc-500
                    ">

                      {bot.created_at
                        ? new Date(
                            bot.created_at
                          ).toLocaleString()
                        : "-"}

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