import Link from "next/link";

export default function SharedPlan() {
  return (
    <section className="py-28 bg-black relative overflow-hidden">

      {/* Gold glow background */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-yellow-500/5" />

      <div className="relative max-w-7xl mx-auto px-6">


        {/* Header */}

        <div className="text-center mb-16">

          <span className="uppercase tracking-[6px] text-yellow-400 text-sm">
            Plan Three
          </span>


          <h2 className="text-5xl md:text-6xl font-bold mt-5">
            Shared Plan
          </h2>


          <p className="text-zinc-300 max-w-3xl mx-auto mt-8 text-lg leading-8">

            Grow together with the power of community mining.

            The Shared Plan combines personal mining,
            referral growth, and team performance to create
            additional earning opportunities.

          </p>

        </div>



        {/* Main Card */}

        <div className="grid lg:grid-cols-2 gap-10">


          {/* Left */}

          <div className="bg-white/5 backdrop-blur-xl border border-yellow-500/20 rounded-3xl p-10">


            <div className="text-6xl mb-6">
              👥
            </div>


            <h3 className="text-3xl font-bold mb-6">
              Build Your Mining Community
            </h3>


            <p className="text-zinc-300 leading-8">

              Invite members using your personal referral link.

              As your organization grows, you unlock more
              opportunities through our multi-level referral
              structure.

              <br />
              <br />

              Your team becomes your digital mining network.

            </p>


            <Link
              href="/shared-plans"
              className="inline-block mt-10 bg-yellow-500 hover:bg-yellow-400 text-black px-10 py-4 rounded-2xl font-bold transition"
            >
              Join Shared Plan
            </Link>


          </div>




          {/* Right */}

          <div className="bg-zinc-900 border border-yellow-500/20 rounded-3xl p-10">


            <h3 className="text-3xl font-bold mb-8">
              Shared Plan Benefits
            </h3>



            <div className="space-y-6">


              <div className="flex gap-4 items-start">

                <span className="text-yellow-400 text-xl">
                  ✔
                </span>

                <p>
                  Earn from team growth and activity
                </p>

              </div>



              <div className="flex gap-4 items-start">

                <span className="text-yellow-400 text-xl">
                  ✔
                </span>

                <p>
                  Unlock referral rewards across 20 levels
                </p>

              </div>




              <div className="flex gap-4 items-start">

                <span className="text-yellow-400 text-xl">
                  ✔
                </span>

                <p>
                  Receive leadership incentives
                </p>

              </div>




              <div className="flex gap-4 items-start">

                <span className="text-yellow-400 text-xl">
                  ✔
                </span>

                <p>
                  Participate in shared mining rewards
                </p>

              </div>




              <div className="flex gap-4 items-start">

                <span className="text-yellow-400 text-xl">
                  ✔
                </span>

                <p>
                  Grow a global mining organization
                </p>

              </div>



            </div>


          </div>


        </div>





        {/* Referral Levels */}

        <h3 className="text-3xl font-bold text-center mb-10">
  20-Level Referral Commission Structure
</h3>


<div className="grid md:grid-cols-4 gap-5">


<div className="bg-zinc-900 rounded-2xl p-6 text-center border border-yellow-500/20">

<h4 className="text-yellow-400 text-3xl font-bold">
10%
</h4>

<p className="text-zinc-300 mt-2">
Level 1
</p>

<p className="text-zinc-500 text-sm">
Direct Referral
</p>

</div>



<div className="bg-zinc-900 rounded-2xl p-6 text-center border border-yellow-500/20">

<h4 className="text-yellow-400 text-3xl font-bold">
5%
</h4>

<p className="text-zinc-300 mt-2">
Level 2
</p>

<p className="text-zinc-500 text-sm">
Second Generation
</p>

</div>



<div className="bg-zinc-900 rounded-2xl p-6 text-center border border-yellow-500/20">

<h4 className="text-yellow-400 text-3xl font-bold">
3%
</h4>

<p className="text-zinc-300 mt-2">
Level 3 - 4
</p>

<p className="text-zinc-500 text-sm">
Team Growth
</p>

</div>



<div className="bg-zinc-900 rounded-2xl p-6 text-center border border-yellow-500/20">

<h4 className="text-yellow-400 text-3xl font-bold">
2%
</h4>

<p className="text-zinc-300 mt-2">
Level 5 - 20
</p>

<p className="text-zinc-500 text-sm">
Team Growth
</p>

</div>



        </div>
      </div>
    </section>
  );
}