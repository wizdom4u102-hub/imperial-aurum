import RevenueModel from "@/components/about/RevenueModel";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function RevenuePage() {
  return (
    <main className="relative overflow-hidden bg-black text-white">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/revenue-bg.jpg')",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-black/90" />

      {/* Floating Gold Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        <div className="absolute top-20 left-20 w-3 h-3 rounded-full bg-yellow-400 animate-pulse" />

        <div className="absolute top-72 right-24 w-2 h-2 rounded-full bg-yellow-300 animate-ping" />

        <div className="absolute bottom-60 left-1/3 w-3 h-3 rounded-full bg-yellow-500 animate-pulse" />

        <div className="absolute bottom-32 right-1/4 w-2 h-2 rounded-full bg-yellow-400 animate-ping" />

        <div className="absolute top-1/2 left-12 w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />

        <div className="absolute top-40 right-1/3 w-3 h-3 rounded-full bg-yellow-300 animate-ping" />

      </div>

      {/* Hero */}

      <section className="relative z-10 pt-40 pb-28">

        <div className="max-w-7xl mx-auto px-6 text-center">

          <span className="uppercase tracking-[8px] text-yellow-400 text-sm">

            Financial Ecosystem

          </span>

          <h1 className="text-5xl md:text-7xl font-bold mt-8 leading-tight">

            How Imperial Aurum
            <br />
            Generates Revenue

          </h1>

          <p className="max-w-4xl mx-auto mt-10 text-zinc-300 text-xl leading-9">

            Discover how Imperial Aurum combines
            cloud mining,
            renewable energy,
            digital asset management,
            and cutting-edge technology
            to create sustainable,
            long-term value for members worldwide.

          </p>

        </div>

      </section>

      {/* Revenue Model */}

      <div className="relative z-10">

        <RevenueModel />

      </div>

            {/* Bottom CTA */}

      <section className="relative z-10 py-24 px-6">

        <div className="max-w-6xl mx-auto">

          <div className="bg-white/5 backdrop-blur-xl border border-yellow-500/20 rounded-[40px] p-12 text-center">

            <span className="uppercase tracking-[6px] text-yellow-400">

              Start Your Journey

            </span>

            <h2 className="text-5xl md:text-6xl font-bold mt-6 mb-8">

              Build Your Future
              <br />
              With Imperial Aurum

            </h2>

            <p className="max-w-3xl mx-auto text-zinc-300 text-lg leading-9">

              Join thousands of members worldwide who are already
              participating in one of the fastest-growing digital
              mining ecosystems.

              Activate your preferred mining plan,
              grow your referral organization,
              participate in our Shared Plan,
              and become part of a global financial community
              built for long-term success.

            </p>

          </div>

        </div>

      </section>

      {/* Global CTA */}

      <div className="relative z-10">

        <CTA />

      </div>

      {/* Footer */}

      <div className="relative z-10">

        <Footer />

      </div>

    </main>
  );
}