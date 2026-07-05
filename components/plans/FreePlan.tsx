import Link from "next/link";

export default function FreePlan() {
  return (
    <section className="py-24 bg-black">

      <div className="max-w-7xl mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-14 items-center">

          {/* Left */}

          <div>

            <span className="uppercase tracking-[5px] text-yellow-400 text-sm">
              Plan One
            </span>

            <h2 className="text-5xl font-bold mt-5 mb-8">
              Free Mining Plan
            </h2>

            <p className="text-zinc-300 leading-8 mb-8">

              The Free Plan is designed for new members who want to
              experience Imperial Aurum without making an initial
              investment.

              <br /><br />

              Every registered member receives free cloud mining
              access and begins earning daily digital gold rewards.

              <br /><br />

              This plan is perfect for learning how the platform
              works before upgrading to a higher mining package.

            </p>

            <div className="grid grid-cols-2 gap-5 mb-10">

              <div className="bg-zinc-900 rounded-2xl p-5 border border-yellow-500/20">

                <h4 className="text-yellow-400 font-semibold">
                  Daily Mining
                </h4>

                <p className="text-3xl font-bold mt-2">
                  120 Gold
                </p>

              </div>

              <div className="bg-zinc-900 rounded-2xl p-5 border border-yellow-500/20">

                <h4 className="text-yellow-400 font-semibold">
                  Cost
                </h4>

                <p className="text-3xl font-bold mt-2">
                  FREE
                </p>

              </div>

            </div>

            <Link
              href="/signup"
              className="inline-block bg-yellow-500 hover:bg-yellow-400 text-black px-10 py-4 rounded-2xl font-bold transition"
            >
              Create Free Account
            </Link>

          </div>

          {/* Right */}

          <div className="bg-white/5 backdrop-blur-xl border border-yellow-500/20 rounded-3xl p-10">

            <h3 className="text-3xl font-bold mb-8">
              What's Included
            </h3>

            <div className="space-y-5">

              <div>✔ Daily cloud mining rewards</div>

              <div>✔ Personal dashboard</div>

              <div>✔ Deposit & Withdrawal access</div>

              <div>✔ Referral program access</div>

              <div>✔ Secure wallet management</div>

              <div>✔ Real-time statistics</div>

              <div>✔ Upgrade anytime</div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}