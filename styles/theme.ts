// タロットアプリのテーマカラー
export const theme = {
  colors: {
    // メインカラー
    primary: {
      main: "#9333ea", // パープル
      light: "#a855f7",
      dark: "#7e22ce",
      contrast: "#ffffff",
    },
    // アクセントカラー
    accent: {
      main: "#f59e0b", // アンバー
      light: "#fbbf24",
      dark: "#d97706",
      contrast: "#000000",
    },
    // 背景色
    background: {
      main: "#0f172a", // ダークブルー
      card: "#1e293b",
      paper: "#334155",
      light: "#f8fafc",
    },
    // テキストカラー
    text: {
      primary: "#f8fafc",
      secondary: "#cbd5e1",
      muted: "#94a3b8",
      dark: "#1e293b",
    },
    // 機能色
    functional: {
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#3b82f6",
    },
    // グラデーション
    gradients: {
      primary: "linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)",
      accent: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      dark: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      mystical: "linear-gradient(135deg, #9333ea 0%, #3b82f6 100%)",
    },
  },
  // 影の設定
  shadows: {
    sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
    outline: "0 0 0 3px rgba(147, 51, 234, 0.5)",
    card: "0 4px 6px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)",
    magical: "0 0 15px rgba(147, 51, 234, 0.5)",
  },
  // 角丸の設定
  borderRadius: {
    sm: "0.125rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    "2xl": "1rem",
    "3xl": "1.5rem",
    full: "9999px",
  },
  // アニメーションの設定
  animation: {
    fast: "0.15s ease-in-out",
    normal: "0.3s ease-in-out",
    slow: "0.5s ease-in-out",
    bounce: "0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)",
  },
  // フォントの設定
  typography: {
    fontFamily: {
      main: 'var(--font-main, "Noto Sans JP", sans-serif)',
      display: 'var(--font-display, "Cinzel", serif)',
      mono: 'var(--font-mono, "JetBrains Mono", monospace)',
    },
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  // レスポンシブブレイクポイント
  breakpoints: {
    xs: "320px",
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
}

// 型定義
export type Theme = typeof theme
export type ThemeColors = typeof theme.colors
export type ThemeShadows = typeof theme.shadows
export type ThemeBorderRadius = typeof theme.borderRadius
export type ThemeAnimation = typeof theme.animation
export type ThemeTypography = typeof theme.typography
export type ThemeBreakpoints = typeof theme.breakpoints
