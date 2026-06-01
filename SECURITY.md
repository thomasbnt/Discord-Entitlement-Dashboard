# Security Policy

## Supported versions

Only the latest version on `main` receives security fixes.

## Reporting a vulnerability

**Do not open a public issue for security vulnerabilities.**

Report via GitHub private vulnerability reporting:
[Security advisories](../../security/advisories/new)

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

You will receive a response within 72 hours.

## Scope

- Bot token exposure or leakage
- Server-side proxy (`server/api/discord/`) misuse allowing unauthorized API calls
- XSS via entitlement data rendered in the UI
- Dependency vulnerabilities with direct exploitability

## Out of scope

- Discord API security issues (report to Discord directly)
- Self-hosted misconfiguration (no HTTPS, exposed ports)
