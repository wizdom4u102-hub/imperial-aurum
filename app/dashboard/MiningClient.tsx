'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Session = {
  id: string
  user_id: string

  active: boolean

  status: string

  started_at: string

  ends_at: string

  last_claim_at: string | null

  rate_per_second: number

  reward: number

  total_earned: number

  boost?: number;
}

export default function MiningClient({
  session,
  initialBalance,
}: {
  session: Session | null
  initialBalance: any
}) {
  const supabase = createClient()

  const [timeLeft, setTimeLeft] = useState(0)
  const [balance, setBalance] = useState(initialBalance || {})
  const [loading, setLoading] = useState(false)

  const BASE_DURATION = 24 * 60 * 60 // 24h

  // 🔐 ANTI-CHEAT CHECK
  const getDeviceKey = () => {
    if (typeof window === 'undefined') return ''
    return localStorage.getItem('device_key') || ''
  }

  // ⛏ OFFLINE PROGRESS TIMER
  useEffect(() => {
    if (!session?.started_at) {
      setTimeLeft(0)
      return
    }

    const updateTimer = () => {
      const now = Date.now();
      const end =
  new Date(session.ends_at).getTime()

const remaining =
  Math.floor((end - now) / 1000)

      setTimeLeft(remaining > 0 ? remaining : 0)
    }

    // ✅ RUN IMMEDIATELY
    updateTimer()

    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [session])

  // ⚡ REALTIME BALANCE SYNC
  useEffect(() => {
    if (!balance?.user_id) return

    const channel = supabase
      .channel(`balance-${balance.user_id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'balances',
          filter: `user_id=eq.${balance.user_id}`,
        },
        (payload: any) => {
          if (payload.new) {
            setBalance(payload.new)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [balance?.user_id, supabase])

  // ⛏ START MINING
  const startMining = async () => {
    setLoading(true)

    try {
      const device = getDeviceKey()

      const res = await fetch('/api/mining/start', {
        method: 'POST',
        headers: {
          'x-device': device,
        },
        credentials: 'include',
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || 'Failed to start mining')
        setLoading(false)
        return
      }

      window.location.reload()
    } catch (err) {
      console.error('Start mining error:', err)
    }

    setLoading(false)
  }


  // 🧠 BOOST
  // 🧠 BOOST
const boostMultiplier = 
  session?.boost === 5 ? 5 :
  session?.boost === 2 ? 2 : 
  1;

  return (
    <div className="space-y-6">

      {/* 💰 BALANCE */}
      <div className="bg-zinc-900 p-6 rounded-2xl">
        <h2 className="text-lg font-semibold">Balance</h2>

        <p className="text-2xl text-yellow-400 font-bold">
          {Number(balance?.gold || 0).toFixed(4)} Gold
        </p>

        <p className="text-zinc-400 mt-2">
          Cash: ${Number(balance?.cash || 0).toFixed(2)}
        </p>
      </div>

      {/* ⛏ MINING */}
      <div className="bg-zinc-900 p-6 rounded-2xl">

        {!session ? (
          <>
            <p className="text-zinc-400 mb-4">
              No active mining session
            </p>

            <button
              onClick={startMining}
              className="bg-green-500 text-black px-6 py-3 rounded-xl font-bold"
              disabled={loading}
            >
              {loading ? 'Starting...' : 'Start Mining'}
            </button>
          </>
        ) : (
          <>
            <h2 className="font-semibold">
              Mining Active
            </h2>

            {/* ⏳ TIMER */}
            <p className="text-yellow-400 text-xl font-bold mt-2">
              {timeLeft > 0
                ? `${Math.floor(timeLeft / 3600)}h ${Math.floor(
                    (timeLeft % 3600) / 60
                  )}m ${Math.floor(timeLeft % 60)}s`
                : 'Cycle Completed'}
            </p>

            {/* 🧠 BOOST */}
            <p className="text-sm text-zinc-400 mt-2">
              Boost: x{boostMultiplier}
            </p>
          </>
        )}
      </div>
    </div>
  )
}