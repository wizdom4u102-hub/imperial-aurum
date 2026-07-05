export default function CompanyTimeline() {
  return (
    <section className="py-24">
      <div className="max-w-5xl mx-auto px-6">

        <h2 className="text-5xl font-bold text-center text-yellow-400 mb-16">
          Our Journey
        </h2>

        <div className="relative">

          {/* Vertical Line */}

          <div className="absolute left-6 top-0 bottom-0 w-1 bg-yellow-500/30" />

          {/* Item 1 */}

          <div className="relative flex mb-16">

            <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center text-black font-bold z-10">
              1
            </div>

            <div className="ml-10 bg-white/5 backdrop-blur-xl border border-yellow-500/20 rounded-3xl p-8 flex-1">

              <h3 className="text-2xl font-bold text-yellow-400 mb-3">
                Platform Founded
              </h3>

              <p className="text-zinc-300 leading-8">
                Imperial Aurum was created with one mission:
                make digital gold mining simple, secure,
                and available to everyone around the world.
              </p>

            </div>

          </div>

          {/* Item 2 */}

          <div className="relative flex mb-16">

            <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center text-black font-bold z-10">
              2
            </div>

            <div className="ml-10 bg-white/5 backdrop-blur-xl border border-yellow-500/20 rounded-3xl p-8 flex-1">

              <h3 className="text-2xl font-bold text-yellow-400 mb-3">
                Cloud Mining Network
              </h3>

              <p className="text-zinc-300 leading-8">
                We expanded our cloud mining infrastructure,
                allowing members to earn digital gold daily
                without purchasing expensive mining hardware.
              </p>

            </div>

          </div>

          {/* Item 3 */}

          <div className="relative flex mb-16">

            <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center text-black font-bold z-10">
              3
            </div>

            <div className="ml-10 bg-white/5 backdrop-blur-xl border border-yellow-500/20 rounded-3xl p-8 flex-1">

              <h3 className="text-2xl font-bold text-yellow-400 mb-3">
                Referral & Shared Plans
              </h3>

              <p className="text-zinc-300 leading-8">
                We introduced our 20-Level Referral Program
                together with the Shared Plan,
                allowing members to grow teams,
                earn leadership bonuses,
                and build long-term passive income.
              </p>

            </div>

          </div>

          {/* Item 4 */}

          <div className="relative flex">

            <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center text-black font-bold z-10">
              4
            </div>

            <div className="ml-10 bg-white/5 backdrop-blur-xl border border-yellow-500/20 rounded-3xl p-8 flex-1">

              <h3 className="text-2xl font-bold text-yellow-400 mb-3">
                Global Expansion
              </h3>

              <p className="text-zinc-300 leading-8">
                Today Imperial Aurum continues expanding across
                more than 100 countries while improving
                mining technology, security,
                and investment opportunities for every member.
              </p>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}