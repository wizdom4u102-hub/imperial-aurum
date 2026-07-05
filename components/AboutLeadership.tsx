import Link from "next/link";

export default function LeadershipPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: "url('/images/about-bg.jpg')",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/90" />

      {/* Content */}
      <div className="relative z-10 py-24">

        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 mb-24 text-center">

          <span className="uppercase tracking-[8px] text-yellow-400 text-sm">
            Leadership
          </span>

          <h1 className="text-6xl font-bold text-white mt-6 mb-8">
            Built For Long-Term
            <br />
            Sustainable Growth
          </h1>

          <p className="max-w-3xl mx-auto text-zinc-300 text-xl leading-9">
            Imperial Aurum is driven by innovation, transparency,
            security, and sustainable cloud mining technology,
            creating long-term value for members across the globe.
          </p>

        </section>

        {/* Leadership */}
        <section className="max-w-7xl mx-auto px-6">

          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left */}
            <div>

              <span className="uppercase tracking-[6px] text-yellow-400 text-sm">
                Leadership
              </span>

              <h2 className="text-5xl font-bold text-white mt-4 mb-8">
                Building The Future
                <br />
                Of Cloud Mining
              </h2>

              <p className="text-zinc-100 leading-9 mb-8">
                Imperial Aurum was founded with one clear objective:
                to make digital gold mining accessible, transparent,
                and rewarding for investors around the world.
              </p>

              <p className="text-zinc-100 leading-9 mb-8">
                Rather than requiring members to purchase expensive
                mining equipment or manage complicated software,
                Imperial Aurum provides professionally managed cloud
                mining infrastructure that allows anyone to
                participate through a secure online dashboard.
              </p>

              <p className="text-zinc-100 leading-9">
                Our experienced operations team, blockchain
                specialists, mining engineers, financial analysts,
                and technology professionals continually optimize
                mining performance, strengthen platform security,
                and deliver an exceptional experience for every
                member.
              </p>

            </div>

            {/* Right */}
            <div className="bg-black/70 backdrop-blur-2xl border border-yellow-400/40 rounded-3xl shadow-2xl p-10">

              <div className="text-yellow-400 text-6xl mb-8 drop-shadow-[0_0_20px_gold]">
                ★
              </div>

              <h3 className="text-4xl font-bold text-white mb-8">
                Our Mission
              </h3>

              <p className="text-zinc-100 leading-9 mb-10">
                To become one of the world's leading cloud mining
                platforms by combining innovative technology,
                responsible management, secure infrastructure,
                and sustainable investment opportunities.
              </p>

              <div className="space-y-6">

                <div className="flex items-center gap-4">
                  <span className="text-yellow-400 text-xl">✔</span>
                  <span className="text-white">
                    Professional Cloud Mining Infrastructure
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-yellow-400 text-xl">✔</span>
                  <span className="text-white">
                    Advanced Security Standards
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-yellow-400 text-xl">✔</span>
                  <span className="text-white">
                    Transparent Member Dashboard
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-yellow-400 text-xl">✔</span>
                  <span className="text-white">
                    Global Community Growth
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-yellow-400 text-xl">✔</span>
                  <span className="text-white">
                    Long-Term Sustainable Development
                  </span>
                </div>

              </div>

            </div>

          </div>

        </section>

        {/* Bottom CTA */}
        <section className="max-w-6xl mx-auto px-6 mt-32">

          <div className="bg-gradient-to-r from-yellow-500/10 via-yellow-400/5 to-yellow-500/10 border border-yellow-500/30 rounded-3xl p-14 text-center backdrop-blur-xl">

            <h2 className="text-5xl font-bold text-white mb-6">
              Join The Future Of
              <br />
              Digital Gold Mining
            </h2>

            <p className="text-zinc-300 text-xl max-w-3xl mx-auto leading-9 mb-10">
              Become part of a growing global community of investors
              who are building wealth through secure cloud mining,
              innovative technology, and long-term sustainable
              opportunities.
            </p>

            <div className="flex flex-wrap justify-center gap-6">

              <Link
                href="/register"
                className="bg-yellow-500 hover:bg-yellow-400 text-black px-10 py-5 rounded-2xl font-bold text-lg transition"
              >
                Start Mining Today
              </Link>

              <Link
                href="/plans"
                className="border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-10 py-5 rounded-2xl font-bold text-lg transition"
              >
                View Investment Plans
              </Link>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}