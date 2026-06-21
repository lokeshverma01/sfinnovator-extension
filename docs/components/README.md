# Component Catalog

Every **reusable** component in the site is documented here so it can be understood, reused, and repaired without reading all the source first. This pairs with the coding standards in [`../../CONTRIBUTING.md`](../../CONTRIBUTING.md).

> Rule: **a component does not exist until it is in this catalog.** When you create or change a component, update its entry in the same commit.

## Catalog

| Component | Path | Purpose | Used by | Status |
|---|---|---|---|---|
| BaseLayout | `src/layouts/BaseLayout.astro` | Page shell: `<html>`, head, header, footer, no-flash theme script | all pages | ✅ active |
| BaseHead | `src/components/BaseHead.astro` | `<head>` SEO: title, meta, OG, Twitter, canonical, JSON-LD | BaseLayout | ✅ active |
| Header | `src/components/Header.astro` | Top nav + logo + theme toggle | BaseLayout | ✅ active |
| Footer | `src/components/Footer.astro` | Site footer + social links | BaseLayout | ✅ active |
| ThemeToggle | `src/components/ThemeToggle.astro` | Light/dark switch button + persistence | Header | ✅ active |
| PostCard | `src/components/PostCard.astro` | Blog summary card (tag, title, excerpt, meta) | home | ✅ active |
| PostListItem | `src/components/PostListItem.astro` | Known-Issues-style scannable row | blog index, category/tag, related | ✅ active |
| BlogIndex | `src/components/BlogIndex.astro` | Shared paginated listing UI (search, filter, list, pager) | /blog, /blog/page/[n] | ✅ active |
| SearchBox | `src/components/SearchBox.astro` | Pagefind static search input (lazy-loaded) | home, blog index | ✅ active |
| PortfolioTile | `src/components/PortfolioTile.astro` | Portfolio solution card | /portfolio | ✅ active |
| PostLayout | `src/layouts/PostLayout.astro` | Master template for all 3 post types | blog/[...slug] | ✅ active |
| post/Callout | `src/components/post/Callout.astro` | note/tip/warning/error box (MDX body) | post bodies | ✅ active |
| post/Steps + Step | `src/components/post/Steps.astro`, `Step.astro` | Auto-numbered tutorial steps (MDX body) | post bodies | ✅ active |
| post/Figure | `src/components/post/Figure.astro` | Image + caption (MDX body) | post bodies | ✅ active |
| post/StatusBadge | `src/components/post/StatusBadge.astro` | Known-Issues status pill | debugging posts, list rows | ✅ active |
| post/PostMeta | `src/components/post/PostMeta.astro` | Byline: author/dates/reading time/categories | PostLayout | ✅ active |
| post/StructuredMeta | `src/components/post/StructuredMeta.astro` | Per-type structured info panel | PostLayout | ✅ active |
| post/TableOfContents | `src/components/post/TableOfContents.astro` | Auto TOC from headings | PostLayout | ✅ active |

**Authoring components** (auto-injected into MDX, no import needed): `Callout`, `Steps`, `Step`, `Figure`, `StatusBadge` — see the registry in `src/components/post/mdxComponents.ts` and the [publishing guide](../publishing-guide.md).

> Each component carries a header comment documenting its props and usage (per [CONTRIBUTING.md](../../CONTRIBUTING.md)).

---

## Per-component template

Create `docs/components/<ComponentName>.md` using this:

```markdown
# <ComponentName>

- **Path:** `src/components/<ComponentName>.astro`
- **Status:** active | deprecated
- **Purpose (one line):** <what it does and why it exists>

## Inputs (props)
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| <name> | <type> | yes/no | <default> | <what it controls> |

## Usage example
\`\`\`astro
---
import <ComponentName> from "@/components/<ComponentName>.astro";
---
<<ComponentName> prop="value" />
\`\`\`

## Dependencies
- <other components, libs, design tokens, or data it relies on>

## Accessibility & SEO notes
- <semantic HTML, aria labels, alt text, heading levels>

## Gotchas
- <anything surprising; link to troubleshooting if relevant>
```
