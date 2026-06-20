/**
 * siteConfig.ts — single source of truth for site-wide constants.
 *
 * Anything that appears in multiple places (site name, URL, author, nav links,
 * social handles) lives HERE and is imported, never hard-coded in components.
 * This keeps canonical URLs correct and makes rebranding a one-file change.
 */

export const siteConfig = {
  /** Public site name (used in header, titles, JSON-LD). */
  name: "SF Innovator",

  /** Production URL — must match astro.config.mjs `site`. Used for canonical/OG. */
  url: "https://sfinnovator.com",

  /** Default tagline / meta description fallback (SEO). */
  description:
    "A Salesforce learning blog: end-to-end implementations, real use-case scenarios, error debugging, and solutions you can validate.",

  /** Author identity — powers JSON-LD Person and post bylines. */
  author: {
    name: "SF Innovator",
    // TODO: replace with your real handles when ready.
    twitter: "@sfinnovator",
  },

  /** Content language (BCP-47). Used for <html lang> and og:locale. */
  locale: "en_US",

  /** Brand color for the browser UI (address bar on mobile). */
  themeColor: "#0176d3",

  /** Primary navigation. Order = display order. */
  nav: [
    { label: "Blog", href: "/blog" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "About", href: "/about" },
  ] as const,

  /** Footer social links. Empty href = not shown yet. */
  socials: [
    { label: "RSS", href: "/rss.xml" },
    { label: "GitHub", href: "https://github.com/" },
    { label: "X", href: "https://x.com/" },
    { label: "LinkedIn", href: "https://linkedin.com/" },
  ] as const,

  /** Default Open Graph image (relative to site root, in /public). */
  defaultOgImage: "/images/og-default.png",
} as const;

export type SiteConfig = typeof siteConfig;
