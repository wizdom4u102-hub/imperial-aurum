'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface PaymentMethod {
  id: string
  name: string
  type: string
  details: string
}

export default function NewSharedPlanPage() {
  const router = useRouter()

  const [amount, setAmount] = useState('1000')

  const [wallets, setWallets] = useState<PaymentMethod[]>([])
  const [wallet, setWallet] = useState<PaymentMethod | null>(null)

  const [copied, setCopied] = useState(false)
  const [loadingWallets, setLoadingWallets] = useState(true)
  const [loading, setLoading] = useState(false)

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // =====================================================
  // LOAD PAYMENT METHODS
  // =====================================================

  useEffect(() => {
    async function loadPaymentMethods() {
      try {
        const response = await fetch(
          '/api/payment-methods',
          {
            cache: 'no-store',
          }
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(
            data.error ||
              'Failed to load payment methods'
          )
        }

        const methods: PaymentMethod[] =
          Array.isArray(data.methods)
            ? data.methods.map(
                (method: {
                  id: string
                  name: string
                  type: string
                  details: unknown
                }) => ({
                  id: method.id,
                  name: method.name,
                  type: method.type,
                  details:
                    typeof method.details ===
                    'string'
                      ? method.details
                      : JSON.stringify(
                          method.details
                        ),
                })
              )
            : []

        setWallets(methods)

        if (methods.length > 0) {
          setWallet(methods[0])
        }
      } catch (err) {
        console.error(
          'PAYMENT METHODS ERROR:',
          err
        )

        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load payment methods'
        )
      } finally {
        setLoadingWallets(false)
      }
    }

    loadPaymentMethods()
  }, [])

  // =====================================================
  // COPY WALLET
  // =====================================================

  async function copyWallet() {
    if (!wallet) return

    try {
      await navigator.clipboard.writeText(
        wallet.details
      )

      setCopied(true)

      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (err) {
      console.error(
        'COPY WALLET ERROR:',
        err
      )
    }
  }

  // =====================================================
  // SUBMIT
  // =====================================================

  async function submit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    if (loading) return

    setMessage('')
    setError('')

    const investmentAmount =
      Number(amount)

    if (
      !investmentAmount ||
      investmentAmount < 1000
    ) {
      setError(
        'Minimum investment is $1000.'
      )

      return
    }

    if (!wallet) {
      setError(
        'Please select a payment method.'
      )

      return
    }

    setLoading(true)

    try {
      const response = await fetch(
        '/api/shared-plan/buy',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            amount:
              investmentAmount,

            method_id:
              wallet.id,
          }),
        }
      )

      const data =
        await response.json()

      if (!response.ok) {
        setError(
          data.error ||
            'Failed to submit Share Plan deposit.'
        )

        return
      }

      setMessage(
        'Share Plan deposit submitted successfully. Your investment will activate after admin approval.'
      )

      setTimeout(() => {
        router.push(
          '/shared-plans'
        )
      }, 2000)
    } catch (err) {
      console.error(
        'SHARE PLAN SUBMIT ERROR:',
        err
      )

      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong.'
      )
    } finally {
      setLoading(false)
    }
  }

  const monthlyProfit =
    Number(amount || 0) * 0.25

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 lg:p-10">
      <div className="max-w-6xl mx-auto">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold text-yellow-400">
            Buy Company Shares
          </h1>

          <p className="text-zinc-400 mt-3">
            Make a direct deposit to purchase
            company shares and activate your
            investment after approval.
          </p>
        </div>

        <form
          onSubmit={submit}
          className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6"
        >

          {/* =====================================================
              INVESTMENT SUMMARY
          ===================================================== */}

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8">

            <h2 className="text-2xl font-bold">
              Investment Summary
            </h2>

            <div className="mt-6 space-y-1">

              <div className="flex items-center justify-between py-4 border-b border-zinc-800">
                <span className="text-zinc-400">
                  Plan
                </span>

                <span className="font-semibold">
                  Imperial Gold Fund
                </span>
              </div>

              <div className="flex items-center justify-between py-4 border-b border-zinc-800">
                <span className="text-zinc-400">
                  Minimum
                </span>

                <span className="font-semibold">
                  $1,000
                </span>
              </div>

              <div className="flex items-center justify-between py-4 border-b border-zinc-800">
                <span className="text-zinc-400">
                  Daily ROI
                </span>

                <span className="font-semibold text-emerald-400">
                  5%
                </span>
              </div>

              <div className="flex items-center justify-between py-4 border-b border-zinc-800">
                <span className="text-zinc-400">
                  Duration
                </span>

                <span className="font-semibold">
                  30 Days
                </span>
              </div>

            </div>

            <div className="mt-6 bg-zinc-800 rounded-2xl p-5">

              <p className="text-zinc-400 mb-2">
                Investment Amount
              </p>

              <input
                type="number"
                min="1000"
                value={amount}
                onChange={(event) =>
                  setAmount(
                    event.target.value
                  )
                }
                required
                className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-400"
              />

            </div>

            <div className="mt-4 bg-zinc-800 rounded-2xl p-5">

              <p className="text-zinc-400 mb-2">
                Estimated Daily Profit
              </p>

              <p className="text-3xl font-bold text-emerald-400">
                $
                {(
                  Number(amount || 0) *
                  0.05
                ).toFixed(2)}
              </p>

            </div>

            <div className="mt-4 bg-zinc-800 rounded-2xl p-5">

              <p className="text-zinc-400 mb-2">
                Estimated Monthly Profit
              </p>

              <p className="text-3xl font-bold text-cyan-400">
                $
                {monthlyProfit.toFixed(2)}
              </p>

            </div>

          </div>

          {/* =====================================================
              PAYMENT DETAILS
          ===================================================== */}

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8">

            <h2 className="text-2xl font-bold">
              Payment Details
            </h2>

            <p className="mt-2 text-sm text-zinc-400">
              Send exactly the investment
              amount using one of the available
              payment methods below.
            </p>

            {/* PAYMENT METHOD */}

            <div className="mt-6">

              <label className="block text-sm text-zinc-400 mb-2">
                Payment Method
              </label>

              {loadingWallets ? (
                <div className="rounded-xl bg-zinc-800 p-4 text-zinc-400">
                  Loading payment methods...
                </div>
              ) : wallets.length === 0 ? (
                <div className="rounded-xl border border-red-500/30 bg-red-950/30 p-4 text-red-400">
                  No payment methods are
                  currently available.
                </div>
              ) : (
                <select
                  value={
                    wallet?.id || ''
                  }
                  onChange={(event) => {
                    const selected =
                      wallets.find(
                        (item) =>
                          item.id ===
                          event.target.value
                      )

                    if (selected) {
                      setWallet(
                        selected
                      )
                    }
                  }}
                  className="w-full h-12 rounded-xl border border-zinc-700 bg-zinc-800 px-4 text-white outline-none focus:border-yellow-400"
                >
                  {wallets.map(
                    (method) => (
                      <option
                        key={method.id}
                        value={
                          method.id
                        }
                      >
                        {method.name} (
                        {method.type})
                      </option>
                    )
                  )}
                </select>
              )}

            </div>

            {/* WALLET */}

            {wallet && (
              <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-5">

                <div>

                  <p className="text-xs uppercase tracking-wide text-zinc-500">
                    Network
                  </p>

                  <span className="mt-2 inline-flex rounded-full bg-yellow-500/20 px-3 py-1 text-sm text-yellow-400">
                    {wallet.type}
                  </span>

                </div>

                <div className="mt-5">

                  <p className="text-xs uppercase tracking-wide text-zinc-500">
                    Wallet Address
                  </p>

                  <div className="mt-2 break-all rounded-xl bg-zinc-900 border border-zinc-800 p-4 text-sm text-white">
                    {wallet.details}
                  </div>

                </div>

                <button
                  type="button"
                  onClick={
                    copyWallet
                  }
                  className="mt-4 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-5 py-3 rounded-xl transition"
                >
                  {copied
                    ? 'Copied!'
                    : 'Copy Wallet Address'}
                </button>

              </div>
            )}

            {/* PAYMENT WARNING */}

            <div className="mt-6 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 p-5">

              <p className="font-semibold text-yellow-400">
                Important
              </p>

              <p className="text-sm text-zinc-400 mt-2">
                Send the exact amount shown
                above to the selected wallet.
                Your Share Plan will remain
                pending until the deposit is
                approved by an administrator.
              </p>

            </div>

            {/* MESSAGES */}

            {error && (
              <div className="mt-6 rounded-xl bg-red-950/40 border border-red-500/30 p-4 text-sm text-red-400">
                {error}
              </div>
            )}

            {message && (
              <div className="mt-6 rounded-xl bg-green-950/40 border border-green-500/30 p-4 text-sm text-green-400">
                {message}
              </div>
            )}

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={
                loading ||
                loadingWallets ||
                !wallet
              }
              className="mt-6 w-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed text-black py-4 rounded-2xl font-bold transition"
            >
              {loading
                ? 'Submitting Deposit...'
                : 'Submit Share Plan Deposit'}
            </button>

          </div>

        </form>

      </div>
    </div>
  )
}