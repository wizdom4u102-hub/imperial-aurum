'use client'

import { useEffect, useMemo, useState } from 'react'

import type { Database } from '@/lib/supabase/database.types'

type MiningPlan =
  Database['public']['Tables']['mining_plans']['Row']

interface PaymentMethod {
  id: string
  name: string
  type: string
  details: string | Record<string, unknown> | null
}

interface MiningPlanPurchaseProps {
  plan: MiningPlan
}

export default function MiningPlanPurchase({
  plan,
}: MiningPlanPurchaseProps) {
  const [amount, setAmount] = useState(
    String(Number(plan.minimum_amount || 0))
  )

  const [methods, setMethods] = useState<PaymentMethod[]>([])
  const [selectedMethodIndex, setSelectedMethodIndex] =
    useState(0)

  const [txid, setTxid] = useState('')
  const [loadingMethods, setLoadingMethods] =
    useState(true)
  const [loading, setLoading] = useState(false)

  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // =====================================================
  // LOAD PAYMENT METHODS
  // =====================================================

  useEffect(() => {
    let cancelled = false

    async function loadPaymentMethods() {
      setLoadingMethods(true)
      setError(null)

      try {
        const response = await fetch(
          '/api/payment-methods',
          {
            method: 'GET',
            cache: 'no-store',
          }
        )

        const data: unknown =
          await response.json()

        if (!response.ok) {
          throw new Error(
            'Failed to load payment methods.'
          )
        }

        if (
          typeof data !== 'object' ||
          data === null ||
          !('methods' in data) ||
          !Array.isArray(data.methods)
        ) {
          throw new Error(
            'Invalid payment methods response.'
          )
        }

        const loadedMethods =
          data.methods.filter(
            (
              method
            ): method is PaymentMethod => {
              if (
                typeof method !== 'object' ||
                method === null
              ) {
                return false
              }

              if (
                !('id' in method) ||
                !('name' in method) ||
                !('type' in method) ||
                !('details' in method)
              ) {
                return false
              }

              return (
                typeof method.id === 'string' &&
                typeof method.name === 'string' &&
                typeof method.type === 'string' &&
                (
                  typeof method.details ===
                    'string' ||
                  method.details === null ||
                  typeof method.details ===
                    'object'
                )
              )
            }
          )

        if (!cancelled) {
          setMethods(loadedMethods)
          setSelectedMethodIndex(0)
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Failed to load payment methods.'
          )
        }
      } finally {
        if (!cancelled) {
          setLoadingMethods(false)
        }
      }
    }

    loadPaymentMethods()

    return () => {
      cancelled = true
    }
  }, [])

  // =====================================================
  // SELECTED PAYMENT METHOD
  // =====================================================

  const selectedMethod =
    methods[selectedMethodIndex] ?? null

  // =====================================================
  // WALLET DETAILS
  // =====================================================

  const walletDetails = useMemo(() => {
    if (!selectedMethod) {
      return ''
    }

    if (
      typeof selectedMethod.details ===
      'string'
    ) {
      return selectedMethod.details
    }

    if (
      selectedMethod.details &&
      typeof selectedMethod.details ===
        'object'
    ) {
      return Object.entries(
        selectedMethod.details
      )
        .map(
          ([key, value]) =>
            `${key}: ${String(value)}`
        )
        .join('\n')
    }

    return ''
  }, [selectedMethod])

  // =====================================================
  // AMOUNT
  // =====================================================

  const numericAmount =
    Number(amount || 0)

  const minimumAmount =
    Number(plan.minimum_amount || 0)

  const maximumAmount =
    Number(plan.maximum_amount || 0)

  // =====================================================
  // DAILY GOLD
  // =====================================================

  const dailyGold =
    numericAmount > 0
      ? numericAmount *
        Number(plan.gold_per_dollar || 0)
      : 0

  // =====================================================
  // AMOUNT VALIDATION
  // =====================================================

  const amountBelowMinimum =
    numericAmount < minimumAmount

  const amountAboveMaximum =
    maximumAmount > 0 &&
    numericAmount > maximumAmount

  const amountInvalid =
    !numericAmount ||
    amountBelowMinimum ||
    amountAboveMaximum

  // =====================================================
  // CHANGE PAYMENT METHOD
  // =====================================================

  function changePaymentMethod() {
    if (methods.length <= 1) {
      return
    }

    setSelectedMethodIndex(
      (current) =>
        (current + 1) % methods.length
    )

    setCopied(false)
  }

  // =====================================================
  // COPY WALLET
  // =====================================================

  async function copyWallet() {
    if (!walletDetails) {
      return
    }

    try {
      await navigator.clipboard.writeText(
        walletDetails
      )

      setCopied(true)

      window.setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (err: unknown) {
      console.error(
        'COPY WALLET ERROR:',
        err
      )

      setError(
        'Unable to copy wallet address. Please copy it manually.'
      )
    }
  }

  // =====================================================
  // SUBMIT MINING DEPOSIT
  // =====================================================

  async function submitDeposit() {
    setError(null)
    setSuccess(false)

    if (amountInvalid) {
      setError(
        `Investment must be between $${minimumAmount.toLocaleString()} and $${maximumAmount.toLocaleString()}.`
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
      const response = await fetch(
        '/api/deposit/create',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            amount: numericAmount,
            method_id:
              selectedMethod.id,

            /*
             * This identifies this deposit
             * as a Mining Plan purchase.
             */
            mining_plan_id: plan.id,

            /*
             * The existing deposits table currently
             * does not have a TXID field according to
             * the schema you provided.
             *
             * We therefore do not send txid into the
             * deposits table yet.
             */
          }),
        }
      )

      const data: unknown =
        await response.json()

      if (!response.ok) {
        let message =
          'Failed to submit mining deposit.'

        if (
          typeof data === 'object' &&
          data !== null &&
          'error' in data &&
          typeof data.error === 'string'
        ) {
          message = data.error
        }

        throw new Error(message)
      }

      setSuccess(true)
      setTxid('')
    } catch (err: unknown) {
      console.error(
        'MINING DEPOSIT ERROR:',
        err
      )

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to submit mining deposit.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">

      {/* ================================================= */}
      {/* PLAN SUMMARY */}
      {/* ================================================= */}

      <section className="rounded-3xl border border-white/10 bg-zinc-900 p-5 sm:p-7">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-yellow-400">
            Selected Plan
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            {plan.name}
          </h2>

          {plan.description && (
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              {plan.description}
            </p>
          )}
        </div>

        <div className="mt-7 space-y-1">

          <div className="flex items-center justify-between border-b border-white/10 py-4">
            <span className="text-sm text-zinc-400">
              Minimum
            </span>

            <span className="font-semibold text-white">
              $
              {minimumAmount.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-white/10 py-4">
            <span className="text-sm text-zinc-400">
              Maximum
            </span>

            <span className="font-semibold text-white">
              $
              {maximumAmount.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-white/10 py-4">
            <span className="text-sm text-zinc-400">
              Gold per $1
            </span>

            <span className="font-semibold text-yellow-400">
              {Number(
                plan.gold_per_dollar || 0
              ).toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between py-4">
            <span className="text-sm text-zinc-400">
              Mining Cycle
            </span>

            <span className="font-semibold text-white">
              24 Hours
            </span>
          </div>

        </div>

        {/* DAILY EARNING */}
        <div className="mt-6 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5">
          <p className="text-xs uppercase tracking-wider text-zinc-400">
            Estimated Daily Mining
          </p>

          <p className="mt-2 text-3xl font-bold text-yellow-400">
            {dailyGold.toLocaleString(
              undefined,
              {
                maximumFractionDigits: 4,
              }
            )}{' '}
            Gold
          </p>

          <p className="mt-2 text-sm text-zinc-500">
            Earned every 24 hours
          </p>
        </div>
      </section>

      {/* ================================================= */}
      {/* PURCHASE */}
      {/* ================================================= */}

      <section className="rounded-3xl border border-white/10 bg-zinc-900 p-5 sm:p-7">

        <div className="mb-7">
          <h2 className="text-2xl font-bold text-white">
            Invest in {plan.name}
          </h2>

          <p className="mt-2 text-sm text-zinc-400">
            Enter the amount you want to invest.
            Your daily Gold earning updates automatically.
          </p>
        </div>

        {/* AMOUNT */}
        <div>
          <label
            htmlFor="mining-amount"
            className="text-sm font-medium text-zinc-300"
          >
            Investment Amount
          </label>

          <div className="relative mt-2">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
              $
            </span>

            <input
              id="mining-amount"
              type="number"
              min={minimumAmount}
              max={maximumAmount}
              step="1"
              value={amount}
              onChange={(event) => {
                setAmount(
                  event.target.value
                )
                setError(null)
                setSuccess(false)
              }}
              className={`h-14 w-full rounded-2xl border bg-black pl-9 pr-4 text-lg font-semibold text-white outline-none transition ${
                amountInvalid
                  ? 'border-red-500/50 focus:border-red-500'
                  : 'border-white/10 focus:border-yellow-400'
              }`}
              placeholder="Enter amount"
            />
          </div>

          <div className="mt-2 flex flex-col gap-1 text-xs sm:flex-row sm:justify-between">
            <span className="text-zinc-500">
              Min: $
              {minimumAmount.toLocaleString()}
            </span>

            <span className="text-zinc-500">
              Max: $
              {maximumAmount.toLocaleString()}
            </span>
          </div>

          {amountBelowMinimum && (
            <p className="mt-2 text-sm text-red-400">
              Amount is below the minimum investment.
            </p>
          )}

          {amountAboveMaximum && (
            <p className="mt-2 text-sm text-red-400">
              Amount exceeds the maximum investment.
            </p>
          )}
        </div>

        {/* LIVE GOLD */}
        <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-zinc-400">
                You will earn
              </p>

              <p className="mt-1 text-2xl font-bold text-emerald-400">
                {dailyGold.toLocaleString(
                  undefined,
                  {
                    maximumFractionDigits: 4,
                  }
                )}{' '}
                Gold
              </p>
            </div>

            <span className="text-sm text-zinc-500">
              / 24 hours
            </span>
          </div>
        </div>

        {/* PAYMENT */}
        <div className="mt-8">
          <div>
            <h3 className="text-xl font-bold text-white">
              Payment Details
            </h3>

            <p className="mt-2 text-sm text-zinc-400">
              Send exactly{' '}
              <span className="font-semibold text-yellow-400">
                $
                {numericAmount.toLocaleString()}
              </span>{' '}
              using the payment method below.
            </p>
          </div>

          {loadingMethods ? (
            <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-6">
              <div className="h-5 w-32 animate-pulse rounded bg-zinc-800" />

              <div className="mt-4 h-12 w-full animate-pulse rounded-xl bg-zinc-800" />

              <div className="mt-4 h-20 w-full animate-pulse rounded-xl bg-zinc-800" />
            </div>
          ) : selectedMethod ? (
            <div className="mt-5 space-y-5 rounded-2xl border border-white/10 bg-black/20 p-5">

              {/* METHOD */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                <div>
                  <p className="text-xs uppercase tracking-wider text-zinc-500">
                    Payment Method
                  </p>

                  <h4 className="mt-1 text-lg font-semibold text-white">
                    {selectedMethod.name}
                  </h4>

                  <span className="mt-2 inline-flex rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-400">
                    {selectedMethod.type}
                  </span>
                </div>

                {methods.length > 1 && (
                  <button
                    type="button"
                    onClick={
                      changePaymentMethod
                    }
                    className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:border-yellow-400 hover:text-yellow-400"
                  >
                    Change Method
                  </button>
                )}

              </div>

              {/* WALLET */}
              <div>
                <p className="text-xs uppercase tracking-wider text-zinc-500">
                  Wallet Address
                </p>

                <div className="mt-2 break-all whitespace-pre-wrap rounded-xl border border-white/5 bg-zinc-950 p-4 text-sm leading-6 text-zinc-300">
                  {walletDetails ||
                    'Wallet details unavailable.'}
                </div>
              </div>

              {/* COPY */}
              <button
                type="button"
                onClick={copyWallet}
                disabled={!walletDetails}
                className="h-11 rounded-xl bg-yellow-400 px-5 font-semibold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {copied
                  ? 'Copied!'
                  : 'Copy Wallet Address'}
              </button>

            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
              <p className="text-sm text-red-400">
                No active payment methods are currently available.
              </p>
            </div>
          )}
        </div>

        {/* TXID */}
        <div className="mt-7">
          <label
            htmlFor="mining-txid"
            className="text-sm font-medium text-zinc-300"
          >
            Transaction Hash (TXID)
          </label>

          <input
            id="mining-txid"
            type="text"
            value={txid}
            onChange={(event) => {
              setTxid(
                event.target.value
              )
              setError(null)
              setSuccess(false)
            }}
            placeholder="Paste your transaction hash"
            className="mt-2 h-14 w-full rounded-2xl border border-white/10 bg-black px-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-yellow-400"
          />
        </div>

        {/* ERROR */}
        {error && (
          <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
            <p className="text-sm text-red-400">
              {error}
            </p>
          </div>
        )}

        {/* SUCCESS */}
        {success && (
          <div className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <p className="font-medium text-emerald-400">
              Mining deposit submitted successfully.
            </p>

            <p className="mt-1 text-sm text-zinc-400">
              Your investment is waiting for admin approval.
              Your current mining plan will remain unchanged until
              the deposit is approved.
            </p>
          </div>
        )}

        {/* SUBMIT */}
        <button
          type="button"
          onClick={submitDeposit}
          disabled={
            loading ||
            loadingMethods ||
            amountInvalid ||
            !selectedMethod ||
            !txid.trim()
          }
          className="mt-6 h-14 w-full rounded-2xl bg-yellow-400 px-6 font-bold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? 'Submitting...'
            : 'Submit Mining Deposit'}
        </button>

        <p className="mt-4 text-center text-xs leading-5 text-zinc-600">
          Your mining plan will only change after the deposit
          has been reviewed and approved.
        </p>

      </section>
    </div>
  )
}