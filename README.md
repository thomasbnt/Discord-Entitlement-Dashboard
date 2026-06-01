# Discord Entitlement Dashboard

[![Nuxt](https://img.shields.io/badge/Nuxt-3.x-00DC82?logo=nuxt.js&logoColor=white)](https://nuxt.com)
[![Discord API](https://img.shields.io/badge/Discord_API-v10-5865F2?logo=discord&logoColor=white)](https://discord.com/developers/docs)
[![Discord Premium Apps](https://img.shields.io/badge/Discord_Premium_Apps-5865F2?logo=discord&logoColor=white)](https://docs.discord.com/developers/platform/app-monetization)
[![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)](https://docker.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Web dashboard to manage [Entitlements](https://docs.discord.com/developers/resources/entitlement) for a Discord App. List, filter, delete and create test entitlements without slash commands or a certified bot account.

![Web Dashboard to manage Discord App Entitlements.](https://github.com/user-attachments/assets/ac5265db-5539-456e-be88-341fb6ccca53)

## What are Premium Apps & Activities?



**Premium Apps & Activities** is Discord's monetization system for developers. It lets you charge users or servers for premium features inside your Discord app:

- **App Subscriptions** — recurring billing, per user or per server (guild)
- **One-time purchases** — single payment for a permanent item or feature unlock

When a user or guild pays, Discord creates an **Entitlement** — the record that grants access. This dashboard manages those entitlements directly via the Discord API.

![Discord App Monetization Overview](public/images/monetization-overview.png)

## Features

- Authentication via Bot Token (stored in localStorage)
- List all entitlements with filters (guild, user, SKU, expired, deleted)
- Delete test entitlements (type `TEST_MODE_PURCHASE` or API-created)
- Create test entitlements with SKU selector
- Guild name resolution (bot member + widget fallback)
- Stats overview: total / active / test / expired
- Dynamic search with debounce
- Copy IDs to clipboard
- Persistent filter preferences (localStorage)
- Sorting on key columns

## Stack

- [Nuxt 3](https://nuxt.com) (v4 compat mode) + TypeScript
- [Nuxt UI v3](https://ui.nuxt.com)
- [Pinia](https://pinia.vuejs.org)
- [Docker](https://docker.com)

## Requirements

- Node.js 20+
- A Discord Bot Token and its Application ID

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

## Environment variables

| Variable | Default | Description        |
|----------|---------|--------------------|
| `PORT`   | `4545`  | Docker host port   |

## Security

The bot token only transits between the browser and the local Nuxt server. It is never sent to third-party servers. Use HTTPS in production.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Commits must follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):

```text
feat: add guild filter
fix: token not cleared on logout
docs: update env variables table
ci: add docker build workflow
chore: bump nuxt to 3.16
```

## License

MIT
