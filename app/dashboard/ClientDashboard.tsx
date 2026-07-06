'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { logoutAction } from '../../actions/auth';
import Link from 'next/link';

interface ClientDashboardProps {
  profile: any
  deposits: any[]
  withdrawals: any[]
  transactions: any[]
  session: any
}

export default function ClientDashboard({
  profile,
  deposits,
 withdrawals,
  transactions,
  session,
}: {
  profile: any
  deposits: any[]
  withdrawals: any[]
  transactions: any[]
  session: any
})

{
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

// Responsive helper
const cardGrid =
  "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6";
  const [balance, setBalance] = useState({
  gold: Number(profile?.balances?.gold || 0),
  cash: Number(profile?.balances?.cash || 0),
  shares: Number(profile?.balances?.shares || 0),

  is_premium: profile?.is_premium || false,
  mining_rate_per_hour: 5,
  total_gold_earned: Number(profile?.balances?.gold || 0),
});

  const [displayGold, setDisplayGold] = useState(
    Number(profile?.balances?.gold || 0)
  );

  // ✅ ALWAYS SYNC STATE WITH LATEST SERVER DATA
useEffect(() => {
  setBalance({
    gold: Number(profile?.balances?.gold || 0),
    cash: Number(profile?.balances?.cash || 0),
    shares: Number(profile?.balances?.shares || 0),

    is_premium: profile?.is_premium || false,

    mining_rate_per_hour:
      Number(profile?.mining_rate_per_hour || 5),

    total_gold_earned:
      Number(profile?.balances?.gold || 0),
  });

  setDisplayGold(
    Number(profile?.balances?.gold || 0)
  );
}, [profile]);

  // ✅ FIXED: moved outside useEffect
  const refreshWallet = async () => {
    if (document.hidden) return;

    try {
      const res = await fetch('/api/wallet', {
        credentials: 'include',
        cache: 'no-store',
      });

      if (!res.ok) return;

      const data = await res.json();

      setBalance({
  gold: Number(data.gold || 0),
  cash: Number(data.cash || 0),
  shares: Number(data.shares || 0),

  total_gold_earned: Number(data.total_gold_earned || data.gold || 0),

  is_premium: profile?.is_premium || false,
  mining_rate_per_hour: Number(data.mining_rate_per_hour || 5),
});

    } catch (err) {
      console.error('Wallet refresh error:', err);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    // Run once immediately
    refreshWallet();

    // Then every 60s
    interval = setInterval(refreshWallet, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = () => {
      refreshWallet();
    };

    window.addEventListener('wallet-refresh', handler);

    return () => {
      window.removeEventListener('wallet-refresh', handler);
    };
  }, []);

  useEffect(() => {
    let animationFrame: any;

    const animate = () => {
      setDisplayGold(prev => {
        const target = balance.gold;

        if (prev >= target) return target;

        const diff = target - prev;
        const step = diff * 0.1;

        return prev + step;
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrame);
  }, [balance.gold]);

  return (
    <div className="flex min-h-screen w-full bg-black text-white overflow-x-hidden">
      {/* SIDEBAR - unchanged */}
      <aside
  className={`
    fixed lg:sticky top-0 left-0 z-50
    h-screen w-64 lg:w-72
    bg-zinc-950 border-r border-zinc-800
    p-4 lg:p-6 flex flex-col overflow-y-auto
    transform transition-transform duration-300
    ${menuOpen ? "translate-x-0" : "-translate-x-full"}
    lg:translate-x-0
  `}
>
  <button
  onClick={() => setMenuOpen(false)}
  className="lg:hidden text-right text-3xl mb-6 text-white"
>
  ✕
</button>
        <div className="mb-10">
          <h1 className="text-xl lg:text-2xl font-bold text-yellow-400">Imperial Aurum</h1>
        </div>

        <nav className="flex-1 space-y-1 text-sm overflow-y-auto">

  <Link
    href="/dashboard"
    className="flex items-center px-4 py-3 rounded-xl bg-zinc-900 text-white font-medium hover:bg-zinc-800 transition-colors"
  >
    Dashboard
  </Link>

  {/* Deposit */}
  <details className="group">
    <summary className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-zinc-900 transition-colors cursor-pointer list-none">
      <span>Deposit</span>
      <span className="text-xs text-zinc-500 group-open:rotate-180 transition-transform">⌄</span>
    </summary>
    <div className="ml-4 mt-1 space-y-1 text-zinc-400">
      <Link className="block px-4 py-2 rounded-lg hover:bg-zinc-800 hover:text-white" href="/deposit">
        All Deposits
      </Link>
      <Link className="block px-4 py-2 rounded-lg hover:bg-zinc-800 hover:text-white" href="/deposit/new">
        New Deposit
      </Link>
    </div>
  </details>

  {/* Withdraw */}
  <details className="group">
    <summary className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-zinc-900 transition-colors cursor-pointer list-none">
      <span>Withdraw</span>
      <span className="text-xs text-zinc-500 group-open:rotate-180 transition-transform">⌄</span>
    </summary>
    <div className="ml-4 mt-1 space-y-1 text-zinc-400">
      <Link className="block px-4 py-2 rounded-lg hover:bg-zinc-800 hover:text-white" href="/withdraw">
        All Withdrawals
      </Link>
      <Link className="block px-4 py-2 rounded-lg hover:bg-zinc-800 hover:text-white" href="/withdraw/new">
        New Withdraw
      </Link>
    </div>
  </details>

  {/* Wallets */}
  <details className="group">
    <summary className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-zinc-900 transition-colors cursor-pointer list-none">
      <span>Wallet Address</span>
      <span className="text-xs text-zinc-500 group-open:rotate-180 transition-transform">⌄</span>
    </summary>
    <div className="ml-4 mt-1 space-y-1 text-zinc-400">
      <Link className="block px-4 py-2 rounded-lg hover:bg-zinc-800 hover:text-white" href="/wallets">
        All Wallets
      </Link>
      <Link className="block px-4 py-2 rounded-lg hover:bg-zinc-800 hover:text-white" href="/wallets/new">
        New Wallet
      </Link>
    </div>
  </details>

  {/* History */}
  <details className="group">
    <summary className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-zinc-900 transition-colors cursor-pointer list-none">
      <span>History</span>
      <span className="text-xs text-zinc-500 group-open:rotate-180 transition-transform">⌄</span>
    </summary>
    <div className="ml-4 mt-1 space-y-1 text-zinc-400">
      <Link className="block px-4 py-2 rounded-lg hover:bg-zinc-800 hover:text-white" href="/history">
        All History
      </Link>
      <Link className="block px-4 py-2 rounded-lg hover:bg-zinc-800 hover:text-white" href="/history/deposits">
        Deposit History
      </Link>
      <Link className="block px-4 py-2 rounded-lg hover:bg-zinc-800 hover:text-white" href="/history/withdrawals">
        Withdrawal History
      </Link>
      <Link className="block px-4 py-2 rounded-lg hover:bg-zinc-800 hover:text-white" href="/history/convert">
        Convert History
      </Link>
      <Link className="block px-4 py-2 rounded-lg hover:bg-zinc-800 hover:text-white" href="/history/mining">
        Mining History
      </Link>
      <Link className="block px-4 py-2 rounded-lg hover:bg-zinc-800 hover:text-white" href="/history/shared-plans">
        Shared Plan History
      </Link>
    </div>
  </details>

  {/* Convert */}
  <details className="group">
    <summary className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-zinc-900 transition-colors cursor-pointer list-none">
      <span>Convert</span>
      <span className="text-xs text-zinc-500 group-open:rotate-180 transition-transform">⌄</span>
    </summary>
    <div className="ml-4 mt-1 space-y-1 text-zinc-400">
      <Link className="block px-4 py-2 rounded-lg hover:bg-zinc-800 hover:text-white" href="/convert">
        All Convert
      </Link>
      <Link className="block px-4 py-2 rounded-lg hover:bg-zinc-800 hover:text-white" href="/convert/new">
        New Convert
      </Link>
    </div>
  </details>

  <Link
    href="/shared-plans"
    className="flex items-center px-4 py-3 rounded-xl hover:bg-zinc-900 transition-colors"
  >
    Shared Plan
  </Link>

  <Link
    href="/referrals"
    className="flex items-center px-4 py-3 rounded-xl hover:bg-zinc-900 transition-colors"
  >
    Referrals
  </Link>

            <Link
              href="/change-password"
              className="flex items-center px-4 py-3 rounded-xl hover:bg-zinc-900 transition-colors"
            >
              Change Password
            </Link>

</nav>

        <div className="mt-auto pt-8">
          <form action={logoutAction}>
            <button className="w-full text-left px-4 py-3 text-red-400 hover:text-red-500 hover:bg-zinc-900 rounded-xl transition-colors text-sm">
              Logout
            </button>
          </form>
        </div>
      </aside>

      {menuOpen && (
  <div
    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
    onClick={() => setMenuOpen(false)}
  />
)}

      {/* MAIN DASHBOARD */}
      <main className="flex-1 p-4 md:p-8 lg:p-10">
        <div className="max-w-7xl mx-auto w-full">
          <button
  onClick={() => setMenuOpen(true)}
  className="lg:hidden mb-3 text-3xl text-white"
>
  ☰
</button>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-12">
            <div>
              <h2 className="text-2xl md:text-4xl font-semibold">Dashboard</h2>
              <p className="text-zinc-400 mt-2">
                Current Plan: <span className="text-yellow-400 font-medium">
                  {balance.is_premium ? 'Premium' : 'Free'}
                </span>
              </p>
            </div>

            <button
             onClick={() => router.refresh()}
             className="w-full md:w-auto px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-sm transition-colors"
             >
             Refresh Balances
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">

            {/* Gold Balance */}
            <div className="bg-zinc-900 p-6 lg:p-8 rounded-full aspect-square w-full max-w-[220px] md:max-w-[260px] lg:max-w-[320px] mx-auto flex flex-col items-center justify-center border-4 border-yellow-400 shadow-2xl">
              <p className="text-zinc-400 text-sm mb-3">Gold Balance</p>

              <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-yellow-400 tracking-tight">
                {Number(displayGold || 0).toFixed(4)}
              </div>
            </div>

            {/* Cash Balance */}
            <div className="bg-zinc-900 p-4 sm:p-6 lg:p-8 rounded-full aspect-square w-full max-w-[220px] md:max-w-[260px] lg:max-w-[320px] mx-auto flex flex-col items-center justify-center border-4 border-zinc-400 shadow-2xl">
              <p className="text-zinc-400 text-sm mb-3">Cash Balance</p>

              <div className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                ${Number(balance.cash || 0).toFixed(2)}
              </div>
            </div>

            {/* Mining */}
            <MiningCard
              ratePerHour={balance.mining_rate_per_hour || 5}
              session={session}
            />
          </div>

          {/* Recent Activity */}
          <div className="mt-16">
            <h3 className="text-xl font-medium mb-6">Recent Activity</h3>

            <div className="bg-zinc-900 rounded-3xl p-4 md:p-8 grid grid-cols-1 xl:grid-cols-2 gap-8">

              <div>
                <h4 className="text-yellow-400 mb-5">Latest Deposits</h4>

                {(deposits || []).length
                  ? (deposits || []).slice(0, 4).map((d: any) => (
                    <div key={d.id} className="flex justify-between py-4 border-b border-zinc-800 last:border-none">
                      <span>${d.amount}</span>

                      <span className={`capitalize ${d.status === 'completed'
                        ? 'text-emerald-400'
                        : 'text-amber-400'
                        }`}>
                        {d.status}
                      </span>
                    </div>
                  ))
                  : <p className="text-zinc-500 py-4">No deposits yet.</p>}
              </div>

              <div>
                <h4 className="text-yellow-400 mb-5">Latest Withdrawals</h4>

                {(withdrawals || []).length
                  ? (withdrawals || []).slice(0, 4).map((w: any) => (
                    <div key={w.id} className="flex justify-between py-4 border-b border-zinc-800 last:border-none">
                      <span>${w.amount}</span>

                      <span className={`capitalize ${w.status === 'completed'
                        ? 'text-emerald-400'
                        : 'text-rose-400'
                        }`}>
                        {w.status}
                      </span>
                    </div>
                  ))
                  : <p className="text-zinc-500 py-4">No withdrawals yet.</p>}
              </div>

            </div>
          </div>

          {/* Referral */}
          <div className="mt-16">
            <h3 className="text-xl font-medium mb-6">Referral Program</h3>

            <div className="bg-zinc-900 rounded-3xl p-8">
              <p className="text-zinc-400 mb-4">
                Invite friends and earn rewards when they join and deposit!
              </p>

              <div className="flex flex-col lg:flex-row gap-4">
                <input
                  type="text"
                  value={`https://imperialaurummining.com/signup?ref=${profile?.id || ''}`}
                  readOnly
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-sm font-mono text-zinc-300 focus:outline-none"
                />

                <button
                  onClick={() => {
                    const link = `https://imperialaurummining.com/signup?ref=${profile?.id || ''}`;
                    navigator.clipboard.writeText(link);
                    alert('Referral link copied!');
                  }}
                  className="w-full lg:w-auto px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold rounded-2xl transition-colors whitespace-nowrap"
                >
                  Copy Link
                </button>
              </div>

              <p className="text-xs text-zinc-500 mt-3">
                Your unique referral link • Share it to earn bonuses
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

// ================= MINING CARD =================

function MiningCard({
  ratePerHour = 5,
}: {
  ratePerHour: number;
  session?: any;
}) {

  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);

  // ================= LOAD SESSION =================
const fetchSession = async () => {

  try {

    const res =
      await fetch(
        '/api/mining/session',
        {
          credentials: 'include',
          cache: 'no-store'
        }
      );

    const data =
      await res.json();

    console.log(
      'SESSION FULL:',
      JSON.stringify(
        data,
        null,
        2
      )
    );

    // no active mining session
    if (
  !data?.success
) {

  setTimeLeft(0);

  setLoading(false);

  return;
}

// completed mining
if (
  data?.completed
) {

  setTimeLeft(0);

  setLoading(false);

  window.dispatchEvent(
    new Event(
      'wallet-refresh'
    )
  );

  return;
}

// no active session
if (
  !data?.session
) {

  setTimeLeft(0);

  setLoading(false);

  return;
}

   // ================= FIX UTC DB TIME =================

// Supabase returns:
// 2026-05-29T23:06:12.487
// without timezone sometimes.
//
// Force UTC safely.

const rawEnd =
  String(
    data.session.ends_at || ''
  );

const normalizedEnd =
  rawEnd.endsWith('Z')
    ? rawEnd
    : rawEnd + 'Z';

const endTime =
  new Date(
    normalizedEnd
  ).getTime();

const now =
  Date.now();

const remaining =
  Math.max(
    0,
    endTime - now
  );

console.log({

  rawEnd,

  normalizedEnd,

  endTime,

  now,

  remaining,

  remainingHours:
    remaining /
    1000 /
    60 /
    60

});

    setTimeLeft(
      remaining
    );

    setLoading(false);

  } catch (err) {

    console.error(
      'Session fetch error:',
      err
    );

    setTimeLeft(0);

    setLoading(false);
  }

};


  // ================= INITIAL LOAD =================

  useEffect(() => {

    fetchSession();

    // sync every 15 sec
    const refresh =
      setInterval(() => {

        fetchSession();

      }, 15000);

    return () => {

      clearInterval(
        refresh
      );

    };

  }, []);


  // ================= LOCAL COUNTDOWN =================

  useEffect(() => {

    if (
      timeLeft <= 0
    ) return;

    const interval =
      setInterval(() => {

        setTimeLeft(
          prev => {

            if (
              prev <= 1000
            ) {

              clearInterval(
                interval
              );

              handleMiningComplete();

              return 0;

            }

            return prev - 1000;

          }
        );

      }, 1000);

    return () => {

      clearInterval(
        interval
      );

    };

  }, [timeLeft]);


  // ================= START MINING =================

  const startMining =
    async () => {

      try {

        const res =
          await fetch(
            '/api/mining/start',
            {
              method: 'POST',
              credentials: 'include'
            }
          );

        const data =
          await res.json();

        console.log(
          'START:',
          data
        );

        if (!res.ok) {

          console.error(
            data.error
          );

          return;

        }

        // immediately reload DB session
        await fetchSession();

      } catch (err) {

        console.error(
          err
        );

      }

    };


  // ================= COMPLETE =================

  const handleMiningComplete =
  async () => {

      try {

        await fetchSession();

        window.dispatchEvent(
          new Event('wallet-refresh')
        );

      } catch (err) {

        console.error(err);

      }

    };


  const hours =
    Math.floor(
      timeLeft /
      (1000 * 60 * 60)
    );

  const minutes =
    Math.floor(
      (
        timeLeft %
        (1000 * 60 * 60)
      ) /
      (1000 * 60)
    );

  const seconds =
    Math.floor(
      (
        timeLeft %
        (1000 * 60)
      ) / 1000
    );


  if (loading) {

    return (

      <div className="bg-gradient-to-br from-amber-900 to-yellow-900 p-4 sm:p-6 lg:p-8 rounded-full aspect-square w-full max-w-[220px] sm:max-w-[240px] lg:max-w-[300px] xl:max-w-[340px] mx-auto flex items-center justify-center border-4 border-yellow-400">

        Loading...

      </div>

    );

  }


  return (

    <div className="bg-gradient-to-br from-amber-900 to-yellow-900 p-4 sm:p-6 lg:p-8 rounded-full aspect-square w-full max-w-[220px] sm:max-w-[240px] lg:max-w-[300px] xl:max-w-[340px] mx-auto flex flex-col items-center justify-center border-4 border-yellow-400 shadow-2xl text-center overflow-hidden">

      {timeLeft <= 0 ? (

        <>

          <p className="text-yellow-300 text-sm mb-4">
            Mining Stopped
          </p>

          <button
            onClick={startMining}
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
              {ratePerHour} GOLD/h
            </p>

          </div>

          <p className="text-xl sm:text-2xl lg:text-3xl font-mono font-bold">

            {hours}h {minutes}m {seconds}s

          </p>

        </>

      )}

    </div>

  );

}