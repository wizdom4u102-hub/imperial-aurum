'use client'

import UserActions from '@/components/admin/UserActions'
import { useParams } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'

type Stats = {
  cash: number
  gold: number
  shares: number

  totalDeposits: number
  totalWithdrawals: number

  investments: number
  transactions: number
  activeShares: number

  status?: string
}

export default function UserDetailPage() {
  const { id } = useParams()

  const [stats, setStats] =
    useState<Stats | null>(null)

  const [loading, setLoading] =
    useState(true)

  const loadStats =
    useCallback(async () => {
      try {
        setLoading(true)

        const res = await fetch(
  `/api/admin/users/${id}/stats`,
  {
    cache: 'no-store',
    credentials: 'include',
  }
)

        const data =
          await res.json()

        console.log(
          'USER STATS RESPONSE:',
          data
        )

        setStats(data)
      } catch (err) {
        console.error(
          'LOAD USER STATS ERROR:',
          err
        )
      } finally {
        setLoading(false)
      }
    }, [id])

  useEffect(() => {
    loadStats()
  }, [loadStats])

  const format = (n: number) =>
    new Intl.NumberFormat(
      'en-US',
      {
        style: 'currency',
        currency: 'USD',
      }
    ).format(Number(n || 0))

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="bg-white shadow-xl rounded-3xl p-10 text-center">
          <div className="animate-spin h-12 w-12 border-4 border-yellow-500 border-t-transparent rounded-full mx-auto mb-5" />

          <h2 className="text-2xl font-bold text-black">
            Loading User Dashboard
          </h2>

          <p className="text-zinc-600 mt-2">
            Fetching account statistics...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-6 p-6">

      {/* LEFT PANEL */}

     <UserActions
  userId={String(id)}
  status={stats?.status || 'active'}
  onActionComplete={loadStats}
/>

      {/* MAIN */}

      <div className="flex-1">

        <div className="flex justify-between items-center mb-6">

          <h1 className="text-3xl font-bold">
            User Dashboard
          </h1>

          <button
            onClick={loadStats}
            className="
              px-4
              py-2
              bg-zinc-800
              hover:bg-zinc-700
              rounded-xl
              text-sm
              text-white
            "
          >
            Refresh Data
          </button>

        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          <Card
            title="Cash Balance"
            value={format(stats?.cash || 0)}
          />

          <Card
            title="Gold Balance"
            value={String(stats?.gold || 0)}
          />

          <Card
            title="Shares"
            value={String(stats?.shares || 0)}
          />

          <Card
            title="Total Deposits"
            value={format(
              stats?.totalDeposits || 0
            )}
          />

          <Card
            title="Total Withdrawals"
            value={format(
              stats?.totalWithdrawals || 0
            )}
          />

          <Card
            title="Investments"
            value={format(
              stats?.investments || 0
            )}
          />

          <Card
            title="Transactions"
            value={String(
              stats?.transactions || 0
            )}
          />

          <Card
            title="Active Shares"
            value={format(
              stats?.activeShares || 0
            )}
          />

        </div>

      </div>

    </div>
  )
}

function Card({
  title,
  value,
}: {
  title: string
  value: string
}) {
  return (
    <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800">

      <p className="text-zinc-400 text-sm">
        {title}
      </p>

      <p className="text-2xl mt-2 font-bold text-white">
        {value}
      </p>

    </div>
  )
}