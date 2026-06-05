import defaultTheme from "tailwindcss/defaultTheme"

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        mono: ["JetBrains Mono", "Fira Code", ...defaultTheme.fontFamily.mono],
        display: ["Martian Mono", "JetBrains Mono", ...defaultTheme.fontFamily.mono],
      },
      typography: {
        DEFAULT: { css: { maxWidth: "none" } },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out",
        "fade-in-up": "fade-in-up 0.5s ease-out",
        bounce: "bounce 1s infinite",
      },
      keyframes: {
        "fade-in": { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        "fade-in-up": { "0%": { opacity: 0, transform: "translateY(20px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        bounce: { "0%, 100%": { transform: "translateY(-25%)", animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)" }, "50%": { transform: "translateY(0)", animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)" } },
      },
      screens: { xs: "475px" },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        "out-expo": "cubic-bezier(0.19, 1, 0.22, 1)",
      },
      boxShadow: {
        glow: "0 0 20px rgba(59, 130, 246, 0.15)",
        "glow-lg": "0 0 40px rgba(59, 130, 246, 0.2)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
}
