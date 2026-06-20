// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

/**
 * Astro configuration.
 *
 * `site` MUST be the real production URL — it is used to generate absolute
 * canonical URLs, the sitemap, and Open Graph tags (all critical for SEO).
 * Update this if the domain ever changes.
 *
 * Integrations:
 *  - tailwind: utility-first styling (Tailwind v3, see tailwind.config.cjs)
 *  - mdx:      lets blog posts mix Markdown with components (future blog posts)
 *  - sitemap:  auto-generates /sitemap-index.xml at build time for search engines
 */
export default defineConfig({
  site: "https://sfinnovator.com",
  integrations: [
    tailwind({
      // We provide our own base styles + CSS variables in src/styles/global.css,
      // so we disable Tailwind's automatic base injection there instead.
      applyBaseStyles: false,
    }),
    mdx(),
    sitemap(),
  ],
});
