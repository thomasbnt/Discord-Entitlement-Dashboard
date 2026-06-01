# Discord Entitlement Dashboard

Dashboard to manage Discord App Entitlements (list, filter, delete, create tests).

## Stack

- **Nuxt 3** (v4 compat mode, `srcDir = app/`) + TypeScript
- **Nuxt UI v3** (UI components, Tailwind v4 built-in)
- **Pinia** (state management, auto-import via `@pinia/nuxt`)
- **Docker** (deployment via `docker compose`)

## Auth

Bot token + Application ID stored in `localStorage`. Sent via `X-Discord-Token` header to Nuxt server routes (`server/api/discord/[...path].ts`) which proxy `https://discord.com/api/v10/`. No discord.js — direct `$fetch` calls.

## Structure

```text
app/                  ← srcDir (Nuxt v4 compat)
  pages/              ← /login, / (dashboard), /help
  components/         ← EntitlementTable, EntitlementFilters, EntitlementStats,
                         DeleteDialog, CreateDialog, GuildBadge
  composables/        ← useDiscord (wraps API calls, guild cache)
  stores/             ← auth.ts, entitlements.ts, skus.ts
  middleware/         ← auth.global.ts (redirect to /login)
server/api/discord/   ← proxy to Discord API
public/               ← static assets (images)
```

## Development

```bash
npm install
npm run dev
```

→ <http://localhost:3000>

## Docker

```bash
cp .env.example .env
docker compose up --build
```

→ <http://localhost:4545>

## Conventions

- **0 custom CSS** — Nuxt UI components only
- TypeScript everywhere
- `.env` never committed — always update `.env.example` for new variables
- Always update `README.md` and `docker-compose.yml`
- `useDiscord()` called inside Pinia actions (not at store setup)
- UTable columns: use `accessorKey`/`header` (TanStack Table), slots named `#[key]-cell`
- Filter preferences persisted to localStorage (SKU, exclude_ended, exclude_deleted)
