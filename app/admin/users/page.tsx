'use client'

import { useEffect, useRef, useState } from 'react'
import UserTransactions from '@/components/admin/UserTransactions'
import UserActions from '@/components/admin/UserActions'

type User = {
  id: string
  email: string
  status: string
  is_admin?: boolean
  verified?: boolean
  created_at?: string | null
}

type Stats = {
  cash?: number;
  gold?: number;
  shares?: number;
  totalDeposits?: number;
  totalWithdrawals?: number;
  totalInvestments?: number;
  totalTransactions?: number;
  totalInterest?: number;
  totalBonus?: number;
  confirmedWithdrawals?: number;
  pendingWithdrawals?: number;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')

  const [selectedUser, setSelectedUser] =
    useState<User | null>(null)

  const [stats, setStats] = useState<Stats | null>(null);

  const [statsLoading, setStatsLoading] =
    useState(false)

  const [showTransactions, setShowTransactions] =
    useState(false)

  const isMounted = useRef(true)

  // ================= CLEANUP =================
  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  // ================= FETCH USERS =================
  async function fetchUsers() {
    try {
      console.log(
        '================ FETCH USERS ================'
      )

      setLoading(true)

      const res = await fetch('/api/admin/users?t=' + Date.now(), {
  method: 'GET',
  cache: 'no-store',
  credentials: 'include',
})

      console.log('USERS STATUS:', res.status)

      if (!res.ok) {
        const text = await res.text()

        console.error(
          '❌ USERS API ERROR:',
          text
        )

        if (isMounted.current) {
          setUsers([])
        }

        return
      }

      let data: any = null

      try {
        data = await res.json()
      } catch (err) {
        console.error(
          '❌ INVALID USERS JSON:',
          err
        )

        if (isMounted.current) {
          setUsers([])
        }

        return
      }

      console.log('✅ USERS RESPONSE:', data)

      if (isMounted.current) {
        setUsers(
          Array.isArray(data.users)
            ? data.users
            : []
        )
      }

    } catch (err) {
      console.error(
        '❌ FETCH USERS FAILED:',
        err
      )

      if (isMounted.current) {
        setUsers([])
      }

    } finally {
      if (isMounted.current) {
        setLoading(false)
      }
    }
  }

  // ================= INITIAL LOAD =================
  useEffect(() => {
    fetchUsers()
  }, [])

  // ================= FETCH USER STATS =================
async function fetchstats(userId: string) {
  try {
    console.log(
      '================ FETCH USER STATS ================'
    );

    console.log('USER ID:', userId);

    setStatsLoading(true);

    const res = await fetch(
      `/api/admin/users/${userId}/stats`,
      {
        method: 'GET',
        cache: 'no-store',
        credentials: 'include',
      }
    );

    console.log(
      'STATS STATUS:',
      res.status
    );

    let data: any = null;

    try {
      data = await res.json();
    } catch (err) {
      console.error(
        '❌ INVALID STATS JSON:',
        err
      );
      data = null;
    }

    if (!res.ok) {
      console.error(
        '❌ STATS ERROR:',
        {
          status: res.status,
          statusText: res.statusText,
          response: data
        }
      );

      if (isMounted.current) {
        setStats({
          cash: 0,
          gold: 0,
          shares: 0,
          totalDeposits: 0,
          totalWithdrawals: 0,
          totalInvestments: 0,
          totalTransactions: 0,
          totalInterest: 0,
          totalBonus: 0,
          confirmedWithdrawals: 0,
          pendingWithdrawals: 0,
        });
      }
      return;
    }

    console.log('✅ USER STATS:', data);

    if (isMounted.current) {
      setStats({
        cash: Number(data.cash || 0),
        gold: Number(data.gold || 0),
        shares: Number(data.shares || 0),
        totalDeposits: Number(data.totalDeposits || 0),
        totalWithdrawals: Number(data.totalWithdrawals || 0),
        totalInvestments: Number(data.investments || 0),
        totalTransactions: Number(data.transactions || 0),
        totalInterest: Number(data.totalInterest || 0),
        totalBonus: Number(data.totalBonus || 0),
        confirmedWithdrawals: Number(data.confirmedWithdrawals || 0),
        pendingWithdrawals: Number(data.pendingWithdrawals || 0),
      });
    }
  } catch (err) {
    console.error(
      '❌ FETCH USER STATS FAILED:',
      err
    );

    if (isMounted.current) {
      setStats({
        cash: 0,
        gold: 0,
        shares: 0,
        totalDeposits: 0,
        totalWithdrawals: 0,
        totalInvestments: 0,
        totalTransactions: 0,
        totalInterest: 0,
        totalBonus: 0,
        confirmedWithdrawals: 0,
        pendingWithdrawals: 0,
      });
    }
  } finally {
    if (isMounted.current) {
      setStatsLoading(false);
    }
  }
}

  // ================= OPEN USER =================
  async function openUser(user: User) {
    console.log('OPEN USER:', user.id)

    setSelectedUser(user)

    setStats(null)

    setShowTransactions(false)

    requestAnimationFrame(() => {
      fetchstats(user.id)
    })
  }

  // ================= CLOSE USER =================
  function closeUser() {
    setSelectedUser(null)

    setStats(null)

    setShowTransactions(false)
  }

  // ================= FILTER USERS =================
  const filteredUsers = users.filter((user) => {
    const value =
      `${user.email} ${user.status}`
        .toLowerCase()

    return value.includes(
      search.toLowerCase()
    )
  })

  // ================= FORMAT MONEY =================
  function money(value: number) {
    return new Intl.NumberFormat(
      'en-US',
      {
        style: 'currency',
        currency: 'USD',
      }
    ).format(Number(value || 0))
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">

          <div>
            <h1 className="text-4xl font-bold text-yellow-400">
              Manage Users
            </h1>

            <p className="text-zinc-400 mt-2">
              Imperial Aurum Admin Control
            </p>
          </div>

          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-3 text-white outline-none"
          />

        </div>

        {/* USERS TABLE */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">

          <table className="w-full">

            <thead className="bg-zinc-950 text-zinc-400">
  <tr>
    <th className="p-4 text-left">Name</th>
    <th>Email</th>
    <th>Status</th>
    <th>Verified</th>
    <th>Role</th>
    <th>Joined</th>
    <th className="text-right pr-4">Actions</th>
  </tr>
</thead>

            <tbody>

              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center p-10 text-zinc-500"
                  >
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center p-10 text-zinc-500"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-t border-zinc-800"
                  >

                    <td className="p-5">
  {user.email?.split('@')[0]}
</td>

<td className="p-5">
  {user.email}
</td>

                    <td className="p-5">

                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          user.status ===
                          'active'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {user.status}
                      </span>

                    </td>

                    <td className="p-5">

                      {user.verified ? (
                        <span className="text-emerald-400">
                          Verified
                        </span>
                      ) : (
                        <span className="text-red-400">
                          Not Verified
                        </span>
                      )}

                    </td>

                    <td className="p-5">

                      {user.is_admin ? (
                        <span className="text-yellow-400 font-semibold">
                          Admin
                        </span>
                      ) : (
                        <span className="text-zinc-400">
                          User
                        </span>
                      )}

                    </td>

                    <td className="p-5 text-zinc-400">

                      {user.created_at
                        ? new Date(
                            user.created_at
                          ).toLocaleDateString()
                        : '-'}

                    </td>

                    <td className="p-5">

                      <button
                        onClick={() =>
                          openUser(user)
                        }
                        className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-xl font-semibold"
                      >
                        Open
                      </button>

                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* USER MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6">

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-7xl flex overflow-hidden">

            {/* LEFT */}
            <UserActions
              userId={selectedUser.id}
              status={selectedUser.status}
              onActionComplete={() =>
                fetchstats(
                  selectedUser.id
                )
              }
            />

            {/* RIGHT */}
            <div className="flex-1 p-8 overflow-y-auto max-h-[90vh]">

              <div className="flex items-center justify-between mb-8">

                <div>

                  <h2 className="text-3xl font-bold text-white">
                    User Dashboard
                  </h2>

                  <p className="text-zinc-400 mt-2">
                    {selectedUser.email}
                  </p>

                </div>

                <button
                  onClick={closeUser}
                  className="text-zinc-400 hover:text-white text-xl"
                >
                  ✕
                </button>

              </div>

              {/* USER INFO */}
              <div className="bg-zinc-800 rounded-3xl p-6 mb-8">

                <h3 className="text-xl font-semibold mb-5">
                  User Information
                </h3>

                <div className="grid grid-cols-2 gap-6">

                  <div>
                    <p className="text-zinc-400">
                      Email
                    </p>

                    <p className="mt-1">
                      {selectedUser.email}
                    </p>
                  </div>

                  <div>
                    <p className="text-zinc-400">
                      Status
                    </p>

                    <p className="mt-1 text-emerald-400">
                      {selectedUser.status}
                    </p>
                  </div>

                </div>

              </div>

              {/* STATS */}
              {statsLoading ? (
                <p className="text-zinc-400">
                  Loading user stats...
                </p>
              ) : stats && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-8">

                  <div className="bg-zinc-800 rounded-2xl p-5">
                    <p className="text-zinc-400">
                      Cash
                    </p>

                    <h3 className="text-2xl font-bold text-emerald-400 mt-2">
                      {money(stats.cash ?? 0)}
                    </h3>
                  </div>

                  <div className="bg-zinc-800 rounded-2xl p-5">
                    <p className="text-zinc-400">
                      Gold
                    </p>

                    <h3 className="text-2xl font-bold text-yellow-400 mt-2">
                      {money(stats.gold ?? 0)}
                    </h3>
                  </div>

                  <div className="bg-zinc-800 rounded-2xl p-5">
                    <p className="text-zinc-400">
                      Shares
                    </p>

                    <h3 className="text-2xl font-bold text-blue-400 mt-2">
                      {money(stats.shares ?? 0)}
                    </h3>
                  </div>

                  <div className="bg-zinc-800 rounded-2xl p-5">
                    <p className="text-zinc-400">
                      Deposits
                    </p>

                    <h3 className="text-2xl font-bold mt-2">
                      {money(stats.totalDeposits ?? 0)}
                    </h3>
                  </div>

                  <div className="bg-zinc-800 rounded-2xl p-5">
                    <p className="text-zinc-400">
                      Withdrawals
                    </p>

                    <h3 className="text-2xl font-bold mt-2">
                      {money(stats.totalWithdrawals ?? 0)}
                    </h3>
                  </div>

                  <div className="bg-zinc-800 rounded-2xl p-5">
                    <p className="text-zinc-400">
                      Investments
                    </p>

                    <h3 className="text-2xl font-bold mt-2">
                      {money(stats.totalInvestments ?? 0)}
                    </h3>
                  </div>

                  <div className="bg-zinc-800 rounded-2xl p-5">
                    <p className="text-zinc-400">
                      Transactions
                    </p>

                    <h3 className="text-2xl font-bold mt-2">
                      {money(stats.totalTransactions ?? 0)}
                    </h3>
                  </div>

                </div>
              )}

              {/* TRANSACTION BUTTON */}
              <button
                onClick={() =>
                  setShowTransactions(
                    !showTransactions
                  )
                }
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-5 py-3 rounded-2xl font-semibold mb-6"
              >
                {showTransactions
                  ? 'Hide Transactions'
                  : 'Show Transactions'}
              </button>

              {/* TRANSACTIONS */}
              {showTransactions && (
                <UserTransactions
                  userId={selectedUser.id}
                />
              )}

            </div>

          </div>

        </div>
      )}

    </div>
  )
}