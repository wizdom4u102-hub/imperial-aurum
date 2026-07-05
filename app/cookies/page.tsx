export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center">
            <span className="text-4xl">🍪</span>
          </div>
          <h1 className="text-5xl font-bold text-yellow-400 tracking-tight">
            Cookies Policy
          </h1>
        </div>

        <p className="text-zinc-300 leading-relaxed text-lg mb-12 max-w-3xl">
          At <span className="text-yellow-400 font-semibold">Imperial Aurum</span>, we use cookies and similar technologies to create a smoother, more personalized experience in our digital empire. 
          This policy explains what cookies are, how we use them, and how you can control them.
        </p>

        <div className="prose prose-invert max-w-none">
          <h2 className="text-3xl font-semibold text-yellow-400 mt-16 mb-6 border-l-4 border-yellow-400 pl-6">
            1. What Are Cookies?
          </h2>
          <p className="text-zinc-300 leading-8 mb-8">
            Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. 
            They help websites remember your preferences, improve functionality, and provide insights into how users interact with the platform.
          </p>

          <h2 className="text-3xl font-semibold text-yellow-400 mt-16 mb-6 border-l-4 border-yellow-400 pl-6">
            2. Why We Use Cookies
          </h2>
          <p className="text-zinc-300 leading-8 mb-10">
            We use cookies to enhance your experience across the Imperial Aurum platform, ensure security, and continuously improve our services.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-zinc-900/60 border border-yellow-400/30 p-7 rounded-2xl">
              <div className="text-yellow-400 text-xl mb-4">🔐 Essential Cookies</div>
              <p className="text-zinc-400">Required for authentication, security, and core platform functions. These cannot be disabled.</p>
            </div>
            
            <div className="bg-zinc-900/60 border border-yellow-400/30 p-7 rounded-2xl">
              <div className="text-yellow-400 text-xl mb-4">📊 Performance &amp; Analytics</div>
              <p className="text-zinc-400">Help us understand how users interact with the platform so we can improve features and mining experience.</p>
            </div>
            
            <div className="bg-zinc-900/60 border border-yellow-400/30 p-7 rounded-2xl">
              <div className="text-yellow-400 text-xl mb-4">🎯 Functional Cookies</div>
              <p className="text-zinc-400">Remember your preferences, language settings, and dashboard customizations.</p>
            </div>
            
            <div className="bg-zinc-900/60 border border-yellow-400/30 p-7 rounded-2xl">
              <div className="text-yellow-400 text-xl mb-4">📣 Marketing Cookies</div>
              <p className="text-zinc-400">Used (only with your consent) to show relevant updates and promotions.</p>
            </div>
          </div>

          <h2 className="text-3xl font-semibold text-yellow-400 mt-16 mb-6 border-l-4 border-yellow-400 pl-6">
            3. How We Use Cookies
          </h2>
          <ul className="space-y-6 text-zinc-300 mb-12">
            <li className="flex gap-4">
              <span className="text-2xl text-yellow-400">→</span>
              <div>
                <strong className="text-yellow-400">Authentication:</strong> Keeping you logged in securely during your mining sessions.
              </div>
            </li>
            <li className="flex gap-4">
              <span className="text-2xl text-yellow-400">→</span>
              <div>
                <strong className="text-yellow-400">Security:</strong> Detecting fraudulent activity and protecting your account.
              </div>
            </li>
            <li className="flex gap-4">
              <span className="text-2xl text-yellow-400">→</span>
              <div>
                <strong className="text-yellow-400">Analytics:</strong> Understanding platform usage to optimize performance and user experience.
              </div>
            </li>
            <li className="flex gap-4">
              <span className="text-2xl text-yellow-400">→</span>
              <div>
                <strong className="text-yellow-400">Preferences:</strong> Remembering your settings so you don&apos;t have to reconfigure everything on every visit.
              </div>
            </li>
          </ul>

          <h2 className="text-3xl font-semibold text-yellow-400 mt-16 mb-6 border-l-4 border-yellow-400 pl-6">
            4. Third-Party Cookies
          </h2>
          <p className="text-zinc-300 leading-8 mb-8">
            We may work with trusted third-party services (such as analytics providers) that set cookies on our behalf. 
            These partners are carefully selected and bound by strict data protection agreements.
          </p>

          <h2 className="text-3xl font-semibold text-yellow-400 mt-16 mb-6 border-l-4 border-yellow-400 pl-6">
            5. Managing Your Cookie Preferences
          </h2>
          <div className="bg-zinc-900/50 border border-yellow-400/20 p-8 rounded-3xl mb-12">
            <p className="text-zinc-300 leading-8 mb-6">
              You have full control over cookies:
            </p>
            <ul className="space-y-4 text-zinc-300">
              <li>• Adjust your browser settings to block or delete cookies</li>
              <li>• Use our in-platform cookie consent manager (where available)</li>
              <li>• Clear cookies through your browser history at any time</li>
            </ul>
            <p className="text-amber-400 text-sm mt-8">
              Note: Disabling certain cookies may affect your experience and limit some platform features.
            </p>
          </div>

          <h2 className="text-3xl font-semibold text-yellow-400 mt-16 mb-6 border-l-4 border-yellow-400 pl-6">
            6. Updates to This Cookies Policy
          </h2>
          <p className="text-zinc-300 leading-8">
            We may update this policy from time to time to reflect changes in our practices or legal requirements. 
            The date at the bottom will indicate when it was last revised. We recommend checking back periodically.
          </p>

          <div className="mt-20 pt-12 border-t border-zinc-800 text-center">
            <p className="text-yellow-400/70 text-sm mb-2">
              Thank you for trusting Imperial Aurum with your digital journey.
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