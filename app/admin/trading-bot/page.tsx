// app/admin/trading-bot/page.tsx

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

async function getTradingBotDashboardData() {
  const supabase = await createClient();


  const [
    depositsResult,
    botsResult,
    statisticsResult,
    notificationsResult,
  ] = await Promise.all([

    supabase
      .from("bot_deposits")
      .select(`
        id,
        investment_amount,
        status,
        created_at,
        user_id,
        plan:trading_bot_plans(
          name
        ),
        profile:profiles(
          name,
          email
        )
      `)
      .order(
        "created_at",
        {
          ascending: false,
        }
      ),

      


    supabase
      .from("user_trading_bots")
      .select(
        `
        id,
        status,
        investment_capital,
        created_at,
        user_id,
        bot_name,
        trading_asset
        `
      ),


    supabase
      .from("bot_statistics")
      .select(
        `
        investment_capital,
        total_profit,
        current_portfolio_value
        `
      ),

      supabase
  .from("admin_notifications")
  .select("*")
  .eq("is_read", false)
  .order("created_at", {
    ascending: false,
  })
  .limit(5),

  ]);

  console.log(
  "ADMIN NOTIFICATIONS:",
  notificationsResult.data
);

console.log(
  "ADMIN NOTIFICATIONS ERROR:",
  notificationsResult.error
);

  console.log(
  "DEPOSITS ERROR:",
  depositsResult.error
);

console.log(
  "DEPOSITS COUNT:",
  depositsResult.data?.length
);



  return {

    deposits:
      depositsResult.data ?? [],


    bots:
      botsResult.data ?? [],


    statistics:
      statisticsResult.data ?? [],

    notifications:
      notificationsResult.data ?? [],

  };

}



export default async function AdminTradingBotDashboard() {


  const {
    deposits,
    bots,
    statistics,
    notifications,


  } =
    await getTradingBotDashboardData();

    console.log("BOT DEPOSITS:", deposits);
console.log("BOT STATUSES:", deposits.map((d) => d.status));



  const pendingDeposits =
    deposits.filter(
      (item) =>
        item.status ===
        "pending"
    );



  const approvedDeposits =
    deposits.filter(
      (item) =>
        item.status ===
        "approved"
    );



  const rejectedDeposits =
    deposits.filter(
      (item) =>
        item.status ===
        "rejected"
    );



  const activeBots =
    bots.filter(
      (bot) =>
        bot.status ===
        "active"
    );



  const pendingBots =
    bots.filter(
      (bot) =>
        bot.status ===
        "pending_activation"
    );



  const totalInvestment =
    statistics.reduce(
      (
        total,
        item
      ) =>
        total +
        Number(
          item.investment_capital ?? 0
        ),

      0
    );



  const totalProfit =
    statistics.reduce(
      (
        total,
        item
      ) =>
        total +
        Number(
          item.total_profit ?? 0
        ),

      0
    );



  return (

    <div className="space-y-8">

      {/* Header */}

      <div className="flex items-start justify-between">

  <div>

    <h1
      className="
        text-3xl
        font-bold
        text-yellow-400
      "
    >
      Trading Bot Dashboard
    </h1>

    <p
      className="
        mt-2
        text-zinc-400
      "
    >
      Manage Imperial Aurum Mining trading bot activities.
    </p>

  </div>

  <div
    className="
      relative
      flex
      h-12
      w-12
      items-center
      justify-center
      rounded-full
      border
      border-zinc-700
      bg-zinc-900
    "
  >
    🔔

    {notifications.length > 0 && (
      <span
        className="
          absolute
          -right-1
          -top-1
          flex
          h-6
          min-w-[24px]
          items-center
          justify-center
          rounded-full
          bg-red-500
          px-1
          text-xs
          font-bold
          text-white
        "
      >
        {notifications.length}
      </span>
    )}

  </div>

</div>

{/* Recent Notifications */}

<div
  className="
    rounded-2xl
    border
    border-zinc-800
    bg-zinc-900
    p-6
  "
>

  <h2
    className="
      text-lg
      font-bold
      text-white
      mb-4
    "
  >
    Recent Notifications
  </h2>

  {notifications.length === 0 ? (

    <p className="text-zinc-400">
      No recent notifications.
    </p>

  ) : (

    <div className="space-y-4">

      {notifications.map((notification) => (

        <div
          key={notification.id}
          className="
            rounded-xl
            border
            border-zinc-800
            bg-zinc-950
            p-4
          "
        >

          <p className="font-semibold text-white">
            {notification.title}
          </p>

          <p className="mt-1 text-sm text-zinc-400">
            {notification.message}
          </p>

          <p className="mt-2 text-xs text-zinc-500">
            {notification.created_at
              ? new Date(notification.created_at).toLocaleString()
               : "-"}
          </p>

        </div>

      ))}

    </div>

  )}

</div>

          {/* Summary Cards */}

      <div className="
        grid
        grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-4
        gap-5
      ">


        <div className="
          rounded-2xl
          border
          border-zinc-800
          bg-zinc-900
          p-6
        ">

          <p className="text-sm text-zinc-400">
            Total Deposits
          </p>

          <h2 className="
            mt-2
            text-3xl
            font-bold
            text-white
          ">
            {deposits.length}
          </h2>

        </div>



        <div className="
          rounded-2xl
          border
          border-zinc-800
          bg-zinc-900
          p-6
        ">

          <p className="text-sm text-zinc-400">
            Pending Activation
          </p>


          <h2 className="
            mt-2
            text-3xl
            font-bold
            text-yellow-400
          ">
            {pendingDeposits.length}
          </h2>

        </div>




        <div className="
          rounded-2xl
          border
          border-zinc-800
          bg-zinc-900
          p-6
        ">

          <p className="text-sm text-zinc-400">
            Active Bots
          </p>


          <h2 className="
            mt-2
            text-3xl
            font-bold
            text-green-400
          ">
            {activeBots.length}
          </h2>

        </div>




        <div className="
          rounded-2xl
          border
          border-zinc-800
          bg-zinc-900
          p-6
        ">

          <p className="text-sm text-zinc-400">
            Total Investment
          </p>


          <h2 className="
            mt-2
            text-3xl
            font-bold
            text-white
          ">
            $
            {totalInvestment.toLocaleString()}
          </h2>

        </div>


      </div>





      {/* Second Row */}

      <div className="
        grid
        grid-cols-1
        md:grid-cols-3
        gap-5
      ">


        <div className="
          rounded-2xl
          border
          border-zinc-800
          bg-zinc-900
          p-6
        ">

          <p className="text-sm text-zinc-400">
            Approved Deposits
          </p>


          <h2 className="
            mt-2
            text-2xl
            font-bold
            text-green-400
          ">
            {approvedDeposits.length}
          </h2>

        </div>




        <div className="
          rounded-2xl
          border
          border-zinc-800
          bg-zinc-900
          p-6
        ">

          <p className="text-sm text-zinc-400">
            Waiting Activation
          </p>


          <h2 className="
            mt-2
            text-2xl
            font-bold
            text-yellow-400
          ">
            {pendingBots.length}
          </h2>

        </div>




        <div className="
          rounded-2xl
          border
          border-zinc-800
          bg-zinc-900
          p-6
        ">

          <p className="text-sm text-zinc-400">
            Total Profit
          </p>


          <h2 className="
            mt-2
            text-2xl
            font-bold
            text-white
          ">
            $
            {totalProfit.toLocaleString()}
          </h2>

        </div>


      </div>
            {/* Quick Links */}

      <div className="
        rounded-2xl
        border
        border-zinc-800
        bg-zinc-900
        p-6
      ">

        <h2 className="
          text-xl
          font-bold
          text-white
          mb-5
        ">
          Trading Bot Management
        </h2>



        <div className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          gap-4
        ">


          <Link
            href="/admin/trading-bot/deposits"
            className="
              rounded-xl
              border
              border-zinc-700
              bg-zinc-950
              p-4
              text-zinc-300
              hover:border-yellow-400
              hover:text-yellow-400
              transition
            "
          >

            💰
            <span className="ml-2">
              Bot Deposits
            </span>

          </Link>




          <Link
            href="/admin/trading-bot/users"
            className="
              rounded-xl
              border
              border-zinc-700
              bg-zinc-950
              p-4
              text-zinc-300
              hover:border-yellow-400
              hover:text-yellow-400
              transition
            "
          >

            👥
            <span className="ml-2">
              User Trading Bots
            </span>

          </Link>




          <Link
            href="/admin/trading-bot/trades"
            className="
              rounded-xl
              border
              border-zinc-700
              bg-zinc-950
              p-4
              text-zinc-300
              hover:border-yellow-400
              hover:text-yellow-400
              transition
            "
          >

            📈
            <span className="ml-2">
              Bot Trades
            </span>

          </Link>




          <Link
            href="/admin/trading-bot/statistics"
            className="
              rounded-xl
              border
              border-zinc-700
              bg-zinc-950
              p-4
              text-zinc-300
              hover:border-yellow-400
              hover:text-yellow-400
              transition
            "
          >

            📊
            <span className="ml-2">
              Bot Statistics
            </span>

          </Link>


          <Link
            href="/admin/trading-bot/plans"
             className="
              rounded-xl
              border
              border-zinc-700
              bg-zinc-950
              p-4
              text-zinc-300
              hover:border-yellow-400
              hover:text-yellow-400
              transition
            "
           >

            🛒
            <span className="ml-2">
              Manage Plan
            </span>
          </Link>




          <Link
            href="/admin/trading-bot/logs"
            className="
              rounded-xl
              border
              border-zinc-700
              bg-zinc-950
              p-4
              text-zinc-300
              hover:border-yellow-400
              hover:text-yellow-400
              transition
            "
          >

            📜
            <span className="ml-2">
              Bot Logs
            </span>

          </Link>


        </div>


      </div>





      {/* Pending Deposits */}

      <div className="
        rounded-2xl
        border
        border-zinc-800
        bg-zinc-900
        overflow-hidden
      ">


        <div className="
          p-6
          border-b
          border-zinc-800
        ">

          <div className="
            flex
            flex-col
            sm:flex-row
            sm:items-center
            sm:justify-between
            gap-3
          ">


            <div>

              <h2 className="
                text-xl
                font-bold
                text-white
              ">
                Pending Bot Deposits
              </h2>


              <p className="
                text-sm
                text-zinc-400
                mt-1
              ">
                Deposits waiting for admin approval.
              </p>

            </div>



            <Link
              href="/admin/trading-bot/deposits"
              className="
                rounded-xl
                bg-yellow-400
                px-4
                py-2
                text-sm
                font-semibold
                text-black
                hover:bg-yellow-300
                transition
              "
            >
              View All
            </Link>


          </div>

        </div>
                <div className="
          p-6
        ">


          {pendingDeposits.length === 0 ? (


            <div className="
              rounded-xl
              border
              border-zinc-800
              bg-zinc-950
              p-6
              text-center
              text-zinc-400
            ">

              No pending bot deposits.

            </div>


          ) : (


            <div className="
              space-y-4
            ">


              {pendingDeposits.map((deposit) => (

                <div
                  key={deposit.id}
                  className="
                    rounded-xl
                    border
                    border-zinc-800
                    bg-zinc-950
                    p-5
                    flex
                    flex-col
                    gap-4
                    md:flex-row
                    md:items-center
                    md:justify-between
                  "
                >


                  <div>

                    <p className="
                      text-white
                      font-semibold
                    ">
                      {deposit.plan?.name}
                    </p>


                    <p className="
                      text-sm
                      text-zinc-400
                    ">
                      User:
                      {" "}
                      {deposit.profile?.email ?? "-"}
                    </p>


                    <p className="
                      text-sm
                      text-zinc-400
                    ">
                      Amount:
                      {" "}
                      ${deposit.investment_amount.toLocaleString()}
                    </p>


                    <p className="
                      text-xs
                      text-yellow-400
                      mt-1
                    ">
                      Pending Activation
                    </p>


                  </div>



                  <Link
                    href={`/admin/trading-bot/deposits/${deposit.id}`}
                    className="
                      rounded-xl
                      border
                      border-yellow-400
                      px-4
                      py-2
                      text-sm
                      text-yellow-400
                      hover:bg-yellow-400
                      hover:text-black
                      transition
                    "
                  >
                    Review
                  </Link>


                </div>

              ))}


            </div>


          )}


        </div>


      </div>



    </div>

  );

}