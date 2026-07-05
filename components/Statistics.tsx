"use client";

import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

function StatCard({
  end,
  suffix = "",
  prefix = "",
  label,
  className = "",
}: {
  end: number;
  suffix?: string;
  prefix?: string;
  label: string;
  className?: string;
}) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.4,
  });

  return (
    <div
      ref={ref}
      className={`bg-zinc-900 rounded-3xl p-8 text-center border border-yellow-500/20 hover:border-yellow-400 transition ${className}`}
    >
      <h3 className="text-4xl lg:text-5xl font-bold text-yellow-400 whitespace-nowrap">
        {inView ? (
          <CountUp
            start={0}
            end={end}
            duration={2.5}
            separator=","
            prefix={prefix}
            suffix={suffix}
          />
        ) : (
          `${prefix}0${suffix}`
        )}
      </h3>

      <p className="text-zinc-400 mt-3 text-lg">
        {label}
      </p>
    </div>
  );
}

export default function Statistics() {
  return (
    <section className="py-16 bg-zinc-950 border-y border-zinc-800">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid grid-cols-2 md:grid-cols-6 gap-6">

          {/* Total Paid - Wider Card */}

          <StatCard
            end={18450000}
            prefix="$"
            suffix="+"
            label="Total Paid"
            className="md:col-span-2"
          />

          {/* Members */}

          <StatCard
            end={12500}
            suffix="+"
            label="Members"
          />

          {/* Mining */}

          <div className="bg-zinc-900 rounded-3xl p-8 text-center border border-yellow-500/20 hover:border-yellow-400 transition">
            <h3 className="text-4xl lg:text-5xl font-bold text-yellow-400">
              24/7
            </h3>

            <p className="text-zinc-400 mt-3 text-lg">
              Mining
            </p>
          </div>

          {/* Uptime */}

          <div className="bg-zinc-900 rounded-3xl p-8 text-center border border-yellow-500/20 hover:border-yellow-400 transition">
            <h3 className="text-4xl lg:text-5xl font-bold text-yellow-400">
              99.9%
            </h3>

            <p className="text-zinc-400 mt-3 text-lg">
              Uptime
            </p>
          </div>

          {/* Referral */}

          <StatCard
            end={20}
            label="Referral Levels"
          />

          {/* Countries */}

          <StatCard
            end={100}
            suffix="+"
            label="Countries"
          />

        </div>

      </div>
    </section>
  );
}