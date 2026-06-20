# Dependency Audit Log

Tracks `pnpm audit` findings, our risk assessment, and remediation decisions.
Reviewed before each merge to `main` (see [security-practices.md](./security-practices.md)).

---

## 2026-06-20 — Initial audit (during Phase 2)

**Result:** 18 vulnerabilities (4 high, 11 moderate, 3 low), all in **Astro core +
Vite + esbuild + js-yaml** (transitive deps present since Phase 0). The Phase 2
additions (`@astrojs/rss`, `sharp`) introduced **none** of them.

### Risk assessment for THIS site (static / SSG on GitHub Pages)

| Group | Vector | Exploitable for us? |
|---|---|---|
| Astro reflected XSS, Host-header SSRF, X-Forwarded-Host reflection, middleware auth bypass, Cloudflare adapter stored XSS, server-island params | **SSR runtime** | **No** — site is fully static; no server runs in production. |
| Vite path traversal, esbuild request leak, Astro dev-server arbitrary local file read | **Dev server** | Dev-machine only; not in deployed output. Mitigation: don't run `pnpm dev` on untrusted networks. |
| js-yaml quadratic DoS | **Build time** | No — build runs in our own CI on our own content. |

**Conclusion:** No vulnerability is exploitable against the deployed static site.
Real risk is low. However, the clean remediation is a version upgrade.

### Remediation decision
- **Proper fix:** upgrade **Astro 4 → Astro 6** (advisories require `astro >= 6.4.6`;
  no Astro 4.x patch clears them). This is a **major version bump** with breakage
  risk, so it is tracked as its own scoped, fully-tested task — NOT bundled into an
  unrelated feature PR.
- **Interim:** safe to continue on Astro 4 for the static preview; do not run the dev
  server on untrusted networks.
- **Status:** ⏳ OPEN — "Astro 6 upgrade" task to be scheduled.

### How to re-check
```bash
pnpm audit --prod
# After upgrading: pnpm up astro@^6 @astrojs/mdx@latest @astrojs/sitemap@latest \
#                          @astrojs/tailwind@latest @astrojs/rss@latest
# then re-run the full build in BOTH modes and re-audit.
```
