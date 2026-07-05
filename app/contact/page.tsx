export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-24">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold text-yellow-400 mb-8">
          Contact Us
        </h1>

        <p className="text-zinc-300 leading-8 mb-10">
          Have questions? Our support team is available 24/7.
        </p>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-6">

          <div>
            <p className="text-zinc-400">Email</p>
            <p className="text-white">support@imperialaurum.com</p>
          </div>

          <div>
            <p className="text-zinc-400">Live Chat</p>
            <p className="text-white">Available inside dashboard</p>
          </div>

          <div>
            <p className="text-zinc-400">Response Time</p>
            <p className="text-white">Within 24 hours</p>
          </div>

        </div>

      </div>
    </main>
  );
}