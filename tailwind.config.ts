import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./utils/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B0C10",
        foreground: "#F3F4F6",
        obsidian: "#0B0C10",
        surface: {
          DEFAULT: "#14171F",
          elevated: "#14171F",
          hover: "#1B202B",
        },
        border: {
          DEFAULT: "rgba(255, 255, 255, 0.08)",
          subtle: "rgba(255, 255, 255, 0.08)",
        },
        gold: {
          DEFAULT: "#D4AF37",
          primary: "#D4AF37",
          hover: "#F59E0B",
          glow: "rgba(212, 175, 55, 0.2)",
        },
        trust: {
          DEFAULT: "#10B981",
          emerald: "#10B981",
          glow: "rgba(16, 185, 129, 0.2)",
        },
      },
      borderColor: {
        DEFAULT: "rgba(255, 255, 255, 0.08)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        card: "0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.08)",
        gold: "0 0 15px rgba(212, 175, 55, 0.25)",
        emerald: "0 0 15px rgba(16, 185, 129, 0.25)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        ticker: "ticker 25s linear infinite",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
