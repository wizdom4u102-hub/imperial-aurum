"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function AppNavbar() {
  const pathname = usePathname();

  const hideNavbar =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/dashboard");

  if (hideNavbar) return null;

  return <Navbar />;
}