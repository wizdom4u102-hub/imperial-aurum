"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-zinc-950 border-b border-zinc-800 z-50">
      
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-4">
          <Image
            src="/images/logo.png"
            alt="Imperial Aurum"
            width={60}
            height={60}
            className="w-12 h-auto object-contain"
          />

          <div className="leading-none">
            <h1 className="text-2xl md:text-3xl font-bold text-yellow-400 tracking-wide">
              Imperial Aurum
            </h1>
            <p className="text-xs md:text-sm uppercase tracking-[6px] md:tracking-[8px] text-yellow-300">
              Mining
            </p>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm">
          <a href="#plans" className="hover:text-yellow-400 transition">
            Plans
          </a>

          <a href="#how-it-works" className="hover:text-yellow-400 transition">
            How it Works
          </a>

          <a href="#faq" className="hover:text-yellow-400 transition">
            FAQ
          </a>

          <Link
            href="/login"
            className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2.5 rounded-xl font-medium transition"
          >
            Login
          </Link>

          <Link
            href="/dashboard"
            className="border border-yellow-400 hover:bg-yellow-400 hover:text-black px-6 py-2.5 rounded-xl font-medium transition"
          >
            Dashboard
          </Link>
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-yellow-400 text-2xl"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-zinc-900 border-t border-zinc-800 px-6 py-4 flex flex-col gap-4 text-sm">
          <a href="#plans" onClick={() => setOpen(false)}>Plans</a>
          <a href="#how-it-works" onClick={() => setOpen(false)}>How it Works</a>
          <a href="#faq" onClick={() => setOpen(false)}>FAQ</a>

          <Link href="/login" onClick={() => setOpen(false)}>
            Login
          </Link>

          <Link href="/dashboard" onClick={() => setOpen(false)}>
            Dashboard
          </Link>
        </div>
      )}
    </nav>
  );
}