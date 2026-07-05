import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import {
  deleteWallet,
  setDefaultWallet,
} from '@/actions/wallets'

export default async function AllWalletsPage() {
  const supabase = await createClient()

  // ✅ get logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Please login
      </div>
    )
  }

  // ✅ fetch user wallets
  const { data: wallets } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="max-w-2xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-semibold">All Wallets</h1>

          <Link
            href="/wallets/new"
            className="bg-yellow-500 text-black px-4 py-2 rounded font-bold"
          >
            + Add Wallet
          </Link>
        </div>

        {wallets?.length === 0 && (
          <div className="bg-zinc-900 p-6 rounded-2xl text-center text-zinc-400">
            No wallets yet
          </div>
        )}

        <div className="space-y-6">
          {wallets?.map((wallet) => (
            <div key={wallet.id} className="bg-zinc-900 p-6 rounded-2xl">

              {/* WALLET INFO */}
              <div>
                <p className="font-bold break-all">{wallet.address}</p>
                <p className="text-sm text-zinc-400">{wallet.network}</p>

                {wallet.is_default && (
                  <span className="text-xs bg-green-500 text-black px-2 py-1 rounded mt-2 inline-block">
                    DEFAULT
                  </span>
                )}
              </div>

              {/* ACTIONS */}
              <div className="flex gap-4 mt-4">

                {/* ⭐ SET DEFAULT */}
                <form action={setDefaultWallet.bind(null, wallet.id)}>
                  <button className="text-yellow-400 text-sm">
                    Set Default
                  </button>
                </form>

                {/* 🗑 DELETE */}
                <form action={deleteWallet.bind(null, wallet.id)}>
                  <button className="text-red-500 text-sm">
                    Delete
                  </button>
                </form>

              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  )
}