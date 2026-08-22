"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Testimonial = {
  id: string;
  name: string;
  country: string | null;
  amount: string | null;
  image: string | null;
  text: string;
  display_order: number;
};

export default function Testimonials() {
  const supabase = createClient();

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadTestimonials = async () => {
      try {
        const { data, error } = await supabase
          .from("testimonials")
          .select(
            "id, name, country, amount, image, text, display_order"
          )
          .eq("status", "approved")
          .order("display_order", {
            ascending: true,
          })
          .order("created_at", {
            ascending: true,
          });

        if (error) {
          console.error(
            "TESTIMONIALS LOAD ERROR:",
            error
          );
          return;
        }

        if (mounted) {
          setTestimonials(data ?? []);
        }
      } catch (error) {
        console.error(
          "TESTIMONIALS LOAD ERROR:",
          error
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadTestimonials();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  return (
    <section className="bg-zinc-950 py-24">
      <div className="mx-auto max-w-7xl px-6">

        {/* HEADER */}

        <div className="mb-16 text-center">

          <span className="text-sm uppercase tracking-[6px] text-yellow-400">
            Testimonials
          </span>

          <h2 className="mt-4 text-5xl font-bold">
            Trusted By Investors Worldwide
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-zinc-400">
            Thousands of members continue to grow their portfolios
            through Imperial Aurum&apos;s cloud mining platform.
          </p>

        </div>

        {/* LOADING */}

        {loading && (
          <div className="grid gap-8 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-[430px] animate-pulse rounded-3xl border border-yellow-500/10 bg-white/5"
              />
            ))}
          </div>
        )}

        {/* TESTIMONIALS */}

        {!loading && testimonials.length > 0 && (
          <div className="grid gap-8 md:grid-cols-3">

            {testimonials.map((item) => {
              const isSelected =
                selectedId === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() =>
                    setSelectedId(
                      isSelected ? null : item.id
                    )
                  }
                  className={`
                    group
                    relative
                    cursor-pointer
                    rounded-3xl
                    border
                    bg-white/5
                    p-8
                    backdrop-blur-xl
                    transition-all
                    duration-500
                    ${
                      isSelected
                        ? "z-20 scale-105 -translate-y-3 border-yellow-400 shadow-[0_0_50px_rgba(234,179,8,0.45)]"
                        : "border-yellow-500/20 hover:scale-105 hover:-translate-y-3 hover:border-yellow-400 hover:shadow-[0_0_40px_rgba(234,179,8,0.35)]"
                    }
                  `}
                >

                  {/* Quote */}

                  <div
                    className={`
                      absolute right-6 top-6 text-5xl
                      text-yellow-400 transition
                      ${
                        isSelected
                          ? "opacity-70"
                          : "opacity-20 group-hover:opacity-60"
                      }
                    `}
                  >
                    ❝
                  </div>

                  {/* Avatar */}

                  <div className="mb-6 flex justify-center">

                    {item.image ? (
                      <div className="relative h-[90px] w-[90px] overflow-hidden rounded-full border-4 border-yellow-400">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="90px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-[90px] w-[90px] items-center justify-center rounded-full border-4 border-yellow-400 bg-zinc-900 text-3xl">
                        👤
                      </div>
                    )}

                  </div>

                  {/* Testimony */}

                  <p className="mb-8 text-center italic leading-8 text-zinc-300">
                    &quot;{item.text}&quot;
                  </p>

                  {/* Footer */}

                  <div className="border-t border-zinc-800 pt-6 text-center">

                    <h3 className="text-xl font-bold">
                      {item.name}
                    </h3>

                    {item.country && (
                      <p className="mt-1 text-zinc-500">
                        {item.country}
                      </p>
                    )}

                    {item.amount && (
                      <>
                        <div className="mt-5 text-sm uppercase tracking-widest text-yellow-400">
                          Total Earnings
                        </div>

                        <div className="mt-2 text-4xl font-bold text-white">
                          {item.amount}
                        </div>
                      </>
                    )}

                  </div>

                </div>
              );
            })}

          </div>
        )}

        {/* NO TESTIMONIALS */}

        {!loading && testimonials.length === 0 && (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-10 text-center">
            <p className="text-zinc-500">
              No testimonials are available at the moment.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}