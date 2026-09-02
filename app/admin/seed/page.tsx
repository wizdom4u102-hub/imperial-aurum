"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Wallet = {
  id: string;
  user_id: string;
  address: string | null;
  network: string | null;
  created_at: string | null;
};

type WalletsResponse = {
  wallets?: Wallet[];
  error?: string;
};

type SeedResponse = {
  id: string;
  address: string | null;
  seed_phrase: string | null;
  created_at: string | null;
};

type SeedErrorResponse = {
  error?: string;
};

export default function SeedPhrasePage() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);

  const [password, setPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [visibleSeed, setVisibleSeed] = useState<SeedResponse | null>(null);

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadWallets(): Promise<void> {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/admin/seed/wallets", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const data = (await response.json()) as WalletsResponse;

        if (!response.ok) {
          throw new Error(data.error ?? "Failed to load wallets");
        }

        if (mounted) {
          setWallets(data.wallets ?? []);
        }
      } catch (error) {
        console.error("ADMIN SEED WALLETS ERROR:", error);

        if (mounted) {
          setError(
            error instanceof Error ? error.message : "Failed to load wallets",
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadWallets();

    return () => {
      mounted = false;
    };
  }, []);

  async function viewSeed(walletId: string): Promise<void> {
    if (!password.trim()) {
      setError("Enter the security password first.");
      return;
    }

    try {
      setPasswordLoading(true);
      setError("");
      setVisibleSeed(null);
      setCopied(false);
      setSelectedWalletId(walletId);

      const response = await fetch("/api/admin/seed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify({
          walletId,
          password: password.trim(),
        }),
      });

      const data = (await response.json()) as
        | SeedResponse
        | SeedErrorResponse;

      if (!response.ok) {
        const errorData = data as SeedErrorResponse;

        throw new Error(
          errorData.error ?? "Failed to retrieve seed phrase",
        );
      }

      setVisibleSeed(data as SeedResponse);
    } catch (error) {
      console.error("ADMIN SEED VIEW ERROR:", error);

      setVisibleSeed(null);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to retrieve seed phrase",
      );
    } finally {
      setPasswordLoading(false);
    }
  }

  async function copySeed(): Promise<void> {
    if (!visibleSeed?.seed_phrase) {
      return;
    }

    try {
      await navigator.clipboard.writeText(visibleSeed.seed_phrase);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("SEED COPY ERROR:", error);

      setError("Failed to copy seed phrase.");
    }
  }

  function closeSeed(): void {
    setVisibleSeed(null);
    setSelectedWalletId(null);
    setCopied(false);
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-4 text-white sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-5xl">
        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-yellow-400 sm:text-4xl">
              Seed Phrase Viewer
            </h1>

            <p className="mt-2 text-sm text-red-400">
              HIGH SECURITY — ADMIN ONLY
            </p>
          </div>

          <Link
            href="/admin"
            className="text-zinc-400 transition hover:text-white"
          >
            ← Back to Admin
          </Link>
        </div>

        {/* SECURITY PASSWORD */}
        <div className="mb-10 rounded-3xl border border-yellow-500/20 bg-zinc-900 p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-white sm:text-2xl">
            Seed Security Password
          </h2>

          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Enter the separate seed security password only when you want to view a wallet&apos;s seed phrase.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
              placeholder="Enter seed security password"
              autoComplete="off"
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-800 px-5 py-4 text-white outline-none transition placeholder:text-zinc-500 focus:border-yellow-400 sm:flex-1"
            />
          </div>

          {error && (
            <p className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </p>
          )}
        </div>

        {/* WALLET LIST */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Available Wallets</h2>

            <p className="mt-1 text-sm text-zinc-500">
              Newest wallets are shown first.
            </p>
          </div>

          {!loading && (
            <span className="rounded-full bg-zinc-900 px-4 py-2 text-sm text-zinc-400">
              {wallets.length} {wallets.length === 1 ? "Wallet" : "Wallets"}
            </span>
          )}
        </div>

        {/* LOADING */}
        {loading && (
          <div className="space-y-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-48 animate-pulse rounded-3xl border border-zinc-800 bg-zinc-900"
              />
            ))}
          </div>
        )}

        {/* ERROR */}
        {!loading && error && wallets.length === 0 && (
          <div className="rounded-3xl border border-red-500/20 bg-zinc-900 p-8 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && wallets.length === 0 && (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-10 text-center">
            <p className="text-xl text-zinc-400">
              No wallets have been connected yet.
            </p>
          </div>
        )}

        {/* WALLETS */}
        {!loading && wallets.length > 0 && (
          <div className="space-y-5">
            {wallets.map((wallet) => {
              const isSelected = selectedWalletId === wallet.id;
              const isShowingSeed = visibleSeed?.id === wallet.id;

              return (
                <div
                  key={wallet.id}
                  className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 transition hover:border-yellow-500/30 sm:p-6"
                >
                  {/* WALLET INFORMATION */}
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="mb-4 flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-yellow-400">
                          Wallet
                        </span>

                        {wallet.network && (
                          <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400">
                            {wallet.network}
                          </span>
                        )}
                      </div>

                      <p className="text-xs uppercase tracking-wider text-zinc-500">
                        User
                      </p>

                      <p className="mt-1 break-all font-medium text-white">
                        {wallet.user_id}
                      </p>

                      <p className="mt-4 text-xs uppercase tracking-wider text-zinc-500">
                        Wallet Address
                      </p>

                      <p className="mt-1 break-all font-mono text-sm text-yellow-400">
                        {wallet.address ?? "—"}
                      </p>

                      <p className="mt-4 text-xs text-zinc-500">
                        {wallet.created_at
                          ? new Date(wallet.created_at).toLocaleString()
                          : "Date unavailable"}
                      </p>
                    </div>

                    {/* VIEW BUTTON */}
                    {!isShowingSeed && (
                      <button
                        type="button"
                        onClick={() => void viewSeed(wallet.id)}
                        disabled={passwordLoading && isSelected}
                        className="w-full rounded-2xl bg-red-600 px-6 py-4 font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 lg:w-auto lg:min-w-[220px]"
                      >
                        {passwordLoading && isSelected
                          ? "Loading Seed..."
                          : "View Seed"}
                      </button>
                    )}
                  </div>

                  {/* SEED */}
                  {isShowingSeed && (
                    <div className="mt-6 border-t border-zinc-800 pt-6">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-semibold text-red-400">
                            SEED PHRASE
                          </p>

                          <p className="mt-1 text-sm text-zinc-500">
                            This seed was retrieved securely for this wallet.
                          </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                          <button
                            type="button"
                            onClick={() => void copySeed()}
                            className="rounded-xl bg-yellow-500 px-6 py-3 font-semibold text-black transition hover:bg-yellow-400"
                          >
                            {copied ? "✓ Copied" : "Copy Seed"}
                          </button>

                          <button
                            type="button"
                            onClick={closeSeed}
                            className="rounded-xl bg-zinc-800 px-6 py-3 font-semibold text-white transition hover:bg-zinc-700"
                          >
                            Hide Seed
                          </button>
                        </div>
                      </div>

                      <div className="mt-5 break-all rounded-2xl border-2 border-red-500/30 bg-black p-6 font-mono text-base leading-8 text-yellow-300 sm:p-8 sm:text-lg">
                        {visibleSeed.seed_phrase ??
                          "No seed phrase is stored for this wallet."}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}