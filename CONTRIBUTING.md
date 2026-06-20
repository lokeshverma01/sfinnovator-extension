# Contributing & Coding Standards

Read this **before writing any code.** It defines how we build SF Innovator so the codebase stays reusable, readable, secure, and easy to maintain. These standards are part of the project's "well-architected" promise.

---

## 1. Reusable components first

- **Build small, single-purpose components.** One component does one thing (a `PostCard` shows a post summary; it does not also fetch data or define layout).
- **Compose, don't duplicate.** If the same markup appears twice, extract a component.
- **Props in, markup out.** Components receive data via typed props; they don't reach into globals. Site-wide constants come from `src/lib/siteConfig.ts`.
- **Document every reusable component** in [`docs/components/`](./docs/components/) in the same commit you create it.
- **Folder conventions:**
  - `src/components/` — reusable UI pieces.
  - `src/layouts/` — page shells.
  - `src/lib/` — logic helpers (SEO, config, utils) — the "backend skeleton."
  - `src/content/` — content + the schema (`config.ts`).

## 2. Comment standards

We comment for the next person (often future you). Aim for **clear, not noisy.**

- **Every component starts with a header comment**: what it is, its props, and where it's used.
  ```astro
  ---
  /**
   * PostCard — summary card for a single blog post.
   * Props: title, excerpt, date, tag, href
   * Used by: src/pages/index.astro, src/pages/blog/index.astro
   */
  ---
  ```
- **Explain *why*, not *what*.** The code shows what; comments explain intent, trade-offs, and gotchas.
- **Comment non-obvious logic** (the no-flash theme script, SEO edge cases, date math).
- **Keep comments truthful.** If you change the code, update the comment in the same edit.
- **No commented-out dead code** in `main` — delete it; Git remembers.

## 3. Naming & style

- Components: `PascalCase.astro`. Helpers/files in `lib`: `camelCase.ts`. Content files: `kebab-case.mdx`.
- Use TypeScript (`strict`) for `src/lib` and component frontmatter where possible.
- Use Tailwind utilities for styling; put shared design tokens (colors, spacing) as CSS variables in `src/styles/global.css`. **No hard-coded hex colors in components** — use tokens.
- Keep accessibility in mind: semantic HTML, one `<h1>` per page, `alt` text, labelled buttons.

## 4. Git workflow

- Branch per change: `feature/<name>`, `post/<slug>`, `fix/<name>`.
- Small, focused commits with clear messages (imperative mood: "Add theme toggle").
- Open a PR → review against the [security checklist](./docs/security/security-practices.md) → merge to `main`.
- `main` is always deployable.

## 5. Definition of Done (every change)

A change is **not done** until:
- [ ] Code follows the component + comment standards above.
- [ ] New/changed components are documented in `docs/components/`.
- [ ] The implementation step is recorded in `docs/implementation-log/`.
- [ ] The security checklist passes.
- [ ] `pnpm build` succeeds and the page works in both light and dark mode.
