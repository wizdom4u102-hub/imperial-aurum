// app/admin/trading-bot/deposits/page.tsx

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

type DepositStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled"
  | "expired";

interface BotDeposit {
  id: string;
  reference: string;
  user_id: string;

  investment_amount: number;

  status: DepositStatus;

  created_at: string;

  deposit_type: "new_bot" | "top_up";

  bot: {
    id: string;
    bot_name: string;
  } | null;

  proof_image: string | null;

  transaction_hash: string | null;

  payment_method_name: string | null;

  payment_network: string | null;

  payment_wallet: string | null;

  notes: string | null;

  plan: {
    id: string;
    name: string;
    trading_asset: string;
  } | null;

  profile: {
    name: string | null;
    email: string | null;
  } | null;
}

const PAGE_SIZE = 10;

export default function AdminTradingBotDepositsPage() {
  const [loading, setLoading] =
    useState(true);

  const [actionLoading, setActionLoading] =
    useState<string | null>(null);

  const [deposits, setDeposits] =
    useState<BotDeposit[]>([]);

  const [status, setStatus] =
    useState<DepositStatus | "all">("pending");

  const [search, setSearch] =
    useState("");

  const [page, setPage] =
    useState(1);

  const loadDeposits =
    useCallback(async () => {
      setLoading(true);

      try {
        const params =
          new URLSearchParams();

        if (status !== "all") {
          params.set(
            "status",
            status
          );
        }

        if (
          search.trim().length > 0
        ) {
          params.set(
            "search",
            search
          );
        }

        const response =
          await fetch(
            `/api/admin/trading-bot/deposits?${params.toString()}`
          );

        const json =
          await response.json();

        if (!response.ok) {
          throw new Error(
            json.error ??
              "Unable to load deposits."
          );
        }

        setDeposits(
          json.deposits ?? []
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, [status, search]);

  useEffect(() => {
    loadDeposits();
  }, [loadDeposits]);

  const filtered =
    useMemo(() => {
      return deposits;
    }, [deposits]);

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filtered.length /
          PAGE_SIZE
      )
    );

  const paginated =
    filtered.slice(
      (page - 1) *
        PAGE_SIZE,
      page * PAGE_SIZE
    );

  useEffect(() => {
    if (page > totalPages) {
      setPage(1);
    }
  }, [page, totalPages]);

  async function approveDeposit(
    depositId: string
  ) {
    setActionLoading(
      depositId
    );

    try {
      const response =
        await fetch(
          "/api/admin/trading-bot/deposits/approve",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              depositId,
            }),
          }
        );

      const json =
        await response.json();

      if (!response.ok) {
        throw new Error(
          json.error ??
            "Approval failed."
        );
      }

      await loadDeposits();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Approval failed."
      );
    } finally {
      setActionLoading(
        null
      );
    }
  }

  async function rejectDeposit(
    depositId: string
  ) {
    setActionLoading(
      depositId
    );

    try {
      const response =
        await fetch(
          "/api/admin/trading-bot/deposits/reject",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              depositId,
            }),
          }
        );

      const json =
        await response.json();

      if (!response.ok) {
        throw new Error(
          json.error ??
            "Reject failed."
        );
      }

      await loadDeposits();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Reject failed."
      );
    } finally {
      setActionLoading(
        null
      );
    }
  }

  async function expireDeposit(
    depositId: string
  ) {
    setActionLoading(
      depositId
    );

    try {
      const response =
        await fetch(
          "/api/admin/trading-bot/deposits/expire",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              depositId,
            }),
          }
        );

      const json =
        await response.json();

      if (!response.ok) {
        throw new Error(
          json.error ??
            "Expire failed."
        );
      }

      await loadDeposits();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Expire failed."
      );
    } finally {
      setActionLoading(
        null
      );
    }
  }

    return (
    <div className="space-y-6 p-4 md:p-6">

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-2xl font-bold">
            Trading Bot Deposits
          </h1>

          <p className="text-sm text-zinc-400">
            Review and manage user trading bot investment requests.
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
hover:bg-yellow-400
hover:text-black
transition
"
        >
          Trading Bot Dashboard
        </Link>

      </div>



      {/* Filters */}
      <div className="rounded-2xl
border
border-zinc-800
bg-zinc-900
p-6">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">


          {/* Search */}
          <input
            type="text"
            placeholder="Search email, reference..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="
              h-10
              w-full
              rounded-lg
              border
              px-3
              text-sm
              outline-none
              focus:ring-2
              lg:max-w-sm
            "
          />



          {/* Status */}
          <select
            value={status}
            onChange={(e) => {
              setStatus(
                e.target.value as
                  | DepositStatus
                  | "all"
              );

              setPage(1);
            }}
            className="
              h-10
              rounded-lg
              border
              px-3
              text-sm
            "
          >

            <option value="pending">
              Pending Confirmation
            </option>

            <option value="approved">
              Approved
            </option>

            <option value="rejected">
              Rejected
            </option>

            <option value="expired">
              Expired
            </option>

            <option value="all">
              All
            </option>

          </select>


        </div>

      </div>




      {/* Desktop Table */}
      <div className="hidden overflow-x-auto rounded-xl border md:block">

        <table className="w-full text-sm">

          <thead className="bg-zinc-950">

            <tr>

              <th className="px-4 py-3 text-left">
                Type
              </th>

              <th className="px-4 py-3 text-left">
                User
              </th>


              <th className="px-4 py-3 text-left">
                Plan
              </th>


              <th className="px-4 py-3 text-left">
                Asset
              </th>


              <th className="px-4 py-3 text-left">
                Amount
              </th>


              <th className="px-4 py-3 text-left">
                Status
              </th>


              <th className="px-4 py-3 text-left">
                Date
              </th>


              <th className="px-4 py-3 text-right">
                Actions
              </th>


            </tr>

          </thead>



          <tbody>


            {loading && (

              <tr>

                <td
                  colSpan={7}
                  className="px-4 py-8 text-center"
                >
                  Loading deposits...
                </td>

              </tr>

            )}



            {!loading &&
              paginated.length === 0 && (

              <tr>

                <td
                  colSpan={7}
                  className="px-4 py-8 text-center"
                >
                  No deposits found.
                </td>

              </tr>

            )}



            {!loading &&
              paginated.map(
                (deposit) => (

                <tr
                  key={deposit.id}
                  className="border-t"
                >

                  <td className="px-4 py-3">

                    <div className="font-medium">
                      {
                        deposit.profile
                          ?.name ??
                        "Unknown"
                      }
                    </div>


                    <div className="text-xs text-zinc-400">
                      {
                        deposit.profile
                          ?.email ??
                        "-"
                      }
                    </div>

                  </td>

                  <td className="px-4 py-3">
  {deposit.deposit_type === "top_up" ? (
    <div className="space-y-1">
      <span className="rounded-full bg-blue-500/20 px-2 py-1 text-xs text-blue-400">
        Top Up
      </span>

      <div className="text-xs text-zinc-400">
        {deposit.bot?.bot_name ?? "-"}
      </div>
    </div>
  ) : (
    <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-xs text-emerald-400">
      New Bot
    </span>
  )}
</td>

<td className="px-4 py-3">
  {deposit.plan?.name ?? "-"}
</td>



                  <td className="px-4 py-3">

                    {
                      deposit.plan
                        ?.trading_asset ??
                      "-"
                    }

                  </td>



                  <td className="px-4 py-3">

                    $
                    {deposit.investment_amount.toLocaleString()}

                  </td>



                  <td className="px-4 py-3">

                    <span
                      className="
                        rounded-full
                        border
                        px-2
                        py-1
                        text-xs
                      "
                    >
                      {
                        deposit.status
                      }

                    </span>

                  </td>



                  <td className="px-4 py-3">

                    {
                      new Date(
                        deposit.created_at
                      ).toLocaleDateString()
                    }

                  </td>



                  <td className="px-4 py-3 text-right">

                    <div className="flex justify-end gap-2">


                      <button
                        onClick={() =>
                          approveDeposit(
                            deposit.id
                          )
                        }
                        disabled={
                          actionLoading ===
                          deposit.id
                        }
                        className="
                          rounded-lg
                          bg-green-600
                          px-3
                          py-1.5
                          text-xs
                          text-white
                          disabled:opacity-50
                        "
                      >
                        Approve
                      </button>



                      <button
                        onClick={() =>
                          rejectDeposit(
                            deposit.id
                          )
                        }
                        disabled={
                          actionLoading ===
                          deposit.id
                        }
                        className="
                          rounded-lg
                          bg-red-600
                          px-3
                          py-1.5
                          text-xs
                          text-white
                          disabled:opacity-50
                        "
                      >
                        Reject
                      </button>



                      <button
                        onClick={() =>
                          expireDeposit(
                            deposit.id
                          )
                        }
                        disabled={
                          actionLoading ===
                          deposit.id
                        }
                        className="
                          rounded-lg
                          bg-gray-600
                          px-3
                          py-1.5
                          text-xs
                          text-white
                          disabled:opacity-50
                        "
                      >
                        Expire
                      </button>


                    </div>

                  </td>


                </tr>

              ))}


          </tbody>


        </table>


      </div>
            {/* Mobile Cards */}
      <div className="space-y-4 md:hidden">


        {loading && (

          <div className="rounded-xl border p-6 text-center text-sm">
            Loading deposits...
          </div>

        )}



        {!loading &&
          paginated.length === 0 && (

          <div className="rounded-xl border p-6 text-center text-sm">
            No deposits found.
          </div>

        )}



        {!loading &&
          paginated.map(
            (deposit) => (

            <div
              key={deposit.id}
              className="
                rounded-xl
                border
                bg-background
                p-4
                space-y-4
              "
            >


              <div className="flex items-start justify-between">

                <div>

                  <h3 className="font-semibold">

                    {
                      deposit.profile
                        ?.name ??
                      "Unknown User"
                    }

                  </h3>


                  <p className="text-xs text-zinc-400">

                    {
                      deposit.profile
                        ?.email ??
                      "-"
                    }

                  </p>


                </div>



                <span
                  className="
                    rounded-full
                    border
                    px-2
                    py-1
                    text-xs
                  "
                >

                  {
                    deposit.status
                  }

                </span>


              </div>




              <div className="grid grid-cols-2 gap-3 text-sm">


                <div>

                  <p className="text-zinc-400">
                    Plan
                  </p>

                  <p className="font-medium">

                    {
                      deposit.plan
                        ?.name ??
                      "-"
                    }

                  </p>

                </div>



                <div>

                  <p className="text-zinc-400">
                    Asset
                  </p>

                  <p className="font-medium">

                    {
                      deposit.plan
                        ?.trading_asset ??
                      "-"
                    }

                  </p>

                </div>




                <div>

                  <p className="text-zinc-400">
                    Amount
                  </p>

                  <p className="font-medium">

                    $
                    {
                      deposit.investment_amount.toLocaleString()
                    }

                  </p>

                </div>



                <div>

                  <p className="text-zinc-400">
                    Date
                  </p>

                  <p className="font-medium">

                    {
                      new Date(
                        deposit.created_at
                      ).toLocaleDateString()
                    }

                  </p>

                </div>


              </div>




              <div>

                <p className="text-zinc-400 text-sm">
                  Reference
                </p>

                <p className="text-sm font-medium break-all">

                  {
                    deposit.reference
                  }

                </p>

              </div>




              <div className="flex flex-col gap-2">


                <button
                  onClick={() =>
                    approveDeposit(
                      deposit.id
                    )
                  }
                  disabled={
                    actionLoading ===
                    deposit.id
                  }
                  className="
                    rounded-lg
                    bg-green-600
                    px-3
                    py-2
                    text-sm
                    text-white
                    disabled:opacity-50
                  "
                >

                  Approve

                </button>




                <button
                  onClick={() =>
                    rejectDeposit(
                      deposit.id
                    )
                  }
                  disabled={
                    actionLoading ===
                    deposit.id
                  }
                  className="
                    rounded-lg
                    bg-red-600
                    px-3
                    py-2
                    text-sm
                    text-white
                    disabled:opacity-50
                  "
                >

                  Reject

                </button>




                <button
                  onClick={() =>
                    expireDeposit(
                      deposit.id
                    )
                  }
                  disabled={
                    actionLoading ===
                    deposit.id
                  }
                  className="
                    rounded-lg
                    bg-gray-600
                    px-3
                    py-2
                    text-sm
                    text-white
                    disabled:opacity-50
                  "
                >

                  Expire

                </button>


              </div>



            </div>

          ))}



      </div>




      {/* Pagination */}

      <div className="flex items-center justify-between rounded-xl border p-4">


        <button
          disabled={
            page === 1
          }
          onClick={() =>
            setPage(
              (prev) =>
                Math.max(
                  1,
                  prev - 1
                )
            )
          }
          className="
            rounded-lg
            border
            px-4
            py-2
            text-sm
            disabled:opacity-50
          "
        >

          Previous

        </button>



        <span className="text-sm">

          Page {page} of {totalPages}

        </span>




        <button
          disabled={
            page === totalPages
          }
          onClick={() =>
            setPage(
              (prev) =>
                Math.min(
                  totalPages,
                  prev + 1
                )
            )
          }
          className="
            rounded-lg
            border
            px-4
            py-2
            text-sm
            disabled:opacity-50
          "
        >

          Next

        </button>


      </div>


    </div>
  );
}