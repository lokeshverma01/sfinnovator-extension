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
| PostCard | `src/components/PostCard.astro` | Blog summary card (tag, title, excerpt, meta) | landing, blog index | ✅ active |

> Each component carries a header comment documenting its props and usage (per [CONTRIBUTING.md](../../CONTRIBUTING.md)). Detailed per-component docs can be expanded from the template below as the API grows.

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
