'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewSharedPlanPage() {
  const router = useRouter()

  const [amount, setAmount] = useState('1000')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const submit = async (e: any) => {
    e.preventDefault()

    setLoading(true)
    setMessage('')

    try {
      const res = await fetch('/api/shared-plan/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Number(amount),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setMessage(data.error || 'Failed to buy shares')
        setLoading(false)
        return
      }

      setMessage('Company shares purchased successfully')

      setTimeout(() => {
        router.push('/shared-plans')
      }, 1500)

    } catch (err) {
      console.error(err)
      setMessage('Something went wrong')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="max-w-2xl mx-auto">

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10">

          <h1 className="text-4xl font-semibold mb-4 text-yellow-400">
            Buy Company Shares
          </h1>

          <p className="text-zinc-400 mb-10">
            Minimum investment is $1000 and you earn 25% monthly ROI.
          </p>

          <form onSubmit={submit} className="space-y-6">

            <div>
              <label className="block mb-3 text-sm text-zinc-400">
                Investment Amount ($)
              </label>

              <input
                type="number"
                min="1000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full bg-black border border-zinc-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div className="bg-zinc-800 rounded-2xl p-5">
              <p className="text-zinc-400 mb-2">Estimated Monthly Profit</p>

              <p className="text-3xl font-bold text-emerald-400">
                ${(Number(amount || 0) * 0.25).toFixed(2)}
              </p>
            </div>

            {message && (
              <div className="bg-zinc-800 p-4 rounded-2xl text-sm text-zinc-300">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-black py-4 rounded-2xl font-bold transition"
            >
              {loading ? 'Processing...' : 'Buy Shares'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}