import Link from "next/link";

import {
  getAdminBotLogs,
} from "@/lib/trading-bot/admin-service";


export default async function AdminBotLogsPage() {

  const result =
    await getAdminBotLogs();

  if (result.error) {

    return (
      <div className="space-y-6 p-4 md:p-6">

        <div>

          <h1 className="text-2xl font-bold">
            Bot Logs
          </h1>

          <p className="text-sm text-zinc-400">
            Monitor trading bot activity and system events.
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

  const logs =
    result.data ?? [];

  const infoLogs =
    logs.filter(
      (log) =>
        log.severity === "info"
    ).length;

  const warningLogs =
    logs.filter(
      (log) =>
        log.severity === "warning"
    ).length;

  const errorLogs =
    logs.filter(
      (log) =>
        log.severity === "error"
    ).length;

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
            Bot Logs
          </h1>

          <p className="text-sm text-zinc-400">
            Monitor trading bot activity and system events.
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
            Total Logs
          </p>

          <p className="
            mt-2
            text-2xl
            font-bold
            text-white
          ">
            {logs.length}
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
            Info
          </p>

          <p className="
            mt-2
            text-2xl
            font-bold
            text-blue-400
          ">
            {infoLogs}
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
            Warnings
          </p>

          <p className="
            mt-2
            text-2xl
            font-bold
            text-yellow-400
          ">
            {warningLogs}
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
            Errors
          </p>

          <p className="
            mt-2
            text-2xl
            font-bold
            text-red-400
          ">
            {errorLogs}
          </p>

        </div>

      </div>


      {/* Logs */}

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
          p-5
          sm:p-6
        ">

          <h2 className="
            text-lg
            font-bold
            text-white
            sm:text-xl
          ">
            Trading Bot Logs
          </h2>

          <p className="
            mt-1
            text-xs
            text-zinc-400
            sm:text-sm
          ">
            {logs.length} log
            {logs.length === 1 ? "" : "s"} found.
          </p>

        </div>


        {logs.length === 0 ? (

          <div className="
            p-8
            text-center
            text-sm
            text-zinc-400
          ">
            No bot logs found.
          </div>

        ) : (

          <>

            {/* Mobile Logs */}

            <div className="
              divide-y
              divide-zinc-800
              md:hidden
            ">

              {logs.map((log) => (

                <div
                  key={log.id}
                  className="
                    space-y-4
                    p-5
                  "
                >

                  <div className="
                    flex
                    items-start
                    justify-between
                    gap-3
                  ">

                    <div className="min-w-0">

                      <p className="
                        break-words
                        text-sm
                        font-semibold
                        text-white
                      ">
                        {log.action}
                      </p>

                      <p className="
                        mt-1
                        text-xs
                        text-zinc-500
                      ">
                        {log.created_at
                          ? new Date(
                              log.created_at
                            ).toLocaleString()
                          : "-"}
                      </p>

                    </div>


                    <span
                      className={`
                        shrink-0
                        rounded-full
                        px-2.5
                        py-1
                        text-[11px]
                        font-semibold
                        ${
                          log.severity === "error"
                            ? "bg-red-500/20 text-red-400"
                            : log.severity === "warning"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-blue-500/20 text-blue-400"
                        }
                      `}
                    >
                      {log.severity}
                    </span>

                  </div>


                  <div>

                    <p className="
                      text-[11px]
                      uppercase
                      tracking-wide
                      text-zinc-500
                    ">
                      Message
                    </p>

                    <p className="
                      mt-1
                      break-words
                      text-sm
                      leading-6
                      text-zinc-300
                    ">
                      {log.message}
                    </p>

                  </div>


                  <div className="
                    grid
                    grid-cols-2
                    gap-4
                  ">

                    <div className="min-w-0">

                      <p className="
                        text-[11px]
                        uppercase
                        tracking-wide
                        text-zinc-500
                      ">
                        Type
                      </p>

                      <p className="
                        mt-1
                        break-words
                        text-xs
                        text-zinc-300
                      ">
                        {log.log_type}
                      </p>

                    </div>


                    <div className="min-w-0">

                      <p className="
                        text-[11px]
                        uppercase
                        tracking-wide
                        text-zinc-500
                      ">
                        Bot
                      </p>

                      <p className="
                        mt-1
                        break-all
                        font-mono
                        text-[11px]
                        text-zinc-500
                      ">
                        {log.bot_id ?? "-"}
                      </p>

                    </div>

                  </div>

                </div>

              ))}

            </div>


            {/* Desktop Logs */}

            <div className="
              hidden
              overflow-x-auto
              md:block
            ">

              <table className="min-w-full text-sm">

                <thead className="
                  border-b
                  border-zinc-800
                  bg-zinc-950
                  text-zinc-400
                ">

                  <tr>

                    <th className="px-5 py-4 text-left">
                      Date
                    </th>

                    <th className="px-5 py-4 text-left">
                      Action
                    </th>

                    <th className="px-5 py-4 text-left">
                      Type
                    </th>

                    <th className="px-5 py-4 text-left">
                      Message
                    </th>

                    <th className="px-5 py-4 text-left">
                      Severity
                    </th>

                    <th className="px-5 py-4 text-left">
                      Bot ID
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {logs.map((log) => (

                    <tr
                      key={log.id}
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
                        text-zinc-500
                      ">

                        {log.created_at
                          ? new Date(
                              log.created_at
                            ).toLocaleString()
                          : "-"}

                      </td>


                      <td className="
                        whitespace-nowrap
                        px-5
                        py-4
                        font-medium
                        text-white
                      ">
                        {log.action}
                      </td>


                      <td className="px-5 py-4">

                        <span className="
                          rounded-full
                          bg-zinc-800
                          px-3
                          py-1
                          text-xs
                          font-semibold
                          text-zinc-300
                        ">
                          {log.log_type}
                        </span>

                      </td>


                      <td className="
                        max-w-md
                        px-5
                        py-4
                      ">
                        {log.message}
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
                              log.severity === "error"
                                ? "bg-red-500/20 text-red-400"
                                : log.severity === "warning"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-blue-500/20 text-blue-400"
                            }
                          `}
                        >
                          {log.severity}
                        </span>

                      </td>


                      <td className="
                        whitespace-nowrap
                        px-5
                        py-4
                        font-mono
                        text-xs
                        text-zinc-500
                      ">
                        {log.bot_id ?? "-"}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </>

        )}

      </div>

    </div>
  );
}