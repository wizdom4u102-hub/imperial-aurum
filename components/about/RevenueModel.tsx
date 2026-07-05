"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function RevenueModel() {
  return (
    <section className="relative py-24 px-6 overflow-hidden">

      {/* Background Image (MOVES with scroll) */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{
          backgroundImage: "url('/images/revenue-bg.jpg')",
        }}
      />

      {/* Dark Gradient Overlay (fixes visibility) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/90 to-black/95" />

      {/* Floating Gold Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">

        <div className="absolute top-20 left-20 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
        <div className="absolute top-52 right-24 w-2 h-2 bg-yellow-300 rounded-full animate-ping" />
        <div className="absolute bottom-40 left-1/3 w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
        <div className="absolute bottom-24 right-16 w-2 h-2 bg-yellow-400 rounded-full animate-ping" />

      </div>

      {/* Header */}
      <div className="relative z-10 max-w-6xl mx-auto text-center mb-20">

        <span className="uppercase tracking-[6px] text-yellow-300 text-sm font-semibold drop-shadow">
          Financial Ecosystem
        </span>

        <h1 className="text-5xl md:text-6xl font-bold mt-6">
          How Imperial Aurum
          <br />
          Generates Revenue
        </h1>

        <p className="text-zinc-300 mt-8 text-lg leading-9">
          Imperial Aurum combines cloud mining, renewable energy,
          digital assets, and global network systems to create
          long-term sustainable value.
        </p>

      </div>

            {/* Revenue Sections */}

      <div className="relative z-10 max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">

        {/* Cloud Mining */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white/5 backdrop-blur-xl border border-yellow-500/20 p-8 rounded-3xl
          hover:-translate-y-2 hover:border-yellow-400 hover:shadow-[0_0_40px_rgba(250,204,21,0.25)]
          transition-all duration-500"
        >
          <div className="text-4xl mb-4">🚀</div>
          <h3 className="text-2xl font-bold text-yellow-400 mb-4">
            Cloud Mining Infrastructure
          </h3>
          
          <p className="text-zinc-200 text-lg leading-9">
            We operate advanced cloud mining systems running 24/7/365,
            generating consistent digital asset output that powers platform liquidity.
          </p>
        </motion.div>

        {/* Solar Energy */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white/5 backdrop-blur-xl border border-yellow-500/20 p-8 rounded-3xl
          hover:-translate-y-2 hover:border-yellow-400 hover:shadow-[0_0_40px_rgba(250,204,21,0.25)]
          transition-all duration-500"
        >
          <div className="text-4xl mb-4">☀️</div>
          <h3 className="text-2xl font-bold text-yellow-400 mb-4">
            Renewable Energy
          </h3>
          <p className="text-zinc-300 leading-8">
            Strategic investments in solar and clean energy infrastructure
            provide stable long-term revenue streams and reduce operational costs.
          </p>
        </motion.div>

        {/* Digital Assets */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white/5 backdrop-blur-xl border border-yellow-500/20 p-8 rounded-3xl
          hover:-translate-y-2 hover:border-yellow-400 hover:shadow-[0_0_40px_rgba(250,204,21,0.25)]
          transition-all duration-500"
        >
          <div className="text-4xl mb-4">💼</div>
          <h3 className="text-2xl font-bold text-yellow-400 mb-4">
            Digital Asset Management
          </h3>
          <p className="text-zinc-300 leading-8">
            Institutional-grade portfolio strategies diversify risk and ensure
            multiple layers of reliable income generation.
          </p>
        </motion.div>

        {/* Referral System */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white/5 backdrop-blur-xl border border-yellow-500/20 p-8 rounded-3xl
          hover:-translate-y-2 hover:border-yellow-400 hover:shadow-[0_0_40px_rgba(250,204,21,0.25)]
          transition-all duration-500"
        >
          <div className="text-4xl mb-4">🌐</div>
          <h3 className="text-2xl font-bold text-yellow-400 mb-4">
            20-Level Referral Network
          </h3>
          <p className="text-zinc-300 leading-8">
            Our global referral system rewards community growth and network expansion
            across twenty generations.
          </p>
        </motion.div>

        {/* Shared Plan */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white/5 backdrop-blur-xl border border-yellow-500/20 p-8 rounded-3xl
          hover:-translate-y-2 hover:border-yellow-400 hover:shadow-[0_0_40px_rgba(250,204,21,0.25)]
          transition-all duration-500"
        >
          <div className="text-4xl mb-4">🤝</div>
          <h3 className="text-2xl font-bold text-yellow-400 mb-4">
            Shared Plan Ecosystem
          </h3>
          <p className="text-zinc-300 leading-8">
            Collaborative earning structures reward teamwork, engagement,
            and community participation across the platform.
          </p>
        </motion.div>

        {/* Technology */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white/5 backdrop-blur-xl border border-yellow-500/20 p-8 rounded-3xl
          hover:-translate-y-2 hover:border-yellow-400 hover:shadow-[0_0_40px_rgba(250,204,21,0.25)]
          transition-all duration-500"
        >
          <div className="text-4xl mb-4">⚡</div>
          <h3 className="text-2xl font-bold text-yellow-400 mb-4">
            Technology & Security
          </h3>
          <p className="text-zinc-300 leading-8">
            Advanced blockchain systems, AI optimization, and security infrastructure
            ensure stability and performance.
          </p>
        </motion.div>

      </div>

            {/* Sustainable Growth Section */}

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative z-10 max-w-6xl mx-auto mt-24"
      >

        <div className="bg-white/5 backdrop-blur-xl border border-yellow-500/20 rounded-[40px] p-12">

          <h2 className="text-4xl font-bold text-yellow-400 mb-6">
            Sustainable Growth Strategy
          </h2>

          <p className="text-zinc-300 leading-9 text-lg mb-8">

            We focus on long-term infrastructure development,
            renewable energy expansion, mining optimization,
            and global community growth.

            Every revenue stream is reinvested into scaling
            platform capacity, improving efficiency, and ensuring
            continuous stability.

          </p>

          <h3 className="text-2xl font-semibold text-yellow-400 mb-4">
            Our Promise
          </h3>

          <p className="text-zinc-300 leading-9">

            Imperial Aurum stands on transparency, innovation,
            and responsible financial management.

            We are completely dedicated to securing a lucrative,
            stable future for every member while continuously
            evolving our ecosystem to meet global standards.

          </p>

        </div>

      </motion.div>

      {/* End Spacer */}
      <div className="h-24" />

    </section>
  );
}