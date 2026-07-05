import Link from "next/link";

export default function AboutPreview() {
  return (
    <section className="py-24 px-6 bg-black">

      <div className="max-w-6xl mx-auto">

        {/* Heading */}

        <div className="text-center mb-16">

          <span className="uppercase tracking-[6px] text-yellow-400 text-sm">
            About Imperial Aurum
          </span>

          <h2 className="text-5xl font-bold mt-4">
            Mine Smarter.
            <br />
            Build Wealth With Confidence.
          </h2>

          <p className="text-zinc-400 max-w-3xl mx-auto text-lg leading-8 mt-8">
            Imperial Aurum is a next-generation cloud mining platform
            built to make digital gold mining simple, secure, and
            profitable for investors around the world.

            Our advanced mining infrastructure operates continuously,
            allowing members to earn daily rewards without purchasing
            expensive mining hardware or managing complicated software.
          </p>

        </div>

        {/* Cards */}

        <div className="grid md:grid-cols-3 gap-8">

          {/* Card 1 */}

          <div
            className="
            group
            bg-white/5
            backdrop-blur-xl
            rounded-3xl
            p-8
            border
            border-yellow-500/20
            transition-all
            duration-500
            hover:scale-105
            hover:-translate-y-3
            hover:border-yellow-400
            hover:shadow-[0_0_40px_rgba(234,179,8,0.35)]
            "
          >

            <div className="text-6xl mb-6 transition-transform duration-500 group-hover:scale-125">
              ⛏️
            </div>

            <h3 className="text-2xl font-semibold mb-5 text-yellow-400">
              Cloud Mining
            </h3>

            <p className="text-zinc-400 leading-8">
              Start mining digital gold instantly without purchasing
              expensive mining equipment or paying electricity costs.
              Everything is managed through our secure cloud
              infrastructure.
            </p>

          </div>

          {/* Card 2 */}

          <div
            className="
            group
            bg-white/5
            backdrop-blur-xl
            rounded-3xl
            p-8
            border
            border-yellow-500/20
            transition-all
            duration-500
            hover:scale-105
            hover:-translate-y-3
            hover:border-yellow-400
            hover:shadow-[0_0_40px_rgba(234,179,8,0.35)]
            "
          >

            <div className="text-6xl mb-6 transition-transform duration-500 group-hover:scale-125">
              💰
            </div>

            <h3 className="text-2xl font-semibold mb-5 text-yellow-400">
              Daily Rewards
            </h3>

            <p className="text-zinc-400 leading-8">
              Earn mining rewards every day based on your selected
              investment package while monitoring deposits,
              withdrawals, earnings, and referrals from your
              dashboard.
            </p>

          </div>

          {/* Card 3 */}

          <div
            className="
            group
            bg-white/5
            backdrop-blur-xl
            rounded-3xl
            p-8
            border
            border-yellow-500/20
            transition-all
            duration-500
            hover:scale-105
            hover:-translate-y-3
            hover:border-yellow-400
            hover:shadow-[0_0_40px_rgba(234,179,8,0.35)]
            "
          >

            <div className="text-6xl mb-6 transition-transform duration-500 group-hover:scale-125">
              🌍
            </div>

            <h3 className="text-2xl font-semibold mb-5 text-yellow-400">
              Global Community
            </h3>

            <p className="text-zinc-400 leading-8">
              Join thousands of members from over 100 countries and
              grow together through mining plans, referral rewards,
              leadership bonuses, and our powerful Shared Plan.
            </p>

          </div>

        </div>

        {/* Button */}

        <div className="text-center mt-16">

          <Link
            href="/about"
            className="
            inline-block
            bg-yellow-500
            hover:bg-yellow-400
            hover:scale-105
            transition-all
            duration-300
            text-black
            px-12
            py-4
            rounded-2xl
            font-bold
            shadow-lg
            "
          >
            Learn More About Imperial Aurum →
          </Link>

        </div>

      </div>

    </section>
  );
}