import Image from "next/image";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Michael Anderson",
      country: "🇺🇸 United States",
      amount: "$48,500",
      image: "/images/testimonials/michael.jpg",
      text: "Imperial Aurum has completely changed my investment journey. Daily rewards are consistent and withdrawals have always been processed smoothly.",
    },
    {
      name: "Sophia Williams",
      country: "🇬🇧 United Kingdom",
      amount: "$31,200",
      image: "/images/testimonials/sophia.jpg",
      text: "The dashboard is extremely easy to use. I especially love the referral program which has become another major source of income.",
    },
    {
      name: "David Müller",
      country: "🇩🇪 Germany",
      amount: "$76,900",
      image: "/images/testimonials/david.jpg",
      text: "Professional platform, transparent transactions, and excellent customer support. One of the best cloud mining experiences I've had.",
    },
  ];

  return (
    <section className="py-24 bg-zinc-950">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">

          <span className="uppercase tracking-[6px] text-yellow-400 text-sm">
            Testimonials
          </span>

          <h2 className="text-5xl font-bold mt-4">
            Trusted By Investors Worldwide
          </h2>

          <p className="text-zinc-400 mt-6 max-w-2xl mx-auto">
            Thousands of members continue to grow their portfolios through
            Imperial Aurum's cloud mining platform.
          </p>

        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {testimonials.map((item, index) => (

            <div
              key={index}
              className="
              group
              relative
              bg-white/5
              backdrop-blur-xl
              border
              border-yellow-500/20
              rounded-3xl
              p-8
              transition-all
              duration-500
              hover:scale-105
              hover:-translate-y-3
              hover:border-yellow-400
              hover:shadow-[0_0_40px_rgba(234,179,8,0.35)]
              "
            >

              {/* Quote */}

              <div className="absolute top-6 right-6 text-5xl text-yellow-400 opacity-20 group-hover:opacity-60 transition">
                ❝
              </div>

              {/* Avatar */}

              <div className="flex justify-center mb-6">

                <Image
                  src={item.image}
                  alt={item.name}
                  width={90}
                  height={90}
                  className="rounded-full border-4 border-yellow-400 object-cover"
                />

              </div>

              {/* Testimony */}

              <p className="text-zinc-300 leading-8 italic text-center mb-8">
                "{item.text}"
              </p>

              {/* Footer */}

              <div className="border-t border-zinc-800 pt-6 text-center">

                <h3 className="text-xl font-bold">
                  {item.name}
                </h3>

                <p className="text-zinc-500 mt-1">
                  {item.country}
                </p>

                <div className="mt-5 text-yellow-400 uppercase tracking-widest text-sm">
                  Total Earnings
                </div>

                <div className="text-4xl font-bold mt-2 text-white">
                  {item.amount}
                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}