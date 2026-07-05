"use client";

import { useState } from "react";
import Link from "next/link";

const faqs = [
  {
    question: "How does cloud mining work?",
    answer:
      "Imperial Aurum uses professional cloud mining infrastructure that allows members to participate in digital gold mining without purchasing expensive hardware. Simply activate a mining plan and monitor your earnings from your dashboard.",
  },
  {
    question: "When can I withdraw my earnings?",
    answer:
      "Withdrawals can be requested once your account meets the minimum withdrawal requirements. Every withdrawal is reviewed and processed securely to protect all members.",
  },
  {
    question: "How does the 20-Level Referral Program work?",
    answer:
      "Share your personal referral link with others. As your network grows, you earn commissions from up to 20 generations of referrals according to the platform's referral compensation structure.",
  },
  {
    question: "What is the Shared Plan?",
    answer:
      "The Shared Plan rewards teamwork. Members who build teams can unlock additional bonuses, leadership rewards, and shared mining income based on overall team performance.",
  },
  {
    question: "Can I upgrade my investment plan?",
    answer:
      "Yes. Members can upgrade their mining plan at any time to increase mining power, daily rewards, and additional earning opportunities.",
  },
  {
    question: "Is my investment secure?",
    answer:
      "Imperial Aurum prioritizes security through account verification, encrypted systems, secure payment processing, and continuous monitoring of platform activity.",
  },
  {
    question: "Which payment methods are accepted?",
    answer:
      "Imperial Aurum supports multiple payment methods depending on your region. Available payment options are displayed inside your deposit page after logging in.",
  },
  {
    question: "Do I need mining equipment?",
    answer:
      "No. Everything is handled through our cloud mining infrastructure. There is no need to purchase mining hardware or manage complicated software.",
  },
];

export default function FaqPreview() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="py-24 bg-zinc-950"
    >
      <div className="max-w-5xl mx-auto px-6">

        <div className="text-center mb-16">

          <span className="text-yellow-400 uppercase tracking-[6px] text-sm">
            Frequently Asked Questions
          </span>

          <h2 className="text-5xl font-bold mt-4">
            Have Questions?
          </h2>

          <p className="text-zinc-400 mt-6 max-w-2xl mx-auto">
            Here are answers to some of the most common questions about
            Imperial Aurum and our cloud mining platform.
          </p>

        </div>

        <div className="space-y-5">

          {faqs.map((faq, index) => (

            <div
              key={index}
              className="bg-zinc-900 border border-yellow-500/20 rounded-3xl overflow-hidden"
            >

              <button
                onClick={() =>
                  setOpen(open === index ? null : index)
                }
                className="w-full flex justify-between items-center p-7 text-left"
              >

                <span className="text-xl font-semibold">
                  {faq.question}
                </span>

                <span className="text-3xl text-yellow-400">
                  {open === index ? "−" : "+"}
                </span>

              </button>

              {open === index && (

                <div className="px-7 pb-7">

                  <div className="border-t border-zinc-800 pt-6">

                    <p className="text-zinc-400 leading-8">
                      {faq.answer}
                    </p>

                  </div>

                </div>

              )}

            </div>

          ))}

        </div>

        <div className="text-center mt-16">

          <p className="text-zinc-400 mb-8">
            Still have questions? Our support team is available 24/7.
          </p>

          <Link
            href="/contact"
            className="inline-block bg-yellow-500 hover:bg-yellow-400 text-black px-10 py-4 rounded-2xl font-semibold transition"
          >
            Contact Support
          </Link>

        </div>

      </div>
    </section>
  );
}