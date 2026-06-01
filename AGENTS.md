# AGENTS.md

Context for AI coding agents working on this codebase.

## Project

Web dashboard to manage Discord App Entitlements (list, filter, delete, create tests) via the Discord API v10.

## Stack

- **Nuxt 3** `^3.15` with `future.compatibilityVersion: 4` → `srcDir = app/`
- **Nuxt UI v3** — all UI via components, Tailwind v4 built-in, **0 custom CSS**
- **Pinia** — state management, auto-imported via `@pinia/nuxt`
- **TypeScript** — everywhere, no `any` without justification
- **Docker** — multi-stage build, deployed via `docker compose`

## Structure

```text
app/
  pages/          ← /login, / (dashboard), /help
  components/     ← EntitlementTable, EntitlementFilters, EntitlementStats,
                     DeleteDialog, CreateDialog, GuildBadge
  composables/    ← useDiscord (wraps $fetch calls + guild cache)
  stores/         ← auth.ts, entitlements.ts, skus.ts (Pinia)
  middleware/     ← auth.global.ts (redirect unauthenticated → /login)
server/api/discord/[...path].ts  ← proxy to https://discord.com/api/v10/
public/           ← static assets
```

## Auth flow

Bot token + Application ID stored in `localStorage`. Browser sends them via `X-Discord-Token` header to Nuxt server routes, which proxy the Discord API. No `discord.js` — direct `$fetch` calls only.

## Key conventions

- `useDiscord()` called inside Pinia actions, not at store setup time
- `UTable` columns: use `accessorKey` / `header` (TanStack Table API), slots named `#[key]-cell`
- Filter preferences (`sku`, `exclude_ended`, `exclude_deleted`) persisted to `localStorage`
- `.env` never committed — update `.env.example` for every new env var
- Always keep `README.md` and `docker-compose.yml` in sync with changes

## Commits

Follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):

| Type | Use |
|------|-----|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `refactor` | No behavior change |
| `ci` | CI/CD workflows |
| `chore` | Deps, tooling, config |
| `style` | Formatting (no logic change) |

Examples:
```
feat: add guild filter to entitlement table
fix: token not cleared from localStorage on logout
ci: restrict discord notify workflow to main branch
chore: bump @nuxt/ui to 3.1.0
```

Breaking changes: add `!` after type or a `BREAKING CHANGE:` footer.

## Development

```bash
npm install
npm run dev   # http://localhost:3000
```

## Docker

```bash
cp .env.example .env
docker compose up --build   # http://localhost:4545
```

## CI

| Workflow | Trigger | Action |
|----------|---------|--------|
| `ci.yml` | push / PR → `main` | `npm ci` + `npm run build` |
| `docker.yml` | push → `main` | build + push to `ghcr.io` |
| `discord.yml` | push → `main` | Discord webhook notification |
