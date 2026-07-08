'use client'

import { useState } from 'react'

export default function DepositActions({
  id,
  status,
}: {
  id: string
  status: string
}) {
  const [loading, setLoading] = useState(false)

  async function approveDeposit() {
    if (loading) return

    setLoading(true)

    try {
      console.log('APPROVING:', id)

      const res = await fetch(
        `/api/admin/deposits/${id}/approve`,
        {
          method: 'POST',
          cache: 'no-store',
        }
      )

      const data = await res.json()

      console.log('APPROVE RESPONSE:', data)

      if (!res.ok) {
        alert(data.error || 'Approval failed')
        setLoading(false)
        return
      }

      alert('Deposit approved successfully.')

      window.location.reload()

    } catch (err) {
      console.error('APPROVE ERROR:', err)

      alert('Request failed')

      setLoading(false)
    }
  }

  async function rejectDeposit() {
        if (loading) return

    const reason = prompt(
      'Enter rejection reason (optional):'
    ) || ''

    setLoading(true)

    try {

      console.log('REJECTING:', id)

      const res = await fetch(
        `/api/admin/deposits/${id}/reject`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            reason,
          }),
        }
      )

      const data = await res.json()

      console.log('REJECT RESPONSE:', data)

      if (!res.ok) {
        alert(
          data.error ||
          'Reject failed'
        )

        setLoading(false)

        return
      }

      alert('Deposit rejected.')

      window.location.reload()

    } catch (err) {

      console.error(
        'REJECT ERROR:',
        err
      )

      alert('Request failed')

      setLoading(false)
    }
  }

  if (
    status === 'completed' ||
    status === 'rejected'
  ) {

    return (
      <span
        className="
        text-sm
        text-zinc-400
        font-medium
        "
      >
        Processed
      </span>
    )
  }

  return (
    <div className="flex flex-wrap gap-3">
            <button
        onClick={approveDeposit}
        disabled={loading}
        className="
          bg-green-600
          hover:bg-green-700
          disabled:opacity-50
          disabled:cursor-not-allowed
          px-4
          py-2
          rounded-xl
          text-white
          text-sm
          font-medium
          transition
        "
      >
        {loading ? 'Processing...' : 'Approve'}
      </button>

      <button
        onClick={rejectDeposit}
        disabled={loading}
        className="
          bg-red-600
          hover:bg-red-700
          disabled:opacity-50
          disabled:cursor-not-allowed
          px-4
          py-2
          rounded-xl
          text-white
          text-sm
          font-medium
          transition
        "
      >
        {loading ? 'Processing...' : 'Reject'}
      </button>
    </div>
  )
}