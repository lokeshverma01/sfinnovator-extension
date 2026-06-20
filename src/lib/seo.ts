/**
 * seo.ts — the SEO engine.
 *
 * Builds a normalized set of meta values (title, description, canonical URL,
 * Open Graph image) for any page from a small input. Centralizing this means
 * every page gets correct, consistent SEO tags and we fix SEO bugs in one place.
 *
 * Used by: src/components/BaseHead.astro
 */
import { siteConfig } from "./siteConfig";

export interface SeoInput {
  /** Page-specific title. If omitted, falls back to the site name. */
  title?: string;
  /** Page-specific description. Falls back to the site description. */
  description?: string;
  /** Path or absolute URL of this page, e.g. "/blog/my-post". */
  path?: string;
  /** Open Graph image path/URL. Falls back to the default OG image. */
  image?: string;
  /** Page type for Open Graph ("website" for pages, "article" for posts). */
  type?: "website" | "article";
}

export interface ResolvedSeo {
  title: string;
  description: string;
  canonical: string;
  image: string;
  type: "website" | "article";
}

/** Join the site origin with a relative path into one absolute URL. */
function absolute(pathOrUrl: string): string {
  if (pathOrUrl.startsWith("http")) return pathOrUrl;
  const base = siteConfig.url.replace(/\/$/, "");
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${base}${path}`;
}

/**
 * Resolve raw SEO input into final, absolute values ready for <head>.
 * Title format: "Page Title — SF Innovator" (site name omitted on the home page).
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
    type: input.type ?? "website",
  };
}
