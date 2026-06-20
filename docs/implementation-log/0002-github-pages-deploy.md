# 0002 — GitHub Repo + GitHub Pages Deploy

- **Date:** 2026-06-20
- **Phase:** Phase 0 (Foundation) — hosting/CI
- **Goal (one sentence):** Put the project under a fresh public GitHub repo and auto-deploy the site to GitHub Pages via GitHub Actions.
- **Branch:** main

> Layman summary: We created a brand-new GitHub repository, pushed all our code to it, and set up a robot (GitHub Actions) that automatically rebuilds and publishes the website every time we push changes — exactly like the Azure auto-deploy, but on GitHub. The existing `lokesh-portfolio` repo (used by Azure) was left untouched.

## Context / decisions
- New repo: **`sfinnovator-extension`**, **public**, under `lokeshverma01`.
- Host (for now): **GitHub Pages**. The future custom domain (sfinnovator.com) migration is a later step.
- The existing Azure CICD repo `lokesh-portfolio` is intentionally **not** modified.

## Prerequisites
- Authenticated GitHub CLI: `gh auth status` shows logged in (scopes: `repo`, `workflow`).
- Git already initialized with commits (see [0001](./0001-foundation-and-landing.md)).

## Key concept — serving under a sub-path
GitHub Pages "project sites" serve at `https://<user>.github.io/<repo>/`, i.e. under
a **sub-path** (`/sfinnovator-extension/`), not the domain root. Every internal link
and asset must include that prefix or it 404s.

We solved this **without hard-coding** so the same code also works on the future root
domain:
- [`astro.config.mjs`](../../astro.config.mjs) reads `process.env.DEPLOY_TARGET`:
  - `ghpages` → `site=https://lokeshverma01.github.io`, `base=/sfinnovator-extension`
  - unset (local/custom domain) → `site=https://sfinnovator.com`, `base=/`
- [`src/lib/paths.ts`](../../src/lib/paths.ts) exports `withBase()`, used by every internal
  link/asset (Header, Footer, index CTAs + cards, BaseHead favicon/sitemap).

When we later point sfinnovator.com here, we simply stop setting `DEPLOY_TARGET=ghpages`.

## Steps

### Step 1 — Create the repo and push
```bash
gh repo create sfinnovator-extension --public --source=. --remote=origin --push \
  --description "SF Innovator — a fast, SEO-first Salesforce learning blog built with Astro."
```
**Result:** repo created at https://github.com/lokeshverma01/sfinnovator-extension, `main` pushed.

### Step 2 — Add the deploy workflow
**File:** [`.github/workflows/deploy.yml`](../../.github/workflows/deploy.yml) — on push to `main`:
checkout → setup pnpm + Node → `pnpm install --frozen-lockfile` → `pnpm build` with
`DEPLOY_TARGET=ghpages` → upload artifact → deploy to Pages. Least-privilege
permissions (`contents: read`, `pages: write`, `id-token: write`).

### Step 3 — Enable Pages (source = GitHub Actions)
```bash
gh api -X POST repos/lokeshverma01/sfinnovator-extension/pages -f build_type=workflow
```
**Result:** Pages enabled at https://lokeshverma01.github.io/sfinnovator-extension/

### Step 4 — Fix the first (failed) run
The first run **failed** — see [troubleshooting/#deploy-fails](../troubleshooting/README.md#deploy-fails)
(Node/pnpm version mismatch). Fixed by bumping the workflow + `.nvmrc` to Node 22, then pushing again.

## Verification
- [x] Workflow run concluded **success** (build + deploy jobs green).
- [x] `curl` homepage → **HTTP 200**, `<title>SF Innovator</title>`.
- [x] Sub-path CSS asset (`/sfinnovator-extension/_astro/*.css`) → **HTTP 200** (styles load, no 404).
- [x] Local default build still produces root paths + `https://sfinnovator.com` canonical (custom-domain-ready).

## Outcome
Live at **https://lokeshverma01.github.io/sfinnovator-extension/**. Every push to `main`
now auto-deploys. `lokesh-portfolio`/Azure untouched.

## Notes
- Two real issues hit and fixed — both recorded in the troubleshooting runbook:
  sitemap version (in [0001]) and the CI Node/pnpm mismatch (below).
- GitHub shows a deprecation notice that the actions internally run on Node; cosmetic, not a failure.
