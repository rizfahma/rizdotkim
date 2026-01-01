import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import tailwind from "@astrojs/tailwind"
import solidJs from "@astrojs/solid-js"

// https://astro.build/config
export default defineConfig({
  site: "https://fahma.pages.dev",
  integrations: [mdx(), sitemap(), solidJs(), tailwind({ applyBaseStyles: false })],
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'search': ['src/components/Search.tsx'],
            'arrowcard': ['src/components/ArrowCard.tsx'],
          }
        }
      }
    }
  },
  output: "static",
  build: {
    format: "directory"
  }
})