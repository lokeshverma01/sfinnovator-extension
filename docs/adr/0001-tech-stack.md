# ADR 0001 — Technology Stack & Architecture

- **Status:** Accepted
- **Date:** 2026-06-20
- **Deciders:** Site owner (SF Innovator)

> An Architecture Decision Record captures one significant decision, the context behind it, and its consequences. ADRs are **append-only** — if we change our mind later, we write a new ADR that supersedes this one. We never edit history.

---

## Context

We are building a Salesforce learning blog at **sfinnovator.com**. Requirements:

- Fastest possible load times for end users.
- Top-tier, built-in SEO.
- Scalable, but cost-optimized (target: ~free, only the domain as fixed cost).
- Content types: implementation guides, use-case scenarios, error/debugging write-ups, and a portfolio.
- Git-based workflow with auto-deploy and per-branch previews.
- Future: a writer → admin editorial/approval workflow, optional CMS, optional ads.
- Must be maintainable, secure, well-documented, and built incrementally as a learning exercise.

## Decision

| Concern | Choice | Rationale |
|---|---|---|
| **Framework** | **Astro** | Ships zero JS by default → fastest loads + best SEO. Content-first. Supports interactive "islands" for portfolio demos. Gentle, incremental learning curve. |
| **Content format** | **Markdown / MDX in Git** | No database needed; version-controlled, diff-able, instant. SEO frontmatter enforced via content collections schema. |
| **Styling** | **Tailwind CSS** | Utility-first, consistent design tokens, small production CSS, fast to build with. |
| **CSS theming** | **CSS custom properties** for light/dark tokens | Smooth, instant theme switching with no flash; single source of color truth. |
| **Hosting (now)** | **Azure Static Web Apps** | Already set up with Git auto-deploy; keep until the site is ready to migrate. |
| **Hosting (future)** | **Cloudflare Pages** (planned) | Unlimited bandwidth, global edge, free, per-branch previews. Migration target. |
| **CMS** | **None now**; Tina/Decap **later, only when a writer is onboarded** | A CMS is optional sugar over the same MDX files. Avoid premature complexity. |
| **Database** | **None** | Static content needs no DB. Add Cloudflare D1/KV via serverless Workers only when dynamic features are required. |
| **Comments (future)** | Giscus (GitHub Discussions) | Free, no DB, SEO-neutral. |
| **Search (future)** | Pagefind | Static, build-time, no server. |
| **Analytics (future)** | Cloudflare Web Analytics / Plausible | Privacy-friendly, no cookie banner. |

## Consequences

**Positive**
- Near-zero running cost (domain only).
- Excellent Core Web Vitals and SEO out of the box.
- Simple, auditable, Git-native editorial workflow via branch protection.
- Incremental: each capability (CMS, comments, ads, DB) bolts on without rework.

**Trade-offs / risks**
- Ad scripts (future) are heavy third-party JS and can hurt Core Web Vitals → must be lazy-loaded and kept below the fold.
- Astro is less of a full "app framework" than Next.js; if we later need large logged-in app areas, we re-evaluate (new ADR).
- A pure-Git editorial flow requires the writer to use a CMS UI (added later) since they won't write raw MDX.

## Alternatives considered

- **Next.js** — more powerful but heavier, React-mandatory, slower default loads for a content site. Rejected for now; revisit if we build app-like features.
- **WordPress** — requires a database + server + ongoing security patching + hosting cost. Rejected: slower, costlier, larger attack surface.
- **Hugo/Eleventy** — excellent and fast, but Astro's component model + islands better fit the interactive portfolio goal.
