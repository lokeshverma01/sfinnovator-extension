# SF Innovator — Documentation

This folder is the **single source of truth** for how this website is designed, built, secured, and debugged. It is written so that **anyone — including a future you, or a brand-new developer — can rebuild or repair this site by following the documents in order.**

> Principle: *If it isn't written down here, it didn't happen.* Every meaningful step, decision, and component is documented side-by-side with the code.

---

## How the documentation is organized

| Folder / File | What it is | When you read it | When you update it |
|---|---|---|---|
| [`adr/`](./adr/) | **Architecture Decision Records.** Every important "why we chose X over Y" decision, dated and permanent. | When you want to understand *why* the project is built this way. | Whenever a significant decision is made. Never edit old ADRs — add a new one. |
| [`implementation-log/`](./implementation-log/) | **The build journal.** Step-by-step, minute-to-minute record of exactly how each phase was built. Layman + professional. | When you (or someone else) wants to **reproduce** the build from scratch. | Continuously, *as you build* — not after. |
| [`components/`](./components/) | **Component catalog.** Every reusable component: its path, purpose, inputs (props), usage example, and dependencies. | When you want to reuse or understand a component. | Every time a component is created or changed. |
| [`troubleshooting/`](./troubleshooting/) | **The runbook.** "If X breaks, here's the component, the file path, the config, and how to debug it." | When something is broken in dev or production. | When you hit (and solve) any new failure mode. |
| [`security/`](./security/) | **Security practices & checklist.** The standards we never compromise on. | Before every merge to `main`, and during reviews. | When a new risk or best practice is identified. |

Also at the repo root:
- [`../CONTRIBUTING.md`](../CONTRIBUTING.md) — coding standards: reusable-component rules + comment style. **Read this before writing any code.**

---

## The workflow these docs enforce

```
   Decide  ──►  record an ADR (docs/adr/)
     │
   Build   ──►  write steps live in the implementation log (docs/implementation-log/)
     │            └─ create reusable components per CONTRIBUTING.md
     │            └─ document each new component (docs/components/)
     │
   Secure  ──►  run the security checklist before merge (docs/security/)
     │
   Break?  ──►  fix using / add to the runbook (docs/troubleshooting/)
```

---

## Documentation rules (so it stays useful)

1. **Write as you build, not after.** The implementation log is a journal, not a summary.
2. **Layman first, then precise.** Explain *what* and *why* in plain English, then give the exact command/code.
3. **Always include the exact path.** Every reference points to a real file like [`src/components/Header.astro`](../src/components/Header.astro).
4. **Reproducible.** A reader following the steps verbatim must end up with the same result. Include versions, commands, and expected output.
5. **One change, one place.** Don't duplicate facts across docs — link instead.
