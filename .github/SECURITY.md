# Security Policy

## Supported Versions

The latest code on the `main` and `elusoc` branches is actively maintained and
receives security fixes.

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it
privately rather than opening a public issue:

1. Use **GitHub → Security → Report a vulnerability** (Private Vulnerability
   Reporting) on this repository, **or**
2. Contact the maintainer directly through their GitHub profile.

Please include:

- A description of the vulnerability and its impact.
- Steps to reproduce (proof-of-concept if possible).
- The affected area (e.g. `server/controllers/...`, a client route, a dependency).

We aim to acknowledge reports within a few days and will keep you updated on the
fix. Please do not publicly disclose the issue until a fix has been released.

## Automated Security Measures

This repository runs automated security tooling — CodeQL static analysis,
dependency auditing, and Dependabot update monitoring. See
[`docs/SECURITY_SCANNING.md`](../docs/SECURITY_SCANNING.md) for how these run and
where to read their results.
