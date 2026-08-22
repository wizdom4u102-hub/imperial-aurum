"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  ChartCandlestick,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function TradingBotCTA() {
  return (
    <section className="relative overflow-hidden bg-black py-24 sm:py-28 lg:py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/[0.05] blur-[140px]" />
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-yellow-500/[0.04] blur-[110px]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] border border-cyan-400/15 bg-zinc-950 p-6 shadow-[0_0_100px_rgba(34,211,238,0.06)] sm:rounded-[2.5rem] sm:p-10 lg:p-14">
          <div className="pointer-events-none absolute left-0 top-0 h-px w-1/2 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

          <div className="pointer-events-none absolute bottom-0 right-0 h-px w-1/2 bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent" />

          <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.8fr] lg:gap-16">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-yellow-400">
                <BrainCircuit className="h-4 w-4" />
                Start Automated Trading
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Put Intelligent Trading{" "}
                <span className="text-yellow-400">To Work</span>
              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base sm:leading-8">
                Explore the available AI trading bot plans, compare their
                features and choose the configuration that fits your trading
                goals.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <ChartCandlestick className="h-5 w-5 shrink-0 text-cyan-400" />
                  <span className="text-sm text-zinc-300">
                    Automated trading cycles
                  </span>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <Bot className="h-5 w-5 shrink-0 text-yellow-400" />
                  <span className="text-sm text-zinc-300">
                    Multiple bot configurations
                  </span>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <Zap className="h-5 w-5 shrink-0 text-emerald-400" />
                  <span className="text-sm text-zinc-300">
                    Live activity monitoring
                  </span>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-blue-400" />
                  <span className="text-sm text-zinc-300">
                    Dashboard performance tracking
                  </span>
                </div>
              </div>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/dashboard/trading-bot"
                  className="group inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-yellow-400 px-7 py-4 text-sm font-bold text-black transition duration-300 hover:-translate-y-1 hover:bg-yellow-300 hover:shadow-[0_15px_40px_rgba(250,204,21,0.18)] sm:w-auto"
                >
                  Explore Trading Bots

                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/signup"
                  className="inline-flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-7 py-4 text-sm font-semibold text-white transition duration-300 hover:-translate-y-1 hover:border-cyan-400/20 hover:bg-cyan-400/[0.04] sm:w-auto"
                >
                  Create Account
                </Link>
              </div>
            </div>

            <div className="relative flex min-h-[300px] items-center justify-center">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative"
              >
                <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/[0.08] blur-[70px]" />

                <div className="relative mx-auto h-32 w-44 rounded-[3rem] border border-cyan-300/30 bg-gradient-to-br from-zinc-200 via-zinc-500 to-zinc-900 shadow-[inset_0_3px_8px_rgba(255,255,255,0.5),0_0_50px_rgba(34,211,238,0.12)]">
                  <div className="absolute inset-2 rounded-[2.5rem] border border-white/10 bg-black/80">
                    <div className="absolute left-1/2 top-8 flex -translate-x-1/2 gap-8">
                      <span className="h-5 w-7 rounded-full bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,1)]" />
                      <span className="h-5 w-7 rounded-full bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,1)]" />
                    </div>

                    <div className="absolute bottom-5 left-1/2 h-1.5 w-10 -translate-x-1/2 rounded-full bg-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.9)]" />
                  </div>

                  <div className="absolute left-1/2 top-[-35px] h-8 w-px -translate-x-1/2 bg-cyan-400/70" />

                  <motion.span
                    animate={{
                      opacity: [0.4, 1, 0.4],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                    }}
                    className="absolute left-1/2 top-[-45px] h-3 w-3 -translate-x-1/2 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,1)]"
                  />
                </div>

                <div className="relative mx-auto mt-3 h-36 w-52 rounded-[2.5rem] border border-cyan-300/20 bg-gradient-to-b from-zinc-300 via-zinc-600 to-zinc-950 shadow-[inset_0_3px_8px_rgba(255,255,255,0.4),0_15px_30px_rgba(0,0,0,0.6)]">
                  <div className="absolute left-1/2 top-7 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full border-4 border-cyan-300/20 bg-black shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                    <Bot className="h-7 w-7 text-cyan-300" />
                  </div>

                  <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                    <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </div>
                </div>

                <div className="mx-auto mt-3 h-3 w-56 rounded-full border border-cyan-400/30 bg-zinc-700 shadow-[0_0_25px_rgba(34,211,238,0.15)]" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}