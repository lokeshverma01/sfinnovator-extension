# 0001 — Foundation + Landing Page (Phase 0 & 1)

- **Date:** 2026-06-20
- **Phase:** Phase 0 (Foundation) + Phase 1 (Landing Page)
- **Goal (one sentence):** Stand up the Astro + Tailwind + MDX project from scratch and ship a working, SEO-ready landing page with smooth dark/light mode.
- **Branch:** feature/landing-page (recommended)

> Layman summary: We set up the website's "engine" (Astro), its styling system (Tailwind), and its content rules, then built the home page. Anyone can follow the steps below verbatim to reach the same result.

## Prerequisites

- **Node.js v20+** (we used v26.0.0). Check: `node -v`
- **pnpm** (our package manager). Install once: `npm install -g pnpm` (we used v11.6.0). Check: `pnpm -v`
- **git** (we used 2.54.0). Check: `git --version`
- A code editor (VS Code) with the Astro + Tailwind extensions.

## Steps

### Step 1 — Install pnpm
**Why:** pnpm is our chosen package manager (faster, disk-efficient). See [ADR 0002](../adr/0002-stack-specifics.md).
**Command:**
```bash
npm install -g pnpm
```
**Expected result:** `pnpm -v` prints a version (we got 11.6.0).

### Step 2 — Create the project config files
**Why:** These define what the project is and how it builds, before any source code.
**Files created:**
- [`package.json`](../../package.json) — dependencies + scripts (`dev`, `build`, `preview`).
- [`astro.config.mjs`](../../astro.config.mjs) — sets the production `site` URL (critical for SEO/canonical/sitemap) and enables the **tailwind**, **mdx**, and **sitemap** integrations.
- [`tailwind.config.cjs`](../../tailwind.config.cjs) — Tailwind v3; maps our CSS-variable design tokens to semantic classes (`bg-bg`, `text-muted`, `text-accent`); dark mode via `data-theme="dark"`.
- [`tsconfig.json`](../../tsconfig.json) — strict TypeScript + the `@/*` path alias to `src/*`.
- [`.gitignore`](../../.gitignore) — excludes `node_modules`, `dist`, and **all secrets** (`.env*`).
- [`.nvmrc`](../../.nvmrc) — pins Node 20 for consistency.

### Step 3 — Add the design tokens (styling foundation)
**Why:** One file is the single source of truth for all colors/spacing, and theming is just a variable swap.
**File created:** [`src/styles/global.css`](../../src/styles/global.css) — ported directly from the approved mockup `design/landing-mockup.html`. Defines `:root` (light) and `[data-theme="dark"]` token sets, base typography, reduced-motion + focus-visible accessibility rules.

### Step 4 — Build the "backend skeleton" (logic, not a server)
**Why:** For a static site the "backend" is configuration + helpers + the content schema.
**Files created:**
- [`src/lib/siteConfig.ts`](../../src/lib/siteConfig.ts) — site name, URL, author, nav, socials. Single source of truth.
- [`src/lib/seo.ts`](../../src/lib/seo.ts) — the SEO engine: turns small per-page input into final title/description/canonical/OG values.
- [`src/lib/utils.ts`](../../src/lib/utils.ts) — `formatDate`, `readingTime`, `slugify`.
- [`src/content/config.ts`](../../src/content/config.ts) — the **content schema** for `blog` and `portfolio` collections. Enforces SEO fields at build time (a post can't ship without a valid title/description/date).

### Step 5 — Build the reusable components
**Why:** Small, single-purpose, documented components (see [CONTRIBUTING.md](../../CONTRIBUTING.md)).
**Files created** (all documented in [docs/components/](../components/)):
- [`src/components/BaseHead.astro`](../../src/components/BaseHead.astro) — all `<head>` SEO/OG/Twitter/JSON-LD tags.
- [`src/components/ThemeToggle.astro`](../../src/components/ThemeToggle.astro) — light/dark switch button + persistence.
- [`src/components/Header.astro`](../../src/components/Header.astro) — sticky nav + logo + toggle.
- [`src/components/Footer.astro`](../../src/components/Footer.astro) — copyright + socials.
- [`src/components/PostCard.astro`](../../src/components/PostCard.astro) — blog summary card.

### Step 6 — Build the layout + landing page
**Why:** The layout is the shared shell; the page is the actual content.
**Files created:**
- [`src/layouts/BaseLayout.astro`](../../src/layouts/BaseLayout.astro) — `<html>`/head/body, header+footer, and the **no-flash inline theme script** (applies saved/OS theme before paint).
- [`src/pages/index.astro`](../../src/pages/index.astro) — hero + CTAs + "Latest posts" grid. Reads real posts from the `blog` collection; falls back to placeholder cards until posts exist.

### Step 7 — Add public assets
**Files created:** [`public/robots.txt`](../../public/robots.txt) (points crawlers to the sitemap), [`public/favicon.svg`](../../public/favicon.svg). Skeleton content folders `src/content/blog/` and `src/content/portfolio/` (with `.gitkeep`).

### Step 8 — Install dependencies
**Command:**
```bash
pnpm install
# pnpm blocks build scripts by default (a security feature). Approve the two we need:
pnpm approve-builds esbuild sharp
```
**Note:** esbuild = Astro's bundler; sharp = image optimization. Both are required and trusted.

### Step 9 — Build & verify
**Command:**
```bash
pnpm build      # production build
pnpm dev        # local dev server (http://localhost:4321, or next free port)
```
**Expected result:** `dist/index.html`, `dist/sitemap-index.xml`, `robots.txt`, `favicon.svg` all generated; build prints "Complete!". Dev server serves the live page with working theme toggle.
**If it fails:** see the sitemap version note below and [troubleshooting/#build-fails](../troubleshooting/README.md#build-fails).

## Verification
- [x] `pnpm build` completes: "1 page(s) built", sitemap created.
- [x] `dist/index.html` contains `<title>`, `rel="canonical"`, and one `application/ld+json` block (SEO confirmed via grep).
- [x] Dev server renders the landing page matching the mockup.
- [x] Dark/light toggle works and persists; no flash on reload.

## Outcome
A working, deployable static site. All components cataloged in [docs/components/](../components/).

## Notes / decisions
- **Issue hit & fixed:** `@astrojs/sitemap@3.7.3` is built for Astro 5's route API and crashed under Astro 4.16 (`Cannot read properties of undefined (reading 'reduce')`). **Fix:** pinned `@astrojs/sitemap` to `3.2.1` in `package.json`. Recorded in [troubleshooting/#build-fails](../troubleshooting/README.md#build-fails).
- Astro 6 is available; we intentionally stay on Astro 4 LTS-style line for stability now. A future upgrade is its own task (and ADR if it changes architecture).
