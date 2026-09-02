'use client'

import {
  FormEvent,
  useEffect,
  useState,
} from 'react'

type MiningPlan = {
  id: string
  created_at: string
  updated_at: string
  description: string | null
  free_daily_gold: number
  gold_per_dollar: number
  is_active: boolean
  is_free: boolean
  maximum_amount: number
  minimum_amount: number
  name: string
  duration_days: number
}

type PlanForm = {
  name: string
  description: string
  minimum_amount: string
  maximum_amount: string
  gold_per_dollar: string
  free_daily_gold: string
  is_free: boolean
  is_active: boolean
  duration_days: string
}

const EMPTY_FORM: PlanForm = {
  name: '',
  description: '',
  minimum_amount: '',
  maximum_amount: '',
  gold_per_dollar: '',
  free_daily_gold: '',
  is_free: false,
  is_active: true,
  duration_days: '30',
}

export default function MiningPlansAdminPage() {
  const [plans, setPlans] = useState<MiningPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingPlanId, setEditingPlanId] =
    useState<string | null>(null)
  const [form, setForm] = useState<PlanForm>(
    EMPTY_FORM
  )

  async function loadPlans() {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(
        '/api/admin/mining-plans',
        {
          method: 'GET',
          cache: 'no-store',
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Failed to load mining plans.'
        )
      }

      setPlans(data.plans ?? [])
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load mining plans.'
      )
    } finally {
      setLoading(false)
    }
  }

    useEffect(() => {
    void loadPlans()
  }, [])

  function openCreateForm() {
    setEditingPlanId(null)
    setForm(EMPTY_FORM)
    setMessage('')
    setError('')
    setShowForm(true)
  }

  function openEditForm(plan: MiningPlan) {
    setEditingPlanId(plan.id)

    setForm({
      name: plan.name,
      description: plan.description ?? '',
      minimum_amount:
        String(plan.minimum_amount),
      maximum_amount:
        String(plan.maximum_amount),
      gold_per_dollar:
        String(plan.gold_per_dollar),
      free_daily_gold:
        String(plan.free_daily_gold),
      is_free: plan.is_free,
      is_active: plan.is_active,
      duration_days:
        String(plan.duration_days),
    })

    setMessage('')
    setError('')
    setShowForm(true)

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  function closeForm() {
    if (saving) return

    setShowForm(false)
    setEditingPlanId(null)
    setForm(EMPTY_FORM)
  }

  function updateForm(
    field: keyof PlanForm,
    value: string | boolean
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  async function submitForm(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setSaving(true)
    setMessage('')
    setError('')

    try {
      const payload = {
        ...(editingPlanId
          ? { id: editingPlanId }
          : {}),
        name: form.name,
        description:
          form.description.trim() || null,
        minimum_amount:
          Number(form.minimum_amount),
        maximum_amount:
          Number(form.maximum_amount),
        gold_per_dollar:
          Number(form.gold_per_dollar),
        free_daily_gold:
          Number(form.free_daily_gold),
        is_free: form.is_free,
        is_active: form.is_active,
         duration_days:
          Number(form.duration_days),
      }

      const response = await fetch(
        '/api/admin/mining-plans',
        {
          method: editingPlanId
            ? 'PATCH'
            : 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify(payload),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Unable to save mining plan.'
        )
      }

      setMessage(
        editingPlanId
          ? 'Mining plan updated successfully.'
          : 'Mining plan created successfully.'
      )

      setShowForm(false)
      setEditingPlanId(null)
      setForm(EMPTY_FORM)

      await loadPlans()
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to save mining plan.'
      )
    } finally {
      setSaving(false)
    }
  }

  async function togglePlan(
    plan: MiningPlan
  ) {
    setError('')
    setMessage('')

    try {
      const response = await fetch(
        '/api/admin/mining-plans',
        {
          method: 'PATCH',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            id: plan.id,
            name: plan.name,
            description: plan.description,
            minimum_amount:
              plan.minimum_amount,
            maximum_amount:
              plan.maximum_amount,
            gold_per_dollar:
              plan.gold_per_dollar,
            free_daily_gold:
              plan.free_daily_gold,
            is_free: plan.is_free,
            is_active: !plan.is_active,
            duration_days: plan.duration_days,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Unable to update plan status.'
        )
      }

      setMessage(
        plan.is_active
          ? `${plan.name} has been deactivated.`
          : `${plan.name} has been activated.`
      )

      await loadPlans()
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to update plan status.'
      )
    }
  }

  return (
    <main className="min-h-screen bg-black p-4 text-white sm:p-6 lg:p-10">
      <div className="mx-auto w-full max-w-7xl">

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-400">
              Imperial Aurum Mining
            </p>

            <h1 className="mt-2 text-2xl font-bold sm:text-3xl lg:text-4xl">
              Manage Mining Power
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
              Create and manage the mining plans available
              to users.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-yellow-400 px-5 text-sm font-semibold text-black transition hover:bg-yellow-300"
          >
            + Add Mining Plan
          </button>
        </div>

        {/* SUCCESS */}
        {message && (
          <div className="mb-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-400">
            {message}
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* FORM */}
        {showForm && (
          <section className="mb-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-5 sm:p-7">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold sm:text-2xl">
                  {editingPlanId
                    ? 'Edit Mining Plan'
                    : 'Add Mining Plan'}
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  {editingPlanId
                    ? 'Update the existing mining plan.'
                    : 'Create a new mining plan.'}
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:border-zinc-500 hover:text-white"
              >
                Cancel
              </button>
            </div>

            <form
              onSubmit={submitForm}
              className="space-y-6"
            >
              {/* NAME + DESCRIPTION */}
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Plan Name
                  </label>

                  <input
                    required
                    value={form.name}
                    onChange={(event) =>
                      updateForm(
                        'name',
                        event.target.value
                      )
                    }
                    placeholder="e.g. Silver"
                    className="h-12 w-full rounded-xl border border-zinc-700 bg-black px-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-yellow-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Description
                  </label>

                  <input
                    value={form.description}
                    onChange={(event) =>
                      updateForm(
                        'description',
                        event.target.value
                      )
                    }
                    placeholder="Plan description"
                    className="h-12 w-full rounded-xl border border-zinc-700 bg-black px-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-yellow-400"
                  />
                </div>
              </div>

              {/* FREE / PAID */}
              <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={form.is_free}
                    onChange={(event) =>
                      updateForm(
                        'is_free',
                        event.target.checked
                      )
                    }
                    className="h-5 w-5 accent-yellow-400"
                  />

                  <span>
                    <span className="block font-medium text-white">
                      Free Mining Plan
                    </span>

                    <span className="block text-xs text-zinc-500">
                      Enable this only for a plan that users
                      can mine without an investment.
                    </span>
                  </span>
                </label>
              </div>

              {/* AMOUNTS */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Minimum Amount
                  </label>

                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.minimum_amount}
                    onChange={(event) =>
                      updateForm(
                        'minimum_amount',
                        event.target.value
                      )
                    }
                    className="h-12 w-full rounded-xl border border-zinc-700 bg-black px-4 text-white outline-none focus:border-yellow-400"
                  />
                </div>

                                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Duration (Days)
                  </label>

                  <input
                    required
                    type="number"
                    min="1"
                    step="1"
                    value={form.duration_days}
                    onChange={(event) =>
                      updateForm(
                        'duration_days',
                        event.target.value
                      )
                    }
                    className="h-12 w-full rounded-xl border border-zinc-700 bg-black px-4 text-white outline-none focus:border-yellow-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Maximum Amount
                  </label>

                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.maximum_amount}
                    onChange={(event) =>
                      updateForm(
                        'maximum_amount',
                        event.target.value
                      )
                    }
                    className="h-12 w-full rounded-xl border border-zinc-700 bg-black px-4 text-white outline-none focus:border-yellow-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Gold Per Dollar
                  </label>

                  <input
                    required
                    type="number"
                    min="0"
                    step="0.000001"
                    value={form.gold_per_dollar}
                    onChange={(event) =>
                      updateForm(
                        'gold_per_dollar',
                        event.target.value
                      )
                    }
                    className="h-12 w-full rounded-xl border border-zinc-700 bg-black px-4 text-white outline-none focus:border-yellow-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Free Daily Gold
                  </label>

                  <input
                    required
                    type="number"
                    min="0"
                    step="0.000001"
                    value={form.free_daily_gold}
                    onChange={(event) =>
                      updateForm(
                        'free_daily_gold',
                        event.target.value
                      )
                    }
                    className="h-12 w-full rounded-xl border border-zinc-700 bg-black px-4 text-white outline-none focus:border-yellow-400"
                  />
                </div>
              </div>

              {/* ACTIVE */}
              <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(event) =>
                      updateForm(
                        'is_active',
                        event.target.checked
                      )
                    }
                    className="h-5 w-5 accent-yellow-400"
                  />

                  <span>
                    <span className="block font-medium text-white">
                      Active Plan
                    </span>

                    <span className="block text-xs text-zinc-500">
                      Inactive plans will not appear to users.
                    </span>
                  </span>
                </label>
              </div>

              {/* SUBMIT */}
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="h-12 rounded-xl border border-zinc-700 px-6 font-semibold text-white transition hover:border-zinc-500"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="h-12 rounded-xl bg-yellow-400 px-7 font-semibold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? 'Saving...'
                    : editingPlanId
                    ? 'Save Changes'
                    : 'Create Mining Plan'}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* PLAN COUNT */}
        <div className="mb-5 rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
          <p className="text-sm text-zinc-400">
            Total mining plans:{' '}
            <span className="font-semibold text-white">
              {plans.length}
            </span>
          </p>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-10 text-center">
            <p className="text-zinc-400">
              Loading mining plans...
            </p>
          </div>
        ) : plans.length === 0 ? (
          /* EMPTY */
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8 text-center sm:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800 text-2xl">
              ⛏️
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              No Mining Plans
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-400">
              Create your first mining plan to make mining
              power available to users.
            </p>

            <button
              type="button"
              onClick={openCreateForm}
              className="mt-6 rounded-xl bg-yellow-400 px-6 py-3 font-semibold text-black transition hover:bg-yellow-300"
            >
              + Create First Plan
            </button>
          </div>
        ) : (
          /* PLAN GRID */
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {plans.map((plan) => {
              const minimumAmount =
                Number(plan.minimum_amount ?? 0)

              const maximumAmount =
                Number(plan.maximum_amount ?? 0)

              const goldPerDollar =
                Number(plan.gold_per_dollar ?? 0)

              const freeDailyGold =
                Number(plan.free_daily_gold ?? 0)

              const maximumDailyGold =
                plan.is_free
                  ? freeDailyGold
                  : maximumAmount *
                    goldPerDollar

              return (
                <article
                  key={plan.id}
                  className="flex h-full flex-col rounded-3xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6"
                >
                  {/* HEADER */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="truncate text-xl font-bold text-white sm:text-2xl">
                          {plan.name}
                        </h2>

                        {plan.is_free && (
                          <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
                            FREE
                          </span>
                        )}
                      </div>

                      {plan.description && (
                        <p className="mt-2 text-sm leading-5 text-zinc-400">
                          {plan.description}
                        </p>
                      )}
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                        plan.is_active
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}
                    >
                      {plan.is_active
                        ? 'Active'
                        : 'Inactive'}
                    </span>
                  </div>

                  {/* DETAILS */}
                  <div className="mt-6 space-y-4">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-zinc-500">
                        Investment Range
                      </p>

                      <p className="mt-1 font-bold text-white">
                        {plan.is_free
                          ? 'Free'
                          : `$${minimumAmount.toLocaleString()} – $${maximumAmount.toLocaleString()}`}
                      </p>
                    </div>

                                        <div>
                      <p className="text-xs uppercase tracking-wider text-zinc-500">
                        Duration
                      </p>

                      <p className="mt-1 font-bold text-white">
                        {plan.duration_days} days
                      </p>
                    </div>

                    <div className="rounded-2xl border border-yellow-500/10 bg-black/40 p-4">
                      <p className="text-xs uppercase tracking-wider text-zinc-500">
                        Mining Power
                      </p>

                      {plan.is_free ? (
                        <>
                          <p className="mt-2 text-2xl font-bold text-yellow-400">
                            {freeDailyGold.toLocaleString()} Gold
                          </p>

                          <p className="mt-1 text-xs text-zinc-500">
                            Every 24 hours
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="mt-2 text-2xl font-bold text-yellow-400">
                            {goldPerDollar.toLocaleString()} Gold
                          </p>

                          <p className="mt-1 text-xs text-zinc-500">
                            Per $1 invested / 24 hours
                          </p>
                        </>
                      )}
                    </div>

                    {!plan.is_free && (
                      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                        <p className="text-xs uppercase tracking-wider text-zinc-500">
                          Maximum Daily Gold
                        </p>

                        <p className="mt-1 font-bold text-white">
                          {maximumDailyGold.toLocaleString()} Gold
                        </p>
                      </div>
                    )}
                  </div>

                  {/* ACTIONS */}
                  <div className="mt-auto grid grid-cols-1 gap-3 pt-6 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() =>
                        openEditForm(plan)
                      }
                      className="h-11 rounded-xl border border-zinc-700 px-4 text-sm font-semibold text-white transition hover:border-yellow-400 hover:text-yellow-400"
                    >
                      Edit Plan
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        togglePlan(plan)
                      }
                      className={`h-11 rounded-xl px-4 text-sm font-semibold transition ${
                        plan.is_active
                          ? 'border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20'
                          : 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                      }`}
                    >
                      {plan.is_active
                        ? 'Deactivate'
                        : 'Activate'}
                    </button>
                  </div>

                  {/* ID */}
                  <p className="mt-4 break-all text-[11px] text-zinc-700">
                    ID: {plan.id}
                  </p>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}