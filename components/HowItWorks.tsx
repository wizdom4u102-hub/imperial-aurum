export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-24 px-6 bg-zinc-950"
    >
      <div className="max-w-6xl mx-auto">

        {/* Header */}

        <div className="text-center mb-16">

          <span className="uppercase tracking-[6px] text-yellow-400 text-sm">
            Process
          </span>

          <h2 className="text-5xl font-bold mt-4">
            How Imperial Aurum Works
          </h2>

          <p className="text-zinc-400 mt-6">
            Start mining in three simple steps.
          </p>

        </div>

        {/* Steps */}

        <div className="grid md:grid-cols-3 gap-8">

          {/* Step 1 */}

          <div
            className="
            group
            bg-white/5
            backdrop-blur-xl
            rounded-3xl
            p-10
            border
            border-yellow-500/20
            text-center
            transition-all
            duration-500
            hover:scale-105
            hover:-translate-y-3
            hover:border-yellow-400
            hover:shadow-[0_0_40px_rgba(234,179,8,0.35)]
            "
          >

            <div className="flex justify-center mb-8">

              <div className="
                w-16 h-16 rounded-full
                bg-yellow-500
                text-black
                flex items-center justify-center
                text-2xl font-bold
                transition-transform duration-500
                group-hover:scale-110
                shadow-lg
              ">
                1
              </div>

            </div>

            <h3 className="text-2xl font-semibold mb-5 text-yellow-400">
              Deposit Funds
            </h3>

            <p className="text-zinc-400 leading-8">
              Deposit funds securely using supported payment methods
              to activate your mining package instantly.
            </p>

          </div>

          {/* Step 2 */}

          <div
            className="
            group
            bg-white/5
            backdrop-blur-xl
            rounded-3xl
            p-10
            border
            border-yellow-500/20
            text-center
            transition-all
            duration-500
            hover:scale-105
            hover:-translate-y-3
            hover:border-yellow-400
            hover:shadow-[0_0_40px_rgba(234,179,8,0.35)]
            "
          >

            <div className="flex justify-center mb-8">

              <div className="
                w-16 h-16 rounded-full
                bg-yellow-500
                text-black
                flex items-center justify-center
                text-2xl font-bold
                transition-transform duration-500
                group-hover:scale-110
                shadow-lg
              ">
                2
              </div>

            </div>

            <h3 className="text-2xl font-semibold mb-5 text-yellow-400">
              Mine Automatically
            </h3>

            <p className="text-zinc-400 leading-8">
              Our cloud mining system operates 24/7 while you track
              earnings, deposits, and performance in real time.
            </p>

          </div>

          {/* Step 3 */}

          <div
            className="
            group
            bg-white/5
            backdrop-blur-xl
            rounded-3xl
            p-10
            border
            border-yellow-500/20
            text-center
            transition-all
            duration-500
            hover:scale-105
            hover:-translate-y-3
            hover:border-yellow-400
            hover:shadow-[0_0_40px_rgba(234,179,8,0.35)]
            "
          >

            <div className="flex justify-center mb-8">

              <div className="
                w-16 h-16 rounded-full
                bg-yellow-500
                text-black
                flex items-center justify-center
                text-2xl font-bold
                transition-transform duration-500
                group-hover:scale-110
                shadow-lg
              ">
                3
              </div>

            </div>

            <h3 className="text-2xl font-semibold mb-5 text-yellow-400">
              Earn & Withdraw
            </h3>

            <p className="text-zinc-400 leading-8">
              Receive daily mining rewards and withdraw profits safely
              after system verification.
            </p>

          </div>

        </div>

      </div>
    </section>
  );
}