# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

PIXEON (internal codename "TUGER") is a Turkish e-commerce storefront for games/consoles/digital codes, built with Next.js 16 (App Router) and React 19. It has three route groups: a public storefront, a customer account/auth area, and a full admin back-office panel — all in a single Next.js app, no separate backend service.

## Commands

```bash
npm run dev            # start dev server (Next.js, Turbopack)
npm run build           # production build
npm run start            # run production build
npm run lint             # ESLint (eslint-config-next core-web-vitals + typescript)
npm run meili:sync       # push products from MySQL into Meilisearch index
```

There is no configured test runner in package.json — do not assume `npm test` works.

### Database (Drizzle ORM + MySQL)

Schema lives in `lib/db/schema.ts`; migrations output to `drizzle/`.

```bash
npx drizzle-kit generate   # generate a migration from schema changes
npx drizzle-kit push       # push schema directly to the DB (no migration file)
npx drizzle-kit studio     # browse the DB
```

One-off DB scripts (ad hoc migrations/fixes, not part of drizzle-kit) live in `scripts/` and at the repo root (`seed.ts`, `update-db.ts`, `update-db-v2.ts`, `check-db.ts`, `list-cats.ts`) and are run directly with `tsx`, e.g. `npx tsx scripts/seed-hero.ts`.

## Architecture

### Route groups (`app/`)

- `app/(public)/` — storefront: home, category pages (`konsollar`, `oyunlar/ps4`, `oyunlar/ps5`, `aksesuarlar`, `dijital-kodlar`, `yeni-urunler`), product pages (`p/[slug]`, `product/[slug]`), cart (`sepet`), checkout (`odeme`), account (`hesabim`), wishlist, blog, support ticketing, search.
- `app/(auth)/` — login/register (also duplicated as top-level `login`/`register` under `(public)` — check both when touching auth pages).
- `app/(admin)/admin/` — back-office: dashboard, products, categories, orders, payments, customers, coupons, shipping, reviews, reports, notifications, support, content (banners/blog/menus/pages/slider/about), settings (admins, logs, monitor). Has its own `layout.tsx`.
- `app/api/` — route handlers for auth (login/register/logout/me/captcha), admin (monitor, notifications, support, upload), support (chat, tickets, upload, status), search, menus, notifications (incl. web-push subscribe), and AI chat.

### Data layer

- `lib/db/schema.ts` — single source of truth for all tables (Drizzle `mysqlTable` defs): users, adminLogs, siteSettings, products, categories, orders/orderItems, reviews/reviewLikes, coupons, blogPosts, supportTickets/supportMessages, shippingMethods, transactions, wishlist, cartItems, heroSlides, banners, navMenus/navMenuItems, cmsPages, settings, liveChatMessages, notifications, pushSubscriptions.
- `lib/db/index.ts` exports the `db` client (mysql2 pool + drizzle). Import `db` from `@/lib/db`, tables/enums from `@/lib/db/schema`.
- **All data mutations go through Next.js Server Actions in `lib/actions/*.ts`** (one file per domain: product, category, order, admin-order, coupon, blog, banner, hero, menu, cms, review, shipping, settings, user, wishlist, cart, report, about). These are `"use server"` files called directly from client/server components — there is no separate REST/GraphQL API layer for internal app data. `app/api/*` is reserved for things that need an HTTP endpoint specifically (webhooks, uploads, auth cookie handling, third-party callbacks, push).
- Admin actions call `createLog(...)` (from `lib/actions/admin-actions.ts`) to write to `adminLogs` for the audit trail — follow this pattern when adding new admin mutations.
- Product/category search is dual: MySQL via Drizzle for transactional reads, and Meilisearch (`lib/meilisearch.ts`, index `MEILI_PRODUCTS_INDEX`) for the search UI — keep the index in sync via `npm run meili:sync` or via `meiliClient` calls inside actions after writes.

### Auth & session

- Custom JWT session (not NextAuth): `lib/auth.ts` signs/verifies a JWT with `jose`, stored in cookie `TUGER_session` (`SESSION_COOKIE_NAME`). `encrypt`/`decrypt`/`getSession`/`updateSession`/`logout` are the primitives.
- `middleware.ts` is the enforcement point for almost everything cross-cutting:
  - Bot/user-agent blocking and a regex-based WAF (path traversal, XSS, SQLi patterns) on every request.
  - Async fire-and-forget logging of every request (and blocked request) to `/api/admin/monitor/log` for the admin live request monitor.
  - Route protection: `/admin/*` requires session + `role === "ADMIN"`; `/hesabim/*` requires any session; authenticated users get redirected away from `/login`/`/register`.
  - Security headers (X-Frame-Options, HSTS, etc.) and CDN `Cache-Control` policy for public GET routes.
  - When adding new protected routes or public API routes, update the route lists / matcher in `middleware.ts` accordingly.
- Rate limiting (`lib/rate-limiter.ts`) is a simple in-memory (per-instance, non-durable) sliding-window limiter keyed by IP — used for things like login and captcha endpoints. It resets on redeploy/restart and does not work across multiple instances; treat as best-effort, not a hard guarantee.
- `lib/captcha.ts` wraps `svg-captcha` (registered as a `serverExternalPackages` in `next.config.ts` since it needs Node APIs).

### Frontend state

Global client state is via React Context providers in `context/`: `CartContext`, `CartAnimationContext`, `CategoryMenuContext`, `ChatWindowContext`, `NotificationContext`, `SupportContext`. Server Actions are the mutation path; contexts hold client-side derived/UI state (cart contents, animations, open/closed menus, live chat/support widget, notifications).

Components are organized by domain under `components/` (admin, blog, cart, categories, footer, header — with `mobile`/`navbar`/`categoriesButton`/`locationButton` subfolders, hero, products, promo, reviews, sellersCard with `bestSellers`/`hotDeals`/`recommended`/`products` subfolders, support, ui for shared primitives). Use `cn()` from `lib/utils.ts` (clsx + tailwind-merge) for conditional Tailwind classes.

### Observability

Sentry is wired via `sentry.client.config.ts` / `sentry.server.config.ts` / `sentry.edge.config.ts` and `next.config.ts` (`withSentryConfig`, org `pixeon`, project `pixeon-shop`). In addition, the admin panel has a bespoke live request monitor (`app/(admin)/admin/settings/monitor`, fed by `middleware.ts` → `/api/admin/monitor/log`) and an admin action audit log (`adminLogs` table / `settings/logs`) — these are custom, not Sentry-based.

## Conventions to know

- UI copy, comments in some files, and TODO tracking (`TODO.md`) are in Turkish; match the existing language when editing user-facing strings in the storefront/admin UI.
- Path alias `@/*` maps to the repo root (see `tsconfig.json`).
- Zod (`zod`) is the standard for input validation on Server Actions/API routes — follow existing action files' validation style when adding new mutations.
- Uploaded files (product images, support ticket attachments) are written under `public/uploads/...`; the upload directory is intentionally kept non-executable per `TODO.md` security notes — don't change upload handling without preserving that constraint.
- `next.config.ts` sets `serverExternalPackages: ["svg-captcha"]` — any other Node-only package used server-side that breaks the build likely needs the same treatment.
