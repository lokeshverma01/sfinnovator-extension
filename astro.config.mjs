// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

/**
 * Astro configuration.
 *
 * `site` + `base` are DEPLOY-TARGET AWARE so the same code works everywhere:
 *
 *   DEPLOY_TARGET=ghpages  → GitHub Pages project site (served under a sub-path)
 *                            site = https://lokeshverma01.github.io
 *                            base = /sfinnovator-extension
 *   (default / unset)      → local dev + future custom domain sfinnovator.com
 *                            site = https://sfinnovator.com, base = /
 *
 * `site` is used for absolute canonical URLs, the sitemap, and Open Graph tags
 * (critical for SEO). `base` is the URL prefix every internal link/asset must
 * include — we centralize that via withBase() in src/lib/paths.ts so links
 * never 404 on the sub-path.
 *
 * When we later point sfinnovator.com at this site, we simply stop setting
 * DEPLOY_TARGET=ghpages and the base becomes "/" again — no code changes.
 *
 * Integrations:
 *  - tailwind: utility-first styling (Tailwind v3, see tailwind.config.cjs)
 *  - mdx:      lets blog posts mix Markdown with components (future blog posts)
 *  - sitemap:  auto-generates /sitemap-index.xml at build time for search engines
 */
const isGhPages = process.env.DEPLOY_TARGET === "ghpages";

export default defineConfig({
  site: isGhPages ? "https://lokeshverma01.github.io" : "https://sfinnovator.com",
  base: isGhPages ? "/sfinnovator-extension" : "/",
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
