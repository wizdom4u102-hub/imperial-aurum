export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center">
            <span className="text-4xl">📜</span>
          </div>
          <h1 className="text-5xl font-bold text-yellow-400 tracking-tight">
            Terms &amp; Conditions
          </h1>
        </div>

        <div className="text-zinc-300 leading-relaxed text-lg mb-12 max-w-3xl">
          Welcome to the <span className="text-yellow-400 font-semibold">Imperial Aurum</span> empire. 
          By accessing or using our platform, you agree to be bound by these Terms &amp; Conditions. 
          These rules form the foundation of our digital kingdom — read them carefully, as they protect both you and the realm.
        </div>

        <div className="prose prose-invert max-w-none">
          <h2 className="text-3xl font-semibold text-yellow-400 mt-16 mb-6 border-l-4 border-yellow-400 pl-6">
            1. Acceptance of Terms
          </h2>
          <p className="text-zinc-300 leading-8 mb-8">
            These Terms constitute a legally binding agreement between you and Imperial Aurum. 
            If you do not agree with any part of these terms, you must not use our services. 
            Continued use means you accept all conditions outlined here.
          </p>

          <h2 className="text-3xl font-semibold text-yellow-400 mt-16 mb-6 border-l-4 border-yellow-400 pl-6">
            2. Eligibility &amp; Account Registration
          </h2>
          <p className="text-zinc-300 leading-8 mb-6">
            You must be at least 18 years old (or the legal age of majority in your jurisdiction) to use Imperial Aurum. 
            By creating an account, you represent that all information provided is accurate, complete, and truthful.
          </p>
          <p className="text-zinc-300 leading-8">
            You are responsible for maintaining the confidentiality of your account credentials and all activities that occur under your account.
          </p>

          <h2 className="text-3xl font-semibold text-yellow-400 mt-16 mb-6 border-l-4 border-yellow-400 pl-6">
            3. User Responsibilities &amp; Conduct
          </h2>
          <div className="bg-zinc-900/50 border border-yellow-400/20 p-8 rounded-3xl mb-10">
            <p className="text-zinc-300 mb-6">As a citizen of the Imperial Aurum realm, you agree to:</p>
            <ul className="space-y-4 text-zinc-300">
              <li className="flex gap-3"><span className="text-yellow-400 font-bold">•</span> Provide accurate and up-to-date information</li>
              <li className="flex gap-3"><span className="text-yellow-400 font-bold">•</span> Use the platform responsibly and in compliance with all applicable laws</li>
              <li className="flex gap-3"><span className="text-yellow-400 font-bold">•</span> Not engage in any fraudulent, abusive, or harmful activities</li>
              <li className="flex gap-3"><span className="text-yellow-400 font-bold">•</span> Respect the rights of other users and the platform</li>
            </ul>
          </div>

          <h2 className="text-3xl font-semibold text-yellow-400 mt-16 mb-6 border-l-4 border-yellow-400 pl-6">
            4. Risk Disclosure
          </h2>
          <div className="bg-amber-950/30 border-l-4 border-amber-500 p-8 rounded-r-3xl mb-10">
            <p className="text-amber-300 font-medium mb-4">⚠️ IMPORTANT RISK WARNING</p>
            <p className="text-zinc-300 leading-8">
           Cryptocurrency mining, staking, and related investment activities involve significant financial risk. The value of digital assets is highly volatile and can fluctuate substantially in a short period.
You may lose some of your invested capital. Imperial Aurum guarantee returns of your, profits, yields, or the safety of your principal. Only for users in Imperial Aurum Shared Plan, Because you are in a fixt deposit and fixt profit.
We strongly encourage all participants to conduct thorough due diligence (DYOR), understand the inherent risks, and only invest funds they can afford to lose. Imperial Aurum is committed to transparency, but users are solely responsible for their investment decisions.
            </p>
            <p className="text-zinc-400 mt-6 text-sm">
              You acknowledge that you are solely responsible for your investment decisions and any resulting losses. If you go against Imperial Aurum policy.
            </p>
          </div>

          <h2 className="text-3xl font-semibold text-yellow-400 mt-16 mb-6 border-l-4 border-yellow-400 pl-6">
            5. Prohibited Activities
          </h2>
          <p className="text-zinc-300 leading-8 mb-6">
            You may not use the platform for any of the following:
          </p>
          <ul className="list-disc pl-8 space-y-3 text-zinc-300 mb-10">
            <li>Any illegal activity, money laundering, or terrorist financing</li>
            <li>Attempting to gain unauthorized access to the platform or other users&apos; accounts</li>
            <li>Interfering with the proper functioning of the service</li>
            <li>Spamming, phishing, or distributing malware</li>
            <li>Using automated scripts, bots, or scraping tools without permission</li>
            <li>Impersonating any person or entity</li>
          </ul>

          <h2 className="text-3xl font-semibold text-yellow-400 mt-16 mb-6 border-l-4 border-yellow-400 pl-6">
            6. Intellectual Property
          </h2>
          <p className="text-zinc-300 leading-8">
            All content, logos, designs, and technology behind Imperial Aurum are the exclusive property of the platform. 
            You are granted a limited, revocable license to use the service for personal, non-commercial purposes.
          </p>

          <h2 className="text-3xl font-semibold text-yellow-400 mt-16 mb-6 border-l-4 border-yellow-400 pl-6">
            7. Platform Rights &amp; Modifications
          </h2>
          <p className="text-zinc-300 leading-8 mb-8">
            We reserve the right to modify, suspend, or discontinue any part of the service at any time, with or without notice. 
            We may also update these Terms periodically — continued use after changes constitutes acceptance of the new terms.
          </p>

          <h2 className="text-3xl font-semibold text-yellow-400 mt-16 mb-6 border-l-4 border-yellow-400 pl-6">
            8. Termination
          </h2>
          <p className="text-zinc-300 leading-8">
            We may terminate or suspend your account at our sole discretion if you violate these Terms, engage in prohibited conduct, 
            or for any other reason. You may also terminate your account at any time by contacting support.
          </p>

          <h2 className="text-3xl font-semibold text-yellow-400 mt-16 mb-6 border-l-4 border-yellow-400 pl-6">
            9. Limitation of Liability
          </h2>
          <p className="text-zinc-300 leading-8">
            To the maximum extent permitted by law, Imperial Aurum shall not be liable for any indirect, incidental, special, 
            consequential, or punitive damages arising out of your use of the service.
          </p>

          <h2 className="text-3xl font-semibold text-yellow-400 mt-16 mb-6 border-l-4 border-yellow-400 pl-6">
            10. Indemnification
          </h2>
          <p className="text-zinc-300 leading-8">
            You agree to indemnify and hold Imperial Aurum, its team, and affiliates harmless from any claims, losses, 
            or damages arising from your violation of these Terms or your use of the platform.
          </p>

          <h2 className="text-3xl font-semibold text-yellow-400 mt-16 mb-6 border-l-4 border-yellow-400 pl-6">
            11. Governing Law
          </h2>
          <p className="text-zinc-300 leading-8">
            These Terms shall be governed by the laws of the jurisdiction in which Imperial Aurum operates, without regard to conflict of laws principles.
          </p>

          <div className="mt-20 pt-12 border-t border-zinc-800 text-center">
            <p className="text-yellow-400/70 text-sm mb-2">
              By continuing to build your empire with Imperial Aurum, you accept these terms.
            </p>
            <p className="text-zinc-500 text-sm">
              Last updated: June 30, 2026
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}