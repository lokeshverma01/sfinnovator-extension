/**
 * paths.ts — URL helpers that respect Astro's configured `base`.
 *
 * Why this exists: on GitHub Pages this site is served under a sub-path
 * (e.g. /sfinnovator-extension/), so EVERY internal link and local asset must
 * be prefixed with that base or it 404s. Astro exposes the base as
 * `import.meta.env.BASE_URL`. Always build internal hrefs with withBase()
 * instead of hard-coding "/..." — that way the same code works on the sub-path
 * AND on the future root domain (where BASE_URL is just "/").
 *
 * External URLs (http...) are returned unchanged.
 */
const BASE = import.meta.env.BASE_URL; // e.g. "/sfinnovator-extension/" or "/"

/** Prefix an internal path with the deploy base. Pass-through for external URLs. */
export function withBase(path: string): string {
  if (/^https?:\/\//.test(path) || path.startsWith("mailto:")) return path;
  const base = BASE.replace(/\/$/, ""); // strip trailing slash
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${base}${clean}`;
}
