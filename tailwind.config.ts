import type { Config } from "tailwindcss";

/**
 * Design tokens are lifted verbatim from the handoff (README → "Design Tokens").
 * The warm bone palette and the three-family type pairing ARE the brand — do not
 * swap them for a default UI theme.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B0D12",
        "ink-warm": "#14161C",
        "ink-strip": "#1A1D26",
        indigo: "#22307A",
        "indigo-light": "#8894C4",
        paper: "#F2F0EC",
        "paper-raised": "#FAF8F4",
        line: "#DEDAD1",
        "line-soft": "#E3DFD6",
        "line-soft-2": "#EDE9E1",
        "txt-2": "#55524A",
        "txt-3": "#6B675E",
        // Darkened from the handoff's #9A968C — that value reads at ~2.7:1 on the
        // paper background (fails WCAG AA). This keeps the same warm, quieter
        // register but at a contrast buyers can actually read.
        "txt-4": "#6E6A61",
        "info-bg": "#E7EAF5",
        "warn-bg": "#FFF3E0",
        "error-bg": "#F7E4E1",
        "error-tx": "#8B3A2C",
        "neutral-chip": "#EDEDE9",
      },
      fontFamily: {
        serif: ["var(--font-bodoni)", "Didot", "Georgia", "serif"],
        sans: ["var(--font-archivo)", "Helvetica", "Arial", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        DEFAULT: "2px",
      },
      boxShadow: {
        bar: "0 -8px 20px rgba(11,13,18,.06)",
      },
      maxWidth: {
        sheet: "1080px",
      },
    },
  },
  plugins: [],
};

export default config;
