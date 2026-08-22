export const tradingBotStyles = {
  page:
    "min-h-screen bg-[#050816] text-white",

  container:
    "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8",

  glassCard:
    [
      "bg-[rgba(255,255,255,0.04)]",
      "border",
      "border-[rgba(255,255,255,0.10)]",
      "backdrop-blur-xl",
      "rounded-2xl",
      "shadow-[0_20px_50px_rgba(0,0,0,0.35)]",
    ].join(" "),

  heading:
    "text-white font-semibold tracking-tight",

  subText:
    "text-[#A1A1AA]",

  goldText:
    "text-[#D4AF37]",

  goldButton:
    [
      "bg-gradient-to-r",
      "from-[#D4AF37]",
      "to-[#F5D76E]",
      "text-black",
      "font-semibold",
      "rounded-xl",
      "transition",
      "hover:opacity-90",
      "active:scale-[0.98]",
    ].join(" "),

  secondaryButton:
    [
      "border",
      "border-[rgba(255,255,255,0.10)]",
      "text-white",
      "rounded-xl",
      "bg-[rgba(255,255,255,0.04)]",
      "hover:bg-[rgba(255,255,255,0.08)]",
      "transition",
    ].join(" "),

  badge:
    [
      "inline-flex",
      "items-center",
      "rounded-full",
      "px-3",
      "py-1",
      "text-xs",
      "font-medium",
      "bg-[rgba(212,175,55,0.12)]",
      "text-[#F5D76E]",
      "border",
      "border-[rgba(212,175,55,0.25)]",
    ].join(" "),
} as const;