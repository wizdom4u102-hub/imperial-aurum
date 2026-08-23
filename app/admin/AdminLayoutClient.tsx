'use client'

import { useEffect,  useCallback, useState } from 'react'
import Link from 'next/link'
import AdminPushNotifications from "@/components/admin/admin-push-notifications";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    users: false,
    deposits: false,
    withdrawals: false,
    plans: false,
    payments: false,
    history: false,
    tradingBot: false,
    testimonials: false,
    team: false,
    documents: false,
    faqs: false,
    blog: false,
    livechat: false,
  })

  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [unreadLiveChatCount, setUnreadLiveChatCount] = useState(0)

  useEffect(() => {
  async function loadUnreadLiveChatCount() {
    try {
      const response = await fetch("/api/admin/live-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "get-unread-count",
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setUnreadLiveChatCount(result.data ?? 0)
      }
    } catch (error) {
      console.error(
        "Failed to load unread live chat count:",
        error,
      )
    }
  }

  void loadUnreadLiveChatCount()

  const interval = window.setInterval(
    loadUnreadLiveChatCount,
    5000,
  )

  return () => {
    window.clearInterval(interval)
  }
}, [])

  const handleAdminTimeout = useCallback(() => {
    window.location.href = '/login/admin'
  }, [])

  useEffect(() => {
    let timeout: number

    const resetTimeout = () => {
      window.clearTimeout(timeout)

      timeout = window.setTimeout(() => {
        handleAdminTimeout()
      }, 5 * 60 * 1000)
    }

    const events = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
      'click',
    ] as const

    events.forEach((event) => {
      window.addEventListener(event, resetTimeout)
    })

    resetTimeout()

    return () => {
      window.clearTimeout(timeout)

      events.forEach((event) => {
        window.removeEventListener(event, resetTimeout)
      })
    }
  }, [handleAdminTimeout])

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }))
  }

  const closeMobileMenu = () => setIsMobileOpen(false)

  return (
    <div className="min-h-screen bg-zinc-950 flex overflow-hidden">
      {/* Mobile Hamburger */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-zinc-900 text-white p-3 rounded-2xl border border-zinc-700 shadow-lg"
      >
        ☰
      </button>

      {/* Sidebar */}
      <div className={`w-72 bg-zinc-900 border-r border-zinc-800 flex flex-col min-h-screen fixed lg:static inset-y-0 left-0 z-40 transition-transform duration-300 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        
        <div className="p-6 border-b border-zinc-800">
          <h1 className="text-3xl font-bold text-yellow-400 tracking-tight">Admin Panel</h1>
          <p className="text-zinc-500 text-sm mt-1">Imperial Aurum Mining</p>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto text-sm">
          <div className="space-y-1">

            {/* Dashboard */}
            <Link href="/admin" onClick={closeMobileMenu} className="flex items-center gap-3 px-5 py-3.5 hover:bg-zinc-800 rounded-2xl text-zinc-400 hover:text-white transition-all">
              📊 Dashboard
            </Link>

            {/* Manage Users */}
            <div>
              <button onClick={() => toggleMenu('users')} className="flex items-center justify-between w-full px-5 py-3.5 hover:bg-zinc-800 rounded-2xl text-white font-medium transition-all">
                👥 Manage Users
                <span className="text-xs bg-zinc-800 px-2.5 py-0.5 rounded-lg">{openMenus.users ? '−' : '+'}</span>
              </button>
              {openMenus.users && (
                <div className="ml-6 mt-1 space-y-0.5 pl-2 border-l border-zinc-800">
                  <Link href="/admin/users?filter=all" onClick={closeMobileMenu} className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-800/70 rounded-xl text-zinc-400 hover:text-white">👤 All Users</Link>
                  <Link href="/admin/users?filter=active" onClick={closeMobileMenu} className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-800/70 rounded-xl text-zinc-400 hover:text-white">✅ Active Users</Link>
                  <Link href="/admin/users?filter=blocked" onClick={closeMobileMenu} className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-800/70 rounded-xl text-zinc-400 hover:text-white">⛔ Blocked Users</Link>
                  <Link href="/admin/users?filter=suspended" onClick={closeMobileMenu} className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-800/70 rounded-xl text-zinc-400 hover:text-white">🚫 Suspended Users</Link>
                  <Link href="/admin/users?filter=verified" onClick={closeMobileMenu} className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-800/70 rounded-xl text-zinc-400 hover:text-white">✓ Verified Users</Link>
                  <Link href="/admin/users?filter=unverified" onClick={closeMobileMenu} className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-800/70 rounded-xl text-zinc-400 hover:text-white">❌ Unverified Users</Link>
                  <Link href="/admin/users/send-email" onClick={closeMobileMenu} className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-800/70 rounded-xl text-zinc-400 hover:text-white">✉️ Send Email</Link>
                </div>
              )}
            </div>

            {/* Deposits, Withdrawals, Plans, Payments — kept compact (you can add icons similarly if you want) */}
            <div>
              <button onClick={() => toggleMenu('deposits')} className="flex items-center justify-between w-full px-5 py-3.5 hover:bg-zinc-800 rounded-2xl text-white font-medium transition-all">
                💰 Manage Deposits
                <span className="text-xs bg-zinc-800 px-2.5 py-0.5 rounded-lg">{openMenus.deposits ? '−' : '+'}</span>
              </button>
              {openMenus.deposits && (
                <div className="ml-6 mt-1 space-y-0.5 pl-2 border-l border-zinc-800">
                  <Link href="/admin/deposits?filter=all" onClick={closeMobileMenu} className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-800/70 rounded-xl text-zinc-400 hover:text-white">📋 All Deposits</Link>
                  <Link href="/admin/deposits?filter=pending" onClick={closeMobileMenu} className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-800/70 rounded-xl text-zinc-400 hover:text-white">⏳ Pending</Link>
                  <Link href="/admin/deposits?filter=approved" onClick={closeMobileMenu} className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-800/70 rounded-xl text-zinc-400 hover:text-white">✅ Approved</Link>
                </div>
              )}
            </div>

            <div>
              <button onClick={() => toggleMenu('withdrawals')} className="flex items-center justify-between w-full px-5 py-3.5 hover:bg-zinc-800 rounded-2xl text-white font-medium transition-all">
                🏧 Manage Withdrawals
                <span className="text-xs bg-zinc-800 px-2.5 py-0.5 rounded-lg">{openMenus.withdrawals ? '−' : '+'}</span>
              </button>
              {openMenus.withdrawals && (
                <div className="ml-6 mt-1 space-y-0.5 pl-2 border-l border-zinc-800">
                  <Link href="/admin/withdrawals?filter=all" onClick={closeMobileMenu} className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-800/70 rounded-xl text-zinc-400 hover:text-white">📋 All Withdrawals</Link>
                  <Link href="/admin/withdrawals?filter=pending" onClick={closeMobileMenu} className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-800/70 rounded-xl text-zinc-400 hover:text-white">⏳ Pending</Link>
                  <Link href="/admin/withdrawals?filter=approved" onClick={closeMobileMenu} className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-800/70 rounded-xl text-zinc-400 hover:text-white">✅ Approved</Link>
                </div>
              )}
            </div>

            <div>
  <button
    onClick={() => toggleMenu('plans')}
    className="flex w-full items-center justify-between rounded-2xl px-5 py-3.5 font-medium text-white transition-all hover:bg-zinc-800"
  >
    ⭐ Plans & Investment
    <span className="rounded-lg bg-zinc-800 px-2.5 py-0.5 text-xs">
      {openMenus.plans ? '−' : '+'}
    </span>
  </button>

  {openMenus.plans && (
    <div className="ml-6 mt-1 space-y-0.5 border-l border-zinc-800 pl-2">

      <Link
        href="/admin/mining-plans/paid"
        onClick={closeMobileMenu}
        className="flex items-center gap-3 rounded-xl px-5 py-3 text-zinc-400 hover:bg-zinc-800/70 hover:text-white"
      >
        💎 Paid Mining Plan
      </Link>

      <Link
        href="/admin/mining-plans/free"
        onClick={closeMobileMenu}
        className="flex items-center gap-3 rounded-xl px-5 py-3 text-zinc-400 hover:bg-zinc-800/70 hover:text-white"
      >
        🆓 Free Mining Plan
      </Link>

      <Link
        href="/admin/share-plans"
        onClick={closeMobileMenu}
        className="flex items-center gap-3 rounded-xl px-5 py-3 text-zinc-400 hover:bg-zinc-800/70 hover:text-white"
      >
        🤝 Share Plan
      </Link>

    </div>
  )}
</div>

                        {/* Mining Power */}
            <Link
              href="/admin/mining-plans"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 px-5 py-3.5 hover:bg-zinc-800 rounded-2xl text-white font-medium transition-all"
            >
              ⛏️ Mining Power
            </Link>

            <div>
              <button onClick={() => toggleMenu('payments')} className="flex items-center justify-between w-full px-5 py-3.5 hover:bg-zinc-800 rounded-2xl text-white font-medium transition-all">
                💳 Payment Methods
                <span className="text-xs bg-zinc-800 px-2.5 py-0.5 rounded-lg">{openMenus.payments ? '−' : '+'}</span>
              </button>
              {openMenus.payments && (
                <div className="ml-6 mt-1 space-y-0.5 pl-2 border-l border-zinc-800">
                  <Link href="/admin/payment-methods?filter=all" onClick={closeMobileMenu} className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-800/70 rounded-xl text-zinc-400 hover:text-white">📋 All Methods</Link>
                  <Link href="/admin/payment-methods?filter=add" onClick={closeMobileMenu} className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-800/70 rounded-xl text-zinc-400 hover:text-white">➕ Add Method</Link>
                </div>
              )}
            </div>

            {/* History with icons */}
            <Link
  href="/admin/history"
 className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-800/70 rounded-xl text-zinc-400 hover:text-white"
>
  <h3 className="text-lg font-bold text-white">
   📜 History Page
  </h3>
</Link>

{/* Trading Bot Management */}
<div>

  <button
    onClick={() => toggleMenu('tradingBot')}
    className="flex items-center justify-between w-full px-5 py-3.5 hover:bg-zinc-800 rounded-2xl text-white font-medium transition-all"
  >

    🤖 Trading Bot

    <span className="text-xs bg-zinc-800 px-2.5 py-0.5 rounded-lg">
      {openMenus.tradingBot ? '−' : '+'}
    </span>

  </button>


  {openMenus.tradingBot && (

    <div className="ml-6 mt-1 space-y-0.5 pl-2 border-l border-zinc-800">


     <Link
  href="/admin/trading-bot"
  onClick={closeMobileMenu}
  className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-800/70 rounded-xl text-zinc-400 hover:text-white"
>
  📊 Trading Bot Dashboard
</Link>

<Link
  href="/admin/trading-bot/deposits"
  onClick={closeMobileMenu}
  className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-800/70 rounded-xl text-zinc-400 hover:text-white"
>
  💰 Bot Deposits
</Link>

<Link
  href="/admin/trading-bot/users"
  onClick={closeMobileMenu}
  className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-800/70 rounded-xl text-zinc-400 hover:text-white"
>
  👥 User Trading Bots
</Link>

<Link
  href="/admin/trading-bot/history"
  onClick={closeMobileMenu}
  className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-800/70 rounded-xl text-zinc-400 hover:text-white"
>
  📜 Bot History
</Link>

<Link
  href="/admin/trading-bot/adjustment"
  onClick={closeMobileMenu}
  className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-800/70 rounded-xl text-zinc-400 hover:text-white"
>
  💳 Credit / Debit Bot
</Link>

<Link
  href="/admin/trading-bot/plans"
  onClick={closeMobileMenu}
  className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-800/70 rounded-xl text-zinc-400 hover:text-white"
>
  🛒Manage Plan
</Link>

<Link
  href="/admin/trading-bot/trades"
  onClick={closeMobileMenu}
  className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-800/70 rounded-xl text-zinc-400 hover:text-white"
>
  📈 Bot Trades
</Link>

<Link
  href="/admin/trading-bot/statistics"
  onClick={closeMobileMenu}
  className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-800/70 rounded-xl text-zinc-400 hover:text-white"
>
  📊 Bot Statistics
</Link>

<Link
  href="/admin/trading-bot/logs"
  onClick={closeMobileMenu}
  className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-800/70 rounded-xl text-zinc-400 hover:text-white"
>
  📜 Bot Logs
</Link>


    </div>

  )}

</div>

<Link
  href="/admin/change-password"
  className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-800/70 rounded-xl text-zinc-400 hover:text-white"
>
  <h3 className="text-lg font-bold text-white">
    🔒 Change Password
  </h3>
</Link>

            {/* Front Menu */}
            <div className="pt-6 mt-6 border-t border-zinc-800">
              <div className="px-5 py-2 text-xs uppercase tracking-widest text-zinc-500 font-medium">Front Menu</div>

              {/* Testimonials */}
              <div>
                <button onClick={() => toggleMenu('testimonials')} className="flex items-center justify-between w-full px-5 py-3.5 hover:bg-zinc-800 rounded-2xl text-white font-medium transition-all">
                  💬 Testimonials
                  <span className="text-xs bg-zinc-800 px-2.5 py-0.5 rounded-lg">{openMenus.testimonials ? '−' : '+'}</span>
                </button>
                {openMenus.testimonials && (
                  <div className="ml-6 mt-1 space-y-0.5 pl-2 border-l border-zinc-800">

  <Link
    href="/admin/testimonials"
    onClick={closeMobileMenu}
    className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-800/70 rounded-xl text-zinc-400 hover:text-white"
  >
    📋 All Testimonials
  </Link>

  <Link
    href="/admin/testimonials/manual"
    onClick={closeMobileMenu}
    className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-800/70 rounded-xl text-zinc-400 hover:text-white"
  >
    📝 Manual Testimonials
  </Link>

  <Link
    href="/admin/testimonials/new"
    onClick={closeMobileMenu}
    className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-800/70 rounded-xl text-zinc-400 hover:text-white"
  >
    ➕ Add Manual Testimonial
  </Link>

  <Link
    href="/admin/testimonials/pending"
    onClick={closeMobileMenu}
    className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-800/70 rounded-xl text-zinc-400 hover:text-white"
  >
    ⏳ Pending User Testimonials
  </Link>

  <Link
    href="/admin/testimonials/approved"
    onClick={closeMobileMenu}
    className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-800/70 rounded-xl text-zinc-400 hover:text-white"
  >
    ✅ Approved User Testimonials
  </Link>

</div>
                )}
              </div>

              {/* Team Members */}
              <div>
                <button onClick={() => toggleMenu('team')} className="flex items-center justify-between w-full px-5 py-3.5 hover:bg-zinc-800 rounded-2xl text-white font-medium transition-all">
                  👥 Team Members
                  <span className="text-xs bg-zinc-800 px-2.5 py-0.5 rounded-lg">{openMenus.team ? '−' : '+'}</span>
                </button>
                {openMenus.team && (
                  <div className="ml-6 mt-1 space-y-0.5 pl-2 border-l border-zinc-800">
  <Link
    href="/admin/team-members"
    onClick={closeMobileMenu}
    className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-800/70 rounded-xl text-zinc-400 hover:text-white"
  >
    👤 All Team Members
  </Link>

  <Link
    href="/admin/team-members/new"
    onClick={closeMobileMenu}
    className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-800/70 rounded-xl text-zinc-400 hover:text-white"
  >
    ➕ Add Member
  </Link>
</div>
                )}
              </div>

              {/* Company Documents */}
              <div>
                <button onClick={() => toggleMenu('documents')} className="flex items-center justify-between w-full px-5 py-3.5 hover:bg-zinc-800 rounded-2xl text-white font-medium transition-all">
                  📄 Company Documents
                  <span className="text-xs bg-zinc-800 px-2.5 py-0.5 rounded-lg">{openMenus.documents ? '−' : '+'}</span>
                </button>
                {openMenus.documents && (
                  <div className="ml-6 mt-1 space-y-0.5 pl-2 border-l border-zinc-800">
                    <Link href="/admin/documents/all" onClick={closeMobileMenu} className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-800/70 rounded-xl text-zinc-400 hover:text-white">📋 All Documents</Link>
                    <Link href="/admin/documents/add" onClick={closeMobileMenu} className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-800/70 rounded-xl text-zinc-400 hover:text-white">➕ Add Document</Link>
                  </div>
                )}
              </div>

              {/* FAQs */}
              <div>
                <button onClick={() => toggleMenu('faqs')} className="flex items-center justify-between w-full px-5 py-3.5 hover:bg-zinc-800 rounded-2xl text-white font-medium transition-all">
                  ❓ FAQs
                  <span className="text-xs bg-zinc-800 px-2.5 py-0.5 rounded-lg">{openMenus.faqs ? '−' : '+'}</span>
                </button>
                {openMenus.faqs && (
                  <div className="ml-6 mt-1 space-y-0.5 pl-2 border-l border-zinc-800">
                    <Link href="/admin/faqs/" onClick={closeMobileMenu} className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-800/70 rounded-xl text-zinc-400 hover:text-white">📋 All FAQs</Link>
                    <Link href="/admin/faqs/new" onClick={closeMobileMenu} className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-800/70 rounded-xl text-zinc-400 hover:text-white">➕ Add FAQ</Link>
                  </div>
                )}
              </div>

              {/* Blog */}
              <div>
                <button onClick={() => toggleMenu('blog')} className="flex items-center justify-between w-full px-5 py-3.5 hover:bg-zinc-800 rounded-2xl text-white font-medium transition-all">
                  📰 Blog
                  <span className="text-xs bg-zinc-800 px-2.5 py-0.5 rounded-lg">{openMenus.blog ? '−' : '+'}</span>
                </button>
                {openMenus.blog && (
                  <div className="ml-6 mt-1 space-y-0.5 pl-2 border-l border-zinc-800">
  <Link
    href="/admin/blog"
    onClick={closeMobileMenu}
    className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-800/70 rounded-xl text-zinc-400 hover:text-white"
  >
    📋 All Blog Posts
  </Link>

  <Link
    href="/admin/blog/new"
    onClick={closeMobileMenu}
    className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-800/70 rounded-xl text-zinc-400 hover:text-white"
  >
    ✍️ Post New Blog
  </Link>
</div>
                )}
              </div>

              {/* New Live Chat */}
<div>
  <Link
    href="/admin/live-chat"
    onClick={closeMobileMenu}
    className="flex w-full items-center justify-between gap-3 rounded-2xl px-5 py-3.5 font-medium text-white transition-all hover:bg-zinc-800"
  >
    <span>💬 New Live Chat</span>

    {unreadLiveChatCount > 0 && (
      <span className="ml-auto shrink-0 rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-bold text-white">
        {unreadLiveChatCount}
      </span>
    )}
  </Link>
</div>

              {/* Live Chat */}
              <div>
                <button onClick={() => toggleMenu('livechat')} className="flex items-center justify-between w-full px-5 py-3.5 hover:bg-zinc-800 rounded-2xl text-white font-medium transition-all">
                  💬 Live Chat
                  <span className="text-xs bg-zinc-800 px-2.5 py-0.5 rounded-lg">{openMenus.livechat ? '−' : '+'}</span>
                </button>
                {openMenus.livechat && (
                  <div className="ml-6 mt-1 space-y-0.5 pl-2 border-l border-zinc-800">
                    <Link href="/admin/livechat/all" onClick={closeMobileMenu} className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-800/70 rounded-xl text-zinc-400 hover:text-white">📋 All Live Chat</Link>
                    <Link href="/admin/livechat/new" onClick={closeMobileMenu} className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-800/70 rounded-xl text-zinc-400 hover:text-white">➕ New Live Chat</Link>
                  </div>
                )}
              </div>
            </div>

          </div>
        </nav>

        <div className="p-6 border-t border-zinc-800 text-xs text-zinc-500">
          Imperial Aurum Admin • v1.0
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div onClick={closeMobileMenu} className="lg:hidden fixed inset-0 bg-black/70 z-30" />
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-auto lg:ml-0">
        <div className="p-6 lg:p-8 pt-16 lg:pt-8">
           <div className="mb-6">
            <AdminPushNotifications />
            </div>

          {children}
        </div>
      </div>
    </div>
  )
}