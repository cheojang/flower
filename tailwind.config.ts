import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 파스텔 감성 팔레트
        cream: "#FBF6F0",
        rose: {
          DEFAULT: "#E8C5C5",
          light: "#F4E3E3",
          deep: "#D9A7A7",
        },
        sage: {
          DEFAULT: "#C7D2C0",
          light: "#E2E9DD",
          deep: "#A8B89F",
        },
        lavender: {
          DEFAULT: "#DCD3E8",
          light: "#EEE9F3",
        },
        ink: "#5C4A45", // 톤다운 브라운 텍스트
        "ink-soft": "#8A776F",
      },
      fontFamily: {
        sans: ["var(--font-pretendard)", "system-ui", "sans-serif"],
        serif: ["var(--font-gowun)", "serif"],
      },
      boxShadow: {
        soft: "0 8px 30px rgba(92, 74, 69, 0.08)",
        "soft-lg": "0 16px 50px rgba(92, 74, 69, 0.12)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s ease-out forwards",
        float: "float 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
