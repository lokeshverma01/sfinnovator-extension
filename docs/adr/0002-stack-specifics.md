# ADR 0002 — Stack Specifics (package manager, Tailwind, accent, copy)

- **Status:** Accepted
- **Date:** 2026-06-20
- **Deciders:** Site owner (SF Innovator)
- **Relates to:** [ADR 0001](./0001-tech-stack.md)

## Context

ADR 0001 set the high-level stack (Astro + MDX + Tailwind + CSS-variable theming). Before scaffolding, we needed to pin concrete versions and brand values so the implementation log and commands are exact and reproducible.

## Decision

| Concern | Choice | Notes |
|---|---|---|
| **Package manager** | **pnpm** | Faster, disk-efficient, strict. All documented commands use `pnpm`. Requires global install once: `npm install -g pnpm`. |
| **Tailwind version** | **Tailwind v3** | Classic `tailwind.config.cjs` + `@astrojs/tailwind` integration. Chosen for maximum compatibility with existing tutorials/answers. NOTE: recent `astro add tailwind` defaults to v4 — we pin v3 explicitly during setup. |
| **Accent color** | **Salesforce blue** | Light: `#0176d3`. Dark: `#4fa8ff`. On-brand; single accent only. Defined as CSS tokens, never hard-coded in components. |
| **Hero copy** | Headline: *"Salesforce, explained by building it."* Subline: *"Real implementations, debugged errors, and solutions you can validate — written down as I learn them."* | Matches approved design mockup. |

## Consequences

- Tailwind v3 means we will **not** use the v4 Vite-plugin setup; setup steps in the implementation log reflect the v3 integration path and a `tailwind.config.cjs`.
- Design tokens from `design/landing-mockup.html` port directly into `src/styles/global.css` and the Tailwind theme.
