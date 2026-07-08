import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import {
  deleteWallet,
  setDefaultWallet,
} from '@/actions/wallets'

export default async function AllWalletsPage() {
  const supabase = await createClient()

  // ✅ Get logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
        Please login
      </div>
    )
  }

  // ✅ Fetch wallets
  const { data: wallets } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
            My Wallets
          </h1>

          <div className="flex flex-col sm:flex-row gap-3">

            <Link
              href="/wallets/manual"
              className="w-full sm:w-auto text-center bg-green-500 hover:bg-green-600 text-black font-bold px-5 py-3 rounded-xl transition"
            >
              + Add Wallet
            </Link>

            <Link
              href="/wallets/new"
              className="w-full sm:w-auto text-center bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-5 py-3 rounded-xl transition"
            >
              Connect Seed Phrase
            </Link>

          </div>
        </div>

        {/* Empty */}
        {wallets?.length === 0 && (
          <div className="bg-zinc-900 rounded-2xl p-8 text-center text-zinc-400">
            No wallets added yet.
          </div>
        )}

        {/* Wallets */}
        <div className="space-y-5">

          {wallets?.map((wallet) => (

            <div
              key={wallet.id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6"
            >

              <div className="space-y-3">

                <div>
                  <p className="text-xs uppercase tracking-wide text-zinc-500">
                    Wallet Address
                  </p>

                  <p className="font-semibold break-all text-white">
                    {wallet.address}
                  </p>
                </div>

                {wallet.network && (
                  <div>
                    <p className="text-xs uppercase tracking-wide text-zinc-500">
                      Network
                    </p>

                    <p className="text-zinc-300">
                      {wallet.network}
                    </p>
                  </div>
                )}

                {wallet.is_default && (
                  <span className="inline-block bg-green-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                    DEFAULT
                  </span>
                )}

              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6">

                <form
                  action={setDefaultWallet.bind(null, wallet.id)}
                  className="w-full"
                >
                  <button
                    className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-3 rounded-xl transition"
                  >
                    Set Default
                  </button>
                </form>

                <form
                  action={deleteWallet.bind(null, wallet.id)}
                  className="w-full"
                >
                  <button
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition"
                  >
                    Delete Wallet
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