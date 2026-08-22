"use client";

import { motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  Gauge,
  LineChart,
  ShieldCheck,
  Target,
  Zap,
} from "lucide-react";

const benefits = [
  {
    icon: BrainCircuit,
    title: "AI-Powered Intelligence",
    description:
      "Designed to analyze trading conditions using automated intelligence and configured trading strategies.",
    color: "cyan",
  },
  {
    icon: Zap,
    title: "Automated Execution",
    description:
      "The bot handles its configured trading cycle automatically, reducing the need for constant manual monitoring.",
    color: "yellow",
  },
  {
    icon: Activity,
    title: "Live Bot Activity",
    description:
      "Follow your bot's current status and trading activity through the platform dashboard.",
    color: "emerald",
  },
  {
    icon: BarChart3,
    title: "Performance Tracking",
    description:
      "Keep track of trading activity and available performance statistics from one centralized dashboard.",
    color: "blue",
  },
  {
    icon: Clock3,
    title: "Continuous Operation",
    description:
      "Once activated, the bot can continue through its configured trading lifecycle without requiring constant manual action.",
    color: "violet",
  },
  {
    icon: ShieldCheck,
    title: "Controlled Trading",
    description:
      "Bot activity follows the selected plan and configuration, giving you a structured automated trading experience.",
    color: "rose",
  },
] as const;

type BenefitColor = (typeof benefits)[number]["color"];

const colorStyles: Record<
  BenefitColor,
  {
    border: string;
    icon: string;
    bg: string;
    glow: string;
  }
> = {
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
  violet: {
    border: "hover:border-violet-400/30",
    icon: "text-violet-400",
    bg: "hover:bg-violet-400/[0.03]",
    glow: "bg-violet-400/[0.05]",
  },
  rose: {
    border: "hover:border-rose-400/30",
    icon: "text-rose-400",
    bg: "hover:bg-rose-400/[0.03]",
    glow: "bg-rose-400/[0.05]",
  },
};

const workflow = [
  {
    number: "01",
    icon: Target,
    title: "Choose Your Bot",
    description:
      "Select a trading bot plan that matches your preferred configuration.",
  },
  {
    number: "02",
    icon: Gauge,
    title: "Activate",
    description:
      "Activate the selected trading bot through the available platform flow.",
  },
  {
    number: "03",
    icon: LineChart,
    title: "Bot Trades",
    description:
      "Your activated bot operates through its configured trading lifecycle.",
  },
  {
    number: "04",
    icon: Activity,
    title: "Monitor",
    description:
      "Follow bot activity and available performance information from your dashboard.",
  },
];

export default function TradingBotBenefits() {
  return (
    <section className="relative overflow-hidden bg-zinc-950 py-20 sm:py-24 lg:py-32">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-500/[0.035] blur-[130px]" />

        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-yellow-500/[0.03] blur-[120px]" />

        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-blue-500/[0.025] blur-[120px]" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/5 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-yellow-400 sm:text-xs">
            <BrainCircuit className="h-4 w-4" />
            Why Use Our AI Bot
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            The Benefits of{" "}
            <span className="text-yellow-400">
              Automated Trading
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base sm:leading-8">
            The Imperial Aurum AI Trading Bot is designed to simplify the
            trading process while giving you visibility and control through
            your dashboard.
          </p>
        </div>

        {/* Benefits */}
        <div className="mt-14 grid grid-cols-1 gap-4 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            const styles = colorStyles[benefit.color];

            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.07,
                }}
                className={`group relative overflow-hidden rounded-3xl border border-white/5 bg-black/40 p-5 transition duration-300 hover:-translate-y-1 sm:p-6 ${styles.border} ${styles.bg}`}
              >
                {/* Glow */}
                <div
                  className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full blur-3xl transition duration-500 group-hover:scale-150 ${styles.glow}`}
                />

                <div className="relative">
                  {/* Icon */}
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                      <Icon className={`h-5 w-5 ${styles.icon}`} />
                    </div>

                    <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-700">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="mt-6 text-lg font-bold text-white">
                    {benefit.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-zinc-500">
                    {benefit.description}
                  </p>

                  <div className="mt-5 flex items-center gap-2">
                    <CheckCircle2
                      className={`h-4 w-4 ${styles.icon}`}
                    />

                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
                      Built Into The System
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* How it works */}
        <div className="mt-20 sm:mt-24 lg:mt-28">
          <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-400 sm:text-xs">
              How It Works
            </p>

            <h3 className="mt-3 text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
              From Activation to Monitoring
            </h3>

            <p className="mt-4 text-sm leading-7 text-zinc-500 sm:text-base">
              A simple flow designed to make automated trading easy to
              understand and monitor.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {workflow.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                  }}
                  className="relative rounded-3xl border border-white/5 bg-black/50 p-5 sm:p-6"
                >
                  {/* Connector */}
                  {index < workflow.length - 1 && (
                    <div className="pointer-events-none absolute right-[-16px] top-1/2 z-20 hidden h-px w-8 bg-gradient-to-r from-cyan-400/20 to-transparent lg:block" />
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/5">
                      <Icon className="h-5 w-5 text-cyan-400" />
                    </div>

                    <span className="text-xs font-bold tracking-[0.2em] text-zinc-700">
                      {item.number}
                    </span>
                  </div>

                  <h4 className="mt-5 font-bold text-white">
                    {item.title}
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-zinc-500">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mt-14 overflow-hidden rounded-[2rem] border border-cyan-400/10 bg-gradient-to-r from-cyan-400/[0.04] via-transparent to-yellow-400/[0.04] p-6 sm:mt-16 sm:p-8 lg:p-10"
        >
          <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-80 -translate-x-1/2 rounded-full bg-cyan-400/[0.04] blur-[80px]" />

          <div className="relative flex flex-col items-center gap-5 text-center lg:flex-row lg:justify-between lg:text-left">
            <div>
              <div className="flex items-center justify-center gap-2 lg:justify-start">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />

                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 sm:text-xs">
                  Automated Trading Technology
                </span>
              </div>

              <h3 className="mt-3 text-xl font-bold text-white sm:text-2xl">
                Let the system handle the trading cycle.
              </h3>

              <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-500">
                Activate your preferred bot configuration and monitor its
                activity through your Imperial Aurum dashboard.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2 rounded-2xl border border-yellow-400/15 bg-yellow-400/5 px-5 py-4">
              <Zap className="h-5 w-5 text-yellow-400" />

              <div className="text-left">
                <p className="text-[9px] uppercase tracking-[0.18em] text-zinc-600">
                  Trading Mode
                </p>

                <p className="mt-1 text-sm font-bold text-yellow-400">
                  Automated
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}