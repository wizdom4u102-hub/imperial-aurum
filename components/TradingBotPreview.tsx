"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  ChartCandlestick,
  Activity,
  Zap,
  Bot,
  BarChart3,
  Globe2,
  Cpu,
} from "lucide-react";

export default function TradingBotPreview() {
  return (
    <section className="relative overflow-hidden bg-zinc-950 py-24 sm:py-28 lg:py-32">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/[0.04] blur-[140px]" />
        <div className="absolute left-[15%] top-[20%] h-64 w-64 rounded-full bg-yellow-500/[0.04] blur-[100px]" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-14 max-w-3xl text-center sm:mb-16 lg:mb-20">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
            <BrainCircuit className="h-4 w-4" />
            AI Trading Technology
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl xl:text-6xl">
            Meet Our{" "}
            <span className="text-yellow-400">
              AI Trading Bot
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base sm:leading-8">
            Intelligent automated trading technology designed to analyze
            market activity, monitor opportunities and execute trading
            strategies while you track everything from your dashboard.
          </p>
        </div>

        {/* Main */}
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 xl:gap-24">
          {/* ================= AI BOT ================= */}
          <div className="relative flex min-h-[520px] items-center justify-center sm:min-h-[620px] lg:min-h-[680px]">
            {/* Large digital screen */}
            <motion.div
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative z-10 w-full max-w-[560px]"
            >
              {/* Screen frame */}
              <div className="relative rounded-[2rem] border border-cyan-400/20 bg-zinc-900/90 p-3 shadow-[0_0_100px_rgba(34,211,238,0.08)] backdrop-blur-xl sm:rounded-[2.5rem] sm:p-4">
                {/* Top bar */}
                <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-black/70 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />

                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-400 sm:text-xs">
                      AI System Online
                    </span>
                  </div>

                  <span className="text-[9px] uppercase tracking-widest text-zinc-600 sm:text-[10px]">
                    Imperial AI
                  </span>
                </div>

                {/* Dashboard screen */}
                <div className="relative mt-3 overflow-hidden rounded-2xl border border-cyan-400/10 bg-[#071014] p-4 sm:p-6">
                  {/* Grid */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-30"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(34,211,238,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.08) 1px, transparent 1px)",
                      backgroundSize: "30px 30px",
                    }}
                  />

                  {/* World / AI data area */}
                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500">
                          Global Market Intelligence
                        </p>

                        <p className="mt-1 text-sm font-bold text-white sm:text-base">
                          AI Market Analysis
                        </p>
                      </div>

                      <Globe2 className="h-5 w-5 text-cyan-400" />
                    </div>

                    {/* Chart labels */}
                    <div className="grid grid-cols-3 gap-3 border-t border-white/5 pt-4">
                      <div>
                        <p className="text-[8px] uppercase text-zinc-600">
                          Signals
                        </p>

                        <p className="mt-1 text-xs font-bold text-emerald-400">
                          Active
                        </p>
                      </div>

                      <div>
                        <p className="text-[8px] uppercase text-zinc-600">
                          Engine
                        </p>

                        <p className="mt-1 text-xs font-bold text-yellow-400">
                          Online
                        </p>
                      </div>

                      <div>
                        <p className="text-[8px] uppercase text-zinc-600">
                          Status
                        </p>

                        <p className="mt-1 text-xs font-bold text-cyan-400">
                          Live
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ================= FUTURISTIC ROBOT ================= */}
                <div className="relative mt-3 flex justify-center">
                  <motion.div
                    animate={{
                      y: [0, -5, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="relative w-[250px] sm:w-[300px]"
                  >
                    {/* Ambient robot glow */}
                    <div className="pointer-events-none absolute left-1/2 top-16 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-400/[0.07] blur-[70px]" />

                    {/* Antenna */}
                    <div className="absolute left-1/2 top-[-58px] z-30 h-12 w-[2px] -translate-x-1/2 bg-gradient-to-t from-cyan-400/80 to-cyan-200/20" />

                    <motion.div
                      animate={{
                        scale: [1, 1.25, 1],
                        opacity: [0.55, 1, 0.55],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                      }}
                      className="absolute left-1/2 top-[-72px] z-30 h-6 w-6 -translate-x-1/2 rounded-full border border-cyan-200 bg-cyan-300 shadow-[0_0_35px_rgba(34,211,238,1)]"
                    />

                    {/* ================= HEAD ================= */}
                    <div className="relative z-20 mx-auto h-[118px] w-[152px] rounded-[3rem] border border-cyan-200/40 bg-gradient-to-br from-zinc-100 via-zinc-400 to-zinc-700 shadow-[inset_0_3px_10px_rgba(255,255,255,0.7),0_0_45px_rgba(34,211,238,0.15)] sm:h-[138px] sm:w-[178px]">
                      {/* Head top highlight */}
                      <div className="absolute left-1/2 top-2 h-4 w-24 -translate-x-1/2 rounded-full bg-white/30 blur-sm" />

                      {/* Face glass */}
                      <div className="absolute inset-[7px] overflow-hidden rounded-[2.5rem] border border-white/20 bg-gradient-to-b from-zinc-800/80 via-zinc-950/95 to-black shadow-[inset_0_0_25px_rgba(34,211,238,0.08)]">
                        {/* Face reflection */}
                        <div className="absolute left-5 top-3 h-10 w-20 rotate-[-18deg] rounded-full bg-white/10 blur-md" />

                        {/* Digital forehead line */}
                        <div className="absolute left-1/2 top-5 h-px w-16 -translate-x-1/2 bg-cyan-400/30 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />

                        {/* Eyes */}
                        <div className="absolute left-1/2 top-10 flex -translate-x-1/2 gap-8 sm:top-12 sm:gap-11">
                          <motion.div
                            animate={{
                              opacity: [0.65, 1, 0.65],
                              scale: [0.95, 1.05, 0.95],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                            }}
                            className="relative h-6 w-8 rounded-full bg-cyan-400 shadow-[0_0_22px_rgba(34,211,238,1)]"
                          >
                            <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
                          </motion.div>

                          <motion.div
                            animate={{
                              opacity: [1, 0.65, 1],
                              scale: [1.05, 0.95, 1.05],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                            }}
                            className="relative h-6 w-8 rounded-full bg-cyan-400 shadow-[0_0_22px_rgba(34,211,238,1)]"
                          >
                            <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
                          </motion.div>
                        </div>

                        {/* Nose sensor */}
                        <div className="absolute left-1/2 top-[67px] h-2 w-2 -translate-x-1/2 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />

                        {/* Mouth */}
                        <div className="absolute bottom-5 left-1/2 h-1.5 w-12 -translate-x-1/2 rounded-full bg-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.9)]" />

                        {/* Mouth signal dots */}
                        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
                          <span className="h-0.5 w-0.5 rounded-full bg-cyan-300" />
                          <span className="h-0.5 w-0.5 rounded-full bg-cyan-300" />
                          <span className="h-0.5 w-0.5 rounded-full bg-cyan-300" />
                        </div>
                      </div>

                      {/* Side ear modules */}
                      <div className="absolute -left-5 top-10 h-14 w-7 rounded-l-2xl border border-cyan-300/30 bg-gradient-to-b from-zinc-300 to-zinc-700 shadow-lg sm:-left-6">
                        <div className="absolute left-1/2 top-1/2 h-6 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
                      </div>

                      <div className="absolute -right-5 top-10 h-14 w-7 rounded-r-2xl border border-cyan-300/30 bg-gradient-to-b from-zinc-300 to-zinc-700 shadow-lg sm:-right-6">
                        <div className="absolute left-1/2 top-1/2 h-6 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
                      </div>
                    </div>

                    {/* Neck */}
                    <div className="relative z-10 mx-auto h-7 w-16 border-x border-cyan-300/30 bg-gradient-to-b from-zinc-700 to-zinc-900">
                      <div className="absolute left-1/2 top-1/2 h-2 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/30 shadow-[0_0_12px_rgba(34,211,238,0.5)]" />
                    </div>

                    {/* ================= SHOULDERS ================= */}
                    <div className="relative z-10 mx-auto -mb-4 flex w-[220px] justify-between sm:w-[255px]">
                      <div className="h-12 w-14 rotate-[18deg] rounded-[1.5rem] border border-cyan-300/20 bg-gradient-to-br from-zinc-100 via-zinc-500 to-zinc-800 shadow-[inset_0_2px_5px_rgba(255,255,255,0.5),0_8px_20px_rgba(0,0,0,0.5)] sm:h-14 sm:w-16" />

                      <div className="h-12 w-14 -rotate-[18deg] rounded-[1.5rem] border border-cyan-300/20 bg-gradient-to-bl from-zinc-100 via-zinc-500 to-zinc-800 shadow-[inset_0_2px_5px_rgba(255,255,255,0.5),0_8px_20px_rgba(0,0,0,0.5)] sm:h-14 sm:w-16" />
                    </div>

                    {/* ================= BODY ================= */}
                    <div className="relative z-10 mx-auto h-[160px] w-[190px] rounded-[2.8rem] border border-cyan-300/30 bg-gradient-to-b from-zinc-100 via-zinc-500 to-zinc-900 shadow-[inset_0_4px_10px_rgba(255,255,255,0.6),0_15px_35px_rgba(0,0,0,0.7)] sm:h-[185px] sm:w-[220px]">
                      {/* Chest armor */}
                      <div className="absolute left-1/2 top-4 h-20 w-32 -translate-x-1/2 rounded-[2rem] border border-white/20 bg-gradient-to-b from-zinc-300/80 via-zinc-600/80 to-zinc-900/90 shadow-[inset_0_2px_8px_rgba(255,255,255,0.35)] sm:h-24 sm:w-40">
                        {/* Chest processor */}
                        <div className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-cyan-300/30 bg-zinc-950 shadow-[0_0_35px_rgba(34,211,238,0.25)] sm:h-20 sm:w-20">
                          <motion.div
                            animate={{
                              scale: [1, 1.12, 1],
                              rotate: [0, 180, 360],
                            }}
                            transition={{
                              scale: {
                                duration: 1.8,
                                repeat: Infinity,
                              },
                              rotate: {
                                duration: 8,
                                repeat: Infinity,
                                ease: "linear",
                              },
                            }}
                          >
                            <Cpu className="h-7 w-7 text-cyan-300 sm:h-9 sm:w-9" />
                          </motion.div>

                          <div className="absolute inset-3 rounded-full border border-cyan-400/20" />
                        </div>
                      </div>

                      {/* Chest side vents */}
                      <div className="absolute left-4 top-12 flex flex-col gap-1.5">
                        <span className="h-1 w-6 rounded-full bg-cyan-400/50" />
                        <span className="h-1 w-4 rounded-full bg-cyan-400/30" />
                        <span className="h-1 w-5 rounded-full bg-cyan-400/40" />
                      </div>

                      <div className="absolute right-4 top-12 flex flex-col items-end gap-1.5">
                        <span className="h-1 w-6 rounded-full bg-cyan-400/50" />
                        <span className="h-1 w-4 rounded-full bg-cyan-400/30" />
                        <span className="h-1 w-5 rounded-full bg-cyan-400/40" />
                      </div>

                      {/* Lower chest lights */}
                      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-3">
                        <motion.span
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{
                            duration: 1.2,
                            repeat: Infinity,
                          }}
                          className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.9)]"
                        />

                        <motion.span
                          animate={{ opacity: [1, 0.4, 1] }}
                          transition={{
                            duration: 1.2,
                            repeat: Infinity,
                          }}
                          className="h-2 w-2 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)]"
                        />

                        <motion.span
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{
                            duration: 1.2,
                            repeat: Infinity,
                          }}
                          className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"
                        />
                      </div>

                      {/* Waist */}
                      <div className="absolute -bottom-6 left-1/2 h-10 w-24 -translate-x-1/2 rounded-xl border border-cyan-300/20 bg-gradient-to-b from-zinc-600 to-zinc-950 shadow-lg">
                        <div className="absolute left-1/2 top-1/2 h-2 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/30" />
                      </div>
                    </div>

                    {/* ================= LEFT ARM ================= */}
                    <div className="absolute left-[-38px] top-[145px] z-0 flex flex-col items-center sm:left-[-48px] sm:top-[165px]">
                      {/* Upper arm */}
                      <div className="relative h-24 w-10 rotate-[10deg] rounded-[1.4rem] border border-cyan-300/20 bg-gradient-to-b from-zinc-200 via-zinc-500 to-zinc-800 shadow-[inset_0_2px_6px_rgba(255,255,255,0.4),0_8px_15px_rgba(0,0,0,0.5)] sm:h-28 sm:w-12">
                        <div className="absolute left-1/2 top-5 h-1 w-6 -translate-x-1/2 rounded-full bg-cyan-400/40" />
                      </div>

                      {/* Elbow */}
                      <div className="z-10 -my-2 h-10 w-10 rounded-full border border-cyan-300/30 bg-gradient-to-br from-zinc-200 to-zinc-800 shadow-lg sm:h-12 sm:w-12">
                        <div className="mx-auto mt-3 h-4 w-4 rounded-full bg-cyan-400/30 shadow-[0_0_12px_rgba(34,211,238,0.5)]" />
                      </div>

                      {/* Forearm */}
                      <div className="relative h-24 w-9 rotate-[7deg] rounded-[1.3rem] border border-cyan-300/20 bg-gradient-to-b from-zinc-300 via-zinc-600 to-zinc-900 shadow-[inset_0_2px_5px_rgba(255,255,255,0.4),0_8px_15px_rgba(0,0,0,0.5)] sm:h-28 sm:w-11">
                        <div className="absolute bottom-5 left-1/2 h-8 w-1 -translate-x-1/2 rounded-full bg-cyan-400/30" />
                      </div>

                      {/* Hand */}
                      <div className="relative mt-1 h-10 w-9 rounded-2xl border border-cyan-300/20 bg-gradient-to-b from-zinc-200 to-zinc-800 shadow-lg sm:h-12 sm:w-11">
                        <div className="absolute bottom-[-8px] left-1/2 h-5 w-7 -translate-x-1/2 rounded-b-xl bg-zinc-700" />
                      </div>
                    </div>

                    {/* ================= RIGHT ARM ================= */}
                    <div className="absolute right-[-38px] top-[145px] z-0 flex flex-col items-center sm:right-[-48px] sm:top-[165px]">
                      {/* Upper arm */}
                      <div className="relative h-24 w-10 -rotate-[10deg] rounded-[1.4rem] border border-cyan-300/20 bg-gradient-to-b from-zinc-200 via-zinc-500 to-zinc-800 shadow-[inset_0_2px_6px_rgba(255,255,255,0.4),0_8px_15px_rgba(0,0,0,0.5)] sm:h-28 sm:w-12">
                        <div className="absolute right-1/2 top-5 h-1 w-6 translate-x-1/2 rounded-full bg-cyan-400/40" />
                      </div>

                      {/* Elbow */}
                      <div className="z-10 -my-2 h-10 w-10 rounded-full border border-cyan-300/30 bg-gradient-to-br from-zinc-200 to-zinc-800 shadow-lg sm:h-12 sm:w-12">
                        <div className="mx-auto mt-3 h-4 w-4 rounded-full bg-cyan-400/30 shadow-[0_0_12px_rgba(34,211,238,0.5)]" />
                      </div>

                      {/* Forearm */}
                      <div className="relative h-24 w-9 -rotate-[7deg] rounded-[1.3rem] border border-cyan-300/20 bg-gradient-to-b from-zinc-300 via-zinc-600 to-zinc-900 shadow-[inset_0_2px_5px_rgba(255,255,255,0.4),0_8px_15px_rgba(0,0,0,0.5)] sm:h-28 sm:w-11">
                        <div className="absolute bottom-5 left-1/2 h-8 w-1 -translate-x-1/2 rounded-full bg-cyan-400/30" />
                      </div>

                      {/* Hand */}
                      <div className="relative mt-1 h-10 w-9 rounded-2xl border border-cyan-300/20 bg-gradient-to-b from-zinc-200 to-zinc-800 shadow-lg sm:h-12 sm:w-11">
                        <div className="absolute bottom-[-8px] left-1/2 h-5 w-7 -translate-x-1/2 rounded-b-xl bg-zinc-700" />
                      </div>
                    </div>

                    {/* ================= LEGS ================= */}
                    <div className="relative z-0 mx-auto -mt-1 flex w-[145px] justify-between sm:w-[165px]">
                      {/* Left leg */}
                      <div className="flex flex-col items-center">
                        <div className="h-20 w-14 rounded-b-[1.4rem] border border-cyan-300/20 bg-gradient-to-b from-zinc-600 via-zinc-700 to-zinc-950 shadow-[inset_0_2px_5px_rgba(255,255,255,0.25)] sm:h-24 sm:w-16">
                          <div className="mx-auto mt-5 h-8 w-1 rounded-full bg-cyan-400/30" />
                        </div>

                        <div className="mt-1 h-9 w-16 rounded-[1rem] border border-cyan-300/20 bg-gradient-to-b from-zinc-300 to-zinc-800 shadow-lg sm:w-[72px]" />

                        <div className="mt-1 h-7 w-20 rounded-[1rem] border border-cyan-300/20 bg-gradient-to-b from-zinc-500 to-zinc-950 shadow-xl sm:w-24" />
                      </div>

                      {/* Right leg */}
                      <div className="flex flex-col items-center">
                        <div className="h-20 w-14 rounded-b-[1.4rem] border border-cyan-300/20 bg-gradient-to-b from-zinc-600 via-zinc-700 to-zinc-950 shadow-[inset_0_2px_5px_rgba(255,255,255,0.25)] sm:h-24 sm:w-16">
                          <div className="mx-auto mt-5 h-8 w-1 rounded-full bg-cyan-400/30" />
                        </div>

                        <div className="mt-1 h-9 w-16 rounded-[1rem] border border-cyan-300/20 bg-gradient-to-b from-zinc-300 to-zinc-800 shadow-lg sm:w-[72px]" />

                        <div className="mt-1 h-7 w-20 rounded-[1rem] border border-cyan-300/20 bg-gradient-to-b from-zinc-500 to-zinc-950 shadow-xl sm:w-24" />
                      </div>
                    </div>

                    {/* Robot platform */}
                    <div className="relative z-0 mx-auto mt-2 h-5 w-[220px] rounded-[50%] border border-cyan-400/30 bg-gradient-to-r from-zinc-800 via-zinc-500 to-zinc-800 shadow-[0_0_30px_rgba(34,211,238,0.18)] sm:w-[260px]">
                      <motion.div
                        animate={{
                          opacity: [0.3, 0.8, 0.3],
                          scaleX: [0.9, 1, 0.9],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                        className="absolute inset-x-8 top-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)]"
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Bottom system bar */}
                <div className="mt-3 flex items-center justify-between rounded-2xl border border-white/5 bg-black/60 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Activity className="h-3.5 w-3.5 text-emerald-400" />

                    <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-emerald-400 sm:text-[10px]">
                      AI Monitoring
                    </span>
                  </div>

                  <span className="text-[9px] text-zinc-600 sm:text-[10px]">
                    Market signals detected
                  </span>
                </div>
              </div>
            </motion.div>

            {/* LIVE badge */}
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute right-0 top-8 z-30 rounded-2xl border border-emerald-400/20 bg-zinc-900/95 px-4 py-3 shadow-xl backdrop-blur sm:right-2 sm:top-14"
            >
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />

                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Live
                </span>
              </div>

              <p className="mt-1 text-xs text-zinc-400">
                Trading Active
              </p>
            </motion.div>

            {/* AI badge */}
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute bottom-10 left-0 z-30 rounded-2xl border border-cyan-400/20 bg-zinc-900/95 px-4 py-3 shadow-xl backdrop-blur sm:bottom-16 sm:left-2"
            >
              <div className="flex items-center gap-2">
                <BrainCircuit className="h-4 w-4 text-cyan-400" />

                <span className="text-xs text-zinc-400">
                  Intelligence
                </span>
              </div>

              <p className="mt-1 text-sm font-bold text-cyan-400">
                Analyzing Markets
              </p>
            </motion.div>
          </div>

          {/* ================= INFORMATION ================= */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-yellow-400/20 bg-yellow-400/5">
                <Bot className="h-6 w-6 text-yellow-400" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-400">
                  Automated Intelligence
                </p>

                <h3 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
                  Smarter Trading. Less Manual Work.
                </h3>
              </div>
            </div>

            <p className="text-sm leading-7 text-zinc-400 sm:text-base sm:leading-8">
              The Imperial Aurum AI Trading Bot is built to automate the
              trading process using intelligent strategies. Instead of
              manually watching the market all day, your activated bot can
              manage its trading cycle while you monitor its performance
              from your dashboard.
            </p>

            {/* Feature cards */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5 transition duration-300 hover:-translate-y-2 hover:border-cyan-400/30 hover:bg-cyan-400/[0.03]">
                <ChartCandlestick className="h-6 w-6 text-cyan-400" />

                <h4 className="mt-4 font-semibold text-white">
                  Market Analysis
                </h4>

                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Designed to analyze market conditions and identify
                  potential trading opportunities.
                </p>
              </div>

              <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5 transition duration-300 hover:-translate-y-2 hover:border-yellow-400/30 hover:bg-yellow-400/[0.03]">
                <Zap className="h-6 w-6 text-yellow-400" />

                <h4 className="mt-4 font-semibold text-white">
                  Automated Execution
                </h4>

                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Trading cycles are handled automatically according to
                  the selected bot configuration.
                </p>
              </div>

              <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5 transition duration-300 hover:-translate-y-2 hover:border-emerald-400/30 hover:bg-emerald-400/[0.03]">
                <BarChart3 className="h-6 w-6 text-emerald-400" />

                <h4 className="mt-4 font-semibold text-white">
                  Performance Tracking
                </h4>

                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Monitor bot activity, trades and performance directly
                  from your dashboard.
                </p>
              </div>

              <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5 transition duration-300 hover:-translate-y-2 hover:border-blue-400/30 hover:bg-blue-400/[0.03]">
                <Activity className="h-6 w-6 text-blue-400" />

                <h4 className="mt-4 font-semibold text-white">
                  Live Monitoring
                </h4>

                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Stay informed with live bot status and trading activity.
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-9">
              <Link
                href="/trading-bot"
                className="group inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-yellow-400 px-7 py-4 text-sm font-bold text-black transition duration-300 hover:-translate-y-1 hover:bg-yellow-300 hover:shadow-[0_15px_40px_rgba(250,204,21,0.18)] sm:w-auto"
              >
                Read More About Our Trading Bot

                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}