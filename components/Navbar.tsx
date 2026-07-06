"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950 border-b border-zinc-800">

        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 flex-shrink-0"
          >
            <Image
              src="/images/logo.png"
              alt="Imperial Aurum"
              width={56}
              height={56}
              priority
              className="w-10 h-10 sm:w-14 sm:h-14 object-contain rounded"
            />

            <div className="leading-none">
              <h1 className="text-lg sm:text-3xl font-bold text-yellow-400">
                Imperial Aurum
              </h1>

              <p className="text-[10px] sm:text-sm uppercase tracking-[6px] sm:tracking-[8px] text-yellow-300 mt-1">
                Mining
              </p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8 text-white">

            <a
              href="#plans"
              className="hover:text-yellow-400 transition"
            >
              Plans
            </a>

            <a
              href="#how-it-works"
              className="hover:text-yellow-400 transition"
            >
              How it Works
            </a>

            <a
              href="#faq"
              className="hover:text-yellow-400 transition"
            >
              FAQ
            </a>

            <Link
              href="/login"
              className="bg-yellow-500 hover:bg-yellow-400 text-black px-5 py-2 rounded-xl font-semibold transition"
            >
              Login
            </Link>

            <Link
              href="/dashboard"
              className="border border-yellow-400 hover:bg-yellow-400 hover:text-black px-5 py-2 rounded-xl font-semibold transition"
            >
              Dashboard
            </Link>

          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-yellow-400 p-2"
            aria-label="Toggle Menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
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
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-zinc-800 bg-zinc-950">

            <div className="flex flex-col px-6 py-6 space-y-5 text-lg">

              <a
                href="#plans"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-yellow-400 transition"
              >
                Plans
              </a>

              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-yellow-400 transition"
              >
                How it Works
              </a>

              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-yellow-400 transition"
              >
                FAQ
              </a>

              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="bg-yellow-500 hover:bg-yellow-400 text-black text-center py-3 rounded-xl font-semibold transition"
              >
                Login
              </Link>

              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="border border-yellow-400 hover:bg-yellow-400 hover:text-black text-center py-3 rounded-xl font-semibold transition"
              >
                Dashboard
              </Link>

            </div>

          </div>
        )}

      </nav>
    </>
  );
}