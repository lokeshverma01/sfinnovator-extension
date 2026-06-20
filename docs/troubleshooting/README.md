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
**Symptom:** GitHub Actions deploy run fails fast (~15s) in the "Setup Node" / pnpm step with `Error [ERR_UNKNOWN_BUILTIN_MODULE]: No such built-in module: node:sqlite` and `This version of pnpm requires at least Node.js v22.13`.
**Component/area:** CI workflow — `.github/workflows/deploy.yml` (Node + pnpm versions).
**Configuration involved:** `actions/setup-node` `node-version` vs. `pnpm/action-setup` `version`.
**How to debug (in order):**
1. `gh run list` → find the failed run; `gh run view <id> --log-failed`.
2. Look for the pnpm/Node version warning near the crash.
**Common root causes & fixes:**
- **Node too old for pnpm.** pnpm 11.x requires Node ≥ 22.13; workflow pinned Node 20 → crash. **Fix:** set `node-version: 22` in the workflow (and keep `.nvmrc` = 22 to match).
- Keep the workflow's pnpm major aligned with the `pnpm-lock.yaml` `lockfileVersion` (we use pnpm 11 + lockfile 9.0).
**Verified fix:** re-run concludes **success**; `curl -I` the Pages URL returns 200.

---

**Symptom:** Live Pages site loads but is **unstyled / links 404** (CSS and internal links point to `/_astro/...` or `/blog` instead of `/sfinnovator-extension/...`).
**Component/area:** Base-path config — `astro.config.mjs` (`base`), `src/lib/paths.ts` (`withBase`).
**Root cause:** A hard-coded internal path that bypassed `withBase()`, or building without `DEPLOY_TARGET=ghpages`.
**Fix:** route every internal href/asset through `withBase()`; ensure the workflow builds with `DEPLOY_TARGET=ghpages`. Verify: `curl -s <url> | grep _astro` shows the `/sfinnovator-extension/` prefix.
