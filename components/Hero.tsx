import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-6 min-h-screen flex items-center overflow-hidden">

      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center">

        <h2 className="text-6xl md:text-7xl font-bold leading-tight mb-6">
          Mine Digital Gold.
          <br />
          Earn Daily Rewards.
          <br />
          Convert To Real Cash.
        </h2>

        <p className="text-xl text-zinc-200 max-w-2xl mx-auto mb-10">
          Imperial Aurum is a secure cloud mining platform where you earn
          digital gold rewards every day.
          <br />
          No hardware needed — just deposit and watch your balance grow.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">

          <Link
            href="/login"
            className="bg-yellow-500 hover:bg-yellow-400 text-black px-10 py-4 rounded-2xl text-lg font-semibold transition"
          >
            Start Mining Now
          </Link>

          <a
            href="#plans"
            className="border border-white/40 hover:border-yellow-400 px-10 py-4 rounded-2xl text-lg font-medium transition"
          >
            View Plans
          </a>

        </div>

      </div>

    </section>
  );
}