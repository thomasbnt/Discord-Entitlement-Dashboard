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

## Conventions

See [CLAUDE.md](CLAUDE.md) for full stack conventions.
