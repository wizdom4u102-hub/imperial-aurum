"use client";

import { useState } from "react";
import { ChevronDown, CircleHelp } from "lucide-react";

const faqs = [
  {
    question: "What is the Imperial Aurum AI Trading Bot?",
    answer:
      "The Imperial Aurum AI Trading Bot is an automated trading system designed to manage trading cycles according to the configuration of the selected bot plan. Users can monitor bot activity and performance from their dashboard.",
  },
  {
    question: "How does the trading bot work?",
    answer:
      "After activating an available bot plan and completing the required investment process, the bot operates according to its configured trading strategy. Trading activity and performance can then be monitored from the dashboard.",
  },
  {
    question: "Do I need to trade manually?",
    answer:
      "No. The purpose of the trading bot is to automate the configured trading cycle so users do not need to manually execute every trading action.",
  },
  {
    question: "Can I monitor my bot?",
    answer:
      "Yes. Your dashboard provides access to bot status, trading activity and performance information so you can follow the activity of your activated bot.",
  },
  {
    question: "Can I choose different bot plans?",
    answer:
      "Yes. Available bot configurations are presented through the trading bot marketplace, allowing users to review the available plans and select an option that fits their goals and investment range.",
  },
  {
    question: "Can I add funds to an active bot?",
    answer:
      "Depending on the bot configuration and available account functionality, users can manage their active bot and use supported account actions such as adding funds.",
  },
  {
    question: "Can trading profits be compounded?",
    answer:
      "Supported bot configurations can provide profit-compounding functionality. When available, users can manage this option through the trading bot system.",
  },
  {
    question: "Is the trading bot risk-free?",
    answer:
      "No. While automated trading executes strategies systematically, it does not eliminate market risk. Imperial Aurum employs robust security measures and risk-management protocols to protect user assets, but market fluctuations still apply. Users should thoroughly review the bot’s configuration, investment parameters, and risk profile prior to plan activation.",
  },
];

export default function TradingBotFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="relative overflow-hidden bg-zinc-950 py-24 sm:py-28 lg:py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/[0.03] blur-[130px]" />
      </div>

      <div className="relative mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
            <CircleHelp className="h-4 w-4" />
            Trading Bot FAQ
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Questions About{" "}
            <span className="text-yellow-400">AI Trading</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base sm:leading-8">
            Learn more about our automated trading system, bot plans and
            dashboard features.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                className={`overflow-hidden rounded-2xl border transition duration-300 ${
                  isOpen
                    ? "border-yellow-400/20 bg-yellow-400/[0.03]"
                    : "border-white/[0.07] bg-white/[0.02]"
                }`}
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenIndex(isOpen ? null : index)
                  }
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left sm:px-6"
                >
                  <span className="text-sm font-semibold leading-6 text-white sm:text-base">
                    {faq.question}
                  </span>

                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition duration-300 ${
                      isOpen
                        ? "rotate-180 border-yellow-400/30 bg-yellow-400/10 text-yellow-400"
                        : "border-white/10 bg-white/[0.03] text-zinc-500"
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </span>
                </button>

                <div
                  className={`grid transition-[grid-template-rows] duration-300 ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="border-t border-white/[0.06] px-5 pb-5 pt-4 sm:px-6">
                      <p className="text-sm leading-7 text-zinc-500">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}