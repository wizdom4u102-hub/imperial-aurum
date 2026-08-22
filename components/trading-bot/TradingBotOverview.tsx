"use client";

import { motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  Bot,
  BrainCircuit,
  ChartCandlestick,
  CheckCircle2,
  Cpu,
  Gauge,
  Globe2,
  LineChart,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";

const colorStyles = {
  cyan: {
    border: "hover:border-cyan-400/30",
    icon: "text-cyan-400",
    bg: "hover:bg-cyan-400/[0.03]",
    glow: "bg-cyan-400/[0.05]",
  },
  yellow: {
    border: "hover:border-yellow-400/30",
    icon: "text-yellow-400",
    bg: "hover:bg-yellow-400/[0.03]",
    glow: "bg-yellow-400/[0.05]",
  },
  emerald: {
    border: "hover:border-emerald-400/30",
    icon: "text-emerald-400",
    bg: "hover:bg-emerald-400/[0.03]",
    glow: "bg-emerald-400/[0.05]",
  },
  blue: {
    border: "hover:border-blue-400/30",
    icon: "text-blue-400",
    bg: "hover:bg-blue-400/[0.03]",
    glow: "bg-blue-400/[0.05]",
  },
} as const;

type ColorKey = keyof typeof colorStyles;

const features: {
  icon: typeof ChartCandlestick;
  title: string;
  description: string;
  color: ColorKey;
}[] = [
  {
    icon: ChartCandlestick,
    title: "Market Analysis",
    description:
      "The bot analyzes market activity and evaluates trading conditions using its configured trading strategy.",
    color: "cyan",
  },
  {
    icon: Zap,
    title: "Automated Trading",
    description:
      "Once activated, the trading bot manages its trading cycle automatically according to its configuration.",
    color: "yellow",
  },
  {
    icon: BarChart3,
    title: "Performance Tracking",
    description:
      "Track bot activity, trades, profit performance and other available statistics directly from your dashboard.",
    color: "emerald",
  },
  {
    icon: Activity,
    title: "Live Monitoring",
    description:
      "Monitor the current status and activity of your trading bot while it operates.",
    color: "blue",
  },
];

const capabilities = [
  {
    icon: BrainCircuit,
    title: "Intelligent Strategy",
    description:
      "Designed around automated trading logic that can operate without requiring constant manual intervention.",
  },
  {
    icon: Gauge,
    title: "Trading Cycles",
    description:
      "The bot works through its configured trading lifecycle while keeping activity visible from your dashboard.",
  },
  {
    icon: LineChart,
    title: "Performance Visibility",
    description:
      "View trading activity and performance information so you can follow how your bot is operating.",
  },
  {
    icon: ShieldCheck,
    title: "Controlled Configuration",
    description:
      "Bot activity follows the configuration and plan selected when the trading bot is activated.",
  },
];

export default function TradingBotOverview() {
  return (
    <section className="relative overflow-hidden bg-black py-20 sm:py-24 lg:py-32">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-500/[0.04] blur-[130px]" />

        <div className="absolute -left-32 top-1/3 h-80 w-80 rounded-full bg-yellow-500/[0.035] blur-[110px]" />

        <div className="absolute -right-32 bottom-1/4 h-80 w-80 rounded-full bg-blue-500/[0.035] blur-[110px]" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-400 sm:text-xs">
            <Bot className="h-4 w-4" />
            AI Trading System
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Built for{" "}
            <span className="text-yellow-400">
              Automated Trading
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base sm:leading-8">
            Imperial Aurum&apos;s AI Trading Bot combines automated trading
            technology with real-time monitoring, allowing users to activate a
            bot and follow its activity from one powerful dashboard.
          </p>
        </div>

        {/* Main overview */}
        <div className="mt-14 grid items-stretch gap-6 lg:mt-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
          {/* Left visual panel */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950/90 p-4 shadow-2xl sm:p-6 lg:p-8"
          >
            {/* Panel glow */}
            <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-cyan-400/[0.06] blur-[100px]" />

            {/* Header */}
            <div className="relative flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/5">
                  <Cpu className="h-5 w-5 text-cyan-400" />
                </div>

                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    Trading Engine
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-white sm:text-xl">
                    Imperial AI Bot
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

                <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 sm:text-[10px]">
                  Live System
                </span>
              </div>
            </div>

            {/* Digital screen */}
            <div className="relative mt-6 overflow-hidden rounded-3xl border border-cyan-400/10 bg-[#061014] p-4 sm:p-6">
              {/* Digital grid */}
              <div
                className="pointer-events-none absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(34,211,238,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.07) 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                }}
              />

              <div className="relative">
                {/* Screen title */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-600">
                      Artificial Intelligence
                    </p>

                    <p className="mt-1 text-sm font-bold text-white sm:text-base">
                      Market Intelligence Engine
                    </p>
                  </div>

                  <Globe2 className="h-5 w-5 text-cyan-400" />
                </div>

                {/* Signal cards */}
                <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
                  <div className="rounded-xl border border-white/5 bg-black/50 p-3">
                    <p className="text-[8px] uppercase tracking-wider text-zinc-600">
                      Engine
                    </p>

                    <p className="mt-1 text-xs font-bold text-cyan-400">
                      Online
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-black/50 p-3">
                    <p className="text-[8px] uppercase tracking-wider text-zinc-600">
                      Signals
                    </p>

                    <p className="mt-1 text-xs font-bold text-emerald-400">
                      Active
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-black/50 p-3">
                    <p className="text-[8px] uppercase tracking-wider text-zinc-600">
                      Status
                    </p>

                    <p className="mt-1 text-xs font-bold text-yellow-400">
                      Live
                    </p>
                  </div>
                </div>

                {/* Animated analysis bars */}
                <div className="mt-5 rounded-2xl border border-white/5 bg-black/40 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                      AI Analysis
                    </span>

                    <Activity className="h-4 w-4 text-cyan-400" />
                  </div>

                  <div className="space-y-3">
                    {[72, 88, 64, 94, 78].map((width, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3"
                      >
                        <span className="w-8 text-[8px] text-zinc-600">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-800">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${width}%` }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 1,
                              delay: index * 0.12,
                            }}
                            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-300"
                          />
                        </div>

                        <span className="w-9 text-right text-[8px] text-zinc-600">
                          AI
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div className="mt-4 flex items-center justify-between rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.03] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />

                    <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-emerald-400 sm:text-[10px]">
                      System Monitoring
                    </span>
                  </div>

                  <span className="text-[9px] text-zinc-600">
                    Continuous
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom stats */}
            <div className="relative mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                {
                  icon: Target,
                  label: "Strategy",
                  value: "Active",
                },
                {
                  icon: Activity,
                  label: "Monitoring",
                  value: "Live",
                },
                {
                  icon: Zap,
                  label: "Execution",
                  value: "Auto",
                },
                {
                  icon: ShieldCheck,
                  label: "Control",
                  value: "Managed",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/5 bg-white/[0.02] p-3"
                  >
                    <Icon className="h-4 w-4 text-cyan-400" />

                    <p className="mt-2 text-[8px] uppercase tracking-wider text-zinc-600">
                      {item.label}
                    </p>

                    <p className="mt-1 text-xs font-bold text-white">
                      {item.value}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Right information */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col justify-center"
          >
            <div className="mb-7 flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-yellow-400/20 bg-yellow-400/5">
                <BrainCircuit className="h-6 w-6 text-yellow-400" />
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-yellow-400 sm:text-xs">
                  Automated Intelligence
                </p>

                <h3 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
                  Smarter Trading.
                  <br />
                  Less Manual Work.
                </h3>
              </div>
            </div>

            <p className="text-sm leading-7 text-zinc-400 sm:text-base sm:leading-8">
              The Imperial Aurum AI Trading Bot is designed to automate the
              trading process while giving users a clear view of their bot
              activity and performance.
            </p>

            <p className="mt-4 text-sm leading-7 text-zinc-500 sm:text-base sm:leading-8">
              Activate a trading bot through the available plans, then monitor
              its trading lifecycle, activity and performance directly from
              your dashboard.
            </p>

            {/* Features */}
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {features.map((feature) => {
                const Icon = feature.icon;
                const styles = colorStyles[feature.color];

                return (
                  <div
                    key={feature.title}
                    className={`group rounded-2xl border border-white/5 bg-white/[0.025] p-4 transition duration-300 hover:-translate-y-1 ${styles.border} ${styles.bg}`}
                  >
                    <Icon
                      className={`h-5 w-5 ${styles.icon}`}
                    />

                    <h4 className="mt-3 text-sm font-semibold text-white">
                      {feature.title}
                    </h4>

                    <p className="mt-2 text-xs leading-6 text-zinc-500">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Capabilities */}
        <div className="mt-16 sm:mt-20 lg:mt-24">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-400 sm:text-xs">
              Bot Capabilities
            </p>

            <h3 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
              Technology Built Around Your Trading
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((capability, index) => {
              const Icon = capability.icon;

              return (
                <motion.div
                  key={capability.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                  }}
                  className="group relative overflow-hidden rounded-2xl border border-white/5 bg-zinc-950 p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/20"
                >
                  <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-cyan-400/[0.03] blur-2xl transition group-hover:bg-cyan-400/[0.07]" />

                  <div className="relative">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/5">
                      <Icon className="h-5 w-5 text-cyan-400" />
                    </div>

                    <h4 className="mt-5 font-semibold text-white">
                      {capability.title}
                    </h4>

                    <p className="mt-2 text-sm leading-6 text-zinc-500">
                      {capability.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom statement */}
        <div className="mt-14 rounded-3xl border border-yellow-400/10 bg-gradient-to-r from-yellow-400/[0.04] via-transparent to-cyan-400/[0.04] p-6 text-center sm:mt-16 sm:p-8">
          <div className="mx-auto flex max-w-3xl flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-yellow-400/20 bg-yellow-400/5">
              <Sparkles className="h-5 w-5 text-yellow-400" />
            </div>

            <h3 className="mt-5 text-xl font-bold text-white sm:text-2xl">
              Your Trading. Powered by Intelligence.
            </h3>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-500">
              Explore the available trading bot plans and choose the
              configuration that fits your trading goals.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}