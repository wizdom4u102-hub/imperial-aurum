import Link from "next/link";

export default function PlansHero() {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/plans-bg.jpg')",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Gold Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-transparent to-yellow-500/10" />

      {/* Floating Blur */}
      <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-yellow-500/20 blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-yellow-400/10 blur-3xl animate-pulse" />

      {/* Content */}

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-36">

        <div className="max-w-4xl">

          <span className="uppercase tracking-[6px] text-yellow-400 font-semibold">
            Investment Plans
          </span>

          <h1 className="text-6xl md:text-7xl font-bold mt-8 leading-tight">

            Choose The Perfect

            <span className="block text-yellow-400">

              Mining Plan

            </span>

          </h1>

          <p className="text-zinc-300 text-xl leading-9 mt-8 max-w-3xl">

            Imperial Aurum offers flexible investment plans designed
            for beginners, experienced investors, and professional
            network builders.

            Every plan provides access to our secure cloud mining
            infrastructure, daily mining rewards, and powerful
            earning opportunities.

          </p>

          <div className="flex flex-col md:flex-row gap-6 mt-12">

            <Link
              href="/signup"
              className="bg-yellow-500 hover:bg-yellow-400 text-black px-10 py-5 rounded-2xl font-bold text-lg transition"
            >
              Start Mining Today
            </Link>

            <Link
              href="/contact"
              className="border border-yellow-400 hover:bg-yellow-400 hover:text-black px-10 py-5 rounded-2xl font-bold text-lg transition"
            >
              Talk To Our Team
            </Link>

          </div>

        </div>

      </div>

      {/* Bottom Fade */}

      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent" />

    </section>
  );
}