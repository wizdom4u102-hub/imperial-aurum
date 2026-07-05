import { createClient } from '../../lib/supabase/server'
import { redirect } from 'next/navigation'

async function getUserData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: balance } = await supabase
    .from('balances')
    .select('cash')
    .eq('user_id', user.id)
    .single()

  return { balance: balance || { cash: 0 } }
}

export default async function WithdrawPage() {
  const { balance } = await getUserData()

  return (
    <div className="min-h-screen bg-zinc-950 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-yellow-400 mb-2">Withdraw to Crypto</h1>
        <p className="text-zinc-400 mb-10">Available Balance: ${Number(balance.cash).toFixed(2)}</p>

        <div className="bg-zinc-900 rounded-3xl p-10">
          <form className="space-y-8">
            <div>
              <label className="block text-sm text-zinc-400 mb-3">Amount to Withdraw (USD)</label>
              <input 
                type="number" 
                step="0.01" 
                min="10"
                placeholder="Minimum $10"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-5 text-2xl"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-3">Your Crypto Wallet Address</label>
              <input 
                type="text" 
                placeholder="0x... or bc1..."
                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-5 text-lg font-mono"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-6 rounded-2xl text-xl font-bold"
            >
              Request Withdrawal
            </button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <a href="/dashboard" className="text-yellow-400 hover:text-yellow-300">← Back to Dashboard</a>
        </div>
      </div>
    </div>
  )
}