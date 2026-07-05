import Link from "next/link";

export default function CTA() {
  return (
    <section className="relative py-32 overflow-hidden">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-110 animate-[slowZoom_25s_linear_infinite_alternate]"
        style={{
          backgroundImage: "url('/images/cta-bg.jpg')",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Gold Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-transparent to-yellow-500/10" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">

        <span className="uppercase tracking-[6px] text-yellow-400 font-semibold">
          Join Thousands Of Investors
        </span>

        <h2 className="text-5xl md:text-7xl font-bold text-white mt-6 leading-tight">
          Start Building
          <br />
          Your Wealth Today
        </h2>

        <p className="max-w-3xl mx-auto mt-8 text-xl text-zinc-200 leading-9">

          Join Imperial Aurum and become part of one of the fastest-growing
          digital gold mining communities.

          <br />
          <br />

          Activate your mining plan, earn daily rewards, build your
          referral organization across 20 levels, participate in our
          Shared Plan, and grow alongside thousands of members from
          more than 100 countries.

        </p>

        <div className="flex flex-col md:flex-row justify-center gap-6 mt-14">

          <Link
            href="/signup"
            className="bg-yellow-500 hover:bg-yellow-400 text-black px-12 py-5 rounded-2xl font-bold text-lg transition duration-300 shadow-xl"
          >
            Create Free Account
          </Link>

          <Link
            href="/plans"
            className="border-2 border-yellow-400 text-yellow-400 px-12 py-5 rounded-2xl font-bold text-lg hover:bg-yellow-400 hover:text-black transition duration-300"
          >
            View Investment Plans
          </Link>

        </div>

      </div>

    </section>
  );
}