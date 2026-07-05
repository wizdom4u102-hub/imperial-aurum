export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center">
            <span className="text-3xl">🛡️</span>
          </div>
          <h1 className="text-5xl font-bold text-yellow-400 tracking-tight">
            Privacy Policy
          </h1>
        </div>

        <p className="text-zinc-300 leading-relaxed text-lg mb-12 max-w-3xl">
          At <span className="text-yellow-400 font-semibold">Imperial Aurum</span>, we believe that trust is the most valuable asset in the digital gold rush. 
          We're committed to protecting your privacy with the same relentless dedication we apply to securing your mining operations and rewards. 
          This Privacy Policy explains how we collect, use, safeguard, and respect your personal information — transparently and without the usual legal jargon overload.
        </p>

        <div className="prose prose-invert max-w-none">
          <h2 className="text-3xl font-semibold text-yellow-400 mt-16 mb-6 border-l-4 border-yellow-400 pl-6">
            1. Information We Collect
          </h2>
          <p className="text-zinc-300 leading-8 mb-8">
            We collect only what we need to deliver an exceptional experience and keep your account secure. This includes:
          </p>
          <ul className="list-disc pl-8 space-y-3 text-zinc-300 mb-10">
            <li><strong>Account Information:</strong> Name, email address, username, and wallet addresses you connect.</li>
            <li><strong>Transaction & Mining Data:</strong> Details of your mining activities, rewards earned, referrals, and blockchain transactions.</li>
            <li><strong>Usage Analytics:</strong> How you interact with the platform — pages visited, features used, session duration — to help us improve.</li>
            <li><strong>Device & Technical Data:</strong> IP address, browser type, operating system, and device identifiers (all handled responsibly).</li>
            <li><strong>Referral & Community Data:</strong> Information about users you invite and their activity, so we can properly reward you both.</li>
          </ul>

          <h2 className="text-3xl font-semibold text-yellow-400 mt-16 mb-6 border-l-4 border-yellow-400 pl-6">
            2. How We Use Your Data
          </h2>
          <p className="text-zinc-300 leading-8 mb-8">
            Your data fuels the empire — but always in ways that benefit you and the community:
          </p>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-zinc-900/50 border border-yellow-400/20 p-6 rounded-2xl">
              <h3 className="text-yellow-400 font-medium mb-3">🔨 Core Operations</h3>
              <p className="text-zinc-400">Managing your account, processing mining rewards, and tracking referrals.</p>
            </div>
            <div className="bg-zinc-900/50 border border-yellow-400/20 p-6 rounded-2xl">
              <h3 className="text-yellow-400 font-medium mb-3">🛡️ Security & Protection</h3>
              <p className="text-zinc-400">Preventing fraud, detecting suspicious activity, and keeping bad actors out.</p>
            </div>
            <div className="bg-zinc-900/50 border border-yellow-400/20 p-6 rounded-2xl">
              <h3 className="text-yellow-400 font-medium mb-3">📈 Platform Improvement</h3>
              <p className="text-zinc-400">Analyzing usage patterns to build better features and smoother experiences.</p>
            </div>
            <div className="bg-zinc-900/50 border border-yellow-400/20 p-6 rounded-2xl">
              <h3 className="text-yellow-400 font-medium mb-3">📣 Communication</h3>
              <p className="text-zinc-400">Sending important updates, reward notifications, and (only with your consent) exciting offers.</p>
            </div>
          </div>

          <h2 className="text-3xl font-semibold text-yellow-400 mt-16 mb-6 border-l-4 border-yellow-400 pl-6">
            3. Cookies, Tracking & Technology
          </h2>
          <p className="text-zinc-300 leading-8 mb-6">
            Like any modern digital fortress, we use cookies and similar technologies to make your experience seamless. 
            You can manage these preferences through your browser settings at any time. We also work with trusted analytics partners to understand platform performance — never for creepy targeted advertising.
          </p>

          <h2 className="text-3xl font-semibold text-yellow-400 mt-16 mb-6 border-l-4 border-yellow-400 pl-6">
            4. Sharing & Third Parties
          </h2>
          <p className="text-zinc-300 leading-8 mb-8">
            We do not sell your personal data. Ever. We only share information in these limited cases:
          </p>
          <ul className="list-disc pl-8 space-y-3 text-zinc-300 mb-10">
            <li>With service providers who help us run the platform (e.g., hosting, analytics, payment processors) under strict confidentiality agreements.</li>
            <li>When required by law or to protect our rights, users, or the public.</li>
            <li>In the event of a business transfer (merger, acquisition, etc.), with appropriate protections in place.</li>
          </ul>

          <h2 className="text-3xl font-semibold text-yellow-400 mt-16 mb-6 border-l-4 border-yellow-400 pl-6">
            5. Data Security
          </h2>
          <p className="text-zinc-300 leading-8 mb-6">
            We treat your data with the same care as the rarest aurum. Industry-leading encryption, multi-factor authentication options, regular security audits, 
            and a dedicated team monitoring for threats keep your information locked down tighter than a vault in the imperial mines.
          </p>

          <h2 className="text-3xl font-semibold text-yellow-400 mt-16 mb-6 border-l-4 border-yellow-400 pl-6">
            6. Your Rights & Choices
          </h2>
          <p className="text-zinc-300 leading-8 mb-8">
            You are in control. Depending on your location and applicable laws, you may have rights to:
          </p>
          <ul className="grid md:grid-cols-2 gap-4 text-zinc-300 mb-10">
            <li className="flex items-start gap-3"><span className="text-yellow-400 mt-1">→</span> Access your personal data</li>
            <li className="flex items-start gap-3"><span className="text-yellow-400 mt-1">→</span> Correct inaccurate information</li>
            <li className="flex items-start gap-3"><span className="text-yellow-400 mt-1">→</span> Request deletion of your data</li>
            <li className="flex items-start gap-3"><span className="text-yellow-400 mt-1">→</span> Opt out of certain processing</li>
            <li className="flex items-start gap-3"><span className="text-yellow-400 mt-1">→</span> Data portability</li>
            <li className="flex items-start gap-3"><span className="text-yellow-400 mt-1">→</span> Withdraw consent where applicable</li>
          </ul>
          <p className="text-zinc-300 leading-8">
            To exercise these rights, simply contact us at <span className="text-yellow-400">privacy@imperialaurum.com</span>.
          </p>

          <h2 className="text-3xl font-semibold text-yellow-400 mt-16 mb-6 border-l-4 border-yellow-400 pl-6">
            7. Children's Privacy
          </h2>
          <p className="text-zinc-300 leading-8">
            Our platform is not intended for children under 18. We do not knowingly collect data from minors. If we discover we've inadvertently done so, we'll delete it promptly.
          </p>

          <h2 className="text-3xl font-semibold text-yellow-400 mt-16 mb-6 border-l-4 border-yellow-400 pl-6">
            8. International Transfers
          </h2>
          <p className="text-zinc-300 leading-8">
            As a global operation, your data may be transferred to and processed in countries outside your own. We ensure appropriate safeguards are in place to maintain the same high level of protection.
          </p>

          <h2 className="text-3xl font-semibold text-yellow-400 mt-16 mb-6 border-l-4 border-yellow-400 pl-6">
            9. Changes to This Policy
          </h2>
          <p className="text-zinc-300 leading-8">
            We may update this Privacy Policy from time to time. The "Last Updated" date at the bottom will always reflect the most recent version. 
            We encourage you to review it periodically. Significant changes will be communicated via email or prominent notice on the platform.
          </p>

          <div className="mt-20 pt-10 border-t border-zinc-800 text-center">
            <p className="text-yellow-400/70 text-sm mb-2">Imperial Aurum — Project You Can Trust</p>
            <p className="text-zinc-500 text-sm">
              Last updated: June 30, 2025
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}