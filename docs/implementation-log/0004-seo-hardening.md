# 0004 — SEO Hardening (Phase 2)

- **Date:** 2026-06-20
- **Phase:** Phase 2 — SEO
- **Goal (one sentence):** Make the site search-engine-grade: deploy-aware indexing, rich structured data, complete social meta, a real OG image, RSS, a 404 page, and a web manifest.
- **Branch:** feature/seo-hardening

> Layman summary: We made the website properly "understandable" to Google and
> social networks, and — critically — made sure the temporary GitHub Pages
> preview can NEVER be indexed so it won't compete with the real sfinnovator.com
> later. We also added a share image, an RSS feed, and a friendly 404 page.

## The most important fix — duplicate-content protection
Before this phase, every page advertised `https://sfinnovator.com` URLs and was
indexable, even on the github.io preview. If Google indexed the preview, it would
later **compete with the real domain as duplicate content** (an SEO penalty).

**Fix:** [`src/lib/seo.ts`](../../src/lib/seo.ts) now derives URLs from the ACTUAL
deploy origin (`import.meta.env.SITE` + `BASE_URL`) and exposes `isProductionDomain`.
- On `sfinnovator.com` → pages are `index, follow` and `robots.txt` allows all.
- On ANY other origin (github.io preview, local) → pages emit
  `noindex, nofollow` AND `robots.txt` is `Disallow: /` (two independent guards).

## What was added/changed

### SEO engine — [`src/lib/seo.ts`](../../src/lib/seo.ts)
- Deploy-aware absolute URL builder (origin + base + path).
- `isProductionDomain` flag; `noindex` resolved per page.
- New input fields: `imageAlt`, `noindex`.
- JSON-LD builders: `websiteJsonLd()` (site+author, every page), `articleJsonLd()`
  (BlogPosting — used in the blog phase), `breadcrumbJsonLd()`.

### Head — [`src/components/BaseHead.astro`](../../src/components/BaseHead.astro)
- `robots` directive (deploy-aware), `theme-color`, `og:locale`,
  `og:image:alt/width/height`, `twitter:site/creator/image:alt`.
- Optional `article` props → `article:*` OG meta + BlogPosting JSON-LD.
- Optional `breadcrumbs` → BreadcrumbList JSON-LD.
- `<link>`s for web manifest and RSS autodiscovery.
- Emits multiple JSON-LD blocks (WebSite always; Article/Breadcrumb when present).

### New endpoints (all deploy-aware)
- [`src/pages/robots.txt.ts`](../../src/pages/robots.txt.ts) — replaces the static
  file; allow on prod / disallow on preview.
- [`src/pages/rss.xml.ts`](../../src/pages/rss.xml.ts) — `@astrojs/rss` feed from the
  blog collection (valid while empty; auto-populates).
- [`src/pages/manifest.webmanifest.ts`](../../src/pages/manifest.webmanifest.ts) — PWA
  manifest with base-aware paths.

### New page
- [`src/pages/404.astro`](../../src/pages/404.astro) — branded not-found page
  (GitHub Pages serves /404.html automatically); `noindex`.

### Social share image
- Source SVG [`src/assets/og-default.svg`](../../src/assets/og-default.svg) (editable,
  version-controlled).
- Build script [`scripts/generate-og.mjs`](../../scripts/generate-og.mjs) → run with
  `pnpm og:image` → outputs `public/images/og-default.png` (1200×630).
- Uses `sharp` (added as a **devDependency** — only needed to regenerate the image,
  not at runtime).

### Config — [`src/lib/siteConfig.ts`](../../src/lib/siteConfig.ts)
- Added `locale` (`en_US`) and `themeColor` (`#0176d3`).

## Commands used
```bash
pnpm add @astrojs/rss@^4.0.0      # RSS integration (Astro 4 compatible)
pnpm add -D sharp@^0.33.0         # OG image rasterization (dev only)
pnpm approve-builds sharp
pnpm og:image                     # generate public/images/og-default.png
```

## Verification (both build modes)
| Check | Preview (`DEPLOY_TARGET=ghpages`) | Production (default) |
|---|---|---|
| robots.txt | `Disallow: /` | `Allow: /` + Sitemap |
| robots meta | `noindex, nofollow` | `index, follow, max-image-preview:large` |
| canonical | self-ref github.io sub-path | `https://sfinnovator.com/` |
| og:image | absolute github.io path | absolute sfinnovator.com path |
| JSON-LD | WebSite present | WebSite present |
| RSS / manifest / 404 | generated | generated |

- [x] `DEPLOY_TARGET=ghpages pnpm build` → preview values correct (noindex).
- [x] `pnpm build` → production values correct (indexable).
- [x] OG PNG is 1200×630, renders on-brand.

## Outcome
SEO foundation is production-grade and safe to keep on the preview URL. Article
schema + per-post OG + RSS items activate automatically once blog posts exist.

## Notes / follow-ups
- When sfinnovator.com goes live, **no code change** is needed — building without
  `DEPLOY_TARGET=ghpages` flips everything to indexable production behavior.
- Submit the production sitemap to Google Search Console after the domain is live.
- Per-post custom OG images can reuse `scripts/generate-og.mjs` (parameterize later).
