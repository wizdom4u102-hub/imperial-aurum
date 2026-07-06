import Link from "next/link";

export default function DashboardNavbar() {
  return (
    <header className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-zinc-800">
      
      {/* LOGO (SMALL FIXED SIZE) */}
      <Link href="/dashboard" className="flex items-center gap-2">
        <img
          src="/images/logo.png"
          alt="Imperial Aurum"
          className="h-8 w-auto object-contain"
        />
        <span className="text-sm font-semibold text-yellow-400">
          Imperial Aurum
        </span>
      </Link>

      {/* NAV ACTIONS */}
      <div className="flex gap-4 items-center text-sm text-zinc-300">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/dashboard/plans">Plans</Link>
        <Link href="/dashboard/referrals">Referrals</Link>
        <Link href="/logout" className="text-red-400">
          Logout
        </Link>
      </div>
    </header>
  );
}