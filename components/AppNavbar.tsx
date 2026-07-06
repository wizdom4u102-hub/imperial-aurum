"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function AppNavbar() {
  const pathname = usePathname();

  const hideNavbar =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/deposit") ||
    pathname.startsWith("/withdraw") ||
    pathname.startsWith("/shared-plans") ||
    pathname.startsWith("/history") ||
    pathname.startsWith("/referrals") ||
    pathname.startsWith("/wallets") ||
    pathname.startsWith("/convert");

  if (hideNavbar) return null;

  return <Navbar />;
}