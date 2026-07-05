"use client";

import { usePathname } from "next/navigation";
import CookieBanner from "@/components/CookieBanner";
import LanguageSelector from "@/components/LanguageSelector";
import Script from "next/script";

export default function LayoutExtras() {
  const pathname = usePathname();

  const hideExtras =
    pathname.startsWith("/admin");

  if (hideExtras) {
    return null;
  }

  return (
    <>
      {/* Google Translate */}
      <div className="fixed bottom-6 left-6 z-50">
        <LanguageSelector />
      </div>

      {/* Smartsupp */}
      <Script
        id="live-chat"
        strategy="afterInteractive"
      >
        {`
          window._smartsupp = window._smartsupp || {};
          window._smartsupp.key = "6df9a8ec6a5b3911664f283a72f6efb96ea4390d";

          window.smartsupp = window.smartsupp || function () {
            (window.smartsupp._ = window.smartsupp._ || []).push(arguments);
          };

          const s = document.createElement("script");
          s.async = true;
          s.src = "https://www.smartsuppchat.com/loader.js";
          document.head.appendChild(s);
        `}
      </Script>

      <noscript>
        Powered by{" "}
        <a
          href="https://www.smartsupp.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Smartsupp
        </a>
      </noscript>

      <CookieBanner />
    </>
  );
}