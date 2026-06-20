# Implementation Log

This is the **build journal** for SF Innovator. It records, step-by-step, *exactly* how the site was built — in plain language a non-expert can follow, plus the precise commands and code so the build is fully reproducible.

> Goal: someone who has never seen this project can open these files in order and **rebuild the entire site by following the steps**, ending with the same result.

## How to use this folder

- Files are numbered and ordered: `0001-...`, `0002-...`. Read them in sequence.
- Each entry covers one phase or work session.
- Write entries **as you build**, not afterwards.
- Use the [template below](#entry-template).

## Index

| # | Entry | Phase | Status |
|---|---|---|---|
| 0001 | (to be written when we scaffold) Foundation: repo, Astro, Tailwind, deploy | Phase 0 | ⏳ pending |
| 0002 | (planned) Landing page: layout, header, footer, theme toggle | Phase 1 | ⏳ pending |

---

## Entry template

Copy this into a new file `NNNN-short-title.md` when starting a phase.

```markdown
# NNNN — <Phase / Task Title>

- **Date:** YYYY-MM-DD
- **Phase:** <e.g., Phase 1 — Landing Page>
- **Goal (one sentence):** <what this entry achieves>
- **Branch:** <e.g., feature/landing-page>

## Prerequisites
- <tools/versions/accounts needed; link to earlier entries if applicable>

## Steps
For each step:

### Step N — <plain-English title>
**Why we do this:** <layman explanation>
**Command / action:**
\`\`\`bash
<exact command>
\`\`\`
**Files created/changed:** <exact paths, e.g. src/layouts/BaseLayout.astro>
**Expected result:** <what you should see; include output or a screenshot note>
**If it fails:** <pointer to docs/troubleshooting or a quick fix>

## Verification
- [ ] <how we confirmed this phase works — e.g., `pnpm build` passes, page loads, Lighthouse score>

## Outcome
- <what now exists; link new components in docs/components/>

## Notes / decisions
- <anything non-obvious; promote real decisions to an ADR>
```
