`"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function DashboardNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-zinc-900 border-b border-zinc-800">

      <div className="flex items-center justify-between px-4 py-3">

        {/* Logo */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2"
        >
          <Image
            src="/images/logo.png"
            alt="Imperial Aurum"
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
            priority
          />

          <span className="font-semibold text-yellow-400 text-sm md:text-base">
            Imperial Aurum
          </span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-300">

          <Link
            href="/dashboard"
            className="hover:text-yellow-400"
          >
            Dashboard
          </Link>

          <Link
            href="/dashboard/plans"
            className="hover:text-yellow-400"
          >
            Plans
          </Link>

          <Link
            href="/dashboard/referrals"
            className="hover:text-yellow-400"
          >
            Referrals
          </Link>

          <Link
            href="/logout"
            className="text-red-400 hover:text-red-300"
          >
            Logout
          </Link>

        </nav>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-zinc-800 bg-zinc-900">

          <nav className="flex flex-col p-4 space-y-4">

            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="text-zinc-300 hover:text-yellow-400"
            >
              Dashboard
            </Link>

            <Link
              href="/dashboard/plans"
              onClick={() => setOpen(false)}
              className="text-zinc-300 hover:text-yellow-400"
            >
              Plans
            </Link>

            <Link
              href="/dashboard/referrals"
              onClick={() => setOpen(false)}
              className="text-zinc-300 hover:text-yellow-400"
            >
              Referrals
            </Link>

            <Link
              href="/logout"
              onClick={() => setOpen(false)}
              className="text-red-400 hover:text-red-300"
            >
              Logout
            </Link>

          </nav>

        </div>
      )}

    </header>
  );
}`