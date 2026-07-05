import Link from "next/link";
import CompanyTimeline from "@/components/CompanyTimeline";
import AboutCEO from "@/components/AboutCEO";
import AboutCTA from "@/components/AboutCTA";
import AboutLeadership from "@/components/AboutLeadership";
import RevenuePreview from "@/components/about/RevenuePreview";

export default function AboutPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">

        

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/about-bg.jpg')",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/88 to-black/95" />

      {/* Content */}
      <div className="relative z-10 py-24 px-6">

         <CompanyTimeline />

         <AboutLeadership />

         <RevenuePreview />

         <AboutCEO />

         <AboutCTA />



        <div className="max-w-5xl mx-auto">

          <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)] mb-6">
            About Imperial Aurum
          </h1>

          <p className="text-xl text-zinc-200 mb-16">
            Mine Smarter. Grow Faster. Build Lasting Wealth.
          </p>

          <div className="space-y-12 text-zinc-200 leading-8 text-lg">

            <section className="bg-black/70 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <h2 className="text-3xl font-semibold text-yellow-400 mb-5">
                Welcome to Imperial Aurum
              </h2>

              <p>
                Tired of expensive hardware, sky-high electricity bills,
                and complex setups? Imperial Aurum makes digital gold
                mining effortless and accessible to everyone.
              </p>

              <p className="mt-5">
                No technical skills are required. No costly mining
                equipment. Simply create an account, choose an investment
                plan, and let our advanced cloud mining infrastructure
                operate for you 24 hours a day, 7 days a week.
              </p>
            </section>

            <section className="bg-black/70 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <h2 className="text-3xl font-semibold text-yellow-400 mb-5">
                Advanced Mining Infrastructure
              </h2>

              <p>
                Imperial Aurum combines cloud computing technology with
                smart digital asset strategies to generate consistent
                mining rewards.
              </p>

              <p className="mt-5">
                These profits help support member payouts, platform
                development, infrastructure upgrades, and long-term
                sustainable growth.
              </p>

              <p className="mt-5">
                Every member has access to a modern dashboard where mining
                performance, deposits, withdrawals, referral earnings,
                shared plan income, and account growth can be monitored in
                real time.
              </p>
            </section>

            <section className="bg-black/70 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <h2 className="text-3xl font-semibold text-yellow-400 mb-5">
                Daily Mining Rewards
              </h2>

              <p>
                Activate a mining plan and begin receiving daily digital
                gold rewards based on your selected investment package.
              </p>

              <p className="mt-5">
                The higher your mining power, the greater your earning
                potential. Rewards accumulate automatically and are
                converted according to Imperial Aurum policies.
              </p>
            </section>

            <section className="bg-black/70 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <h2 className="text-3xl font-semibold text-yellow-400 mb-5">
                Secure Deposits & Withdrawals
              </h2>

              <p>
                Deposit funds securely to activate or upgrade your mining
                operation.
              </p>

              <p className="mt-5">
                Withdrawals are processed after verification to ensure
                security, transparency, and protection for every member.
              </p>
            </section>

            <section className="bg-black/40 backdrop-blur-sm rounded-3xl p-8 border border-yellow-500/20">

  <div className="flex items-center gap-4 mb-6">

    <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-2xl">
      👥
    </div>

    <h2 className="text-3xl font-semibold text-yellow-400">
      20-Level Referral Program
    </h2>

  </div>

  <p className="text-zinc-300 leading-8">

    Share Imperial Aurum using your personal referral link and earn
    commissions across twenty generations of referrals.

    <br /><br />

    As your organization grows, you unlock additional passive income,
    leadership rewards, and long-term team-building opportunities.

  </p>

  {/* Commission Structure */}

  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">

    <div className="bg-zinc-900 rounded-2xl p-6 text-center border border-yellow-500/20">

      <div className="text-4xl font-bold text-yellow-400">
        10%
      </div>

      <h3 className="text-xl font-semibold mt-3">
        Level 1
      </h3>

      <p className="text-zinc-400 text-sm mt-2">
        Direct Referrals
      </p>

    </div>

    <div className="bg-zinc-900 rounded-2xl p-6 text-center border border-yellow-500/20">

      <div className="text-4xl font-bold text-yellow-400">
        5%
      </div>

      <h3 className="text-xl font-semibold mt-3">
        Level 2
      </h3>

      <p className="text-zinc-400 text-sm mt-2">
        Second Generation
      </p>

    </div>

    <div className="bg-zinc-900 rounded-2xl p-6 text-center border border-yellow-500/20">

      <div className="text-4xl font-bold text-yellow-400">
        3%
      </div>

      <h3 className="text-xl font-semibold mt-3">
        Levels 3–4
      </h3>

      <p className="text-zinc-400 text-sm mt-2">
        Team Growth
      </p>

    </div>

    <div className="bg-zinc-900 rounded-2xl p-6 text-center border border-yellow-500/20">

      <div className="text-4xl font-bold text-yellow-400">
        2%
      </div>

      <h3 className="text-xl font-semibold mt-3">
        Levels 5–20
      </h3>

      <p className="text-zinc-400 text-sm mt-2">
        Passive Team Income
      </p>

    </div>

  </div>

  {/* Full Structure */}

  <div className="mt-10 bg-zinc-900/60 rounded-2xl p-6 border border-zinc-800">

    <h3 className="text-xl font-semibold text-yellow-400 mb-4">
      Referral Commission Breakdown
    </h3>

    <div className="grid md:grid-cols-2 gap-3 text-zinc-300">

      <div className="flex justify-between border-b border-zinc-800 pb-2">
        <span>Level 1</span>
        <span className="text-yellow-400 font-semibold">10%</span>
      </div>

      <div className="flex justify-between border-b border-zinc-800 pb-2">
        <span>Level 2</span>
        <span className="text-yellow-400 font-semibold">5%</span>
      </div>

      <div className="flex justify-between border-b border-zinc-800 pb-2">
        <span>Level 3</span>
        <span className="text-yellow-400 font-semibold">3%</span>
      </div>

      <div className="flex justify-between border-b border-zinc-800 pb-2">
        <span>Level 4</span>
        <span className="text-yellow-400 font-semibold">3%</span>
      </div>

      <div className="flex justify-between border-b border-zinc-800 pb-2">
        <span>Levels 5–20</span>
        <span className="text-yellow-400 font-semibold">2% each</span>
      </div>

    </div>

  </div>

  <div className="mt-8 p-5 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl">

    <p className="text-zinc-200 leading-8">

      <span className="text-yellow-400 font-semibold">
        The larger and more active your network becomes, the greater your earning opportunities.
      </span>

      <br /><br />

      Continue building your organization and earn recurring commissions,
      leadership bonuses, and shared mining rewards from your growing global community.

    </p>

  </div>

</section>`

            <section className="bg-black/70 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <h2 className="text-3xl font-semibold text-yellow-400 mb-5">
                Shared Plan
              </h2>

              <p>
                The Shared Plan rewards teamwork, leadership, and
                long-term community growth.
              </p>

              <p className="mt-5">
                Build mining teams, expand your organization, unlock
                leadership bonuses, shared mining rewards, team
                commissions, and additional income opportunities beyond
                your personal mining rewards.
              </p>
            </section>

            <section className="bg-black/70 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <h2 className="text-3xl font-semibold text-yellow-400 mb-5">
                Security & Transparency
              </h2>

              <p>
                Every transaction is securely recorded and displayed in
                your personal dashboard.
              </p>

              <p className="mt-5">
                We prioritize transparency, responsible management, and
                long-term sustainability so members can focus on growing
                their wealth with confidence.
              </p>
            </section>

            <section className="bg-black/70 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <h2 className="text-3xl font-semibold text-yellow-400 mb-5">
                Join Imperial Aurum Today
              </h2>

              <p>
                Whether you're beginning your investment journey or
                expanding your portfolio, Imperial Aurum offers a secure,
                modern, and rewarding cloud mining experience backed by a
                growing global community.
              </p>

              <p className="mt-5 font-semibold text-yellow-400">
                Mine Smarter. Grow Faster. Build Lasting Wealth.
              </p>
            </section>

          </div>

          <div className="mt-20 flex flex-col sm:flex-row gap-6 justify-center">

            <Link
              href="/register"
              className="bg-yellow-500 hover:bg-yellow-400 text-black px-10 py-4 rounded-2xl font-semibold transition text-center"
            >
              Start Mining
            </Link>

            <Link
              href="/plans"
              className="border border-yellow-500 hover:bg-yellow-500 hover:text-black px-10 py-4 rounded-2xl transition text-center"
            >
              View Investment Plans
            </Link>

          </div>

        </div>

      </div>

    </main>
  );
}