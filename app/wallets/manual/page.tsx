'use client';

import Link from 'next/link';
import { addWallet } from '@/actions/wallets';

export default function ManualWalletPage() {
  return (
    <div className="min-h-screen bg-black text-white px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-2xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold">
            Add Wallet Manually
          </h1>

          <p className="mt-3 text-zinc-400">
            Save an existing cryptocurrency wallet address to your account.
          </p>
        </div>

        {/* Form */}
        <form
          action={addWallet}
          className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 sm:p-8 space-y-6"
        >

          {/* Wallet Address */}
          <div>
            <label className="block text-sm text-zinc-400 mb-3">
              Wallet Address
            </label>

            <input
              name="address"
              type="text"
              required
              placeholder="Paste your wallet address"
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-800 px-4 py-4 text-white outline-none transition focus:border-yellow-500"
            />
          </div>

          {/* Network */}
          <div>
            <label className="block text-sm text-zinc-400 mb-3">
              Network (Optional)
            </label>

            <input
              name="network"
              type="text"
              placeholder="Example: ERC20, TRC20, BTC, SOL"
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-800 px-4 py-4 text-white outline-none transition focus:border-yellow-500"
            />

            <p className="mt-2 text-xs text-zinc-500">
              Leave this empty to let Imperial Aurum Mining detect the network automatically.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full rounded-2xl bg-green-500 py-4 font-bold text-black transition hover:bg-green-600"
          >
            Add Wallet
          </button>

        </form>

        {/* Navigation */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2">

          <Link
            href="/wallets/new"
            className="rounded-2xl bg-yellow-500 py-4 text-center font-bold text-black transition hover:bg-yellow-400"
          >
            Import Seed Phrase
          </Link>

          <Link
            href="/wallets"
            className="rounded-2xl bg-zinc-800 py-4 text-center transition hover:bg-zinc-700"
          >
            Back to Wallets
          </Link>

        </div>

      </div>
    </div>
  );
}