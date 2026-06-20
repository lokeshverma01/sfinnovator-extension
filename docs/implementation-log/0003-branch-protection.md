# 0003 — Branch Protection on main

- **Date:** 2026-06-20
- **Phase:** Phase 0 (Foundation) — governance
- **Goal (one sentence):** Protect `main` so changes flow through Pull Requests and a passing build, rehearsing the future writer/admin approval workflow — without locking out the solo developer.
- **Branch:** main

> Layman summary: We told GitHub that the `main` branch of THIS repo must be changed
> through reviewed Pull Requests whose build passes — not by pushing straight to it.
> This only affects `sfinnovator-extension`; every other repo (including the Azure
> `lokesh-portfolio`) is untouched. Branch protection is always per-repo, per-branch;
> there is no account-wide setting.

## Decision — "Option A (Light)"
Chosen because the owner is currently a solo developer. A required PR *approval* would
lock the owner out (GitHub forbids approving your own PR). We enforce the PR flow and a
green build now, and will add required approval later when a second collaborator
(writer/admin) is onboarded.

## What is enforced on `main` (this repo only)
| Rule | Value |
|---|---|
| Required status check | `build` (Astro build must pass) |
| Branch must be up to date before merge | yes (`strict`) |
| Required approvals | 0 (solo can self-merge) |
| Force pushes | blocked |
| Branch deletion | blocked |
| Linear history | required |
| Conversation resolution | required |
| Admin enforcement | off (owner keeps an emergency escape hatch) |

## Prerequisite fix (important)
Branch protection requires the `build` check to run **on Pull Requests**, but the
workflow originally only ran on push to `main`. If left unfixed, the required check
would never run on a PR and **no PR could ever merge** (footgun).

**Fix applied to** [`.github/workflows/deploy.yml`](../../.github/workflows/deploy.yml):
- Added `pull_request: branches: [main]` so `build` runs on PRs.
- Gated the `deploy` job with `if: github.event_name != 'pull_request'` so a PR
  validates the build but never publishes to production.

## Steps
```bash
# 1. Find the exact check names (status-check "contexts"):
gh api repos/lokeshverma01/sfinnovator-extension/commits/main/check-runs --jq '.check_runs[].name'
#    -> build, deploy   (we require only "build")

# 2. Apply protection (Option A) via the branch protection API:
gh api -X PUT repos/lokeshverma01/sfinnovator-extension/branches/main/protection --input protection.json
#    protection.json: required_status_checks {strict:true, contexts:["build"]},
#    enforce_admins:false, required_pull_request_reviews:null,
#    allow_force_pushes:false, allow_deletions:false,
#    required_linear_history:true, required_conversation_resolution:true
```

## Verification
- [x] `GET .../branches/main/protection` shows the settings above.
- [x] `lokesh-portfolio/main` still `protected:false` — other repos unaffected.

## The normal workflow from now on
```bash
git switch -c feature/<name>      # new branch
# ...edit...
git push -u origin feature/<name> # push branch
gh pr create --fill               # open PR -> build runs automatically
# when build is green:
gh pr merge --squash --delete-branch   # merge -> deploy runs on main
```

## Planned future change (when a writer/admin is onboarded)
Upgrade to require approval (the editorial gate):
```bash
# set required_pull_request_reviews.required_approving_review_count = 1
```
This makes the admin the approver of writer PRs — the two-tier publish flow from the
project goals. Track in the ADRs when implemented.
