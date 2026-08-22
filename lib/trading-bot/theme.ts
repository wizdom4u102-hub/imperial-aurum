export const tradingBotTheme = {
  colors: {
    background: "#050816",

    card: "rgba(255,255,255,0.04)",

    border: "rgba(255,255,255,0.10)",

    gold: "#D4AF37",

    goldGlow: "#F5D76E",

    success: "#22C55E",

    danger: "#EF4444",

    textPrimary: "#FFFFFF",

    textSecondary: "#A1A1AA",
  },

  gradients: {
    gold:
      "linear-gradient(135deg, #D4AF37 0%, #F5D76E 100%)",

    background:
      "linear-gradient(180deg, #050816 0%, #020617 100%)",

    card:
      "linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
  },

  shadows: {
    gold:
      "0 0 30px rgba(212,175,55,0.25)",

    card:
      "0 20px 50px rgba(0,0,0,0.35)",
  },

  radius: {
    card: "1rem",

    button: "0.75rem",
  },
} as const;


export type TradingBotTheme =
  typeof tradingBotTheme;