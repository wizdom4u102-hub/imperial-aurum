export default function PaymentSecurity() {
  return (
    <section className="py-20 bg-zinc-950 border-t border-zinc-800">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">

          <span className="uppercase tracking-[6px] text-yellow-400 text-sm">
            Security
          </span>

          <h2 className="text-5xl font-bold mt-4">
            Secure Payments & Trusted Infrastructure
          </h2>

          <p className="text-zinc-400 mt-6 max-w-2xl mx-auto leading-8">
            Imperial Aurum combines secure payment systems,
            blockchain verification, and encrypted infrastructure
            to ensure every transaction remains protected.
          </p>

        </div>

        {/* Payment Methods */}

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">

          {[
            "Bitcoin",
            "Ethereum",
            "USDT",
            "BNB",
            "Visa",
            "Mastercard",
            "Bank",
            "PayPal",
          ].map((item) => (

            <div
              key={item}
              className="
              group
              bg-white/5
              backdrop-blur-xl
              border
              border-yellow-500/20
              rounded-2xl
              py-8
              text-center
              transition-all
              duration-500
              hover:scale-105
              hover:-translate-y-2
              hover:border-yellow-400
              hover:shadow-[0_0_30px_rgba(234,179,8,0.35)]
              "
            >

              <div className="text-yellow-400 text-lg font-semibold transition-transform duration-500 group-hover:scale-110">
                {item}
              </div>

            </div>

          ))}

        </div>

        {/* Security Cards */}

        <div className="grid md:grid-cols-4 gap-8 mt-16">

          {/* Card */}

          <div
            className="
            group
            bg-white/5
            backdrop-blur-xl
            rounded-3xl
            p-8
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

            <div className="text-5xl mb-5 transition-transform duration-500 group-hover:scale-125">
              🔒
            </div>

            <h3 className="font-bold text-2xl mb-3">
              SSL Encryption
            </h3>

            <p className="text-zinc-400 leading-7">
              Military-grade encrypted communication protects every user session.
            </p>

          </div>

          {/* Card */}

          <div
            className="
            group
            bg-white/5
            backdrop-blur-xl
            rounded-3xl
            p-8
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

            <div className="text-5xl mb-5 transition-transform duration-500 group-hover:scale-125">
              🛡️
            </div>

            <h3 className="font-bold text-2xl mb-3">
              Secure Wallets
            </h3>

            <p className="text-zinc-400 leading-7">
              Digital assets are stored using advanced wallet protection technologies.
            </p>

          </div>

          {/* Card */}

          <div
            className="
            group
            bg-white/5
            backdrop-blur-xl
            rounded-3xl
            p-8
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

            <div className="text-5xl mb-5 transition-transform duration-500 group-hover:scale-125">
              🌍
            </div>

            <h3 className="font-bold text-2xl mb-3">
              Worldwide Access
            </h3>

            <p className="text-zinc-400 leading-7">
              Members from over 100 countries trust Imperial Aurum every day.
            </p>

          </div>

          {/* Card */}

          <div
            className="
            group
            bg-white/5
            backdrop-blur-xl
            rounded-3xl
            p-8
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

            <div className="text-5xl mb-5 transition-transform duration-500 group-hover:scale-125">
              ✔
            </div>

            <h3 className="font-bold text-2xl mb-3">
              Verified Platform
            </h3>

            <p className="text-zinc-400 leading-7">
              Built with transparency, reliability, and modern security standards.
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}