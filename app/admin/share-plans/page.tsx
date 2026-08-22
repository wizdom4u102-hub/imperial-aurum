'use client'

import {
  FormEvent,
  useEffect,
  useState,
} from 'react'

type Profile = {
  id: string
  full_name: string | null
  username: string | null
  email: string | null
}

type SharedPlan = {
  id: string
  user_id: string
  title: string | null
  description: string | null
  amount: number | null
  minimum_amount: number | null
  daily_roi: number | null
  monthly_roi: number | null
  duration_days: number | null
  days_completed: number | null
  total_invested: number | null
  total_profit_generated: number | null
  started_at: string | null
  ends_at: string | null
  last_profit_at: string | null
  deposit_id: string | null
  active: boolean | null
  status: string | null
  created_at: string | null
  updated_at: string | null
}

type SharePlanForm = {
  title: string
  description: string
  amount: string
  minimum_amount: string
  daily_roi: string
  monthly_roi: string
  duration_days: string
  days_completed: string
  total_invested: string
  total_profit_generated: string
  started_at: string
  ends_at: string
  active: boolean
  status: string
}

const EMPTY_FORM: SharePlanForm = {
  title: '',
  description: '',
  amount: '',
  minimum_amount: '',
  daily_roi: '',
  monthly_roi: '',
  duration_days: '',
  days_completed: '',
  total_invested: '',
  total_profit_generated: '',
  started_at: '',
  ends_at: '',
  active: true,
  status: 'active',
}

export default function AdminSharePlansPage() {
  const [plans, setPlans] = useState<SharedPlan[]>([])
  const [profiles, setProfiles] = useState<
    Profile[]
  >([])

  const [loading, setLoading] =
    useState(true)

  const [saving, setSaving] =
    useState(false)

  const [showEdit, setShowEdit] =
    useState(false)

  const [editingPlanId, setEditingPlanId] =
    useState<string | null>(null)

  const [form, setForm] =
    useState<SharePlanForm>(
      EMPTY_FORM
    )

  const [message, setMessage] =
    useState('')

  const [error, setError] =
    useState('')

  useEffect(() => {
    void loadPlans()
  }, [])

  async function loadPlans() {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(
        '/api/admin/share-plans',
        {
          method: 'GET',
          cache: 'no-store',
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Failed to load share plans.'
        )
      }

      setPlans(
        Array.isArray(data.plans)
          ? data.plans
          : []
      )

      setProfiles(
        Array.isArray(data.profiles)
          ? data.profiles
          : []
      )
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load share plans.'
      )
    } finally {
      setLoading(false)
    }
  }

  function getProfile(
    userId: string
  ) {
    return profiles.find(
      (profile) =>
        profile.id === userId
    )
  }

  function openEdit(
    plan: SharedPlan
  ) {
    setEditingPlanId(plan.id)

    setForm({
      title: plan.title ?? '',
      description:
        plan.description ?? '',

      amount:
        String(plan.amount ?? 0),

      minimum_amount:
        String(
          plan.minimum_amount ?? 0
        ),

      daily_roi:
        String(plan.daily_roi ?? 0),

      monthly_roi:
        String(
          plan.monthly_roi ?? 0
        ),

      duration_days:
        String(
          plan.duration_days ?? 0
        ),

      days_completed:
        String(
          plan.days_completed ?? 0
        ),

      total_invested:
        String(
          plan.total_invested ?? 0
        ),

      total_profit_generated:
        String(
          plan.total_profit_generated ?? 0
        ),

      started_at:
        toDateTimeLocal(
          plan.started_at
        ),

      ends_at:
        toDateTimeLocal(
          plan.ends_at
        ),

      active:
        plan.active ?? false,

      status:
        plan.status ?? 'active',
    })

    setMessage('')
    setError('')
    setShowEdit(true)

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  function closeEdit() {
    if (saving) return

    setShowEdit(false)
    setEditingPlanId(null)
    setForm(EMPTY_FORM)
  }

  function updateForm(
    field: keyof SharePlanForm,
    value: string | boolean
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  async function savePlan(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    if (!editingPlanId) {
      return
    }

    setSaving(true)
    setMessage('')
    setError('')

    try {
      const response = await fetch(
        '/api/admin/share-plans',
        {
          method: 'PATCH',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            id: editingPlanId,

            title:
              form.title.trim(),

            description:
              form.description.trim() ||
              null,

            amount:
              Number(form.amount),

            minimum_amount:
              Number(
                form.minimum_amount
              ),

            daily_roi:
              Number(form.daily_roi),

            monthly_roi:
              Number(
                form.monthly_roi
              ),

            duration_days:
              Number(
                form.duration_days
              ),

            days_completed:
              Number(
                form.days_completed
              ),

            total_invested:
              Number(
                form.total_invested
              ),

            total_profit_generated:
              Number(
                form.total_profit_generated
              ),

            started_at:
              form.started_at
                ? new Date(
                    form.started_at
                  ).toISOString()
                : null,

            ends_at:
              form.ends_at
                ? new Date(
                    form.ends_at
                  ).toISOString()
                : null,

            active:
              form.active,

            status:
              form.status,
          }),
        }
      )

      const data =
        await response.json()

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Failed to update share plan.'
        )
      }

      setMessage(
        'Share plan updated successfully.'
      )

      closeEdit()

      await loadPlans()
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to update share plan.'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-black p-4 text-white sm:p-6 lg:p-10">
      <div className="mx-auto w-full max-w-7xl">

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-400">
              Imperial Aurum
            </p>

            <h1 className="mt-2 text-2xl font-bold sm:text-3xl lg:text-4xl">
              Manage Share Plans
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
              Review and manage user share-plan
              investments, ROI and maturity.
            </p>
          </div>

          <a
            href="/admin"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-700 px-5 text-sm font-semibold text-white transition hover:border-yellow-400 hover:text-yellow-400"
          >
            ← Admin Dashboard
          </a>
        </div>

        {/* MESSAGE */}
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

        {/* EDIT FORM */}
        {showEdit && (
          <section className="mb-8 rounded-3xl border border-yellow-500/20 bg-zinc-900 p-5 sm:p-7">

            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-yellow-400">
                  Administration
                </p>

                <h2 className="mt-1 text-xl font-bold sm:text-2xl">
                  Edit Share Plan
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Update the existing user investment.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEdit}
                disabled={saving}
                className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:border-zinc-500 hover:text-white"
              >
                Cancel
              </button>
            </div>

            <form
              onSubmit={savePlan}
              className="space-y-6"
            >

              {/* TITLE */}
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Plan Title
                  </label>

                  <input
                    required
                    value={form.title}
                    onChange={(event) =>
                      updateForm(
                        'title',
                        event.target.value
                      )
                    }
                    className="h-12 w-full rounded-xl border border-zinc-700 bg-black px-4 text-white outline-none focus:border-yellow-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Description
                  </label>

                  <input
                    value={
                      form.description
                    }
                    onChange={(event) =>
                      updateForm(
                        'description',
                        event.target.value
                      )
                    }
                    className="h-12 w-full rounded-xl border border-zinc-700 bg-black px-4 text-white outline-none focus:border-yellow-400"
                  />
                </div>

              </div>

              {/* FINANCIAL */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

                <NumberField
                  label="Amount"
                  value={form.amount}
                  onChange={(value) =>
                    updateForm(
                      'amount',
                      value
                    )
                  }
                />

                <NumberField
                  label="Minimum Amount"
                  value={
                    form.minimum_amount
                  }
                  onChange={(value) =>
                    updateForm(
                      'minimum_amount',
                      value
                    )
                  }
                />

                <NumberField
                  label="Daily ROI %"
                  value={form.daily_roi}
                  onChange={(value) =>
                    updateForm(
                      'daily_roi',
                      value
                    )
                  }
                />

                <NumberField
                  label="Monthly ROI %"
                  value={
                    form.monthly_roi
                  }
                  onChange={(value) =>
                    updateForm(
                      'monthly_roi',
                      value
                    )
                  }
                />

              </div>

              {/* PROGRESS */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

                <NumberField
                  label="Duration Days"
                  value={
                    form.duration_days
                  }
                  onChange={(value) =>
                    updateForm(
                      'duration_days',
                      value
                    )
                  }
                />

                <NumberField
                  label="Days Completed"
                  value={
                    form.days_completed
                  }
                  onChange={(value) =>
                    updateForm(
                      'days_completed',
                      value
                    )
                  }
                />

                <NumberField
                  label="Total Invested"
                  value={
                    form.total_invested
                  }
                  onChange={(value) =>
                    updateForm(
                      'total_invested',
                      value
                    )
                  }
                />

                <NumberField
                  label="Total Profit Generated"
                  value={
                    form.total_profit_generated
                  }
                  onChange={(value) =>
                    updateForm(
                      'total_profit_generated',
                      value
                    )
                  }
                />

              </div>

              {/* DATES */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Started At
                  </label>

                  <input
                    type="datetime-local"
                    value={
                      form.started_at
                    }
                    onChange={(event) =>
                      updateForm(
                        'started_at',
                        event.target.value
                      )
                    }
                    className="h-12 w-full rounded-xl border border-zinc-700 bg-black px-4 text-white outline-none focus:border-yellow-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Ends At
                  </label>

                  <input
                    type="datetime-local"
                    value={
                      form.ends_at
                    }
                    onChange={(event) =>
                      updateForm(
                        'ends_at',
                        event.target.value
                      )
                    }
                    className="h-12 w-full rounded-xl border border-zinc-700 bg-black px-4 text-white outline-none focus:border-yellow-400"
                  />
                </div>

              </div>

              {/* STATUS */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Status
                  </label>

                  <select
                    value={form.status}
                    onChange={(event) =>
                      updateForm(
                        'status',
                        event.target.value
                      )
                    }
                    className="h-12 w-full rounded-xl border border-zinc-700 bg-black px-4 text-white outline-none focus:border-yellow-400"
                  >
                    <option value="active">
                      Active
                    </option>

                    <option value="completed">
                      Completed
                    </option>

                    <option value="pending">
                      Pending
                    </option>

                    <option value="cancelled">
                      Cancelled
                    </option>
                  </select>
                </div>

                <div className="flex items-end">
                  <label className="flex h-12 w-full cursor-pointer items-center gap-3 rounded-xl border border-zinc-700 bg-black px-4">
                    <input
                      type="checkbox"
                      checked={
                        form.active
                      }
                      onChange={(event) =>
                        updateForm(
                          'active',
                          event.target.checked
                        )
                      }
                      className="h-5 w-5 accent-yellow-400"
                    />

                    <span className="text-sm font-medium text-white">
                      Investment Active
                    </span>
                  </label>
                </div>

              </div>

              {/* BUTTONS */}
              <div className="flex flex-col gap-3 border-t border-zinc-800 pt-6 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={closeEdit}
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
                    : 'Save Changes'}
                </button>

              </div>

            </form>
          </section>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-10 text-center">
            <p className="text-zinc-400">
              Loading share plans...
            </p>
          </div>
        ) : plans.length === 0 ? (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-10 text-center">

            <div className="text-5xl">
              📈
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              No Share Plan Investments
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              No user share-plan investments
              have been created yet.
            </p>

          </div>
        ) : (
          <>

            {/* DESKTOP */}
            <div className="hidden overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 lg:block">

              <div className="border-b border-zinc-800 p-6">
                <h2 className="text-xl font-bold">
                  All Share Plan Investments
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  {plans.length}{' '}
                  investment
                  {plans.length === 1
                    ? ''
                    : 's'}
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-[1300px] w-full">

                  <thead className="bg-zinc-800">
                    <tr>
                      <th className="p-5 text-left text-sm">
                        User
                      </th>

                      <th className="p-5 text-left text-sm">
                        Plan
                      </th>

                      <th className="p-5 text-left text-sm">
                        Investment
                      </th>

                      <th className="p-5 text-left text-sm">
                        ROI
                      </th>

                      <th className="p-5 text-left text-sm">
                        Progress
                      </th>

                      <th className="p-5 text-left text-sm">
                        Profit
                      </th>

                      <th className="p-5 text-left text-sm">
                        Status
                      </th>

                      <th className="p-5 text-left text-sm">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-zinc-800">

                    {plans.map(
                      (plan) => {
                        const profile =
                          getProfile(
                            plan.user_id
                          )

                        const days =
                          Number(
                            plan.days_completed ??
                              0
                          )

                        const duration =
                          Number(
                            plan.duration_days ??
                              0
                          )

                        const progress =
                          duration > 0
                            ? Math.min(
                                100,
                                Math.max(
                                  0,
                                  (days /
                                    duration) *
                                    100
                                )
                              )
                            : 0

                        return (
                          <tr
                            key={plan.id}
                            className="hover:bg-zinc-800/40"
                          >

                            {/* USER */}
                            <td className="p-5">
                              <p className="font-semibold text-white">
                                {profile?.full_name ||
                                  'No name'}
                              </p>

                              <p className="mt-1 text-sm text-yellow-400">
                                {profile?.username
                                  ? `@${profile.username}`
                                  : 'No username'}
                              </p>

                              <p className="mt-1 max-w-[220px] break-all text-xs text-zinc-500">
                                {profile?.email ||
                                  'No email'}
                              </p>
                            </td>

                            {/* PLAN */}
                            <td className="p-5">
                              <p className="font-semibold text-white">
                                {plan.title ||
                                  'Share Plan'}
                              </p>

                              {plan.description && (
                                <p className="mt-1 max-w-[200px] text-xs text-zinc-500">
                                  {plan.description}
                                </p>
                              )}
                            </td>

                            {/* INVESTMENT */}
                            <td className="p-5">
                              <p className="font-bold text-yellow-400">
                                $
                                {Number(
                                  plan.amount ??
                                    0
                                ).toFixed(2)}
                              </p>

                              <p className="mt-1 text-xs text-zinc-500">
                                Deposit:{' '}
                                {plan.deposit_id ||
                                  'N/A'}
                              </p>
                            </td>

                            {/* ROI */}
                            <td className="p-5">
                              <p className="font-semibold text-emerald-400">
                                {Number(
                                  plan.daily_roi ??
                                    0
                                )}
                                % Daily
                              </p>

                              <p className="mt-1 text-xs text-zinc-500">
                                {Number(
                                  plan.monthly_roi ??
                                    0
                                )}
                                % Monthly
                              </p>
                            </td>

                            {/* PROGRESS */}
                            <td className="p-5">
                              <p className="text-sm text-zinc-300">
                                {days} /{' '}
                                {duration} days
                              </p>

                              <div className="mt-2 h-2 w-32 overflow-hidden rounded-full bg-zinc-800">
                                <div
                                  className="h-full rounded-full bg-yellow-400"
                                  style={{
                                    width: `${progress}%`,
                                  }}
                                />
                              </div>
                            </td>

                            {/* PROFIT */}
                            <td className="p-5">
                              <p className="font-bold text-blue-400">
                                $
                                {Number(
                                  plan.total_profit_generated ??
                                    0
                                ).toFixed(2)}
                              </p>
                            </td>

                            {/* STATUS */}
                            <td className="p-5">
                              <span
                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                  plan.status ===
                                  'completed'
                                    ? 'bg-blue-500/10 text-blue-400'
                                    : plan.status ===
                                      'active'
                                    ? 'bg-emerald-500/10 text-emerald-400'
                                    : 'bg-zinc-800 text-zinc-400'
                                }`}
                              >
                                {plan.status ||
                                  'unknown'}
                              </span>

                              <p className="mt-2 text-xs text-zinc-600">
                                {plan.active
                                  ? 'Active'
                                  : 'Inactive'}
                              </p>
                            </td>

                            {/* EDIT */}
                            <td className="p-5">
                              <button
                                type="button"
                                onClick={() =>
                                  openEdit(
                                    plan
                                  )
                                }
                                className="rounded-xl border border-zinc-700 px-4 py-2 text-sm font-semibold text-white transition hover:border-yellow-400 hover:text-yellow-400"
                              >
                                Edit
                              </button>
                            </td>

                          </tr>
                        )
                      }
                    )}

                  </tbody>

                </table>
              </div>
            </div>

            {/* MOBILE */}
            <div className="space-y-4 lg:hidden">

              {plans.map(
                (plan) => {
                  const profile =
                    getProfile(
                      plan.user_id
                    )

                  const days =
                    Number(
                      plan.days_completed ??
                        0
                    )

                  const duration =
                    Number(
                      plan.duration_days ??
                        0
                    )

                  const progress =
                    duration > 0
                      ? Math.min(
                          100,
                          Math.max(
                            0,
                            (days /
                              duration) *
                              100
                          )
                        )
                      : 0

                  return (
                    <article
                      key={plan.id}
                      className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6"
                    >

                      {/* USER */}
                      <div className="border-b border-zinc-800 pb-5">

                        <p className="text-xs uppercase tracking-wider text-zinc-500">
                          User
                        </p>

                        <p className="mt-2 font-bold text-white">
                          {profile?.full_name ||
                            'No name'}
                        </p>

                        <p className="mt-1 text-sm text-yellow-400">
                          {profile?.username
                            ? `@${profile.username}`
                            : 'No username'}
                        </p>

                        <p className="mt-1 break-all text-xs text-zinc-500">
                          {profile?.email ||
                            'No email'}
                        </p>

                      </div>

                      {/* PLAN */}
                      <div className="mt-5">
                        <p className="text-xs uppercase tracking-wider text-zinc-500">
                          Share Plan
                        </p>

                        <p className="mt-1 text-xl font-bold text-white">
                          {plan.title ||
                            'Share Plan'}
                        </p>
                      </div>

                      {/* AMOUNT */}
                      <div className="mt-5 grid grid-cols-2 gap-3">

                        <div className="rounded-2xl bg-black/40 p-4">
                          <p className="text-xs text-zinc-500">
                            Investment
                          </p>

                          <p className="mt-1 font-bold text-yellow-400">
                            $
                            {Number(
                              plan.amount ??
                                0
                            ).toFixed(2)}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-black/40 p-4">
                          <p className="text-xs text-zinc-500">
                            Profit
                          </p>

                          <p className="mt-1 font-bold text-blue-400">
                            $
                            {Number(
                              plan.total_profit_generated ??
                                0
                            ).toFixed(2)}
                          </p>
                        </div>

                      </div>

                      {/* ROI */}
                      <div className="mt-4 rounded-2xl border border-zinc-800 bg-black/30 p-4">

                        <p className="text-xs uppercase tracking-wider text-zinc-500">
                          ROI
                        </p>

                        <p className="mt-2 font-bold text-emerald-400">
                          {Number(
                            plan.daily_roi ??
                              0
                          )}
                          % Daily
                        </p>

                        <p className="mt-1 text-sm text-zinc-500">
                          {Number(
                            plan.monthly_roi ??
                              0
                          )}
                          % Monthly
                        </p>

                      </div>

                      {/* PROGRESS */}
                      <div className="mt-4">

                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-400">
                            Progress
                          </span>

                          <span className="text-white">
                            {days} /{' '}
                            {duration} days
                          </span>
                        </div>

                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-800">
                          <div
                            className="h-full rounded-full bg-yellow-400"
                            style={{
                              width: `${progress}%`,
                            }}
                          />
                        </div>

                      </div>

                      {/* STATUS */}
                      <div className="mt-5 flex items-center justify-between gap-3">

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            plan.status ===
                            'completed'
                              ? 'bg-blue-500/10 text-blue-400'
                              : plan.status ===
                                'active'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          {plan.status ||
                            'unknown'}
                        </span>

                        <span className="text-xs text-zinc-500">
                          {plan.active
                            ? 'Active'
                            : 'Inactive'}
                        </span>

                      </div>

                      {/* DATES */}
                      <div className="mt-5 grid grid-cols-1 gap-3 text-xs text-zinc-500 sm:grid-cols-2">

                        <div>
                          Started:{' '}
                          {plan.started_at
                            ? new Date(
                                plan.started_at
                              ).toLocaleString()
                            : 'N/A'}
                        </div>

                        <div>
                          Ends:{' '}
                          {plan.ends_at
                            ? new Date(
                                plan.ends_at
                              ).toLocaleString()
                            : 'N/A'}
                        </div>

                      </div>

                      {/* EDIT */}
                      <button
                        type="button"
                        onClick={() =>
                          openEdit(
                            plan
                          )
                        }
                        className="mt-6 h-11 w-full rounded-xl border border-zinc-700 font-semibold text-white transition hover:border-yellow-400 hover:text-yellow-400"
                      >
                        Edit Share Plan
                      </button>

                    </article>
                  )
                }
              )}

            </div>

          </>
        )}

      </div>
    </main>
  )
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (
    value: string
  ) => void
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-zinc-300">
        {label}
      </label>

      <input
        required
        type="number"
        min="0"
        step="0.000001"
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="h-12 w-full rounded-xl border border-zinc-700 bg-black px-4 text-white outline-none focus:border-yellow-400"
      />
    </div>
  )
}

function toDateTimeLocal(
  value: string | null
): string {
  if (!value) {
    return ''
  }

  const date =
    new Date(value)

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return ''
  }

  const year =
    date.getFullYear()

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, '0')

  const day =
    String(
      date.getDate()
    ).padStart(2, '0')

  const hours =
    String(
      date.getHours()
    ).padStart(2, '0')

  const minutes =
    String(
      date.getMinutes()
    ).padStart(2, '0')

  return `${year}-${month}-${day}T${hours}:${minutes}`
}