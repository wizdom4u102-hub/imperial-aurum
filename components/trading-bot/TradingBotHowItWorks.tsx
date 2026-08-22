"use client";

import { motion } from "framer-motion";
import {
  Activity,
  ArrowDown,
  Bot,
  CheckCircle2,
  CircleDollarSign,
  Cpu,
  LineChart,
  Settings2,
  Wallet,
  Zap,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Wallet,
    title: "Choose Your Bot Plan",
    description:
      "Select the trading bot plan that matches your preferred trading configuration and investment level.",
    accent: "cyan",
  },
  {
    number: "02",
    icon: Settings2,
    title: "Activate Your Bot",
    description:
      "Complete the required activation process and your selected trading bot becomes available in your account.",
    accent: "yellow",
  },
  {
    number: "03",
    icon: Cpu,
    title: "AI Trading Begins",
    description:
      "The bot begins its configured trading cycle while its activity is handled automatically.",
    accent: "purple",
  },
  {
    number: "04",
    icon: LineChart,
    title: "Monitor Performance",
    description:
      "Track bot activity, trades, statistics and performance directly from your personal dashboard.",
    accent: "emerald",
  },
] as const;

const accentClasses = {
  cyan: {
    number: "text-cyan-400",
    icon: "text-cyan-400",
    border: "border-cyan-400/20",
    glow: "bg-cyan-400/[0.05]",
  },
  yellow: {
    number: "text-yellow-400",
    icon: "text-yellow-400",
    border: "border-yellow-400/20",
    glow: "bg-yellow-400/[0.05]",
  },
  purple: {
    number: "text-purple-400",
    icon: "text-purple-400",
    border: "border-purple-400/20",
    glow: "bg-purple-400/[0.05]",
  },
  emerald: {
    number: "text-emerald-400",
    icon: "text-emerald-400",
    border: "border-emerald-400/20",
    glow: "bg-emerald-400/[0.05]",
  },
} as const;

type Accent = keyof typeof accentClasses;

export default function TradingBotHowItWorks() {
  return (
    <section className="relative overflow-hidden bg-zinc-950 py-20 sm:py-24 lg:py-32">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/[0.035] blur-[130px] sm:h-[700px] sm:w-[700px]" />

        <div className="absolute -left-32 top-1/4 h-72 w-72 rounded-full bg-yellow-500/[0.025] blur-[100px]" />

        <div className="absolute -right-32 bottom-1/4 h-72 w-72 rounded-full bg-blue-500/[0.025] blur-[100px]" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/5 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-yellow-400 sm:text-xs">
            <Bot className="h-4 w-4" />
            How It Works
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl xl:text-6xl">
            From Activation to{" "}
            <span className="text-yellow-400">Automated Trading</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base sm:leading-8">
            Getting started with the Imperial Aurum AI Trading Bot is designed
            to be simple. Choose your plan, activate your bot and monitor its
            activity from your dashboard.
          </p>
        </div>

        {/* Desktop timeline */}
        <div className="relative mt-14 hidden lg:block lg:mt-20">
          {/* Connecting line */}
          <div className="absolute left-[12.5%] right-[12.5%] top-12 h-px bg-gradient-to-r from-cyan-400/10 via-yellow-400/40 to-emerald-400/10" />

          <div className="grid grid-cols-4 gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const accent = accentClasses[step.accent as Accent];

              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                  }}
                  className="group relative text-center"
                >
                  {/* Step number */}
                  <div className="relative z-10 mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-zinc-950 shadow-2xl transition-all duration-300 group-hover:scale-105">
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-full border ${accent.border} ${accent.glow}`}
                    >
                      <Icon className={`h-7 w-7 ${accent.icon}`} />
                    </div>
                  </div>

                  <div className="mt-7">
                    <span
                      className={`text-xs font-bold tracking-[0.25em] ${accent.number}`}
                    >
                      STEP {step.number}
                    </span>

                    <h3 className="mt-3 text-xl font-bold text-white">
                      {step.title}
                    </h3>

                    <p className="mx-auto mt-3 max-w-[250px] text-sm leading-6 text-zinc-500">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mobile / tablet timeline */}
        <div className="relative mt-12 lg:hidden">
          <div className="absolute bottom-8 left-6 top-8 w-px bg-gradient-to-b from-cyan-400/30 via-yellow-400/30 to-emerald-400/30 sm:left-7" />

          <div className="space-y-5 sm:space-y-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const accent = accentClasses[step.accent as Accent];

              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                  }}
                  className="relative flex gap-4 sm:gap-5"
                >
                  {/* Timeline icon */}
                  <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-zinc-950 sm:h-14 sm:w-14">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full border ${accent.border} ${accent.glow} sm:h-10 sm:w-10`}
                    >
                      <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${accent.icon}`} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1 rounded-2xl border border-white/[0.07] bg-black/40 p-5 sm:rounded-3xl sm:p-6">
                    <div className="flex items-center justify-between gap-3">
                      <span
                        className={`text-[10px] font-bold tracking-[0.2em] sm:text-xs ${accent.number}`}
                      >
                        STEP {step.number}
                      </span>

                      <CheckCircle2
                        className={`h-4 w-4 shrink-0 ${accent.icon}`}
                      />
                    </div>

                    <h3 className="mt-3 text-lg font-bold text-white sm:text-xl">
                      {step.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-zinc-500 sm:leading-7">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom information panel */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mt-10 overflow-hidden rounded-3xl border border-yellow-400/10 bg-black/50 p-5 sm:mt-14 sm:p-7 lg:mt-16 lg:p-9"
        >
          <div className="pointer-events-none absolute right-0 top-0 h-52 w-52 rounded-full bg-yellow-400/[0.035] blur-[90px]" />

          <div className="relative grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-yellow-400/20 bg-yellow-400/5">
                  <Zap className="h-5 w-5 text-yellow-400" />
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-yellow-400">
                    Automated Process
                  </p>

                  <h3 className="mt-1 text-xl font-bold text-white sm:text-2xl">
                    Your Bot Works While You Monitor
                  </h3>
                </div>
              </div>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-500 sm:text-base sm:leading-8">
                Once your bot is activated, you can follow its trading
                activity and performance from your dashboard without needing
                to manually manage every trading cycle.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:min-w-[330px]">
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-center">
                <Bot className="mx-auto h-5 w-5 text-cyan-400" />

                <p className="mt-2 text-[9px] font-semibold uppercase tracking-wider text-zinc-600">
                  Automated
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-center">
                <Activity className="mx-auto h-5 w-5 text-emerald-400" />

                <p className="mt-2 text-[9px] font-semibold uppercase tracking-wider text-zinc-600">
                  Live
                </p>
              </div>

              <div className="col-span-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-center sm:col-span-1">
                <CircleDollarSign className="mx-auto h-5 w-5 text-yellow-400" />

                <p className="mt-2 text-[9px] font-semibold uppercase tracking-wider text-zinc-600">
                  Performance
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Down indicator */}
        <div className="mt-8 flex justify-center sm:mt-10">
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.02]"
          >
            <ArrowDown className="h-4 w-4 text-zinc-600" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}