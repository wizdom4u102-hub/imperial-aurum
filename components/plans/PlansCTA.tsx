import Link from "next/link";


export default function PlansCTA() {

  return (

    <section className="relative py-32 overflow-hidden">


      {/* Background */}

      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/plans-bg.jpg')",
        }}
      />



      {/* Overlay */}

      <div className="absolute inset-0 bg-black/75" />


      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-transparent to-yellow-500/20" />




      {/* Content */}

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">



        <span className="uppercase tracking-[6px] text-yellow-400 text-sm">

          Start Your Journey

        </span>



        <h2 className="text-5xl md:text-7xl font-bold text-white mt-6 leading-tight">

          Choose Your Plan.
          <br />

          Start Mining Today.

        </h2>




        <p className="max-w-3xl mx-auto mt-8 text-xl text-zinc-200 leading-9">


          Whether you are starting with free mining,
          upgrading to Premium, or building a global
          community through Shared Plans, Imperial Aurum
          gives you the tools to grow.


          <br />
          <br />


          Join thousands of members building their
          digital gold future.


        </p>





        <div className="flex flex-col md:flex-row justify-center gap-6 mt-14">



          <Link

            href="/signup"

            className="
            bg-yellow-500
            hover:bg-yellow-400
            text-black
            px-12
            py-5
            rounded-2xl
            font-bold
            text-lg
            transition
            shadow-xl
            "

          >

            Create Account

          </Link>





          <Link

            href="/deposit"

            className="
            border-2
            border-yellow-400
            text-yellow-400
            hover:bg-yellow-400
            hover:text-black
            px-12
            py-5
            rounded-2xl
            font-bold
            text-lg
            transition
            "

          >

            Activate Plan

          </Link>



        </div>




      </div>


    </section>

  );

}