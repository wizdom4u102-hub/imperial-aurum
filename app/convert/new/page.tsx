'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewConvertPage() {
  const router = useRouter()

  const [gold, setGold] = useState('')
  const [cash, setCash] = useState(0)
  const [wallet, setWallet] = useState<any>(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // ================= LOAD WALLET =================
  const fetchWalletAgain = async () => {
    try {
      const res = await fetch('/api/wallet', {
        cache: 'no-store',
      })

      const data = await res.json()
      setWallet(data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchWalletAgain()
  }, [])

  // ================= CALCULATE =================
  useEffect(() => {
    const goldAmount = Number(gold || 0)

    // 500 GOLD = $1
    setCash(goldAmount / 500)
  }, [gold])

  // ================= SUBMIT =================
  const handleConvert = async () => {
    setLoading(true)
    setError('')

    try {
      const goldAmount = Number(gold)

      // VALID INPUT
      if (!gold || isNaN(goldAmount) || goldAmount <= 0) {
        setError('Enter a valid gold amount')
        return
      }

      // MINIMUM
      if (goldAmount < 1000) {
        setError('Minimum conversion is 1000 GOLD')
        return
      }

      const availableGold = Number(wallet?.gold ?? 0)

      // BALANCE CHECK
      if (goldAmount > availableGold) {
        setError('Insufficient gold balance')
        return
      }

      const res = await fetch('/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gold: goldAmount,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Conversion failed')
        return
      }

      alert('Conversion successful')

      // ✅ IMPORTANT: refresh wallet immediately
      await fetchWalletAgain()

      // clear input
      setGold('')

    } catch (err) {
      console.error(err)
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="max-w-2xl mx-auto">

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10">

          <h1 className="text-4xl font-semibold mb-2">
            Convert Gold
          </h1>

          <p className="text-zinc-400 mb-10">
            Convert your GOLD into cash balance
          </p>

          {/* BALANCE */}
          <div className="bg-zinc-950 rounded-2xl p-6 mb-8 border border-zinc-800">
            <p className="text-zinc-400 text-sm">
              Available Gold
            </p>

            <p className="text-4xl font-bold text-yellow-400 mt-2">
              {Number(wallet?.gold || 0).toFixed(2)} GOLD
            </p>
          </div>

          {/* RATE */}
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-5 mb-8">
            <p className="text-yellow-400 font-medium">
              Conversion Rate
            </p>

            <p className="text-zinc-300 mt-1">
              500 GOLD = $1 USD
            </p>

            <p className="text-zinc-500 text-sm mt-2">
              Minimum conversion: 1000 GOLD
            </p>
          </div>

          {/* INPUT */}
          <div className="space-y-6">

            <div>
              <label className="block mb-3 text-sm text-zinc-400">
                Gold Amount
              </label>

              <input
                type="number"
                value={gold}
                onChange={(e) => setGold(e.target.value)}
                placeholder="Enter gold amount"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-white outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block mb-3 text-sm text-zinc-400">
                Cash You Will Receive
              </label>

              <div className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-emerald-400 text-2xl font-bold">
                ${cash.toFixed(2)}
              </div>
            </div>

          </div>

          {/* ERROR */}
          {error && (
            <div className="mt-6 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-400">
              {error}
            </div>
          )}

          {/* BUTTON */}
          <button
            onClick={handleConvert}
            disabled={loading}
            className="w-full mt-8 bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-4 rounded-2xl transition"
          >
            {loading ? 'Processing...' : 'Convert Gold'}
          </button>

        </div>

      </div>
    </div>
  )
}