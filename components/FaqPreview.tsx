"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Faq = {
  id: string;
  question: string;
  answer: string;
  is_active: boolean;
  display_order: number;
};

export default function FaqPreview() {
  const supabase = createClient();

  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadFaqs = async () => {
      try {
        const { data, error } = await supabase
          .from("faqs")
          .select(
            "id, question, answer, is_active, display_order"
          )
          .eq("is_active", true)
          .order("display_order", {
            ascending: true,
          })
          .order("created_at", {
            ascending: true,
          });

        if (error) {
          console.error("FAQ LOAD ERROR:", error);
          return;
        }

        if (mounted) {
          setFaqs(data ?? []);

          if (data && data.length > 0) {
            setOpen(data[0].id);
          }
        }
      } catch (error) {
        console.error("FAQ LOAD ERROR:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadFaqs();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  return (
    <section
      id="faq"
      className="bg-zinc-950 py-24"
    >
      <div className="mx-auto max-w-5xl px-6">

        {/* HEADER */}
        <div className="mb-16 text-center">

          <span className="text-sm uppercase tracking-[6px] text-yellow-400">
            Frequently Asked Questions
          </span>

          <h2 className="mt-4 text-5xl font-bold">
            Have Questions?
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-zinc-400">
            Here are answers to some of the most common questions about
            Imperial Aurum and our cloud mining platform.
          </p>

        </div>

        {/* LOADING */}
        {loading && (
          <div className="space-y-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-20 animate-pulse rounded-3xl border border-yellow-500/10 bg-zinc-900"
              />
            ))}
          </div>
        )}

        {/* FAQS */}
        {!loading && faqs.length > 0 && (
          <div className="space-y-5">

            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="overflow-hidden rounded-3xl border border-yellow-500/20 bg-zinc-900"
              >

                <button
                  type="button"
                  onClick={() =>
                    setOpen(
                      open === faq.id
                        ? null
                        : faq.id
                    )
                  }
                  className="flex w-full items-center justify-between p-7 text-left"
                >

                  <span className="text-xl font-semibold">
                    {faq.question}
                  </span>

                  <span className="text-3xl text-yellow-400">
                    {open === faq.id
                      ? "−"
                      : "+"}
                  </span>

                </button>

                {open === faq.id && (
                  <div className="px-7 pb-7">

                    <div className="border-t border-zinc-800 pt-6">

                      <p className="leading-8 text-zinc-400">
                        {faq.answer}
                      </p>

                    </div>

                  </div>
                )}

              </div>
            ))}

          </div>
        )}

        {/* NO FAQS */}
        {!loading && faqs.length === 0 && (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8 text-center">
            <p className="text-zinc-500">
              No frequently asked questions are available at the moment.
            </p>
          </div>
        )}

        {/* CONTACT */}
        <div className="mt-16 text-center">

          <p className="mb-8 text-zinc-400">
            Still have questions? Our support team is available 24/7.
          </p>

          <Link
            href="/contact"
            className="inline-block rounded-2xl bg-yellow-500 px-10 py-4 font-semibold text-black transition hover:bg-yellow-400"
          >
            Contact Support
          </Link>

        </div>

      </div>
    </section>
  );
}