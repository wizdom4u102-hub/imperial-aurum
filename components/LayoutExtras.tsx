"use client";

import { usePathname } from "next/navigation";
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

    </>
  );
}
