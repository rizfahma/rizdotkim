import defaultTheme from "tailwindcss/defaultTheme"

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        "sans": ["Geist", ...defaultTheme.fontFamily.sans],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "full",
          },
        },
      },
      rotate: {
        "45": "45deg",
        "135": "135deg",
        "225": "225deg",
        "315": "315deg",
      },
      animation: {
        twinkle: "twinkle 2s ease-in-out forwards",
        meteor: "meteor 3s ease-in-out forwards",
      },
      keyframes: {
        twinkle: {
          "0%": { 
            opacity: 0, 
            transform: "rotate(0deg)" 
          },
          "50%": { 
            opacity: 1,
            transform: "rotate(180deg)" 
          },
          "100%": { 
            opacity: 0, 
            transform: "rotate(360deg)" 
          },
        },
        meteor: {
          "0%": { 
            opacity: 0, 
            transform: "translateY(200%)" 
          },
          "50%": { 
            opacity: 1  
          },
          "100%": { 
            opacity: 0, 
            transform: "translateY(0)" 
          },
        },
      },
      colors: {
        dark: {
          DEFAULT: '#1e1e2e', // Main background
          foreground: '#ff75b5', // Neon pink for main text
          muted: '#6c7086', // Grayish for subtle text
          accent: '#00ffcc', // Bright neon cyan for highlights
          border: '#45475a', // Selection/border color
          highlight: '#89b4fa', // Light blue for structural elements
        },
        // Supabase-inspired color palette
        supabase: {
          green: '#3ecf8e',
          blue: '#0891b2',
          purple: '#8b5cf6',
          pink: '#ec4899',
          orange: '#f97316',
          dark: '#0f172a',
          light: '#f8fafc',
          gray: {
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b',
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
            900: '#0f172a',
          }
        }
      },
      ringColor: {
        ring: 'rgb(var(--ring))'
      },
      screens: {
        'xs': '475px',
      }
    },
  },
  plugins: [require("@tailwindcss/typography")],
}
