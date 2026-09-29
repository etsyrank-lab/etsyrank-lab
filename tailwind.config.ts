import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deepened indigo/violet brand scale — richer than the default MVP palette.
        brand: {
          50: "#f1f2ff",
          100: "#e3e6ff",
          200: "#cbd1ff",
          300: "#a6afff",
          400: "#7d84fc",
          500: "#5d5df7",
          600: "#4c3fe8",
          700: "#3e33c9",
          800: "#352ea3",
          900: "#2f2b80",
          950: "#1c1a4d",
        },
        // Warm amber accent for highlights, CTAs and "opportunity" moments.
        accent: {
          50: "#fff9eb",
          100: "#fff1c6",
          200: "#ffe288",
          300: "#ffcb47",
          400: "#ffb01f",
          500: "#f98a07",
          600: "#dd6202",
          700: "#b74306",
          800: "#94340c",
          900: "#7a2d0e",
        },
      },
      boxShadow: {
        soft: "0 1px 2px rgb(16 24 64 / 0.05), 0 8px 24px -12px rgb(76 63 232 / 0.18)",
        lift: "0 2px 4px rgb(16 24 64 / 0.06), 0 18px 44px -16px rgb(76 63 232 / 0.30)",
        glow: "0 0 0 4px rgb(93 93 247 / 0.16)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both",
        float: "float 7s ease-in-out infinite",
      },
      borderRadius: { xl2: "1.25rem" },
    },
  },
  plugins: [],
};

export default config;
