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
      rotate: { "45": "45deg", "135": "135deg", "225": "225deg", "315": "315deg" },
      animation: {
        twinkle: "twinkle 2s ease-in-out forwards",
        meteor: "meteor 3s ease-in-out forwards",
        float: "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "gradient-x": "gradient-x 15s ease infinite",
        "fade-in": "fade-in 0.5s ease-out",
        "fade-in-up": "fade-in-up 0.5s ease-out",
        "slide-in-left": "slide-in-left 0.3s ease-out",
      },
      keyframes: {
        twinkle: { "0%": { opacity: 0, transform: "rotate(0deg)" }, "50%": { opacity: 1, transform: "rotate(180deg)" }, "100%": { opacity: 0, transform: "rotate(360deg)" } },
        meteor: { "0%": { opacity: 0, transform: "translateY(200%)" }, "50%": { opacity: 1 }, "100%": { opacity: 0, transform: "translateY(0)" } },
        float: { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
        "gradient-x": { "0%, 100%": { "background-position": "0% 50%" }, "50%": { "background-position": "100% 50%" } },
        "fade-in": { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        "fade-in-up": { "0%": { opacity: 0, transform: "translateY(20px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        "slide-in-left": { "0%": { opacity: 0, transform: "translateX(-20px)" }, "100%": { opacity: 1, transform: "translateX(0)" } },
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
