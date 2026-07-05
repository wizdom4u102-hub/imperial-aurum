'use client'

import { useEffect, useState } from 'react'

export default function AdminDeposits() {
  const [deposits, setDeposits] = useState<any[]>([])
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const fetchDeposits = async () => {
    try {
      const res = await fetch('/api/admin/deposits')
      const data = await res.json()
      setDeposits(data.deposits || [])
    } catch (err) {
      console.error('Fetch deposits error:', err)
    }
  }

  useEffect(() => {
  fetchDeposits()

  const interval = setInterval(fetchDeposits, 5000) // 🔁 auto refresh

  return () => clearInterval(interval)
}, [])

  const approve = async (id: string) => {
  if (!id) {
    alert('Invalid deposit ID')
    return
  }

  setLoadingId(id)

  try {
    const url = `/api/admin/deposits/${id}/approve`

    console.log('CALLING:', url)

    const res = await fetch(url, {
      method: 'POST',
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.error || 'Failed to approve')
      return
    }

    alert('Deposit approved ✅')

    setDeposits(prev => prev.filter(d => d.id !== id))

  } catch (err) {
    console.error(err)
  }

  setLoadingId(null)
}

  return (
    <div className="space-y-4">
      {deposits.length === 0 && (
        <p className="text-zinc-500">No pending deposits</p>
      )}

      {deposits.map((d) => {
  console.log('DEPOSIT OBJECT:', d) // ✅ THIS WILL NOW WORK

  return (
    <div
      key={d.id || d.deposit_id || d._id}
      className="flex justify-between items-center bg-zinc-800 p-4 rounded-xl"
    >
      <div>
        <p className="font-semibold">${d.amount}</p>
        <p className="text-xs text-zinc-400">
          User: {d.user_id}
        </p>
      </div>

      <button
        onClick={() => {
          console.log('APPROVING ID:', d.id, d.deposit_id, d._id)

          // ✅ TEMP SAFE FIX (handles ALL cases)
          approve(d.id || d.deposit_id || d._id)
        }}
        disabled={loadingId === d.id}
        className="bg-green-500 px-4 py-2 rounded font-bold text-black"
      >
        {loadingId === d.id ? 'Processing...' : 'Approve'}
      </button>
    </div>
  )
})}
    </div>
  )
}