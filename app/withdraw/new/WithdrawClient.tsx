'use client'

import { useState } from 'react'

type Wallet = {
  id: string
  address: string
  network?: string
}

export default function WithdrawClient({
  methods,
}: {
  methods: Wallet[]
}) {
  const [amount, setAmount] = useState('')
  const [methodId, setMethodId] = useState('')
  const [loading, setLoading] = useState(false)

  return (
    <div className="space-y-6">

      {/* 💰 AMOUNT INPUT */}
      <div className="bg-zinc-900 p-6 rounded-2xl">
        <label className="text-sm text-zinc-400">
          Withdrawal Amount
        </label>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="w-full mt-2 p-3 bg-zinc-800 rounded-lg outline-none text-white"
        />
      </div>

      {/* 💳 USER WALLETS */}
      <div className="space-y-4">
        {methods.length === 0 ? (
          <div className="bg-zinc-900 p-6 rounded-2xl text-center text-zinc-400">
            No wallets found. Please add a withdrawal wallet first.
          </div>
        ) : (
          methods.map((m) => (
            <div
              key={m.id}
              className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800"
            >
              {/* WALLET ADDRESS */}
              <h2 className="font-bold text-white break-all">
                {m.address}
              </h2>

              {/* NETWORK */}
              {m.network && (
                <p className="text-sm text-zinc-400">
                  {m.network}
                </p>
              )}

              {/* SELECT BUTTON */}
              <button
                onClick={() => setMethodId(m.id)}
                className={`mt-4 px-4 py-2 rounded-lg font-semibold ${
                  methodId === m.id
                    ? 'bg-green-500 text-black'
                    : 'bg-yellow-500 text-black'
                }`}
              >
                {methodId === m.id ? 'Selected' : 'Select Wallet'}
              </button>
            </div>
          ))
        )}
      </div>

      {/* 🚀 SUBMIT BUTTON */}
      <button
        disabled={!amount || !methodId || loading}
        onClick={async () => {
          setLoading(true)

          try {
            const res = await fetch('/api/withdraw/create', {
  method: 'POST',
  credentials: 'include', // ✅ VERY IMPORTANT
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
  amount,
  method_id: methodId,
 }),
})

            const data = await res.json()

            if (!res.ok) {
              alert(data.error || 'Withdrawal failed')
              setLoading(false)
              return
            }

            alert('Withdrawal request submitted successfully')

            setAmount('')
            setMethodId('')
          } catch (err) {
            console.error(err)
            alert('Something went wrong')
          }

          setLoading(false)
        }}
        className="w-full bg-green-500 text-black py-3 rounded-xl font-bold disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Submit Withdrawal'}
      </button>

    </div>
  )
}