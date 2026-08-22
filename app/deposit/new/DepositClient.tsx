'use client'

import { useState } from 'react'

interface PaymentMethod {
  id: string
  name: string
  type: string
   details: unknown
}

interface DepositClientProps {
  methods: PaymentMethod[]
}

export default function DepositClient({
  methods,
}: DepositClientProps) {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const [selectedMethod, setSelectedMethod] =
    useState<PaymentMethod | null>(
      methods[0] || null
    )

  const [txid, setTxid] = useState('')
  const [copied, setCopied] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const walletDetails = selectedMethod
    ? typeof selectedMethod.details === 'string'
      ? selectedMethod.details
      : JSON.stringify(
          selectedMethod.details
        )
    : ''

  async function copyWallet() {
    if (!walletDetails) return

    await navigator.clipboard.writeText(
      walletDetails
    )

    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  async function submitDeposit() {
    if (loading) return

    setError('')
    setMessage('')

    if (!amount || Number(amount) <= 0) {
      setError(
        'Please enter a valid deposit amount.'
      )
      return
    }

    if (!selectedMethod) {
      setError(
        'Please select a payment method.'
      )
      return
    }

    if (!txid.trim()) {
      setError(
        'Please enter your transaction hash (TXID).'
      )
      return
    }

    setLoading(true)

    try {
      const res = await fetch(
        '/api/deposit/create',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            amount: Number(amount),
            method_id:
              selectedMethod.id,
            txid: txid.trim(),
          }),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        setError(
          data.error ||
            'Failed to submit deposit.'
        )

        setLoading(false)
        return
      }

      setMessage(
        'Deposit submitted successfully and is waiting for admin approval.'
      )

      setAmount('')
      setTxid('')

    } catch (err) {
      console.error(
        'DEPOSIT SUBMIT ERROR:',
        err
      )

      setError(
        'Something went wrong. Please try again.'
      )
    }

    setLoading(false)
  }

  if (!methods.length) {
    return (
      <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-10 text-center">
        <p className="text-zinc-400">
          No payment methods are available yet.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* ================= AMOUNT ================= */}

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6">

        <label className="text-sm text-zinc-400">
          Deposit Amount
        </label>

        <input
          type="number"
          min="1"
          value={amount}
          onChange={(event) =>
            setAmount(event.target.value)
          }
          placeholder="Enter amount"
          className="
            mt-2
            h-12
            w-full
            rounded-xl
            border
            border-zinc-700
            bg-black
            px-4
            text-white
            outline-none
            focus:border-yellow-400
          "
        />

      </div>

      {/* ================= PAYMENT DETAILS ================= */}

      {selectedMethod && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6 space-y-6">

          <div>

            <h2 className="text-2xl font-bold text-white">
              Payment Details
            </h2>

            <p className="mt-2 text-sm text-zinc-400">
              Send exactly
              <span className="ml-1 font-semibold text-yellow-400">
                $
                {Number(
                  amount || 0
                ).toLocaleString()}
              </span>
              {' '}using the wallet below.
            </p>

          </div>

          {/* ================= PAYMENT METHOD SELECTOR ================= */}

          <div>

            <label
              htmlFor="payment-method"
              className="text-xs uppercase tracking-wide text-zinc-500"
            >
              Payment Method
            </label>

            <select
              id="payment-method"
              value={selectedMethod.id}
              onChange={(event) => {

                const method =
                  methods.find(
                    (item) =>
                      item.id ===
                      event.target.value
                  )

                if (method) {
                  setSelectedMethod(
                    method
                  )

                  setCopied(false)
                  setError('')
                }

              }}
              className="
                mt-2
                h-12
                w-full
                rounded-xl
                border
                border-zinc-700
                bg-black
                px-4
                text-white
                outline-none
                focus:border-yellow-400
              "
            >

              {methods.map(
                (method) => (
                  <option
                    key={method.id}
                    value={method.id}
                    className="bg-zinc-900 text-white"
                  >
                    {method.name}
                    {' '}
                    ({method.type})
                  </option>
                )
              )}

            </select>

          </div>

          {/* ================= SELECTED METHOD ================= */}

          <div>

            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Network
            </p>

            <span className="mt-2 inline-flex rounded-full bg-yellow-500/20 px-3 py-1 text-sm text-yellow-400">
              {selectedMethod.type}
            </span>

          </div>

          {/* ================= WALLET ================= */}

          <div>

            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Wallet Address
            </p>

            <div className="mt-2 break-all rounded-xl bg-black/40 p-4 text-sm text-white">
              {walletDetails}
            </div>

          </div>

          {/* ================= COPY ================= */}

          <button
            type="button"
            onClick={copyWallet}
            className="
              rounded-xl
              bg-yellow-400
              px-5
              py-3
              font-semibold
              text-black
              transition
              hover:bg-yellow-300
            "
          >
            {copied
              ? 'Copied!'
              : 'Copy Address'}
          </button>

        </div>
      )}

      {/* ================= TXID ================= */}

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6">

        <label className="text-sm text-zinc-400">
          Transaction Hash (TXID)
        </label>

        <input
          value={txid}
          onChange={(event) =>
            setTxid(event.target.value)
          }
          placeholder="Paste your transaction hash"
          className="
            mt-2
            h-12
            w-full
            rounded-xl
            border
            border-zinc-700
            bg-black
            px-4
            text-white
            outline-none
            focus:border-yellow-400
          "
        />

      </div>

      {/* ================= ERROR ================= */}

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* ================= SUCCESS ================= */}

      {message && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-400">
          {message}
        </div>
      )}

      {/* ================= SUBMIT ================= */}

      <button
        type="button"
        onClick={submitDeposit}
        disabled={loading}
        className="
          h-12
          w-full
          rounded-xl
          bg-yellow-400
          font-bold
          text-black
          transition
          hover:bg-yellow-300
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        {loading
          ? 'Submitting...'
          : 'Submit Deposit'}
      </button>

    </div>
  )
}