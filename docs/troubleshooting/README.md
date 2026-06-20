# Troubleshooting Runbook

When something breaks — in development or production — start here. This runbook maps a **symptom** to the **responsible component, its file path, its configuration, and how to debug it.**

> Goal: go from "something's wrong" to "here's the exact file and fix" in under a minute.

## How to use

1. Find your symptom in the table below.
2. Go to the linked detail section (or component doc / file path).
3. Follow the debugging steps. If you solve a *new* problem, **add it here.**

## Symptom → Location quick map

| Symptom | Likely area | Where to look | Detail |
|---|---|---|---|
| Site won't build (`pnpm build` fails) | Build/config | `astro.config.mjs`, terminal error | [#build-fails](#build-fails) |
| Dark/light theme flashes or won't switch | Theme script | `src/layouts/BaseLayout.astro` (inline script), `ThemeToggle.astro` | [#theme-issues](#theme-issues) |
| Styles missing / Tailwind classes ignored | Tailwind setup | `src/styles/global.css`, `astro.config.mjs` | [#styles-missing](#styles-missing) |
| A blog post doesn't appear | Content schema | `src/content/config.ts`, the post's frontmatter, `draft` flag | [#post-missing](#post-missing) |
| Wrong/missing SEO tags or social preview | SEO head | `src/components/BaseHead.astro`, `src/lib/seo.ts`, `src/lib/siteConfig.ts` | [#seo-issues](#seo-issues) |
| 404 on a page that should exist | Routing | `src/pages/` file/route name | [#routing-404](#routing-404) |
| Deploy succeeds locally but fails on host | CI/CD | host build logs, Node version (`.nvmrc`), build command | [#deploy-fails](#deploy-fails) |

---

## Detail template (use for each entry)

```markdown
### <symptom-anchor>
**Symptom:** <what the user/dev sees>
**Component/area:** <name> — `path/to/file`
**Configuration involved:** <env vars, config keys, build settings>
**How to debug (in order):**
1. <first thing to check + exact command>
2. <next>
**Common root causes & fixes:**
- <cause> → <fix>
**Verified fix:** <what "fixed" looks like>
```

---

<!-- Fill these in as we build each phase. Stubs below so paths exist. -->

### build-fails
**Symptom:** `pnpm build` fails with `Cannot read properties of undefined (reading 'reduce')` pointing into `@astrojs/sitemap/dist/index.js`.
**Component/area:** Sitemap integration — `astro.config.mjs` (`sitemap()`), version in `package.json`.
**Configuration involved:** `@astrojs/sitemap` version vs. Astro major version.
**How to debug (in order):**
1. Read the stack trace — confirm it originates in `@astrojs/sitemap`, not your code.
2. Check installed versions: `pnpm list astro @astrojs/sitemap`.
**Common root causes & fixes:**
- Sitemap `3.7.x` (built for Astro 5's `build:done` route API) running under **Astro 4** → `_routes` is undefined. **Fix:** pin `"@astrojs/sitemap": "3.2.1"` in `package.json`, then `pnpm install`.
**Verified fix:** build prints `[@astrojs/sitemap] sitemap-index.xml created` and `Complete!`.

---

**Symptom:** After `pnpm install`, a warning: `Ignored build scripts: esbuild, sharp`.
**Not an error** — pnpm blocks postinstall scripts by default (supply-chain safety). **Fix:** `pnpm approve-builds esbuild sharp` (both are required: esbuild = bundler, sharp = image optimization).

### theme-issues
_To be documented when we build the theme toggle (Phase 1)._

### styles-missing
_To be documented when we wire Tailwind (Phase 0)._

### post-missing
_To be documented when we add content collections (Phase 1)._

### seo-issues
_To be documented when we build BaseHead/seo.ts (Phase 1)._

### routing-404
_To be documented when we add multiple pages (Phase 1+)._

### deploy-fails
_To be documented when we confirm the deploy pipeline (Phase 0)._
