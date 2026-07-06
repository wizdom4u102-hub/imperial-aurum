import AppNavbar from "@/components/AppNavbar";
import type { Metadata } from "next";
import CookieBanner from "@/components/CookieBanner";
import Script from "next/script";
import LayoutExtras from "@/components/LayoutExtras";
import "./globals.css";

export const metadata: Metadata = {
  title: "Imperial Aurum",
  description: "Premium investment and wealth management platform.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col overflow-x-hidden bg-zinc-950 text-white">

        <AppNavbar />

        <LayoutExtras />

        <main className="flex-1 pt-20 w-full">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XT4YYHBGMG"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config','G-XT4YYHBGMG',{
              page_path: window.location.pathname,
            });
          `}
        </Script>

        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)}
              t=l.createElement(r)
              t.async=1
              t.src="https://www.clarity.ms/tag/"+i
              y=l.getElementsByTagName(r)[0]
              y.parentNode.insertBefore(t,y)
            })(window,document,"clarity","script","xdjf6pogkt")
          `}
        </Script>

        <CookieBanner />

      </body>
    </html>
  );
}