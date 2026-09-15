"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

declare global {
  interface Window {
    smartsupp?: {
      (...args: unknown[]): void;
      _: unknown[];
    };
  }
}

const SMARTSUPP_KEY =
  "5ab2f9e58c3767cfb63eeac9898d047a22d2b4b8";

export default function SmartsuppChat() {
  const pathname = usePathname();

  // Never load Smartsupp anywhere in the admin area.
  const isAdmin =
    pathname === "/admin" ||
    pathname.startsWith("/admin/");

  useEffect(() => {
    if (isAdmin) {
      return;
    }

    const sendPageview = () => {
      const smartsupp = window.smartsupp;

      if (typeof smartsupp !== "function") {
        return;
      }

      const currentUrl =
        window.location.origin + pathname;

      /*
       * Notify Smartsupp when the Next.js route changes.
       *
       * This is important because Next.js App Router navigation
       * does not perform a full browser page reload.
       */
      smartsupp("pageview", currentUrl);
    };

    // Give the Smartsupp loader time to initialize.
    const timer = window.setTimeout(
      sendPageview,
      1000
    );

    return () => {
      window.clearTimeout(timer);
    };
  }, [pathname, isAdmin]);

  if (isAdmin) {
    return null;
  }

  return (
    <Script
      id="smartsupp-live-chat"
      strategy="afterInteractive"
    >
      {`
        var _smartsupp = _smartsupp || {};
        _smartsupp.key = '${SMARTSUPP_KEY}';

        window.smartsupp || (function(d) {
          var s, c, o = smartsupp = function() {
            o._.push(arguments);
          };

          o._ = [];

          s = d.getElementsByTagName('script')[0];
          c = d.createElement('script');

          c.type = 'text/javascript';
          c.charset = 'utf-8';
          c.async = true;
          c.src = 'https://www.smartsuppchat.com/loader.js?';

          s.parentNode.insertBefore(c, s);
        })(document);
      `}
    </Script>
  );
}