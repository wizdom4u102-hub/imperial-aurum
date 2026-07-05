import Link from "next/link";

export default function SharedPlanPreview() {
  return (
    <section className="py-24 px-6 bg-black">

      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 items-center">

        <div>

          <span className="text-yellow-400 uppercase tracking-[6px]">
            Shared Plan
          </span>

          <h2 className="text-5xl font-bold mt-5 mb-8">
            Grow Together.
            <br />
            Earn Together.
          </h2>

          <p className="text-zinc-400 leading-8 mb-8">
            Imperial Aurum rewards teamwork. Build mining teams,
            expand your community, and unlock shared mining rewards,
            leadership bonuses, and additional income opportunities.
          </p>

          <Link
            href="/shared-plans"
            className="bg-yellow-500 text-black px-10 py-4 rounded-xl font-semibold hover:bg-yellow-400 transition"
          >
            Explore Shared Plan
          </Link>

        </div>

        <div className="grid gap-6">

          <div className="bg-zinc-900 rounded-3xl p-8 border border-yellow-500/20">
            <h3 className="text-2xl font-bold mb-3 text-yellow-400">
              Team Rewards
            </h3>

            <p className="text-zinc-400">
              Earn bonuses from your team's collective mining performance.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-3xl p-8 border border-yellow-500/20">
            <h3 className="text-2xl font-bold mb-3 text-yellow-400">
              Leadership Bonus
            </h3>

            <p className="text-zinc-400">
              Receive additional rewards as your organization expands.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-3xl p-8 border border-yellow-500/20">
            <h3 className="text-2xl font-bold mb-3 text-yellow-400">
              Global Community
            </h3>

            <p className="text-zinc-400">
              Connect with members worldwide and build long-term passive income.
            </p>
          </div>

        </div>

      </div>

    </section>
  );
}