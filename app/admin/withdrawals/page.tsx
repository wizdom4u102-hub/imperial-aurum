'use client'

import { useEffect, useMemo, useState } from 'react'

export default function ManageWithdrawals() {

  const [withdrawals, setWithdrawals] =
    useState<any[]>([])

  const [loading, setLoading] =
    useState(true)

  const [filter, setFilter] =
    useState<'all' | 'pending' | 'completed' | 'rejected'>(
      'all'
    )

  // =====================================================
  // FETCH WITHDRAWALS
  // =====================================================

  const fetchWithdrawals =
    async () => {

      try {

        setLoading(true)

        const res =
          await fetch(
            '/api/admin/withdrawals',
            {
              method: 'GET',
              credentials: 'include',
              cache: 'no-store',
            }
          )

        const data =
          await res.json()

        console.log(
          'WITHDRAWALS API:',
          data
        )

        // =====================================================
        // SAFE ARRAY FIX
        // =====================================================

        if (
          Array.isArray(
            data?.withdrawals
          )
        ) {

          setWithdrawals(
            data.withdrawals
          )

        } else if (
          Array.isArray(data)
        ) {

          setWithdrawals(data)

        } else {

          setWithdrawals([])

        }

      } catch (err) {

        console.error(
          'FETCH WITHDRAWALS ERROR:',
          err
        )

        setWithdrawals([])

      } finally {

        setLoading(false)

      }

    }

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
  fetchWithdrawals()
}, [])

  // =====================================================
  // FILTERED DATA
  // =====================================================

  const filteredWithdrawals =
    useMemo(() => {

      if (
        filter === 'all'
      ) {

        return withdrawals

      }

      return withdrawals.filter(
        (w) =>
          String(
            w.status
          ).toLowerCase() === filter
      )

    }, [
      withdrawals,
      filter
    ])

  // =====================================================
  // APPROVE
  // =====================================================

  const approveWithdrawal =
    async (id: string) => {

      try {

        const res =
          await fetch(
            `/api/admin/withdrawals/${id}/approve`,
            {
              method: 'POST',
              credentials: 'include',
            }
          )

        const data =
          await res.json()

        console.log(
          ':',
          data
        )

        if (!res.ok) {

          alert(
            data.error ||
            'Failed to approve withdrawal'
          )

          return

        }

        alert(
          'Withdrawal approved ✅'
        )

        // =====================================================
        // INSTANT UI UPDATE
        // =====================================================

        setWithdrawals(
          (prev) =>
            prev.map((w) =>
              w.id === id
                ? {
                    ...w,
                    status:
                      'completed',
                  }
                : w
            )
        )

        // refresh latest
        fetchWithdrawals()

      } catch (err) {

        console.error(err)

        alert(
          'Something went wrong'
        )

      }

    }

  // =====================================================
  // REJECT
  // =====================================================

  const rejectWithdrawal =
    async (id: string) => {

      try {

        const res =
          await fetch(
            `/api/admin/withdrawals/${id}/reject`,
            {
              method: 'POST',
              credentials: 'include',
            }
          )

        const data =
          await res.json()

        console.log(
          'REJECT:',
          data
        )

        if (!res.ok) {

          alert(
            data.error ||
            'Failed to reject withdrawal'
          )

          return

        }

        alert(
          'Withdrawal rejected ❌'
        )

        // =====================================================
        // INSTANT UI UPDATE
        // =====================================================

        setWithdrawals(
          (prev) =>
            prev.map((w) =>
              w.id === id
                ? {
                    ...w,
                    status:
                      'rejected',
                  }
                : w
            )
        )

        fetchWithdrawals()

      } catch (err) {

        console.error(err)

        alert(
          'Something went wrong'
        )

      }

    }

  return (

    <div className="p-10 min-h-screen bg-black text-white">

      <div className="max-w-7xl mx-auto">

        {/* ===================================================== */}
        {/* HEADER */}
        {/* ===================================================== */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">

          <div>

            <h1 className="text-4xl font-bold">
              Manage Withdrawals
            </h1>

            <p className="text-zinc-400 mt-2">
              View pending, approved and rejected withdrawals
            </p>

          </div>

          {/* ===================================================== */}
          {/* FILTERS */}
          {/* ===================================================== */}

          <div className="flex flex-wrap gap-3">

            <button
              onClick={() =>
                setFilter('all')
              }
              className={`px-6 py-3 rounded-2xl text-sm font-medium transition ${
                filter === 'all'
                  ? 'bg-yellow-400 text-black'
                  : 'bg-zinc-800 text-white'
              }`}
            >
              All Withdrawals
            </button>

            <button
              onClick={() =>
                setFilter(
                  'pending'
                )
              }
              className={`px-6 py-3 rounded-2xl text-sm font-medium transition ${
                filter === 'pending'
                  ? 'bg-amber-500 text-black'
                  : 'bg-zinc-800 text-white'
              }`}
            >
              Pending
            </button>

            <button
              onClick={() =>
                setFilter(
                  'completed'
                )
              }
              className={`px-6 py-3 rounded-2xl text-sm font-medium transition ${
                filter === 'completed'
                  ? 'bg-green-500 text-black'
                  : 'bg-zinc-800 text-white'
              }`}
            >
              Approved
            </button>

            <button
              onClick={() =>
                setFilter(
                  'rejected'
                )
              }
              className={`px-6 py-3 rounded-2xl text-sm font-medium transition ${
                filter === 'rejected'
                  ? 'bg-red-500 text-white'
                  : 'bg-zinc-800 text-white'
              }`}
            >
              Rejected
            </button>

          </div>

        </div>

        {/* ===================================================== */}
        {/* CONTENT */}
        {/* ===================================================== */}

        <div className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800">

          {/* ===================================================== */}
          {/* LOADING */}
          {/* ===================================================== */}

          {loading && (

            <div className="py-20 text-center">

              <p className="text-zinc-400 animate-pulse">
                Loading withdrawals...
              </p>

            </div>

          )}

          {/* ===================================================== */}
          {/* EMPTY */}
          {/* ===================================================== */}

          {!loading &&
            filteredWithdrawals.length === 0 && (

            <div className="py-20 text-center">

              <p className="text-zinc-500 text-lg">
                No withdrawal requests found.
              </p>

            </div>

          )}

          {/* ===================================================== */}
          {/* LIST */}
          {/* ===================================================== */}

          <div className="space-y-4">

            {filteredWithdrawals.map(
              (w: any) => {

                const status =
                  String(
                    w.status || ''
                  ).toLowerCase()

                const statusColor =
                  status ===
                  'completed'
                    ? 'text-green-400 bg-green-500/10 border-green-500/30'
                    : status ===
                      'pending'
                    ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                    : 'text-red-400 bg-red-500/10 border-red-500/30'

                return (

                  <div
                    key={w.id}
                    className="bg-zinc-800 border border-zinc-700 rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
                  >

                    {/* ===================================================== */}
                    {/* LEFT */}
                    {/* ===================================================== */}

                    <div>

                      <p className="text-2xl font-bold text-white">
                        $
                        {Number(
                          w.amount || 0
                        ).toFixed(2)}
                      </p>

                      <p className="text-sm text-zinc-400 mt-2 break-all">
                        User ID:
                        {' '}
                        {w.user_id}
                      </p>

                      {w.wallet_address && (

                        <p className="text-sm text-zinc-500 mt-1 break-all">
                          Wallet:
                          {' '}
                          {w.wallet_address}
                        </p>

                      )}

                      <p className="text-xs text-zinc-500 mt-2">
                        {new Date(
                          w.created_at
                        ).toLocaleString()}
                      </p>

                    </div>

                    {/* ===================================================== */}
                    {/* RIGHT */}
                    {/* ===================================================== */}

                    <div className="flex flex-col lg:items-end gap-4">

                      <div
                        className={`px-4 py-2 rounded-full border text-sm font-bold capitalize ${statusColor}`}
                      >
                        {status}
                      </div>

                      {/* ===================================================== */}
                      {/* ACTIONS */}
                      {/* ===================================================== */}

                      {status ===
                        'pending' && (

                        <div className="flex gap-3">

                          {/* APPROVE */}

                          <button
                            onClick={() =>
                              approveWithdrawal(
                                w.id
                              )
                            }
                            className="px-5 py-2 bg-green-500 hover:bg-green-400 text-black rounded-xl font-bold transition"
                          >
                            Approve
                          </button>

                          {/* REJECT */}

                          <button
                            onClick={() =>
                              rejectWithdrawal(
                                w.id
                              )
                            }
                            className="px-5 py-2 bg-red-500 hover:bg-red-400 text-white rounded-xl font-bold transition"
                          >
                            Reject
                          </button>

                        </div>

                      )}

                    </div>

                  </div>

                )

              }
            )}

          </div>

        </div>

      </div>

    </div>

  )

}