"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Check,
  Crown,
  Gem,
  Rocket,
  Sparkles,
  Star,
} from "lucide-react";

const plans = [
  {
    name: "Bronze Trader",
    badge: "Starter",
    description:
      "A beginner-friendly trading plan for new investors.",
    icon: Rocket,
    accent: "orange",
    featured: false,
    dailyRoi: "1%",
    monthlyRoi: "30%",
    duration: "15 Days",
    minimum: "$10",
    features: [
      "Automated trading cycles",
      "Live bot monitoring",
      "Performance tracking",
      "Trading history",
    ],
  },
  {
    name: "Silver Trader",
    badge: "Popular",
    description:
      "Entry level trading bot",
    icon: Star,
    accent: "cyan",
    featured: true,
    dailyRoi: "2%",
    monthlyRoi: "60%",
    duration: "20 Days",
    minimum: "$100",
    features: [
      "Automated trading cycles",
      "Live market monitoring",
      "Performance analytics",
      "Trading history",
    ],
  },
  {
    name: "Gold Trader",
    badge: "Popular",
    description:
      "Professional trading strategy",
    icon: Crown,
    accent: "yellow",
    featured: true,
    dailyRoi: "3%",
    monthlyRoi: "90%",
    duration: "25 Days",
    minimum: "$1,000",
    features: [
      "Advanced trading cycles",
      "Live market monitoring",
      "Performance analytics",
      "Trading history",
      "Priority bot configuration",
    ],
  },
  {
    name: "Platinum Trader",
    badge: "Elite",
    description:
      "High performance diversified trading",
    icon: Gem,
    accent: "blue",
    featured: false,
    dailyRoi: "4%",
    monthlyRoi: "120%",
    duration: "30 Days",
    minimum: "$5,000",
    features: [
      "Enhanced trading cycles",
      "Advanced market monitoring",
      "Detailed performance tracking",
      "Trading history",
      "Expanded bot configuration",
    ],
  },
  {
    name: "Diamond Trader",
    badge: "VIP",
    description:
      "Premium institutional strategy",
    icon: Gem,
    accent: "purple",
    featured: false,
    dailyRoi: "5%",
    monthlyRoi: "150%",
    duration: "30 Days",
    minimum: "$20,000",
    features: [
      "Premium automated trading cycles",
      "Advanced market monitoring",
      "Detailed performance analytics",
      "Trading history",
      "Premium bot configuration",
    ],
  },
] as const;

const accentStyles = {
  orange: {
    border: "border-orange-400/20",
    icon: "text-orange-400",
    iconBg: "bg-orange-400/5",
    glow: "bg-orange-400/[0.03]",
    check: "text-orange-400",
    button:
      "border-orange-400/20 hover:border-orange-400/40 hover:bg-orange-400/5",
  },
  cyan: {
    border: "border-cyan-400/20",
    icon: "text-cyan-400",
    iconBg: "bg-cyan-400/5",
    glow: "bg-cyan-400/[0.03]",
    check: "text-cyan-400",
    button:
      "border-cyan-400/20 hover:border-cyan-400/40 hover:bg-cyan-400/5",
  },
  yellow: {
    border: "border-yellow-400/30",
    icon: "text-yellow-400",
    iconBg: "bg-yellow-400/5",
    glow: "bg-yellow-400/[0.04]",
    check: "text-yellow-400",
    button:
      "bg-yellow-400 text-black hover:bg-yellow-300 hover:shadow-[0_15px_40px_rgba(250,204,21,0.15)]",
  },
  blue: {
    border: "border-blue-400/20",
    icon: "text-blue-400",
    iconBg: "bg-blue-400/5",
    glow: "bg-blue-400/[0.03]",
    check: "text-blue-400",
    button:
      "border-blue-400/20 hover:border-blue-400/40 hover:bg-blue-400/5",
  },
  purple: {
    border: "border-purple-400/20",
    icon: "text-purple-400",
    iconBg: "bg-purple-400/5",
    glow: "bg-purple-400/[0.03]",
    check: "text-purple-400",
    button:
      "border-purple-400/20 hover:border-purple-400/40 hover:bg-purple-400/5",
  },
} as const;

type Accent = keyof typeof accentStyles;

export default function TradingBotPlans() {
  return (
    <section className="relative overflow-hidden bg-black py-24 sm:py-28 lg:py-32">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-cyan-500/[0.025] blur-[140px]" />

        <div className="absolute left-[5%] top-[20%] h-72 w-72 rounded-full bg-yellow-500/[0.025] blur-[120px]" />

        <div className="absolute bottom-[10%] right-[5%] h-72 w-72 rounded-full bg-emerald-500/[0.025] blur-[120px]" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-14 max-w-3xl text-center sm:mb-16 lg:mb-20">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-yellow-400">
            <Sparkles className="h-4 w-4" />
            Trading Bot Marketplace
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl xl:text-6xl">
            Choose Your{" "}
            <span className="text-yellow-400">
              AI Trading Bot
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base sm:leading-8">
            Explore our available trading bot configurations and choose the
            plan that fits your trading goals. Every bot is designed to run
            automated trading cycles while you monitor its activity from your
            dashboard.
          </p>
        </div>

        {/* Plans */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const styles = accentStyles[plan.accent as Accent];

            return (
              <motion.div
                key={plan.name}
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.15,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                }}
                className={`group relative flex h-full flex-col overflow-hidden rounded-[2rem] border bg-zinc-950/90 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 sm:p-7 lg:p-8 ${
                  styles.border
                } ${
                  plan.featured
                    ? "shadow-[0_0_60px_rgba(250,204,21,0.06)]"
                    : ""
                }`}
              >
                {/* Card glow */}
                <div
                  className={`pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full blur-[80px] ${styles.glow}`}
                />

                {/* Badge */}
                <div
                  className={`absolute right-5 top-5 rounded-full border px-3 py-1 text-[9px] font-bold uppercase tracking-[0.18em] ${
                    plan.featured
                      ? "border-yellow-400/20 bg-yellow-400/10 text-yellow-400"
                      : `${styles.border} ${styles.icon}`
                  }`}
                >
                  {plan.badge}
                </div>

                {/* Icon */}
                <div
                  className={`relative flex h-14 w-14 items-center justify-center rounded-2xl border ${styles.border} ${styles.iconBg}`}
                >
                  <Icon
                    className={`h-7 w-7 ${styles.icon}`}
                  />
                </div>

                {/* Name */}
                <div className="relative mt-6">
                  <p
                    className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${styles.icon}`}
                  >
                    AI Trading
                  </p>

                  <h3 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                    {plan.name}
                  </h3>

                  <p className="mt-3 min-h-[48px] text-sm leading-7 text-zinc-500">
                    {plan.description}
                  </p>
                </div>

                {/* ROI */}
                <div className="relative mt-7 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-4">
                    <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-600">
                      Daily ROI
                    </p>

                    <p
                      className={`mt-2 text-xl font-bold ${styles.icon}`}
                    >
                      {plan.dailyRoi}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-4">
                    <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-600">
                      Monthly ROI
                    </p>

                    <p
                      className={`mt-2 text-xl font-bold ${styles.icon}`}
                    >
                      {plan.monthlyRoi}
                    </p>
                  </div>
                </div>

                {/* Duration / Minimum */}
                <div className="relative mt-3 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-4">
                    <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-600">
                      Duration
                    </p>

                    <p className="mt-2 text-sm font-bold text-white">
                      {plan.duration}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-4">
                    <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-600">
                      Minimum
                    </p>

                    <p className="mt-2 text-sm font-bold text-white">
                      {plan.minimum}
                    </p>
                  </div>
                </div>

                {/* Bot status */}
                <div className="relative mt-5 flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.025] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Bot
                      className={`h-4 w-4 ${styles.icon}`}
                    />

                    <span className="text-xs font-medium text-zinc-300">
                      AI Bot
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

                    <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                      Active
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="relative mt-7 flex-1">
                  <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-600">
                    Included
                  </p>

                  <div className="space-y-3">
                    {plan.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-start gap-3 text-sm text-zinc-400"
                      >
                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/[0.04]">
                          <Check
                            className={`h-3 w-3 ${styles.check}`}
                          />
                        </div>

                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="relative mt-8">
                  <Link
                    href="/signup"
                    className={`group/button flex w-full items-center justify-center gap-2 rounded-2xl border px-5 py-3.5 text-sm font-bold transition duration-300 ${
                      plan.featured
                        ? styles.button
                        : `text-white ${styles.button}`
                    }`}
                  >
                    Explore Plan

                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/button:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Marketplace CTA */}
        <div className="mt-10 rounded-[2rem] border border-white/5 bg-white/[0.02] p-6 text-center sm:p-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-yellow-400/20 bg-yellow-400/5">
            <Bot className="h-6 w-6 text-yellow-400" />
          </div>

          <h3 className="mt-5 text-xl font-bold text-white sm:text-2xl">
            Find the Right Bot for Your Strategy
          </h3>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-zinc-500">
            Visit the Trading Bot Marketplace to view available plans,
            compare configurations and activate the bot that matches
            your goals.
          </p>

          <Link
            href="/dashboard/trading-bot"
            className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-6 py-3.5 text-sm font-bold text-black transition duration-300 hover:bg-yellow-300 sm:w-auto"
          >
            Visit Bot Marketplace

            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}