# 0005 — Content System: post templates, blog, search, portfolio

- **Date:** 2026-06-21
- **Phase:** Phase 3 — Content System
- **Goal (one sentence):** Build a "fill-in-the-fields, never touch code" publishing system with three consistent post templates, a paginated/filterable blog, database-free search, category/tag pages, and a portfolio.
- **Branch:** feature/content-system

> Layman summary: From now on, publishing a post means creating ONE Markdown
> file and filling in fields — no code edits. The template renders it
> consistently and updates the blog list, search, RSS, and sitemap automatically.
> See the no-code [publishing guide](../publishing-guide.md).

## Research that informed the design
Analyzed top Salesforce blogs (Salesforce Ben, Apex Hours, Automation Champion,
the Developer blog, Stack Exchange) and the Salesforce Known Issues site. Key
takeaways baked in: strong description-as-TL;DR, prominent `updatedDate`, reading
time, role-based categories + topic tags, a Table of Contents for long posts, a
consistent type-specific info panel (Known-Issues style), and the high-value
"Decision guide"/"Prevention" sections for use-case/debugging posts.

## Architecture: hybrid template
- **Structured frontmatter** (the "form") renders as consistent UI (badges, meta,
  info panels) — defined and validated by the schema.
- **Free Markdown body** for the explanation, with a few ready-made components
  (`Callout`, `Steps`/`Step`, `Figure`, `StatusBadge`) auto-injected so authors
  write them with no import lines.

## What was built

### Schema — [`src/content/config.ts`](../../src/content/config.ts)
Discriminated union on `postType` (`implementation` | `use-case` | `debugging`),
each with its own fields, plus a richer `portfolio` collection. Validates at build
time, so a malformed post fails the build instead of shipping broken.

### Post body components — `src/components/post/`
`Callout.astro`, `Steps.astro` + `Step.astro`, `Figure.astro`, `StatusBadge.astro`,
`PostMeta.astro`, `StructuredMeta.astro` (the per-type info panel),
`TableOfContents.astro`, and `mdxComponents.ts` (the auto-inject map).

### Master template — [`src/layouts/PostLayout.astro`](../../src/layouts/PostLayout.astro)
Renders any post type consistently: breadcrumb, type eyebrow, title, PostMeta,
type-specific StructuredMeta panel, prose body, tags, sticky TOC, related posts.
Emits BlogPosting + Breadcrumb JSON-LD and article OG tags via BaseHead.

### Routes
- [`blog/[...slug].astro`](../../src/pages/blog/[...slug].astro) — one page per post; auto-injects body components; computes reading time; shows related posts.
- [`blog/index.astro`](../../src/pages/blog/index.astro) + [`blog/page/[page].astro`](../../src/pages/blog/page/[page].astro) — paginated listing (page 1 at `/blog`, pages 2+ at `/blog/page/N`). Split this way to avoid colliding with the `[...slug]` post route.
- [`blog/category/[category].astro`](../../src/pages/blog/category/[category].astro) and [`blog/tag/[tag].astro`](../../src/pages/blog/tag/[tag].astro) — filter pages.
- [`portfolio/index.astro`](../../src/pages/portfolio/index.astro) + [`portfolio/[...slug].astro`](../../src/pages/portfolio/[...slug].astro) — tiles + detail.
- [`about.astro`](../../src/pages/about.astro).

### Shared logic — [`src/lib/posts.ts`](../../src/lib/posts.ts)
`getPublishedPosts`, `getRelatedPosts`, `postReadingTime`, `POSTS_PER_PAGE` — one
source of truth used by every route + RSS + home.

### Search — Pagefind (no database)
`pnpm build` now runs `astro build && pagefind --site dist`. Pagefind indexes the
built HTML (scoped via `data-pagefind-body` on article/portfolio bodies) into a
tiny client-side index. [`SearchBox.astro`](../../src/components/SearchBox.astro)
lazy-loads it on the homepage and blog index. **No server, no DB.**

### Styling
Added `.prose` typography to [`global.css`](../../src/styles/global.css) for
rendered Markdown (headings, code, tables, blockquotes) using design tokens.

### Example content (doubles as the templates)
Three posts (one per type) + one portfolio entry in `src/content/`.

## Commands
```bash
pnpm add -D pagefind          # static search
# build script updated to: astro build && pagefind --site dist
```

## Verification
- [x] `pnpm build` → 21 pages + Pagefind indexes 4 bodies; "Complete!"
- [x] Routes generated: /blog, 3 posts, 3 category pages, 9 tag pages, portfolio
      index + detail, about, 404.
- [x] GH Pages mode: all internal links + the Pagefind base carry the
      `/sfinnovator-extension` sub-path.
- [x] RSS contains all 3 posts; sitemap regenerated.

## Answers to the original questions
- **Search needs a database?** No — Pagefind is build-time + client-side. Included.
- **Pagination for many posts?** Yes — static pages, no DB.
- **Portfolio tile?** Built (`/portfolio`).
- **"Never touch code"?** Achieved — publishing = one `.mdx` file. See the guide.

## Notes / follow-ups
- Per-post custom OG images can reuse `scripts/generate-og.mjs` later.
- The Astro 4→6 security upgrade (from [dependency-audit](../security/dependency-audit.md)) is still tracked and unaffected by this work.
