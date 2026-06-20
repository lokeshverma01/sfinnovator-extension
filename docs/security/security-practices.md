# Security Practices & Checklist

Security is **non-negotiable** on this project. A static site has a small attack surface, but "small" is not "none." This document lists the standards we follow and a checklist to run **before every merge to `main`.**

> Principle: secure by default, least privilege, no secrets in Git, defense in depth.

---

## Standing practices

### 1. Secrets & credentials
- **No secrets in the repo — ever.** No API keys, tokens, or passwords in code or committed files.
- Use the host's encrypted **environment variables** (Azure SWA settings / Cloudflare Pages env) for anything sensitive.
- `.gitignore` must exclude `.env`, `.env.*`, and local secret files.
- If a secret is ever committed: rotate it immediately, then scrub history.

### 2. Dependencies (supply chain)
- Pin Node version via `.nvmrc`; use a lockfile (`pnpm-lock.yaml`) — commit it.
- Run `pnpm audit` regularly; enable **Dependabot** on GitHub for automated alerts/PRs.
- Add new dependencies deliberately — prefer fewer, well-maintained packages. Each dependency is attack surface.

### 3. HTTP security headers (set at the host)
Configure these on the static host:
- `Content-Security-Policy` (CSP) — restrict script/style/img/connect sources. Tighten as features are added (ads/analytics need explicit allow-listing).
- `Strict-Transport-Security` (HSTS) — force HTTPS.
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` — disable unused browser features (camera, mic, geolocation).
- `X-Frame-Options: DENY` (or CSP `frame-ancestors`) — prevent clickjacking.

### 4. Third-party scripts (ads, analytics, comments)
- Load only over HTTPS; add to CSP allow-list explicitly.
- Lazy-load / defer to protect performance and limit exposure.
- Prefer privacy-friendly, cookie-free tools (Cloudflare Analytics, Plausible) to avoid consent-banner + tracking risk.

### 5. Content & input safety
- MDX can execute components — **only render trusted/authored content.** When a CMS/writer flow is added, treat submitted content as untrusted: review via PR before merge; sanitize any HTML.
- Escape/validate any user-provided values if/when dynamic features (forms) are added.

### 6. Access control & workflow
- Protect the `main` branch: require PR review before merge; only admin merges (this enforces the future editorial approval flow).
- Enable 2FA on GitHub, the domain registrar, and the hosting account.
- Principle of least privilege for any future serverless functions and tokens.

### 7. Transport & DNS
- HTTPS everywhere (free TLS from host); redirect HTTP → HTTPS.
- Lock the domain registrar (registrar lock) and enable DNSSEC when migrating DNS.

---

## Pre-merge security checklist

Run through this before merging any branch to `main`:

- [ ] No secrets, keys, or `.env` files in the diff.
- [ ] Lockfile committed; `pnpm audit` shows no unresolved high/critical issues.
- [ ] Any new third-party script is HTTPS + added to CSP + deferred.
- [ ] New external content/HTML is from a trusted source or sanitized.
- [ ] Security headers still valid (CSP not broken by new resources).
- [ ] No new public route exposes sensitive data or admin functionality.
- [ ] Dependencies added are necessary and reputable.

---

## To configure when we set up hosting/CI (tracked tasks)
- [ ] Add security headers config (Azure `staticwebapp.config.json` / Cloudflare `_headers`).
- [ ] Enable Dependabot + secret scanning on the GitHub repo.
- [ ] Enable branch protection on `main`.
- [ ] Enable 2FA on all accounts.
