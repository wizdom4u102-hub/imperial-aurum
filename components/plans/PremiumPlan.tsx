import Link from "next/link";

export default function PremiumPlan() {
  return (
    <section className="py-24 bg-zinc-950">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">

          <span className="uppercase tracking-[5px] text-yellow-400">
            Plan Two
          </span>

          <h2 className="text-5xl font-bold mt-5">
            Premium Mining Plan
          </h2>

          <p className="text-zinc-400 mt-6 max-w-3xl mx-auto">

            Upgrade your mining power and unlock significantly
            higher earning opportunities with Imperial Aurum's
            Premium Investment Plans.

          </p>

        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {/* Bronze */}

          <div className="bg-black rounded-3xl border border-yellow-500/20 p-10">

            <h3 className="text-3xl font-bold">
              Bronze
            </h3>

            <p className="text-yellow-400 mt-2">
              Entry Premium
            </p>

            <div className="text-5xl font-bold mt-8">
              240
            </div>

            <p className="text-zinc-400">
              Gold / Day
            </p>

            <ul className="space-y-4 mt-8 text-zinc-300">

              <li>✔ Higher Mining Power</li>

              <li>✔ Daily Profit</li>

              <li>✔ Referral Bonus</li>

              <li>✔ Faster Withdrawals</li>

            </ul>

          </div>

          {/* Silver */}

          <div className="bg-yellow-500 text-black rounded-3xl p-10 scale-105 shadow-2xl">

            <div className="text-sm font-bold mb-4">
              MOST POPULAR
            </div>

            <h3 className="text-3xl font-bold">
              Silver
            </h3>

            <div className="text-5xl font-bold mt-8">
              500
            </div>

            <p>
              Gold / Day
            </p>

            <ul className="space-y-4 mt-8">

              <li>✔ Maximum Mining Speed</li>

              <li>✔ Priority Support</li>

              <li>✔ Higher Referral Income</li>

              <li>✔ Shared Plan Bonuses</li>

            </ul>

          </div>

          {/* Gold */}

          <div className="bg-black rounded-3xl border border-yellow-500/20 p-10">

            <h3 className="text-3xl font-bold">
              Gold
            </h3>

            <p className="text-yellow-400 mt-2">
              Professional
            </p>

            <div className="text-5xl font-bold mt-8">
              1000
            </div>

            <p className="text-zinc-400">
              Gold / Day
            </p>

            <ul className="space-y-4 mt-8 text-zinc-300">

              <li>✔ VIP Mining</li>

              <li>✔ Maximum Referral Bonus</li>

              <li>✔ Priority Withdrawals</li>

              <li>✔ Leadership Rewards</li>

            </ul>

          </div>

        </div>

        <div className="text-center mt-16">

          <Link
            href="/deposit"
            className="bg-yellow-500 hover:bg-yellow-400 text-black px-12 py-5 rounded-2xl font-bold transition"
          >
            Activate Premium Plan
          </Link>

        </div>

      </div>

    </section>
  );
}