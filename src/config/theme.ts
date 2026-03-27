// ============================================
// LANDING THEME — фирменные цвета из miniapp
// ============================================

export const theme = {
  colors: {
    background: "#0f0f14",
    backgroundAlt: "#050505",
    backgroundSection: "#0a0a10",
    surface: "rgba(255,255,255,0.06)",
    surfaceHover: "rgba(255,255,255,0.1)",
    border: "rgba(255,255,255,0.08)",
    borderLight: "rgba(255,255,255,0.06)",
    borderAccent: "rgba(255,140,0,0.2)",

    textPrimary: "#fff",
    textSecondary: "rgba(255,255,255,0.6)",
    textTertiary: "rgba(255,255,255,0.35)",
    textMuted: "rgba(255,255,255,0.15)",

    accent: "#ff8c00",
    accentDark: "#ff6b00",
    accentBg: "rgba(255,140,0,0.12)",
    accentBgLight: "rgba(255,140,0,0.08)",
    accentBgHover: "rgba(255,140,0,0.15)",
    accentBorder: "rgba(255,140,0,0.4)",
    accentShadow: "rgba(255,140,0,0.3)",

    success: "#52c41a",
    successBg: "rgba(82,196,26,0.07)",

    danger: "#ff4b2b",
  },

  gradients: {
    primary: "linear-gradient(135deg, #ff8c00, #ff6b00)",
    page: "linear-gradient(160deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
    hero: "linear-gradient(160deg, #050505 0%, #0f0f1a 40%, #1a1a2e 100%)",
    section: "linear-gradient(180deg, #0a0a10 0%, #0f0f14 100%)",
    glow: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,140,0,0.12) 0%, transparent 60%)",
    glowStrong: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(255,140,0,0.2) 0%, transparent 50%)",
    card: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
    cardAccent: "linear-gradient(135deg, rgba(255,140,0,0.12) 0%, rgba(255,140,0,0.04) 100%)",
    footer: "linear-gradient(180deg, #0a0a10 0%, #050505 100%)",
  },

  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    pill: 999,
  },

  shadows: {
    card: "0 4px 32px rgba(0,0,0,0.4), 0 1px 4px rgba(0,0,0,0.2)",
    button: "0 4px 20px rgba(255,140,0,0.4), 0 1px 4px rgba(0,0,0,0.2)",
    glow: "0 0 60px rgba(255,140,0,0.15)",
    phone: "0 32px 80px rgba(0,0,0,0.6), 0 8px 32px rgba(255,140,0,0.1)",
  },

  blur: {
    sm: "blur(8px)",
    md: "blur(16px)",
    lg: "blur(24px)",
    header: "blur(20px) saturate(1.4)",
  },

  transitions: {
    fast: "0.15s ease",
    normal: "0.25s ease",
    smooth: "0.35s cubic-bezier(0.4, 0, 0.2, 1)",
    spring: "0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
} as const;

export type Theme = typeof theme;
