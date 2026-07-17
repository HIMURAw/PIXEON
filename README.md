<div align="center">

# PIXEON

**A full-stack gaming e-commerce platform** — storefront, checkout, and a complete
admin back-office, built with Next.js 16, React 19, and Drizzle ORM.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle-MySQL-C5F74F)](https://orm.drizzle.team)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue)](LICENSE)

</div>

---

PIXEON is a game/console storefront (originally built for the Turkish market — UI copy
is in Turkish) with a real admin panel behind it, not just a demo shop. It was built
as a single Next.js app: no separate backend service, no CMS — data access goes
through typed Server Actions, and the whole thing ships with its own security,
observability, and content-management tooling.

## Highlights

**Storefront**
- Category browsing (consoles, games, accessories, digital codes), product search
  with [Meilisearch](https://www.meilisearch.com/), filtering, wishlist, and cart
  sharing
- Interactive **3D product viewers** (`react-three-fiber` + `.glb` models) for
  controllers and consoles, with lazy loading for performance
- Reviews with likes, coupons, order tracking, blog, and a support-ticket system with
  live chat and an AI chat assistant

**Admin back-office** (`/admin`)
- Products, categories, orders, payments, customers, coupons, shipping, reviews,
  reports
- CMS for banners, blog posts, nav menus, static pages, and the homepage hero slider
- Role-based admin accounts, a full **audit log** of admin actions, and a **live
  request monitor** for the whole site

**Platform / security**
- Custom JWT session auth (`jose`), bcrypt password hashing, and CAPTCHA
  (`svg-captcha`) on sensitive endpoints
- In-app rate limiting, a regex-based WAF, and bot blocking, all enforced in
  `middleware.ts`
- Security headers (HSTS, X-Frame-Options, etc.) and CDN cache-control policy per route
- Zod validation on Server Actions/API routes
- [Sentry](https://sentry.io) error/performance monitoring alongside the custom admin
  monitor and audit log
- Web push notifications (`web-push`)

## Tech stack

| | |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack), [React 19](https://react.dev) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Database | MySQL via [Drizzle ORM](https://orm.drizzle.team) |
| Search | [Meilisearch](https://www.meilisearch.com/) |
| Auth | Custom JWT sessions (`jose`), `bcryptjs` |
| 3D | `react-three-fiber`, `@react-three/drei`, `three` |
| Forms/validation | `react-hook-form`, `zod` |
| Monitoring | `@sentry/nextjs` |

## Getting started

### Prerequisites

- Node.js 20+
- A MySQL-compatible database (MariaDB works too)
- A [Meilisearch](https://www.meilisearch.com/) instance (optional — only needed for
  product search)

### Setup

```bash
git clone https://github.com/HIMURAw/PIXEON.git
cd PIXEON
npm install

cp .env.example .env
# fill in DATABASE_URL, JWT_SECRET, and (optionally) MEILISEARCH_* / NEXT_PUBLIC_SENTRY_DSN

npx drizzle-kit push   # sync the schema (lib/db/schema.ts) to your database

npm run dev
```

The app runs at `http://localhost:3000`.

### Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Lint with ESLint |
| `npm run meili:sync` | Push products from MySQL into the Meilisearch index |

Drizzle migrations are managed with `npx drizzle-kit generate` / `push` / `studio`.

## Project structure

See [CLAUDE.md](CLAUDE.md) for a deeper architectural walkthrough (route groups,
the Server Actions data layer, auth/middleware design, etc.). In short:

```
app/
  (public)/    storefront routes
  (auth)/      login / register
  (admin)/     admin back-office
  api/         route handlers (auth, uploads, webhooks, support chat, ...)
lib/
  actions/     Server Actions — the primary data-mutation layer
  db/          Drizzle schema + client
components/    UI components, organized by domain
context/       React Context providers for client-side state (cart, chat, etc.)
```

## License

Apache License 2.0 — see [LICENSE](LICENSE).
