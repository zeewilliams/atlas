import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1a3a6b",
        accent: "#f5c518",
        success: "#43a047",
        warning: "#f57f17",
        danger: "#e53935",
        "zone-active": "#7c4dff",
        "zone-complete": "#43a047",
        night: "#06080F",
      },
      fontFamily: {
        sans: ["var(--font-nunito)", "system-ui", "sans-serif"],
        dashboard: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        standard: "12px",
        card: "18px",
        pill: "99px",
      },
      boxShadow: {
        atlas: "0 4px 16px rgba(26,58,107,0.12)",
      },
      backgroundImage: {
        island: "linear-gradient(180deg, #87CEEB, #b0e0f5, #5bb8d4)",
      },
    },
  },
  plugins: [],
};

export default config;
