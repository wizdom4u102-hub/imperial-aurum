export default function AboutCEO() {
  return (
    <section className="py-24 px-6 relative">

      {/* Glass Card */}
      <div className="max-w-5xl mx-auto bg-white/5 backdrop-blur-xl border border-yellow-500/20 rounded-3xl p-10 md:p-16 text-center shadow-2xl">

        {/* Gold Icon */}
        <div className="text-5xl mb-6">👑</div>

        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-6">
          Message From The CEO
        </h2>

        {/* Message */}
        <p className="text-zinc-300 leading-8 text-lg">
          Welcome to <span className="text-yellow-400 font-semibold">Imperial Aurum</span>, where innovation meets opportunity.
          Our mission is simple — to make digital gold mining accessible, transparent, and profitable for everyone.
          <br /><br />
          We built this platform to eliminate barriers like expensive hardware, technical complexity, and high energy costs.
          Instead, we give you a powerful, automated mining system that works 24/7 for you.
          <br /><br />
          Your success is our success. That is why we are committed to long-term sustainability, security, and continuous growth of this ecosystem.
        </p>

        {/* Signature */}
        <div className="mt-10 text-yellow-400 font-semibold text-xl">
          — CEO, Imperial Aurum
        </div>
      </div>
    </section>
  )
}