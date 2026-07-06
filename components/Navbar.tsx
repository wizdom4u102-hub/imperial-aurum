"use client";

import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-zinc-950 border-b border-zinc-800 z-50">

      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

        <Link href="/" className="flex items-center gap-4">

  <Image
  src="/images/logo.png"
  alt="Imperial Aurum"
  width={44}
  height={44}
  className="w-11 h-11 object-contain"
/>

<div className="leading-none">
  <h1 className="text-2xl font-bold text-yellow-400 tracking-wide">
    Imperial Aurum
  </h1>

  <p className="text-xs uppercase tracking-[6px] text-yellow-300">
    Mining
  </p>
</div>

</Link>

        <div className="flex items-center gap-8 text-sm">

          

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

      </div>

    </nav>
  );
}