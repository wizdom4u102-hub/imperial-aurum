"use client";

import {
  Check,
  X,
  Bot,
  Zap,
  ShieldCheck,
  BarChart3,
  Cpu,
} from "lucide-react";

const rows = [
  {
    feature: "Automated Trading",
    starter: true,
    advanced: true,
    professional: true,
  },
  {
    feature: "AI Market Analysis",
    starter: true,
    advanced: true,
    professional: true,
  },
  {
    feature: "Trading Cycle Automation",
    starter: true,
    advanced: true,
    professional: true,
  },
  {
    feature: "Live Performance Tracking",
    starter: true,
    advanced: true,
    professional: true,
  },
  {
    feature: "Profit Compounding",
    starter: false,
    advanced: true,
    professional: true,
  },
  {
    feature: "Advanced Trading Strategies",
    starter: false,
    advanced: true,
    professional: true,
  },
  {
    feature: "Priority Trading Configuration",
    starter: false,
    advanced: false,
    professional: true,
  },
  {
    feature: "Higher Investment Capacity",
    starter: false,
    advanced: true,
    professional: true,
  },
];

const plans = [
  {
    name: "Starter Bot",
    description: "A simple entry point into automated trading.",
    icon: Bot,
    accent: "cyan",
  },
  {
    name: "Advanced Bot",
    description: "More features for users seeking greater flexibility.",
    icon: Zap,
    accent: "yellow",
  },
  {
    name: "Professional Bot",
    description: "Our most advanced automated trading experience.",
    icon: Cpu,
    accent: "emerald",
  },
] as const;

type Accent = (typeof plans)[number]["accent"];

const accentStyles: Record<
  Accent,
  {
    border: string;
    icon: string;
    badge: string;
  }
> = {
  cyan: {
    border: "border-cyan-400/20",
    icon: "text-cyan-400",
    badge: "bg-cyan-400/10 text-cyan-400",
  },
  yellow: {
    border: "border-yellow-400/20",
    icon: "text-yellow-400",
    badge: "bg-yellow-400/10 text-yellow-400",
  },
  emerald: {
    border: "border-emerald-400/20",
    icon: "text-emerald-400",
    badge: "bg-emerald-400/10 text-emerald-400",
  },
};

function FeatureValue({
  enabled,
}: {
  enabled: boolean;
}) {
  return enabled ? (
    <div className="flex items-center justify-center">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400/10">
        <Check className="h-4 w-4 text-emerald-400" />
      </span>
    </div>
  ) : (
    <div className="flex items-center justify-center">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.03]">
        <X className="h-4 w-4 text-zinc-600" />
      </span>
    </div>
  );
}

export default function TradingBotComparison() {
  return (
    <section className="relative overflow-hidden bg-black py-24 sm:py-28 lg:py-32">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-cyan-500/[0.03] blur-[140px]" />
        <div className="absolute right-0 top-1/2 h-80 w-80 rounded-full bg-yellow-500/[0.03] blur-[120px]" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-14 max-w-3xl text-center sm:mb-16 lg:mb-20">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
            <BarChart3 className="h-4 w-4" />
            Compare Trading Bots
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl xl:text-6xl">
            Choose Your{" "}
            <span className="text-yellow-400">Trading Power</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base sm:leading-8">
            Compare our automated trading options and choose the bot
            configuration that best fits your trading goals.
          </p>
        </div>

        {/* Desktop / Tablet comparison */}
        <div className="hidden overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.02] shadow-2xl md:block">
          {/* Plan headers */}
          <div className="grid grid-cols-[1.35fr_repeat(3,1fr)] border-b border-white/10">
            <div className="flex items-center p-5 lg:p-7">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Features
                </p>

                <p className="mt-2 text-sm text-zinc-400">
                  Compare bot capabilities
                </p>
              </div>
            </div>

            {plans.map((plan) => {
              const Icon = plan.icon;
              const style = accentStyles[plan.accent];

              return (
                <div
                  key={plan.name}
                  className={`border-l ${style.border} p-5 text-center lg:p-7`}
                >
                  <div className="flex justify-center">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.04] ${style.icon}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <h3 className="mt-4 text-base font-bold text-white lg:text-lg">
                    {plan.name}
                  </h3>

                  <p className="mx-auto mt-2 max-w-[180px] text-xs leading-5 text-zinc-500">
                    {plan.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Rows */}
          {rows.map((row, index) => (
            <div
              key={row.feature}
              className={`grid grid-cols-[1.35fr_repeat(3,1fr)] ${
                index !== rows.length - 1
                  ? "border-b border-white/[0.06]"
                  : ""
              }`}
            >
              <div className="flex items-center p-5 lg:p-6">
                <span className="text-sm font-medium text-zinc-300">
                  {row.feature}
                </span>
              </div>

              <div className="border-l border-white/[0.06] p-5 lg:p-6">
                <FeatureValue enabled={row.starter} />
              </div>

              <div className="border-l border-white/[0.06] p-5 lg:p-6">
                <FeatureValue enabled={row.advanced} />
              </div>

              <div className="border-l border-white/[0.06] p-5 lg:p-6">
                <FeatureValue enabled={row.professional} />
              </div>
            </div>
          ))}

          {/* Footer */}
          <div className="grid grid-cols-[1.35fr_repeat(3,1fr)] border-t border-white/10 bg-white/[0.02]">
            <div className="p-5 lg:p-6">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />

                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  All bots
                </span>
              </div>

              <p className="mt-2 text-xs text-zinc-600">
                Monitor your trading activity from your dashboard.
              </p>
            </div>

            {plans.map((plan) => (
              <div
                key={`${plan.name}-footer`}
                className="flex items-center justify-center border-l border-white/[0.06] p-5 lg:p-6"
              >
                <span
                  className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${accentStyles[plan.accent].badge}`}
                >
                  Available
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile comparison cards */}
        <div className="space-y-5 md:hidden">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const style = accentStyles[plan.accent];

            return (
              <div
                key={plan.name}
                className={`overflow-hidden rounded-[1.75rem] border ${style.border} bg-white/[0.02]`}
              >
                {/* Card header */}
                <div className="border-b border-white/[0.06] p-5">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/[0.04] ${style.icon}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-lg font-bold text-white">
                        {plan.name}
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-zinc-500">
                        {plan.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="divide-y divide-white/[0.06]">
                  {rows.map((row) => {
                    const enabled =
                      plan.name === "Starter Bot"
                        ? row.starter
                        : plan.name === "Advanced Bot"
                          ? row.advanced
                          : row.professional;

                    return (
                      <div
                        key={`${plan.name}-${row.feature}`}
                        className="flex items-center justify-between gap-4 px-5 py-4"
                      >
                        <span className="text-sm text-zinc-400">
                          {row.feature}
                        </span>

                        <FeatureValue enabled={enabled} />
                      </div>
                    );
                  })}
                </div>

                {/* Bottom */}
                <div className="border-t border-white/[0.06] bg-white/[0.02] px-5 py-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />

                    <span className="text-xs font-semibold text-emerald-400">
                      Available in marketplace
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom note */}
        <div className="mx-auto mt-8 flex max-w-3xl items-center justify-center gap-2 text-center">
          <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" />

          <p className="text-xs leading-5 text-zinc-600 sm:text-sm">
            Bot availability, investment limits and configurations may vary
            by plan.
          </p>
        </div>
      </div>
    </section>
  );
}