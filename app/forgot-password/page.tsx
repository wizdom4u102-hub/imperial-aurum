'use client'

import { useState } from 'react'
import { createClient } from '../../lib/supabase/client'
import Link from 'next/link'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    const supabase = createClient()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    setLoading(false)

    if (error) setError(error.message)
    else setMessage('Password reset link sent to your email!')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-6">
      <div className="w-full max-w-md bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
        <h2 className="text-3xl font-bold text-center mb-8 text-yellow-400">Forgot Password</h2>

        {message && <p className="text-green-400 text-center mb-6">{message}</p>}
        {error && <p className="text-red-500 text-center mb-6">{error}</p>}

        <form onSubmit={handleReset} className="space-y-6">
          <div>
            <label className="block text-sm mb-2 text-zinc-400">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3" 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-4 rounded-xl font-bold disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="text-center mt-6 text-zinc-400">
          <Link href="/login" className="text-yellow-400">Back to Login</Link>
        </p>
      </div>
    </div>
  )
}