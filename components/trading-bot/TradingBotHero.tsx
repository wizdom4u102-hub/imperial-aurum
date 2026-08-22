"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  BrainCircuit,
  ChartCandlestick,
  Cpu,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function TradingBotHero() {
  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-black py-20 sm:py-24 lg:py-28">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-yellow-500/10 blur-[130px] sm:h-[600px] sm:w-[600px]" />
        <div className="absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-blue-500/5 blur-[100px]" />
        <div className="absolute -right-32 top-20 h-72 w-72 rounded-full bg-yellow-500/5 blur-[100px]" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-yellow-400"
          >
            <BrainCircuit className="h-4 w-4" />
            Imperial Aurum AI Trading
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl"
          >
            Intelligent Trading.
            <br />
            <span className="text-yellow-400">Automated By AI.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base sm:leading-8"
          >
            Meet the Imperial Aurum AI Trading Bot — an automated trading
            system designed to analyze market activity, execute trading
            cycles, and help you monitor your bot performance from one
            powerful dashboard.
          </motion.p>
        </div>

        {/* Main Bot */}
        <div className="relative mx-auto mt-14 flex min-h-[680px] max-w-5xl items-center justify-center sm:mt-16 sm:min-h-[760px] lg:mt-20 lg:min-h-[820px]">
          {/* Orbit */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute h-[280px] w-[280px] rounded-full border border-yellow-400/10 sm:h-[420px] sm:w-[420px] lg:h-[500px] lg:w-[500px]"
          />

          <motion.div
            animate={{ rotate: -360 }}
            transition={{
              duration: 28,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute h-[220px] w-[220px] rounded-full border border-blue-400/10 sm:h-[340px] sm:w-[340px] lg:h-[410px] lg:w-[410px]"
          />

          {/* AI Core Glow */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl sm:h-96 sm:w-96"
          />

          {/* ================= FUTURISTIC ROBOT ================= */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, -5, 0],
            }}
            transition={{
              opacity: { duration: 0.8 },
              scale: { duration: 0.8 },
              y: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            className="relative z-10 w-[250px] sm:w-[300px]"
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
              <div className="relative h-24 w-10 rotate-[10deg] rounded-[1.4rem] border border-cyan-300/20 bg-gradient-to-b from-zinc-200 via-zinc-500 to-zinc-800 shadow-[inset_0_2px_6px_rgba(255,255,255,0.4),0_8px_15px_rgba(0,0,0,0.5)] sm:h-28 sm:w-12">
                <div className="absolute left-1/2 top-5 h-1 w-6 -translate-x-1/2 rounded-full bg-cyan-400/40" />
              </div>

              <div className="z-10 -my-2 h-10 w-10 rounded-full border border-cyan-300/30 bg-gradient-to-br from-zinc-200 to-zinc-800 shadow-lg sm:h-12 sm:w-12">
                <div className="mx-auto mt-3 h-4 w-4 rounded-full bg-cyan-400/30 shadow-[0_0_12px_rgba(34,211,238,0.5)]" />
              </div>

              <div className="relative h-24 w-9 rotate-[7deg] rounded-[1.3rem] border border-cyan-300/20 bg-gradient-to-b from-zinc-300 via-zinc-600 to-zinc-900 shadow-[inset_0_2px_5px_rgba(255,255,255,0.4),0_8px_15px_rgba(0,0,0,0.5)] sm:h-28 sm:w-11">
                <div className="absolute bottom-5 left-1/2 h-8 w-1 -translate-x-1/2 rounded-full bg-cyan-400/30" />
              </div>

              <div className="relative mt-1 h-10 w-9 rounded-2xl border border-cyan-300/20 bg-gradient-to-b from-zinc-200 to-zinc-800 shadow-lg sm:h-12 sm:w-11">
                <div className="absolute bottom-[-8px] left-1/2 h-5 w-7 -translate-x-1/2 rounded-b-xl bg-zinc-700" />
              </div>
            </div>

            {/* ================= RIGHT ARM ================= */}
            <div className="absolute right-[-38px] top-[145px] z-0 flex flex-col items-center sm:right-[-48px] sm:top-[165px]">
              <div className="relative h-24 w-10 -rotate-[10deg] rounded-[1.4rem] border border-cyan-300/20 bg-gradient-to-b from-zinc-200 via-zinc-500 to-zinc-800 shadow-[inset_0_2px_6px_rgba(255,255,255,0.4),0_8px_15px_rgba(0,0,0,0.5)] sm:h-28 sm:w-12">
                <div className="absolute right-1/2 top-5 h-1 w-6 translate-x-1/2 rounded-full bg-cyan-400/40" />
              </div>

              <div className="z-10 -my-2 h-10 w-10 rounded-full border border-cyan-300/30 bg-gradient-to-br from-zinc-200 to-zinc-800 shadow-lg sm:h-12 sm:w-12">
                <div className="mx-auto mt-3 h-4 w-4 rounded-full bg-cyan-400/30 shadow-[0_0_12px_rgba(34,211,238,0.5)]" />
              </div>

              <div className="relative h-24 w-9 -rotate-[7deg] rounded-[1.3rem] border border-cyan-300/20 bg-gradient-to-b from-zinc-300 via-zinc-600 to-zinc-900 shadow-[inset_0_2px_5px_rgba(255,255,255,0.4),0_8px_15px_rgba(0,0,0,0.5)] sm:h-28 sm:w-11">
                <div className="absolute bottom-5 left-1/2 h-8 w-1 -translate-x-1/2 rounded-full bg-cyan-400/30" />
              </div>

              <div className="relative mt-1 h-10 w-9 rounded-2xl border border-cyan-300/20 bg-gradient-to-b from-zinc-200 to-zinc-800 shadow-lg sm:h-12 sm:w-11">
                <div className="absolute bottom-[-8px] left-1/2 h-5 w-7 -translate-x-1/2 rounded-b-xl bg-zinc-700" />
              </div>
            </div>

            {/* ================= LEGS ================= */}
            <div className="relative z-0 mx-auto -mt-1 flex w-[145px] justify-between sm:w-[165px]">
              <div className="flex flex-col items-center">
                <div className="h-20 w-14 rounded-b-[1.4rem] border border-cyan-300/20 bg-gradient-to-b from-zinc-600 via-zinc-700 to-zinc-950 shadow-[inset_0_2px_5px_rgba(255,255,255,0.25)] sm:h-24 sm:w-16">
                  <div className="mx-auto mt-5 h-8 w-1 rounded-full bg-cyan-400/30" />
                </div>

                <div className="mt-1 h-9 w-16 rounded-[1rem] border border-cyan-300/20 bg-gradient-to-b from-zinc-300 to-zinc-800 shadow-lg sm:w-[72px]" />

                <div className="mt-1 h-7 w-20 rounded-[1rem] border border-cyan-300/20 bg-gradient-to-b from-zinc-500 to-zinc-950 shadow-xl sm:w-24" />
              </div>

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

          {/* Live card */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
            className="absolute right-0 top-6 z-20 rounded-2xl border border-emerald-400/20 bg-zinc-900/90 px-4 py-3 shadow-xl backdrop-blur sm:right-4 sm:top-12"
          >
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />

              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Live
              </span>
            </div>

            <p className="mt-1 text-xs text-zinc-400">Bot Active</p>
          </motion.div>

          {/* AI card */}
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
            }}
            className="absolute bottom-6 left-0 z-20 rounded-2xl border border-cyan-400/20 bg-zinc-900/90 px-4 py-3 shadow-xl backdrop-blur sm:bottom-12 sm:left-4"
          >
            <div className="flex items-center gap-2">
              <BrainCircuit className="h-4 w-4 text-cyan-400" />

              <span className="text-xs text-zinc-400">
                Intelligence
              </span>
            </div>

            <p className="mt-1 text-lg font-bold text-cyan-400">
              Analyzing Markets
            </p>
          </motion.div>
        </div>

        {/* Bottom features */}
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              icon: ChartCandlestick,
              title: "Market Analysis",
              text: "Analyze market activity automatically.",
            },
            {
              icon: Zap,
              title: "Automated Trading",
              text: "Trading cycles handled automatically.",
            },
            {
              icon: ShieldCheck,
              title: "Dashboard Control",
              text: "Monitor your bot and performance.",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-2xl border border-white/5 bg-white/[0.03] p-5 text-center transition duration-300 hover:-translate-y-1 hover:border-yellow-400/20"
              >
                <Icon className="mx-auto h-6 w-6 text-yellow-400" />

                <h3 className="mt-3 font-semibold text-white">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center sm:mt-12">
          <Link
            href="/signup"
            className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-yellow-400 px-8 py-4 text-sm font-bold text-black transition duration-300 hover:-translate-y-1 hover:bg-yellow-300 hover:shadow-[0_15px_40px_rgba(250,204,21,0.18)]"
          >
            Explore AI Trading
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}