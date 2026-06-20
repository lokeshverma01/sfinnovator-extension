/**
 * seo.ts — the SEO engine.
 *
 * Builds a normalized set of meta values (title, description, canonical URL,
 * Open Graph image, robots directive) for any page, plus JSON-LD structured
 * data builders. Centralizing this means every page gets correct, consistent
 * SEO and we fix SEO issues in exactly one place.
 *
 * DEPLOY-AWARENESS (important for SEO):
 * URLs are built from the ACTUAL deploy origin (Astro's `import.meta.env.SITE`
 * + `BASE_URL`), not a hard-coded domain. So on the GitHub Pages preview the
 * canonical/OG URLs are self-referential and correct. We also detect whether we
 * are on the real production domain (sfinnovator.com); if NOT, pages emit
 * `noindex` so the preview deployment never competes with production as
 * duplicate content in search results.
 *
 * Used by: src/components/BaseHead.astro
 */
import { siteConfig } from "./siteConfig";

export interface SeoInput {
  /** Page-specific title. If omitted, falls back to the site name. */
  title?: string;
  /** Page-specific description. Falls back to the site description. */
  description?: string;
  /** Path of this page, e.g. "/blog/my-post" (leading slash, no base prefix). */
  path?: string;
  /** Open Graph image path/URL. Falls back to the default OG image. */
  image?: string;
  /** Alt text for the OG image (accessibility + richer cards). */
  imageAlt?: string;
  /** Page type for Open Graph ("website" for pages, "article" for posts). */
  type?: "website" | "article";
  /** Force-hide from search engines even on production (e.g. thank-you pages). */
  noindex?: boolean;
}

export interface ResolvedSeo {
  title: string;
  description: string;
  canonical: string;
  image: string;
  imageAlt: string;
  type: "website" | "article";
  /** true → emit a noindex robots directive. */
  noindex: boolean;
}

/**
 * The real, deployed origin + base, as configured in astro.config.mjs and
 * exposed by Astro at build time. Examples:
 *   production     → SITE=https://sfinnovator.com           BASE_URL=/
 *   github pages   → SITE=https://lokeshverma01.github.io   BASE_URL=/sfinnovator-extension/
 */
const SITE = (import.meta.env.SITE ?? siteConfig.url).replace(/\/$/, "");
const BASE = import.meta.env.BASE_URL ?? "/";

/**
 * Are we building for the canonical production domain? Only then do we allow
 * search engines to index. Any other origin (the github.io preview, a local
 * build) is kept out of the index to avoid duplicate-content penalties.
 */
export const isProductionDomain = SITE === siteConfig.url.replace(/\/$/, "");

/** Join the deploy origin + base + path into one absolute, canonical URL. */
function absolute(pathOrUrl: string): string {
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  const base = BASE.replace(/\/$/, "");
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${SITE}${base}${path}`;
}

/**
 * Resolve raw SEO input into final, absolute values ready for <head>.
 * Title format: "Page Title — SF Innovator" (site name only, on the home page).
 */
export function resolveSeo(input: SeoInput = {}): ResolvedSeo {
  const title = input.title
    ? `${input.title} — ${siteConfig.name}`
    : siteConfig.name;

  return {
    title,
    description: input.description ?? siteConfig.description,
    canonical: absolute(input.path ?? "/"),
    image: absolute(input.image ?? siteConfig.defaultOgImage),
    imageAlt: input.imageAlt ?? `${siteConfig.name} — ${siteConfig.description}`,
    type: input.type ?? "website",
    // noindex if explicitly requested OR we're not on the production domain.
    noindex: input.noindex === true || !isProductionDomain,
  };
}

/* ----------------------------- JSON-LD builders ---------------------------- */
/* Structured data helps search engines understand the site, author, articles,
 * and navigation. Each builder returns a plain object; BaseHead serializes it. */

/** Site-wide identity: WebSite + the author as a Person. Used on every page. */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: absolute("/"),
    description: siteConfig.description,
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
    },
  };
}

/** Per-article schema for blog posts (built now, used in the blog phase). */
export interface ArticleJsonLdInput {
  title: string;
  description: string;
  path: string;
  image?: string;
  publishDate: Date;
  updatedDate?: Date;
}
export function articleJsonLd(a: ArticleJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: a.title,
    description: a.description,
    url: absolute(a.path),
    image: absolute(a.image ?? siteConfig.defaultOgImage),
    datePublished: a.publishDate.toISOString(),
    dateModified: (a.updatedDate ?? a.publishDate).toISOString(),
    author: { "@type": "Person", name: siteConfig.author.name },
    publisher: { "@type": "Person", name: siteConfig.author.name },
    mainEntityOfPage: { "@type": "WebPage", "@id": absolute(a.path) },
  };
}

/** Breadcrumb trail for richer search results. Pass [{name, path}, ...]. */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absolute(item.path),
    })),
  };
}
