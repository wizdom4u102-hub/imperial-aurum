"use client";

import React, {
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

import {
  LayoutDashboard,
  Bot,
  ShoppingCart,
  Activity,
  History,
  BarChart3,
  Bell,
  Settings,
} from "lucide-react";

interface TradingBotSidebarProps {
  mobile?: boolean;
  onClose?: () => void;
}

const TradingBotSidebar: React.FC<
  TradingBotSidebarProps
> = ({
  mobile = false,
  onClose,
}) => {
  const pathname = usePathname();

  const [
    unreadCount,
    setUnreadCount,
  ] = useState(0);

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
  try {
    const response = await fetch(
      "/api/trading-bot/notifications",
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return;
    }

    const data = await response.json();

    setUnreadCount(
      data.unreadCount ?? 0
    );
  } catch (error) {
    console.error(error);
  }
}

  const menuItems = [
    {
      name: "Overview",
      href: "/dashboard/trading-bot",
      icon: LayoutDashboard,
    },
    {
      name: "Bot Marketplace",
      href: "/dashboard/trading-bot/marketplace",
      icon: ShoppingCart,
    },
    {
      name: "My Bots",
      href: "/dashboard/trading-bot/my-bots",
      icon: Bot,
    },
    {
      name: "Live Trades",
      href: "/dashboard/trading-bot/live-trades",
      icon: Activity,
    },
    {
      name: "Trading History",
      href: "/dashboard/trading-bot/history",
      icon: History,
    },
    {
      name: "Performance",
      href: "/dashboard/trading-bot/performance",
      icon: BarChart3,
    },
    {
      name: "Notifications",
      href: "/dashboard/trading-bot/notifications",
      icon: Bell,
      badge: unreadCount,
    },
    {
      name: "Settings",
      href: "/dashboard/trading-bot/settings",
      icon: Settings,
    },
  ];

  return (
    <aside
      className={`
        <aside
  className="
    h-full
    w-64
    bg-[#080b1a]
    border-r
    border-white/10
    text-white
    flex
    flex-col
        ${
          mobile
  ? "fixed inset-y-0 left-0 z-50"
  : "h-screen sticky top-0"
        }
      `}
    >
      {/* Logo */}

      <div className="border-b border-white/10 px-6 py-6">
  <div className="flex items-center gap-3">
    <Image
      src="/images/logo.png"
      alt="Imperial Aurum"
      width={42}
      height={42}
      className="h-10 w-10 object-contain"
      priority
    />

    <div>
      <h2 className="text-lg font-bold tracking-wide text-white">
        Imperial Aurum
      </h2>

      <p className="text-xs text-zinc-400">
        AI Trading Terminal
      </p>
    </div>
  </div>
</div>

      {/* Navigation */}

      <nav className="flex-1 space-y-2 px-2 py-6">
        {menuItems.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`
                flex
                items-center
                justify-between
                rounded-xl
                px-3
                py-3
                transition-all
                duration-200
                ${
                  active
                    ? "border border-blue-400/20 bg-blue-500/20 text-blue-400"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <Icon size={20} />

                <span className="text-sm font-medium">
                  {item.name}
                </span>
              </div>

              {item.name === "Notifications" && unreadCount > 0 && (
  <span
    className="
      flex
      h-6
      min-w-[24px]
      items-center
      justify-center
      rounded-full
      bg-red-600
      px-2
      text-xs
      font-bold
      text-white
    "
  >
    {unreadCount}
  </span>
)}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}

      <div className="border-t border-white/10 p-4">
        <div
          className="
            rounded-xl
            border
            border-white/10
            bg-white/[0.04]
            p-4
          "
        >
          <p className="text-xs text-zinc-400">
            Trading Engine
          </p>

          <div className="mt-2 flex items-center gap-2">
            <span
              className="
                h-2
                w-2
                rounded-full
                bg-green-500
              "
            />

            <span className="text-sm text-green-400">
              Online
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default TradingBotSidebar;