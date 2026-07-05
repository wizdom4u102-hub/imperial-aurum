import Link from "next/link";

export default function PlansPreview() {
  return (
    <section
      id="plans"
      className="py-24 px-6 bg-black"
    >
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-14">

          <span className="uppercase tracking-[6px] text-yellow-400 text-sm">
            Investment Plans
          </span>

          <h2 className="text-5xl font-bold mt-4">
            Choose Your Mining Plan
          </h2>

          <p className="text-zinc-400 mt-6 max-w-2xl mx-auto">
            Select the mining package that matches your investment goals
            and start earning daily digital gold rewards.
          </p>

        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {/* Starter */}

          <div
            className="
            group
            relative
            bg-white/5
            backdrop-blur-xl
            border
            border-yellow-500/20
            rounded-3xl
            p-10
            transition-all
            duration-500
            hover:scale-105
            hover:-translate-y-3
            hover:border-yellow-400
            hover:shadow-[0_0_40px_rgba(234,179,8,0.35)]
            "
          >

            <h3 className="text-3xl font-bold mb-4">
              Starter
            </h3>

            <p className="text-yellow-400 text-5xl font-bold mb-8">
              Beginner
            </p>

            <ul className="space-y-4 text-zinc-300">
              <li>✔ Daily mining rewards</li>
              <li>✔ Dashboard access</li>
              <li>✔ Withdraw profits</li>
            </ul>

          </div>

          {/* Premium */}

          <div
            className="
            group
            relative
            bg-gradient-to-b
            from-yellow-500
            to-yellow-400
            text-black
            rounded-3xl
            p-10
            transition-all
            duration-500
            hover:scale-105
            hover:-translate-y-4
            shadow-2xl
            hover:shadow-[0_0_60px_rgba(234,179,8,0.6)]
            "
          >

            <span className="absolute top-5 right-5 bg-black text-yellow-400 px-4 py-1 rounded-full text-xs font-bold">
              MOST POPULAR
            </span>

            <h3 className="text-3xl font-bold mt-8 mb-4">
              Premium
            </h3>

            <p className="text-5xl font-bold mb-8">
              Higher Returns
            </p>

            <ul className="space-y-4">
              <li>✔ Increased mining power</li>
              <li>✔ Faster withdrawals</li>
              <li>✔ Higher referral rewards</li>
            </ul>

          </div>

          {/* Enterprise */}

          <div
            className="
            group
            relative
            bg-white/5
            backdrop-blur-xl
            border
            border-yellow-500/20
            rounded-3xl
            p-10
            transition-all
            duration-500
            hover:scale-105
            hover:-translate-y-3
            hover:border-yellow-400
            hover:shadow-[0_0_40px_rgba(234,179,8,0.35)]
            "
          >

            <h3 className="text-3xl font-bold mb-4">
              Enterprise
            </h3>

            <p className="text-yellow-400 text-5xl font-bold mb-8">
              Maximum
            </p>

            <ul className="space-y-4 text-zinc-300">
              <li>✔ Highest mining capacity</li>
              <li>✔ VIP support</li>
              <li>✔ Team bonuses</li>
            </ul>

          </div>

        </div>

        <div className="text-center mt-16">

          <Link
            href="/plans"
            className="inline-block bg-yellow-500 text-black px-12 py-4 rounded-2xl font-bold hover:bg-yellow-400 transition"
          >
            View All Investment Plans
          </Link>

        </div>

      </div>
    </section>
  );
}