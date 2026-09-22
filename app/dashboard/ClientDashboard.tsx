"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";

import { useRouter } from "next/navigation";
import { logoutAction } from "../../actions/auth";
import Link from "next/link";
import {
  Cpu,
  LayoutDashboard,
  User,
  Pickaxe,
  Wallet,
  History,
  ArrowLeftRight,
  Users,
  Network,
} from "lucide-react";

interface ClientDashboardProps {
  profile: any;
  deposits: any[];
  withdrawals: any[];
  transactions: any[];
  session: any;
  currentMiningPlan: {
    id: string;
    name: string;
    is_free: boolean;
  } | null;
  referralLink: string;
}

export default function ClientDashboard({
  profile,
  deposits,
  withdrawals,
  transactions,
  session,
  currentMiningPlan,
  referralLink,
}: ClientDashboardProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] =
    useState(false);

      const inactivityFormRef =
    useRef<HTMLFormElement>(null);

      useEffect(() => {
    const INACTIVITY_LIMIT = 10 * 60 * 1000;

    let inactivityTimer: number;

    const resetInactivityTimer = () => {
      window.clearTimeout(inactivityTimer);

      inactivityTimer = window.setTimeout(() => {
        inactivityFormRef.current?.requestSubmit();
      }, INACTIVITY_LIMIT);
    };

    const activityEvents: Array<keyof WindowEventMap> = [
      "mousemove",
      "mousedown",
      "keydown",
      "touchstart",
      "scroll",
      "click",
    ];

    activityEvents.forEach((event) => {
      window.addEventListener(
        event,
        resetInactivityTimer,
        { passive: true }
      );
    });

    resetInactivityTimer();

    return () => {
      window.clearTimeout(inactivityTimer);

      activityEvents.forEach((event) => {
        window.removeEventListener(
          event,
          resetInactivityTimer
        );
      });
    };
  }, []);

  const cardGrid =
    "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6";

  const [balance, setBalance] =
    useState({
      gold: Number(
        profile?.balances?.gold || 0
      ),
      cash: Number(
        profile?.balances?.cash || 0
      ),
      shares: Number(
        profile?.balances?.shares || 0
      ),
      is_premium:
        profile?.is_premium || false,
      mining_rate_per_hour: 5,
      total_gold_earned: Number(
        profile?.balances?.gold || 0
      ),
    });

  const [displayGold, setDisplayGold] =
    useState(
      Number(
        profile?.balances?.gold || 0
      )
    );

  // =====================================================
  // SYNC STATE WITH SERVER DATA
  // =====================================================

  useEffect(() => {
    setBalance({
      gold: Number(
        profile?.balances?.gold || 0
      ),
      cash: Number(
        profile?.balances?.cash || 0
      ),
      shares: Number(
        profile?.balances?.shares || 0
      ),
      is_premium:
        profile?.is_premium || false,
      mining_rate_per_hour:
        Number(
          profile?.mining_rate_per_hour || 5
        ),
      total_gold_earned:
        Number(
          profile?.balances?.gold || 0
        ),
    });

    setDisplayGold(
      Number(
        profile?.balances?.gold || 0
      )
    );
  }, [profile]);

  // =====================================================
  // REFRESH WALLET
  // =====================================================

  const refreshWallet =
    useCallback(async () => {
      if (
        typeof document !==
          "undefined" &&
        document.hidden
      ) {
        return;
      }

      try {
        const res =
          await fetch(
            "/api/wallet",
            {
              credentials:
                "include",
              cache:
                "no-store",
            }
          );

        if (!res.ok) {
          return;
        }

        const data =
          await res.json();

        setBalance({
          gold: Number(
            data.gold || 0
          ),
          cash: Number(
            data.cash || 0
          ),
          shares: Number(
            data.shares || 0
          ),
          total_gold_earned:
            Number(
              data.total_gold_earned ||
                data.gold ||
                0
            ),
          is_premium:
            profile?.is_premium ||
            false,
          mining_rate_per_hour:
            Number(
              data.mining_rate_per_hour ||
                5
            ),
        });
      } catch (err) {
        console.error(
          "Wallet refresh error:",
          err
        );
      }
    }, [profile?.is_premium]);

  useEffect(() => {
    void refreshWallet();

    const interval =
      window.setInterval(
        () => {
          void refreshWallet();
        },
        60000
      );

    return () =>
      window.clearInterval(
        interval
      );
  }, [refreshWallet]);

  useEffect(() => {
    const handler =
      () => {
        void refreshWallet();
      };

    window.addEventListener(
      "wallet-refresh",
      handler
    );

    return () => {
      window.removeEventListener(
        "wallet-refresh",
        handler
      );
    };
  }, [refreshWallet]);

  // =====================================================
  // GOLD ANIMATION
  // =====================================================

  useEffect(() => {
    let animationFrame:
      number;

    const animate =
      () => {
        setDisplayGold(
          (prev) => {
            const target =
              balance.gold;

            if (
              prev >= target
            ) {
              return target;
            }

            const diff =
              target - prev;

            const step =
              diff * 0.1;

            return prev + step;
          }
        );

        animationFrame =
          window.requestAnimationFrame(
            animate
          );
      };

    animate();

    return () =>
      window.cancelAnimationFrame(
        animationFrame
      );
  }, [balance.gold]);

  return (
    <div className="flex min-h-screen w-full bg-black text-white overflow-x-hidden">
          <form
        ref={inactivityFormRef}
        action={logoutAction}
        className="hidden"
      />
      {/* SIDEBAR */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-50
          h-screen w-64 lg:w-72
          bg-zinc-950 border-r border-zinc-800
          p-4 lg:p-6 flex flex-col overflow-y-auto
          transform transition-transform duration-300
          ${
            menuOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
          lg:translate-x-0
        `}
      >
        <button
          onClick={() =>
            setMenuOpen(false)
          }
          className="lg:hidden text-right text-3xl mb-6 text-white"
        >
          ✕
        </button>

        <div className="mb-10">
          <h1 className="text-xl lg:text-2xl font-bold text-yellow-400">
            Imperial Aurum
          </h1>
        </div>

        <nav className="flex-1 space-y-1 text-sm overflow-y-auto">
  <Link
    href="/dashboard"
    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-900 text-white font-medium hover:bg-zinc-800 transition-colors"
  >
    <LayoutDashboard className="w-5 h-5 text-yellow-400" />
    <span>
      Dashboard
    </span>
  </Link>

  <Link
    href="/dashboard/profile"
    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-900 transition-colors"
  >
    <User className="w-5 h-5 text-yellow-400" />
    <span>
      Profile
    </span>
  </Link>

  <Link
    href="/dashboard/reinvestment"
    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-900 transition-colors"
  >
    <ArrowLeftRight className="w-5 h-5 text-yellow-400" />
   <span>
    Reinvestment
   </span>
  </Link>

  <details className="group">
    <summary className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-zinc-900 transition-colors cursor-pointer list-none">
      <div className="flex items-center gap-3">
        <Pickaxe className="w-5 h-5 text-yellow-400" />

        <span>
          Mining Plans
        </span>
      </div>

      <span className="text-xs text-zinc-500 group-open:rotate-180 transition-transform">
        ⌄
      </span>
    </summary>

    <div className="ml-4 mt-1 space-y-1 text-zinc-400">
      <Link
        className="block px-4 py-2 rounded-lg hover:bg-zinc-800 hover:text-white"
        href="/dashboard/mining-plans"
      >
        Purchase Mining Power
      </Link>

      <Link
        className="block px-4 py-2 rounded-lg hover:bg-zinc-800 hover:text-white"
        href="/deposit"
      >
        Deposit History
      </Link>
    </div>
  </details>

  <details className="group">
    <summary className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-zinc-900 transition-colors cursor-pointer list-none">
      <div className="flex items-center gap-3">
        <Wallet className="w-5 h-5 text-yellow-400" />

        <span>
          Withdraw
        </span>
      </div>

      <span className="text-xs text-zinc-500 group-open:rotate-180 transition-transform">
        ⌄
      </span>
    </summary>

    <div className="ml-4 mt-1 space-y-1 text-zinc-400">
      <Link
        className="block px-4 py-2 rounded-lg hover:bg-zinc-800 hover:text-white"
        href="/withdraw"
      >
        All Withdrawals
      </Link>

      <Link
        className="block px-4 py-2 rounded-lg hover:bg-zinc-800 hover:text-white"
        href="/withdraw/new"
      >
        New Withdraw
      </Link>
    </div>
  </details>

  <details className="group">
    <summary className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-zinc-900 transition-colors cursor-pointer list-none">
      <div className="flex items-center gap-3">
        <Wallet className="w-5 h-5 text-yellow-400" />

        <span>
          Wallet Address
        </span>
      </div>

      <span className="text-xs text-zinc-500 group-open:rotate-180 transition-transform">
        ⌄
      </span>
    </summary>

    <div className="ml-4 mt-1 space-y-1 text-zinc-400">
      <Link
        className="block px-4 py-2 rounded-lg hover:bg-zinc-800 hover:text-white"
        href="/wallets"
      >
        All Wallets
      </Link>

      <Link
        className="block px-4 py-2 rounded-lg hover:bg-zinc-800 hover:text-white"
        href="/wallets/new"
      >
        New Wallet
      </Link>
    </div>
  </details>

  <details className="group">
    <summary className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-zinc-900 transition-colors cursor-pointer list-none">
      <div className="flex items-center gap-3">
        <History className="w-5 h-5 text-yellow-400" />

        <span>
          History
        </span>
      </div>

      <span className="text-xs text-zinc-500 group-open:rotate-180 transition-transform">
        ⌄
      </span>
    </summary>

    <div className="ml-4 mt-1 space-y-1 text-zinc-400">
      <Link
        className="block px-4 py-2 rounded-lg hover:bg-zinc-800 hover:text-white"
        href="/history"
      >
        All History
      </Link>

      <Link
        className="block px-4 py-2 rounded-lg hover:bg-zinc-800 hover:text-white"
        href="/history/deposits"
      >
        Deposit History
      </Link>

      <Link
        className="block px-4 py-2 rounded-lg hover:bg-zinc-800 hover:text-white"
        href="/history/withdrawals"
      >
        Withdrawal History
      </Link>

      <Link
        className="block px-4 py-2 rounded-lg hover:bg-zinc-800 hover:text-white"
        href="/history/convert"
      >
        Convert History
      </Link>

      <Link
        className="block px-4 py-2 rounded-lg hover:bg-zinc-800 hover:text-white"
        href="/history/mining"
      >
        Gold History
      </Link>

      <Link
        className="block px-4 py-2 rounded-lg hover:bg-zinc-800 hover:text-white"
        href="/history/shared-plans"
      >
        Shared Plan History
      </Link>
    </div>
  </details>

  <details className="group">
    <summary className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-zinc-900 transition-colors cursor-pointer list-none">
      <div className="flex items-center gap-3">
        <ArrowLeftRight className="w-5 h-5 text-yellow-400" />

        <span>
          Convert
        </span>
      </div>

      <span className="text-xs text-zinc-500 group-open:rotate-180 transition-transform">
        ⌄
      </span>
    </summary>

    <div className="ml-4 mt-1 space-y-1 text-zinc-400">
      <Link
        className="block px-4 py-2 rounded-lg hover:bg-zinc-800 hover:text-white"
        href="/convert"
      >
        All Convert
      </Link>

      <Link
        className="block px-4 py-2 rounded-lg hover:bg-zinc-800 hover:text-white"
        href="/convert/new"
      >
        New Convert
      </Link>
    </div>
  </details>

  <Link
    href="/shared-plans"
    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-900 transition-colors"
  >
    <Users className="w-5 h-5 text-yellow-400" />
    <span>
      Shared Plan
    </span>
  </Link>

  <Link
    href="/referrals"
    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-900 transition-colors"
  >
    <Network className="w-5 h-5 text-yellow-400" />
    <span>
      Referrals
    </span>
  </Link>

  <Link
    href="/dashboard/trading-bot"
    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-900 text-zinc-400 hover:text-amber-500 transition-colors"
  >
    <Cpu className="w-5 h-5 text-amber-500" />
    <span>
      Trading Bot
    </span>
  </Link>
</nav>

        <div className="mt-auto pt-8">
          <form
            action={
              logoutAction
            }
          >
            <button className="w-full text-left px-4 py-3 text-red-400 hover:text-red-500 hover:bg-zinc-900 rounded-xl transition-colors text-sm">
              Logout
            </button>
          </form>
        </div>
      </aside>

      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() =>
            setMenuOpen(false)
          }
        />
      )}

      {/* MAIN DASHBOARD */}
      <main className="flex-1 p-4 md:p-8 lg:p-10">
        <div className="max-w-7xl mx-auto w-full">
          <button
            onClick={() =>
              setMenuOpen(true)
            }
            className="lg:hidden mb-3 text-3xl text-white"
          >
            ☰
          </button>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-12">
            <div>
              <h2 className="text-2xl md:text-4xl font-semibold">
                Dashboard
              </h2>

              <p className="text-zinc-400 mt-2">
                Current Plan:{" "}
                <span className="text-yellow-400 font-medium">
                  {currentMiningPlan?.name ||
                    "Free"}
                </span>
              </p>
            </div>

            <button
              onClick={() =>
                router.refresh()
              }
              className="w-full md:w-auto px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-sm transition-colors"
            >
              Refresh Balances
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {/* Gold Balance */}
            <div className="bg-zinc-900 p-6 lg:p-8 rounded-full aspect-square w-full max-w-[220px] md:max-w-[260px] lg:max-w-[320px] mx-auto flex flex-col items-center justify-center border-4 border-yellow-400 shadow-2xl">
              <p className="text-zinc-400 text-sm mb-3">
                Gold Balance
              </p>

              <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-yellow-400 tracking-tight">
                {Number(
                  displayGold || 0
                ).toFixed(2)}
              </div>
            </div>

            {/* Cash Balance */}
            <div className="bg-zinc-900 p-4 sm:p-6 lg:p-8 rounded-full aspect-square w-full max-w-[220px] md:max-w-[260px] lg:max-w-[320px] mx-auto flex flex-col items-center justify-center border-4 border-zinc-400 shadow-2xl">
              <p className="text-zinc-400 text-sm mb-3">
                Cash Balance
              </p>

              <div className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                $
                {Number(
                  balance.cash || 0
                ).toFixed(2)}
              </div>
            </div>

            {/* Mining */}
            <MiningCard
              session={session}
            />
          </div>

          {/* Recent Activity */}
          <div className="mt-16">
            <h3 className="text-xl font-medium mb-6">
              Recent Activity
            </h3>

            <div className="bg-zinc-900 rounded-3xl p-4 md:p-8 grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div>
                <h4 className="text-yellow-400 mb-5">
                  Latest Deposits
                </h4>

                {(deposits || [])
                  .length ? (
                  (
                    deposits || []
                  )
                    .slice(0, 4)
                    .map(
                      (
                        d: any
                      ) => (
                        <div
                          key={
                            d.id
                          }
                          className="flex justify-between py-4 border-b border-zinc-800 last:border-none"
                        >
                          <span>
                            $
                            {
                              d.amount
                            }
                          </span>

                          <span
                            className={`capitalize ${
                              d.status ===
                              "completed"
                                ? "text-emerald-400"
                                : "text-amber-400"
                            }`}
                          >
                            {
                              d.status
                            }
                          </span>
                        </div>
                      )
                    )
                ) : (
                  <p className="text-zinc-500 py-4">
                    No deposits yet.
                  </p>
                )}
              </div>

              <div>
                <h4 className="text-yellow-400 mb-5">
                  Latest Withdrawals
                </h4>

                {(withdrawals || [])
                  .length ? (
                  (
                    withdrawals ||
                    []
                  )
                    .slice(0, 4)
                    .map(
                      (
                        w: any
                      ) => (
                        <div
                          key={
                            w.id
                          }
                          className="flex justify-between py-4 border-b border-zinc-800 last:border-none"
                        >
                          <span>
                            $
                            {
                              w.amount
                            }
                          </span>

                          <span
                            className={`capitalize ${
                              w.status ===
                              "completed"
                                ? "text-emerald-400"
                                : "text-rose-400"
                            }`}
                          >
                            {
                              w.status
                            }
                          </span>
                        </div>
                      )
                    )
                ) : (
                  <p className="text-zinc-500 py-4">
                    No withdrawals yet.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Referral */}
          <div className="mt-16">
            <h3 className="text-xl font-medium mb-6">
              Referral Program
            </h3>

            <div className="bg-zinc-900 rounded-3xl p-8">
              <p className="text-zinc-400 mb-4">
                Invite friends and earn rewards when they join and deposit!
              </p>

              <div className="flex flex-col lg:flex-row gap-4">
                <input
                  type="text"
                  value={
                    referralLink
                  }
                  readOnly
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-sm font-mono text-zinc-300 focus:outline-none"
                />

                <button
                  onClick={() => {
                    void navigator.clipboard.writeText(
                      referralLink
                    );

                    alert(
                      "Referral link copied!"
                    );
                  }}
                  className="w-full lg:w-auto px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold rounded-2xl transition-colors whitespace-nowrap"
                >
                  Copy Link
                </button>
              </div>

              <p className="text-xs text-zinc-500 mt-3">
                Your unique referral link • Share it to earn 1000 Gold
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// =====================================================
// MINING CARD
// =====================================================

function MiningCard({
  session,
}: {
  session?: {
    id: string;
    user_id: string;
    active: boolean | null;
    status: string | null;
    started_at: string | null;
    ends_at: string | null;
    last_claim_at: string | null;
    rate_per_second: number | null;
    reward: number | null;
    total_earned: number | null;
    boost?: number;
    investment_amount?: number | null;
  } | null;
}) {
  // =====================================================
  // STATE
  // =====================================================

    const [timeLeft, setTimeLeft] =
    useState(0);

  const [uiTimeLeft, setUiTimeLeft] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [currentSession, setCurrentSession] =
    useState(session);

      const isPaidMining =
    Number(
      currentSession?.investment_amount || 0
    ) > 0;

  // =====================================================
  // SESSION FETCH
  // =====================================================

  const fetchSession =
    useCallback(async () => {
      try {
        const res =
          await fetch(
            "/api/mining/session",
            {
              credentials:
                "include",
              cache:
                "no-store",
            }
          );

        const data =
          (await res.json()) as {
            success?: boolean;
            session?: typeof session;
            completed?: boolean;
            paused?: boolean;
            error?: string;
          };

        console.log(
          "SESSION FULL:",
          JSON.stringify(
            data,
            null,
            2
          )
        );

        // =================================================
        // NO SESSION
        // =================================================

                if (
          !data?.session
        ) {
          setCurrentSession(
            null
          );

          setTimeLeft(0);
          setUiTimeLeft(0);

          setLoading(false);

          return;
        }

        // =================================================
        // COMPLETED SESSION
        //
        // A paid plan may be completed while its reward
        // remains available in mining_sessions.reward.
        //
        // Therefore we do NOT throw away the session merely
        // because `completed === true`.
        // =================================================

        const serverSession =
          data.session;

        setCurrentSession(
          serverSession
        );

        // =================================================
        // PAUSED SESSION
        // =================================================

                if (
          data.paused === true ||
          serverSession.active !==
            true ||
          serverSession.status !==
            "active"
        ) {
          setTimeLeft(0);
          setUiTimeLeft(0);

          setLoading(false);

          if (
            data.paused === true ||
            data.completed === true
          ) {
            window.dispatchEvent(
              new Event(
                "wallet-refresh"
              )
            );
          }

          return;
        }

        // =================================================
        // AUTHORITATIVE TIMER
        //
        // IMPORTANT:
        //
        // NEVER calculate:
        //
        // last_claim_at + 24 hours
        //
        // here.
        //
        // `ends_at` is the authoritative session/plan end.
        //
        // Paid mining:
        //   ends_at = original paid-plan expiry.
        //
        // Free mining:
        //   ends_at = end of the current 24-hour cycle.
        // =================================================

        if (
          !serverSession.ends_at
        ) {
          console.error(
            "MINING SESSION: ends_at is missing."
          );

          setTimeLeft(0);

          setLoading(false);

          return;
        }

        const planEnd =
          new Date(
            serverSession.ends_at
          ).getTime();

        if (
          !Number.isFinite(
            planEnd
          )
        ) {
          console.error(
            "MINING SESSION: Invalid ends_at.",
            serverSession.ends_at
          );

          setTimeLeft(0);

          setLoading(false);

          return;
        }

                const now =
          Date.now();

        const remaining =
          Math.max(
            0,
            planEnd - now
          );

        // =================================================
        // REAL SERVER TIMER
        //
        // This remains the actual paid-plan/free-session
        // timer. It is NOT changed into a 24-hour timer.
        // =================================================

        setTimeLeft(
          remaining
        );

        // =================================================
        // 24-HOUR UI CLAIM TIMER
        //
        // PAID MINING:
        //
        // The backend continues mining independently.
        // The UI stops after 24 hours and waits for Mine Now.
        //
        // The timestamp is stored locally so refreshing the
        // page does not restart the 24-hour UI cycle.
        //
        // FREE MINING:
        //
        // Keep the existing server-controlled 24-hour cycle.
        // =================================================

        const paidMining =
          Number(
            serverSession.investment_amount ||
              0
          ) > 0;

        if (paidMining) {
          const storageKey =
            `paid-mining-ui-cycle:${serverSession.id}`;

          const storedCycleStart =
            window.localStorage.getItem(
              storageKey
            );

          const parsedCycleStart =
            storedCycleStart
              ? Number(
                  storedCycleStart
                )
              : NaN;

          const cycleStart =
            Number.isFinite(
              parsedCycleStart
            )
              ? parsedCycleStart
              : serverSession.started_at
                ? new Date(
                    serverSession.started_at
                  ).getTime()
                : now;

          const uiElapsed =
            Math.max(
              0,
              now - cycleStart
            );

          const uiRemaining =
            Math.max(
              0,
              DAILY_DISPLAY_DURATION -
                uiElapsed
            );

          setUiTimeLeft(
            uiRemaining
          );
        } else {
          setUiTimeLeft(
            remaining
          );
        }

        setLoading(false);
      }
      
      catch (err) {
        console.error(
          "Session fetch error:",
          err
        );

        setTimeLeft(0);

        setLoading(false);
      }
    }, []);

  // =====================================================
  // INITIAL SESSION LOAD
  // =====================================================

  useEffect(() => {
    void fetchSession();

    const refresh =
      window.setInterval(
        () => {
          void fetchSession();
        },
        15000
      );

    return () =>
      window.clearInterval(
        refresh
      );
  }, [fetchSession]);

  // =====================================================
  // LOCAL COUNTDOWN
  //
  // timeLeft is milliseconds.
  //
  // We simply subtract one second locally. The server
  // remains authoritative and is rechecked every 15 seconds.
  // =====================================================

    useEffect(() => {
    if (
      timeLeft <= 0 &&
      uiTimeLeft <= 0
    ) {
      return;
    }

    const interval =
      window.setInterval(
        () => {
          setTimeLeft(
            (previous) => {
              if (
                previous <=
                1000
              ) {
                return 0;
              }

              return (
                previous - 1000
              );
            }
          );

          setUiTimeLeft(
            (previous) => {
              if (
                previous <=
                1000
              ) {
                return 0;
              }

              return (
                previous - 1000
              );
            }
          );
        },
        1000
      );

    return () =>
      window.clearInterval(
        interval
      );
  }, [
    timeLeft,
    uiTimeLeft,
  ]);

  // =====================================================
  // START / MINE NOW
  // =====================================================

  const startMining =
    async () => {
      try {
        const res =
          await fetch(
            "/api/mining/start",
            {
              method:
                "POST",

              credentials:
                "include",
            }
          );

        const data =
          (await res.json()) as {
            success?: boolean;
            session?: typeof session;
            type?: string;
            error?: string;
          };

        console.log(
          "START:",
          data
        );

        if (!res.ok) {
          console.error(
            data.error ||
              "Failed to start mining."
          );

          return;
        }

        // The server decides whether this is:
        //
        // - a new free 24-hour cycle
        // - a paid mining continuation
        // - an existing active session
        //
        // Never manufacture a new timer on the client.

        await fetchSession();

        window.dispatchEvent(
          new Event(
            "wallet-refresh"
          )
        );
      } catch (err) {
        console.error(
          "Start mining error:",
          err
        );
      }
    };


      const claimPaidMining =
    async () => {
      try {
        const res =
          await fetch(
            "/api/mining/claim",
            {
              method:
                "POST",

              credentials:
                "include",
            }
          );

        const data =
          (await res.json()) as {
            success?: boolean;
            claimed?: number;
            credited?: number;
            total_earned?: number;
            completed?: boolean;
            error?: string;
          };

        console.log(
          "PAID MINING CLAIM:",
          data
        );

                if (!res.ok || data.success !== true) {
          console.error(
            data.error ||
              "Failed to claim paid mining reward."
          );

          return;
        }

        if (data.completed !== true) {
          const sessionId =
            currentSession?.id;

          if (sessionId) {
            const storageKey =
              `paid-mining-ui-cycle:${sessionId}`;

            window.localStorage.setItem(
              storageKey,
              String(Date.now())
            );
          }

          setUiTimeLeft(
            DAILY_DISPLAY_DURATION
          );
        }

        await fetchSession();

        window.dispatchEvent(
          new Event(
            "wallet-refresh"
          )
        );
      } catch (err) {
        console.error(
          "Paid mining claim error:",
          err
        );
      }
    };

      // =====================================================
  // TIMER DISPLAY
  //
  // PAID MINING:
  //   Uses the separate 24-hour UI claim timer.
  //
  // FREE MINING:
  //   Uses the server-controlled 24-hour timer.
  //
  // The paid plan's real `timeLeft` remains separate and
  // continues to represent the actual paid-plan expiry.
  // =====================================================

  const DAILY_DISPLAY_DURATION =
    24 * 60 * 60 * 1000;

  const displayTimeLeft =
    uiTimeLeft;

  const hours =
    Math.floor(
      displayTimeLeft /
        (1000 * 60 * 60)
    );

  const minutes =
    Math.floor(
      (
        displayTimeLeft %
          (1000 * 60 * 60)
      ) /
        (1000 * 60)
    );

  const seconds =
    Math.floor(
      (
        displayTimeLeft %
          (1000 * 60)
      ) /
        1000
    );

  const ratePerHour =
    Number(
      currentSession?.rate_per_second ||
        0
    ) * 3600;

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-amber-900 to-yellow-900 p-4 sm:p-6 lg:p-8 rounded-full aspect-square w-full max-w-[220px] sm:max-w-[240px] lg:max-w-[300px] xl:max-w-[340px] mx-auto flex items-center justify-center border-4 border-yellow-400">
        Loading...
      </div>
    );
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="bg-gradient-to-br from-amber-900 to-yellow-900 p-4 sm:p-6 lg:p-8 rounded-full aspect-square w-full max-w-[220px] sm:max-w-[240px] lg:max-w-[300px] xl:max-w-[340px] mx-auto flex flex-col items-center justify-center border-4 border-yellow-400 shadow-2xl text-center overflow-hidden">
            {uiTimeLeft <= 0 ? (
        <>
          <p className="text-yellow-300 text-sm mb-4">
            Mining Stopped
          </p>

                    <button
            onClick={
              isPaidMining
                ? claimPaidMining
                : startMining
            }
            className="px-6 py-3 bg-yellow-400 text-black font-bold rounded-xl"
          >
            Mine Now
          </button>
        </>
      ) : (
        <>
          <p className="text-yellow-300 text-sm mb-1">
            Inside the Mine
          </p>

          <div className="mb-4">
            <p className="text-yellow-300 text-xs">
              Mining Rate
            </p>

            <p className="text-2xl sm:text-3xl font-bold text-yellow-400">
              {ratePerHour.toFixed(4)}{" "}
               GOLD/h
              </p>
          </div>

          <p className="text-xl sm:text-2xl lg:text-3xl font-mono font-bold">
            {hours}h{" "}
            {minutes}m{" "}
            {seconds}s
          </p>
        </>
      )}
    </div>
  );
}