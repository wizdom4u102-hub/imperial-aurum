"use client";

import Link from "next/link";

export default function AboutCTA() {
  return (
    <section className="relative py-28 px-6 overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-black to-yellow-500/10 animate-pulse" />

      {/* Floating Gold Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-20 w-40 h-40 bg-yellow-400 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-20 w-52 h-52 bg-yellow-500 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Content */}
      <div className="relative max-w-5xl mx-auto text-center">

        {/* Headline */}
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Ready to Start{" "}
          <span className="text-yellow-400">Mining Real Wealth?</span>
        </h2>

        {/* Subtitle */}
        <p className="text-zinc-300 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-8">
          Join thousands of investors already earning daily digital gold rewards
          through Imperial Aurum’s advanced cloud mining system.
          No hardware. No stress. Just passive income growth.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">

          <Link
            href="/login"
            className="bg-yellow-500 hover:bg-yellow-400 text-black px-10 py-4 rounded-2xl text-lg font-bold transition shadow-lg shadow-yellow-500/20"
          >
            Start Mining Now
          </Link>

          <Link
            href="/register"
            className="bg-yellow-500 hover:bg-yellow-400 text-black px-10 py-4 rounded-2xl text-lg font-bold transition shadow-lg shadow-yellow-500/20"
          >
            Create Free Account
          </Link>

        </div>

        {/* Extra Trust Line */}
        <p className="text-zinc-500 text-sm mt-10">
          Secure • Transparent • Global Mining Infrastructure • 24/7 Active System
        </p>

      </div>
    </section>
  );
}