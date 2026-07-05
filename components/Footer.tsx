import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-yellow-500/20">

      <div className="max-w-7xl mx-auto px-6 py-20">

        <div className="grid lg:grid-cols-4 gap-12">

          {/* Company */}

          <div>

            <h2 className="text-3xl font-bold text-yellow-400 mb-6">
              Imperial Aurum
            </h2>

            <p className="text-zinc-400 leading-8">

              Imperial Aurum is a premium digital gold cloud mining platform
              built to provide secure mining opportunities, transparent
              investments, and sustainable long-term growth.

            </p>

          </div>

          {/* Company */}

          <div>

            <h3 className="text-xl font-semibold mb-6 text-white">
              Company
            </h3>

            <div className="space-y-4">

              <Link href="/" className="block text-zinc-400 hover:text-yellow-400">
                Home
              </Link>

              <Link href="/about" className="block text-zinc-400 hover:text-yellow-400">
                About Us
              </Link>

              <Link href="/leadership" className="block text-zinc-400 hover:text-yellow-400">
                Leadership
              </Link>

              <Link href="/plans" className="block text-zinc-400 hover:text-yellow-400">
                Investment Plans
              </Link>

            </div>

          </div>

          {/* Platform */}

          <div>

            <h3 className="text-xl font-semibold mb-6 text-white">
              Platform
            </h3>

            <div className="space-y-4">

              <Link href="/referral" className="block text-zinc-400 hover:text-yellow-400">
                Referral Program
              </Link>

              <Link href="/shared-plans" className="block text-zinc-400 hover:text-yellow-400">
                Shared Plan
              </Link>

              <Link href="/faq" className="block text-zinc-400 hover:text-yellow-400">
                FAQ
              </Link>

              <Link href="/contact" className="block text-zinc-400 hover:text-yellow-400">
                Contact
              </Link>

            </div>

          </div>

          {/* Support */}

          <div>

            <h3 className="text-xl font-semibold mb-6 text-white">
              Contact
            </h3>

            <div className="space-y-4 text-zinc-400">

              <p>
                🌍 Serving Members Worldwide
              </p>

              <p>
                💬 Live Chat Support
              </p>

              <p>
                📧 support@imperialaurum.com
              </p>

              <p>
                🕒 24 Hours / 7 Days
              </p>

            </div>

          </div>

        </div>

        <div className="border-t border-zinc-800 mt-16 pt-10 flex flex-col lg:flex-row justify-between items-center gap-6">

          <div className="text-zinc-500 text-center lg:text-left">

            © 2026 Imperial Aurum.

            All Rights Reserved.

          </div>

          <div className="flex gap-8">

            <Link
              href="/privacy-policy"
              className="text-zinc-500 hover:text-yellow-400"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="text-zinc-500 hover:text-yellow-400"
            >
              Terms
            </Link>

            <Link
              href="/cookies"
              className="text-zinc-500 hover:text-yellow-400"
            >
              Cookies
            </Link>

          </div>

        </div>

      </div>

    </footer>
  );
}