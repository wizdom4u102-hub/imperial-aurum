import Link from "next/link";

export default function ReferralPreview() {
  return (
    <section className="py-24 px-6 bg-zinc-950">

      <div className="max-w-6xl mx-auto">

        {/* Header */}

        <div className="text-center">

          <span className="uppercase tracking-[6px] text-yellow-400 text-sm">
            Referral Program
          </span>

          <h2 className="text-5xl font-bold mt-4">
            Build Your Network.
            <br />
            Earn Up To 20 Levels Deep.
          </h2>

          <p className="text-zinc-400 max-w-3xl mx-auto mt-8 leading-8">
            Share Imperial Aurum using your personal referral link and earn
            commissions across twenty generations. As your organization grows,
            you unlock passive income, leadership rewards, and long-term
            earning potential.
          </p>

        </div>

        {/* Commission Cards */}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">

          {/* Card 1 */}

          <div className="
            group
            bg-white/5
            backdrop-blur-xl
            rounded-3xl
            border border-yellow-500/20
            p-8
            text-center
            transition-all duration-500
            hover:scale-105
            hover:-translate-y-3
            hover:border-yellow-400
            hover:shadow-[0_0_40px_rgba(234,179,8,0.35)]
          ">

            <div className="text-6xl font-bold text-yellow-400 transition-transform duration-500 group-hover:scale-110">
              10%
            </div>

            <h3 className="text-2xl font-semibold mt-5">
              Level 1
            </h3>

            <p className="text-zinc-400 mt-3">
              Direct Referrals
            </p>

          </div>

          {/* Card 2 */}

          <div className="
            group
            bg-white/5
            backdrop-blur-xl
            rounded-3xl
            border border-yellow-500/20
            p-8
            text-center
            transition-all duration-500
            hover:scale-105
            hover:-translate-y-3
            hover:border-yellow-400
            hover:shadow-[0_0_40px_rgba(234,179,8,0.35)]
          ">

            <div className="text-6xl font-bold text-yellow-400 transition-transform duration-500 group-hover:scale-110">
              5%
            </div>

            <h3 className="text-2xl font-semibold mt-5">
              Level 2
            </h3>

            <p className="text-zinc-400 mt-3">
              Second Generation
            </p>

          </div>

          {/* Card 3 */}

          <div className="
            group
            bg-white/5
            backdrop-blur-xl
            rounded-3xl
            border border-yellow-500/20
            p-8
            text-center
            transition-all duration-500
            hover:scale-105
            hover:-translate-y-3
            hover:border-yellow-400
            hover:shadow-[0_0_40px_rgba(234,179,8,0.35)]
          ">

            <div className="text-6xl font-bold text-yellow-400 transition-transform duration-500 group-hover:scale-110">
              3%
            </div>

            <h3 className="text-2xl font-semibold mt-5">
              Levels 3–4
            </h3>

            <p className="text-zinc-400 mt-3">
              Team Growth
            </p>

          </div>

          {/* Card 4 */}

          <div className="
            group
            bg-white/5
            backdrop-blur-xl
            rounded-3xl
            border border-yellow-500/20
            p-8
            text-center
            transition-all duration-500
            hover:scale-105
            hover:-translate-y-3
            hover:border-yellow-400
            hover:shadow-[0_0_40px_rgba(234,179,8,0.35)]
          ">

            <div className="text-6xl font-bold text-yellow-400 transition-transform duration-500 group-hover:scale-110">
              2%
            </div>

            <h3 className="text-2xl font-semibold mt-5">
              Levels 5–20
            </h3>

            <p className="text-zinc-400 mt-3">
              Passive Income
            </p>

          </div>

        </div>

        {/* Summary Panel */}

        <div className="
          mt-14
          bg-white/5
          backdrop-blur-xl
          border border-yellow-500/20
          rounded-3xl
          p-10
          text-center
          transition-all
          duration-500
          hover:scale-[1.02]
          hover:border-yellow-400
          hover:shadow-[0_0_50px_rgba(234,179,8,0.25)]
        ">

          <h3 className="text-3xl font-semibold text-yellow-400 mb-5">
            Unlimited Team Building Potential
          </h3>

          <p className="text-zinc-300 leading-8 max-w-4xl mx-auto">
            Grow your referral organization across 20 generations and earn
            recurring commissions every time your network expands.
            The larger your active team becomes, the greater your long-term
            passive income and leadership rewards.
          </p>

        </div>

        {/* CTA Button */}

        <div className="text-center mt-14">

          <Link
            href="/referrals"
            className="
              inline-block
              bg-yellow-500
              hover:bg-yellow-400
              hover:scale-105
              transition-all duration-300
              text-black
              px-12 py-4
              rounded-2xl
              font-bold
              shadow-lg
            "
          >
            Explore Referral Program →
          </Link>

        </div>

      </div>

    </section>
  );
}