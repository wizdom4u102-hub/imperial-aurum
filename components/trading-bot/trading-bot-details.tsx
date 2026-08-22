"use client";

import React from "react";

import type {
  TradingBotDetailsResponse,
} from "@/lib/trading-bot/api.types";

interface TradingBotDetailsProps {
  data: TradingBotDetailsResponse;
}

const currency = new Intl.NumberFormat(
  "en-US",
  {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }
);

function formatCurrency(
  value?: number | null
) {
  return currency.format(
    Number(value ?? 0)
  );
}

function formatPercent(
  value?: number | null
) {
  return `${Number(value ?? 0).toFixed(2)}%`;
}

function formatDate(
  value?: string | null
) {
  if (!value) {
    return "--";
  }

  return new Date(value)
    .toLocaleString();
}

export default function TradingBotDetails({
  data,
}: TradingBotDetailsProps) {

  const {
    bot,
    statistics,
    trades,
    logs,
    deposits,
    history,
  } = data;

  return (

    <div
      className="
        space-y-6
      "
    >

      {/* ------------------------------------------------ */}
      {/*                 BOT OVERVIEW                     */}
      {/* ------------------------------------------------ */}

      <section
        className="
          rounded-2xl
          border
          border-white/10
          bg-[rgba(255,255,255,0.04)]
          backdrop-blur-xl
          p-6
        "
      >

        <div
          className="
            flex
            flex-col
            gap-6
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >

          <div>

            <h2
              className="
                text-2xl
                font-bold
                text-white
              "
            >
              {bot.bot_name}
            </h2>

            <p
              className="
                mt-2
                text-sm
                text-zinc-400
              "
            >
              {bot.strategy}
            </p>

          </div>

          <span
            className="
              rounded-full
              bg-emerald-500/10
              px-4
              py-2
              text-sm
              font-semibold
              text-emerald-400
            "
          >
            {(bot.status ?? "").toUpperCase()}
          </span>

        </div>

      </section>

      {/* ------------------------------------------------ */}
      {/*               QUICK STATISTICS                   */}
      {/* ------------------------------------------------ */}

      <section
        className="
          grid
          gap-4
          md:grid-cols-2
          xl:grid-cols-4
        "
      >

        <StatCard
          title="Investment"
          value={formatCurrency(
            bot.investment_capital
          )}
        />

        <StatCard
          title="Current Value"
          value={formatCurrency(
            bot.current_value
          )}
        />

        <StatCard
          title="Accumulated Profit"
          value={formatCurrency(
            bot.accumulated_profit
          )}
        />

        <StatCard
          title="Trading Asset"
          value={
            bot.trading_asset ??
            "--"
          }
        />

      </section>
            {/* ------------------------------------------------ */}
            {/*             BOT INFORMATION                      */}
            {/* ------------------------------------------------ */}

      <section
        className="
          rounded-2xl
          border
          border-white/10
          bg-[rgba(255,255,255,0.04)]
          p-6
        "
      >

        <h3
          className="
            mb-6
            text-lg
            font-bold
            text-white
          "
        >
          Bot Information
        </h3>

        <div
          className="
            grid
            gap-4
            md:grid-cols-2
          "
        >

          <InfoRow
            label="Plan"
            value={bot.bot_name ?? "--"}
          />

          <InfoRow
            label="Version"
            value={bot.version ?? "--"}
          />

          <InfoRow
            label="Activated"
            value={formatDate(
              bot.activated_at
            )}
          />

          <InfoRow
            label="Expires"
            value={formatDate(
              bot.expires_at
            )}
          />

          <InfoRow
            label="Auto Renew"
            value={
              bot.auto_renew
                ? "Enabled"
                : "Disabled"
            }
          />

          <InfoRow
            label="Total Trades"
            value={String(
              statistics?.total_trades ?? 0
            )}
          />

          <InfoRow
            label="Win Rate"
            value={formatPercent(
              statistics?.win_rate
            )}
          />

          <InfoRow
            label="ROI"
            value={formatPercent(
              statistics?.roi_percentage
            )}
          />

        </div>

      </section>

      {/* ------------------------------------------------ */}
      {/*                 RECENT TRADES                    */}
      {/* ------------------------------------------------ */}

      <section
        className="
          rounded-2xl
          border
          border-white/10
          bg-[rgba(255,255,255,0.04)]
          p-6
        "
      >

        <h3
          className="
            mb-6
            text-lg
            font-bold
            text-white
          "
        >
          Recent Trades
        </h3>

        {trades.length === 0 ? (

          <div
            className="
              rounded-xl
              border
              border-dashed
              border-white/10
              py-10
              text-center
              text-zinc-500
            "
          >
            No trades found.
          </div>

        ) : (

          <div
            className="
              overflow-x-auto
            "
          >

            <table
              className="
                w-full
                text-sm
              "
            >

              <thead>

                <tr
                  className="
                    border-b
                    border-white/10
                    text-left
                    text-zinc-400
                  "
                >

                  <th className="pb-3">
                    Asset
                  </th>

                  <th className="pb-3">
                    Profit
                  </th>

                  <th className="pb-3">
                    ROI
                  </th>

                  <th className="pb-3">
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
                      border-white/5
                    "
                  >

                    <td className="py-4 text-white">
                      {trade.asset}
                    </td>

                    <td className="py-4 text-emerald-400">
                      {formatCurrency(
                        trade.net_profit
                      )}
                    </td>

                    <td className="py-4 text-zinc-300">
                      {formatPercent(
                        trade.roi_percentage
                      )}
                    </td>

                    <td className="py-4 text-zinc-300">
                      {trade.status}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </section>
            {/* ------------------------------------------------ */}
      {/*                DEPOSIT HISTORY                   */}
      {/* ------------------------------------------------ */}

      <section
        className="
          rounded-2xl
          border
          border-white/10
          bg-[rgba(255,255,255,0.04)]
          p-6
        "
      >

        <h3
          className="
            mb-6
            text-lg
            font-bold
            text-white
          "
        >
          Deposit History
        </h3>

        {deposits.length === 0 ? (

          <div
            className="
              rounded-xl
              border
              border-dashed
              border-white/10
              py-10
              text-center
              text-zinc-500
            "
          >
            No deposits found.
          </div>

        ) : (

          <div
            className="
              overflow-x-auto
            "
          >

            <table
              className="
                w-full
                text-sm
              "
            >

              <thead>

                <tr
                  className="
                    border-b
                    border-white/10
                    text-left
                    text-zinc-400
                  "
                >

                  <th className="pb-3">
                    Amount
                  </th>

                  <th className="pb-3">
                    Type
                  </th>

                  <th className="pb-3">
                    Status
                  </th>

                  <th className="pb-3">
                    Date
                  </th>

                </tr>

              </thead>

              <tbody>

                {deposits.map((deposit) => (

                  <tr
                    key={deposit.id}
                    className="
                      border-b
                      border-white/5
                    "
                  >

                    <td className="py-4 text-white">
                      {formatCurrency(
                        deposit.investment_amount
                      )}
                    </td>

                    <td className="py-4 text-zinc-300">
                      {deposit.deposit_type}
                    </td>

                    <td className="py-4 text-zinc-300">
                      {deposit.status}
                    </td>

                    <td className="py-4 text-zinc-400">
                      {formatDate(
                        deposit.created_at
                      )}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </section>

      {/* ------------------------------------------------ */}
      {/*                 PROFIT HISTORY                   */}
      {/* ------------------------------------------------ */}

      <section
        className="
          rounded-2xl
          border
          border-white/10
          bg-[rgba(255,255,255,0.04)]
          p-6
        "
      >

        <h3
          className="
            mb-6
            text-lg
            font-bold
            text-white
          "
        >
          Profit History
        </h3>

        {history.length === 0 ? (

          <div
            className="
              rounded-xl
              border
              border-dashed
              border-white/10
              py-10
              text-center
              text-zinc-500
            "
          >
            No profit history available.
          </div>

        ) : (

          <div
            className="
              overflow-x-auto
            "
          >

            <table
              className="
                w-full
                text-sm
              "
            >

              <thead>

                <tr
                  className="
                    border-b
                    border-white/10
                    text-left
                    text-zinc-400
                  "
                >

                  <th className="pb-3">
                    Date
                  </th>

                  <th className="pb-3">
                    Profit
                  </th>

                  <th className="pb-3">
                    Balance
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
                    "
                  >

                    <td className="py-4 text-zinc-300">
                      {formatDate(
                        item.created_at
                      )}
                    </td>

                    <td className="py-4 text-emerald-400">
                      {formatCurrency(
                        item.profit_amount
                      )}
                    </td>

                    <td className="py-4 text-white">
                      {formatCurrency(
                         item.running_balance
                      )}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </section>
      
     {/* ------------------------------------------------ */}
      {/*                  ACTIVITY LOGS                   */}
      {/* ------------------------------------------------ */}

      <section
        className="
          rounded-2xl
          border
          border-white/10
          bg-[rgba(255,255,255,0.04)]
          p-6
        "
      >

        <h3
          className="
            mb-6
            text-lg
            font-bold
            text-white
          "
        >
          Activity Logs
        </h3>

        {logs.length === 0 ? (

          <div
            className="
              rounded-xl
              border
              border-dashed
              border-white/10
              py-10
              text-center
              text-zinc-500
               "
            >
            No activity logs found.
          </div>

        ) : (

          <div
            className="
              space-y-4
               "
            
          >

            {logs.map((log) => (

              <div
                key={log.id}
                className="
                  rounded-xl
                  border
                  border-white/10
                  bg-white/[0.03]
                  p-4
                "
              >

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-4
                  "
                >

                  <div>

                    <p
                      className="
                        font-medium
                        text-white
                      "
                    >
                      {log.action}
                    </p>

                    <p
                      className="
                        mt-1
                        text-sm
                        text-zinc-400
                      "
                    >
                      {log.message}
                    </p>

                  </div>

                  <span
                    className="
                      whitespace-nowrap
                      text-xs
                      text-zinc-500
                    "
                  >
                    {formatDate(
                      log.created_at
                    )}
                  </span>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

    </div>

  );

}


interface StatCardProps {
  title: string;
  value: string;
}

function StatCard({
  title,
  value,
}: StatCardProps) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-white/10
        bg-white/[0.04]
        p-5
      "
    >
      <p
        className="
          text-sm
          text-zinc-400
        "
      >
        {title}
      </p>

      <h3
        className="
          mt-3
          text-2xl
          font-bold
          text-white
        "
      >
        {value}
      </h3>
    </div>
  );
}

interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({
  label,
  value,
}: InfoRowProps) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        border-b
        border-white/5
        pb-3
      "
    >
      <span
        className="
          text-zinc-400
        "
      >
        {label}
      </span>

      <span
        className="
          font-medium
          text-white
        "
      >
        {value}
      </span>
    </div>
  );
}