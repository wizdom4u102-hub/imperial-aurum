import Link from "next/link";

export default function RevenuePreview() {
  return (
    <section className="relative py-24 overflow-hidden">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/revenue-bg.jpg')",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/85 to-black/95" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Heading */}

        <div className="text-center max-w-4xl mx-auto mb-16">

          <span className="uppercase tracking-[6px] text-yellow-400 text-sm">
            Financial Ecosystem
          </span>

          <h2 className="text-5xl font-bold mt-6 mb-6 text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
            How Imperial Aurum
            <br />
            Generates Revenue
          </h2>

          <p className="text-zinc-300 text-lg leading-9">

            Discover how Imperial Aurum combines advanced cloud
            mining infrastructure, renewable energy investments,
            digital asset management, and a global community to
            generate sustainable long-term growth.

          </p>

        </div>

        {/* Revenue Cards */}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          <div className="bg-white/5 backdrop-blur-xl border border-yellow-500/20 rounded-3xl p-8 hover:border-yellow-400 hover:shadow-[0_0_40px_rgba(250,204,21,0.25)] transition-all duration-500">

            <div className="text-5xl mb-5">
              🚀
            </div>

            <h3 className="text-2xl font-bold text-yellow-400 mb-4">
              Cloud Mining
            </h3>

            <p className="text-zinc-300 leading-8">

              Professionally managed mining infrastructure operating
              24/7 to support platform growth.

            </p>

          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-yellow-500/20 rounded-3xl p-8 hover:border-yellow-400 hover:shadow-[0_0_40px_rgba(250,204,21,0.25)] transition-all duration-500">

            <div className="text-5xl mb-5">
              ☀️
            </div>

            <h3 className="text-2xl font-bold text-yellow-400 mb-4">
              Solar Energy
            </h3>

            <p className="text-zinc-300 leading-8">

              Renewable energy investments create additional
              revenue while reducing operational costs.

            </p>

          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-yellow-500/20 rounded-3xl p-8 hover:border-yellow-400 hover:shadow-[0_0_40px_rgba(250,204,21,0.25)] transition-all duration-500">

            <div className="text-5xl mb-5">
              💼
            </div>

            <h3 className="text-2xl font-bold text-yellow-400 mb-4">
              Digital Assets
            </h3>

            <p className="text-zinc-300 leading-8">

              Diversified institutional-grade asset management
              strengthens long-term financial stability.

            </p>

          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-yellow-500/20 rounded-3xl p-8 hover:border-yellow-400 hover:shadow-[0_0_40px_rgba(250,204,21,0.25)] transition-all duration-500">

            <div className="text-5xl mb-5">
              🌐
            </div>

            <h3 className="text-2xl font-bold text-yellow-400 mb-4">
              Global Network
            </h3>

            <p className="text-zinc-300 leading-8">

              Our expanding worldwide community fuels sustainable
              growth and long-term opportunity.

            </p>

          </div>

        </div>

        {/* Bottom Banner */}

        <div className="mt-16 bg-gradient-to-r from-yellow-500/10 via-yellow-400/10 to-yellow-500/10 border border-yellow-500/30 rounded-[40px] p-12 text-center backdrop-blur-xl">

          <h3 className="text-4xl font-bold mb-6 text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">

            Built For Long-Term Wealth Creation

          </h3>

          <p className="max-w-4xl mx-auto text-zinc-300 leading-9 text-lg">

            Imperial Aurum continuously expands its infrastructure,
            renewable energy portfolio, cloud mining capacity,
            digital asset strategies, and technology ecosystem to
            create multiple revenue channels that support the
            platform's long-term vision and global community.

          </p>

          <Link
            href="/how-we-generate-revenue"
            className="inline-flex items-center gap-3 mt-10 bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-10 py-5 rounded-2xl transition-all duration-300 hover:scale-105"
          >
            Learn How We Generate Revenue
            <span>→</span>
          </Link>

        </div>

      </div>

    </section>
  );
}