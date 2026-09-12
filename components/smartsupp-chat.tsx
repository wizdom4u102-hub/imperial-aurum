"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";

export default function SmartsuppChat() {
  const pathname = usePathname();

  // Never load Smartsupp anywhere in the admin area.
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return null;
  }

  return (
    <Script id="smartsupp-live-chat" strategy="afterInteractive">
      {`
        var _smartsupp = _smartsupp || {};
        _smartsupp.key = '5ab2f9e58c3767cfb63eeac9898d047a22d2b4b8';

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