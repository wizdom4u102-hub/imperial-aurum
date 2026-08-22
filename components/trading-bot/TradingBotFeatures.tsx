"use client";

import { motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  Bot,
  BrainCircuit,
  ChartCandlestick,
  Cpu,
  ShieldCheck,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: BrainCircuit,
    title: "AI Market Intelligence",
    description:
      "The trading system analyzes market activity and evaluates trading conditions using automated intelligence.",
    accent: "cyan",
  },
  {
    icon: Zap,
    title: "Automated Trading",
    description:
      "Once activated, the bot manages its trading cycle automatically according to its configured strategy.",
    accent: "yellow",
  },
  {
    icon: BarChart3,
    title: "Performance Tracking",
    description:
      "Monitor trades, activity, profit performance and other important bot statistics directly from your dashboard.",
    accent: "emerald",
  },
  {
    icon: Activity,
    title: "Live Monitoring",
    description:
      "Stay informed with live bot status and trading activity while your trading bot operates.",
    accent: "blue",
  },
  {
    icon: ChartCandlestick,
    title: "Trading Analysis",
    description:
      "Market information and trading activity are continuously evaluated to support the bot's trading decisions.",
    accent: "purple",
  },
  {
    icon: ShieldCheck,
    title: "Controlled Operation",
    description:
      "Your activated trading bot operates within the selected configuration and plan parameters.",
    accent: "orange",
  },
] as const;

const accentClasses = {
  cyan: {
    border: "hover:border-cyan-400/30",
    icon: "text-cyan-400",
    bg: "hover:bg-cyan-400/[0.03]",
    glow: "bg-cyan-400/[0.04]",
  },
  yellow: {
    border: "hover:border-yellow-400/30",
    icon: "text-yellow-400",
    bg: "hover:bg-yellow-400/[0.03]",
    glow: "bg-yellow-400/[0.04]",
  },
  emerald: {
    border: "hover:border-emerald-400/30",
    icon: "text-emerald-400",
    bg: "hover:bg-emerald-400/[0.03]",
    glow: "bg-emerald-400/[0.04]",
  },
  blue: {
    border: "hover:border-blue-400/30",
    icon: "text-blue-400",
    bg: "hover:bg-blue-400/[0.03]",
    glow: "bg-blue-400/[0.04]",
  },
  purple: {
    border: "hover:border-purple-400/30",
    icon: "text-purple-400",
    bg: "hover:bg-purple-400/[0.03]",
    glow: "bg-purple-400/[0.04]",
  },
  orange: {
    border: "hover:border-orange-400/30",
    icon: "text-orange-400",
    bg: "hover:bg-orange-400/[0.03]",
    glow: "bg-orange-400/[0.04]",
  },
} as const;

type Accent = keyof typeof accentClasses;

export default function TradingBotFeatures() {
  return (
    <section className="relative overflow-hidden bg-black py-20 sm:py-24 lg:py-32">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/[0.035] blur-[130px] sm:h-[650px] sm:w-[650px]" />

        <div className="absolute -left-32 top-20 h-64 w-64 rounded-full bg-yellow-500/[0.025] blur-[100px] sm:h-80 sm:w-80" />

        <div className="absolute -right-32 bottom-10 h-64 w-64 rounded-full bg-blue-500/[0.025] blur-[100px] sm:h-80 sm:w-80" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400 sm:text-xs">
            <Bot className="h-4 w-4" />
            Intelligent Trading System
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl xl:text-6xl">
            Built for{" "}
            <span className="text-yellow-400">Smarter Trading</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base sm:leading-8">
            Explore the technology and features behind the Imperial Aurum AI
            Trading Bot.
          </p>
        </div>

        {/* Feature grid */}
        <div className="mt-12 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5 lg:mt-16 lg:grid-cols-3 lg:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const accent = accentClasses[feature.accent as Accent];

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.06,
                }}
                className={`group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-zinc-950/80 p-5 transition-all duration-300 hover:-translate-y-1 sm:rounded-3xl sm:p-6 lg:p-7 ${accent.border} ${accent.bg}`}
              >
                {/* Card glow */}
                <div
                  className={`pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100 ${accent.glow}`}
                />

                {/* Icon */}
                <div className="relative flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.03] sm:h-14 sm:w-14">
                    <Icon
                      className={`h-6 w-6 transition-transform duration-300 group-hover:scale-110 sm:h-7 sm:w-7 ${accent.icon}`}
                    />
                  </div>

                  <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-700">
                    AI
                  </span>
                </div>

                {/* Content */}
                <div className="relative mt-6">
                  <h3 className="text-lg font-bold text-white sm:text-xl">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-zinc-500 sm:leading-7">
                    {feature.description}
                  </p>
                </div>

                {/* Bottom indicator */}
                <div className="relative mt-6 flex items-center gap-2">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${accent.icon.replace(
                      "text-",
                      "bg-",
                    )}`}
                  />

                  <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
                    System Feature
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Technology panel */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mt-5 overflow-hidden rounded-3xl border border-cyan-400/10 bg-zinc-950/80 p-5 sm:mt-6 sm:p-7 lg:p-9"
        >
          <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-cyan-400/[0.04] blur-[80px]" />

          <div className="relative grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-10">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/5">
                  <Cpu className="h-5 w-5 text-cyan-400" />
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                    Trading Intelligence
                  </p>

                  <h3 className="mt-1 text-xl font-bold text-white sm:text-2xl">
                    Everything in One Trading System
                  </h3>
                </div>
              </div>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-500 sm:text-base sm:leading-8">
                From market analysis and automated execution to live
                monitoring and performance tracking, the trading bot is
                designed to give you a complete view of your automated
                trading activity.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-4 text-center sm:min-w-[105px] sm:px-4">
                <p className="text-lg font-bold text-cyan-400 sm:text-xl">
                  AI
                </p>

                <p className="mt-1 text-[8px] uppercase tracking-wider text-zinc-600 sm:text-[9px]">
                  Intelligence
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-4 text-center sm:min-w-[105px] sm:px-4">
                <p className="text-lg font-bold text-yellow-400 sm:text-xl">
                  LIVE
                </p>

                <p className="mt-1 text-[8px] uppercase tracking-wider text-zinc-600 sm:text-[9px]">
                  Monitoring
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-4 text-center sm:min-w-[105px] sm:px-4">
                <p className="text-lg font-bold text-emerald-400 sm:text-xl">
                  24/7
                </p>

                <p className="mt-1 text-[8px] uppercase tracking-wider text-zinc-600 sm:text-[9px]">
                  Operation
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}