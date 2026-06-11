# Contributing

## Prerequisites

- Node.js 20+
- A Discord Bot Token + Application ID (for testing)

## Setup

```bash
git clone https://github.com/thomasbnt/Discord-Entitlement-Dashboard
cd Discord-Entitlement-Dashboard
npm install
npm run dev
```

## Workflow

1. Fork the repository
2. Create a branch: `git checkout -b feat/my-feature` or `fix/my-bug`
3. Make your changes
4. Open a Pull Request against `main`

## Branch naming

| Prefix | Use case |
|--------|----------|
| `feat/` | New feature |
| `fix/` | Bug fix |
| `chore/` | Tooling, deps, config |
| `docs/` | Documentation only |

## PR checklist

- [ ] `.env.example` updated if new env vars added
- [ ] `README.md` updated if user-facing behavior changed
- [ ] No `.env` or secrets committed
- [ ] TypeScript — no `any` without justification
- [ ] No custom CSS (Nuxt UI components only)

## Commit messages

Commits must follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification:

```
<type>[optional scope]: <description>
```

| Type | Use |
|------|-----|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `refactor` | No behavior change |
| `ci` | CI/CD workflows |
| `chore` | Deps, tooling, config |
| `style` | Formatting (no logic change) |

Breaking changes: add `!` after the type, or a `BREAKING CHANGE:` footer.

```text
feat: add CSV export for filtered entitlements
fix: app switcher not navigating to /login
docs: update README with multi-app feature
chore: bump @nuxt/ui to 3.1.0
feat!: drop Node.js 18 support
```

## Conventions

See [CLAUDE.md](CLAUDE.md) for full stack conventions.
