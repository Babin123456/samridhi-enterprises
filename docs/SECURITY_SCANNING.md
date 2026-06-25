# Security Scanning & Dependency Monitoring

This repository runs automated security checks so vulnerabilities and vulnerable
dependencies are caught before they reach production. This document explains what
runs, when, and where to read the results.

## Overview

| Tool | What it does | Trigger | Where results appear |
|------|--------------|---------|----------------------|
| **CodeQL** | Static analysis of the JS/JSX code for security issues | Push & PR to `main`/`elusoc`, plus weekly | **Security** tab → **Code scanning alerts** |
| **Dependency Review** | Blocks PRs that add a high-severity vulnerable dependency | Pull requests | Inline check on the PR |
| **npm audit** | Reports known advisories in `client/` and `server/` | Pull requests, plus weekly, plus manual | **Actions** tab → run logs |
| **Dependabot** | Opens grouped PRs to update outdated/vulnerable deps | Weekly | **Pull requests** + **Security** tab → **Dependabot alerts** |

## Workflows

### `.github/workflows/codeql.yml`
Runs CodeQL with the `security-and-quality` query suite over the
`javascript-typescript` language (covers both the React client and the Express
server). JavaScript needs no build, so it uses `build-mode: none`. Findings show
up as **Code scanning alerts** in the Security tab; each alert links to the exact
line and an explanation.

### `.github/workflows/dependency-audit.yml`
Two jobs:
- **dependency-review** — runs only on pull requests and fails the PR if it
  introduces a dependency with a **high** (or higher) severity advisory. It does
  **not** fail on advisories that already exist on the base branch.
- **npm-audit** — runs `npm audit --audit-level=high` separately in `client/`
  and `server/`. It is currently **reported, not gated** (`continue-on-error`),
  so pre-existing advisories are visible in the run log without blocking every
  PR. Once the dependency tree is clean, remove `continue-on-error` to make
  high-severity advisories a hard failure.

## Dependabot — `.github/dependabot.yml`
Opens **weekly** update PRs for:
- `npm` packages in `/client` (grouped into one PR)
- `npm` packages in `/server` (grouped into one PR)
- the `github-actions` used by the workflows above

Grouping keeps update PRs to a manageable number. Dependabot also raises
**Dependabot alerts** (Security tab) when a dependency in the lockfiles has a
known advisory.

## Reading & triaging results

1. **Code scanning alerts** (Security tab): review each alert, confirm whether it
   is a true positive, and fix or dismiss with a reason.
2. **Dependency Review check** on a PR: if it fails, the PR added a vulnerable
   dependency — bump it to a patched version or choose an alternative.
3. **npm audit log** (Actions tab): expand the `npm audit` step to see the
   advisory list and the suggested `npm audit fix` remediation.
4. **Dependabot PRs**: review the changelog/diff, let CI run, and merge once green.

## Running the checks locally

```bash
# Audit each workspace the same way CI does
cd client && npm audit --audit-level=high
cd ../server && npm audit --audit-level=high

# Attempt automatic safe fixes
npm audit fix
```
