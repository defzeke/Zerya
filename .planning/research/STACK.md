# Technology Stack: Zerya Blooms

**Project:** Zerya Blooms — boutique floral e-commerce + custom inquiry ticketing
**Researched:** 2026-07-21
**Overall confidence:** HIGH

## Architecture at a Glance

```
Browser → Vercel CDN → Next.js 16 (App Router)
                           ├── Server Components (catalog, gallery, pages)
                           ├── Server Actions (forms, ticket submission, cart)
                           ├── Route Handlers (Resend webhooks, Stripe webhooks)
                           └── Client Components (file upload UI, cart drawer)
                              │
                              ├── Supabase PostgreSQL (products, tickets, orders)
                              ├── Vercel Blob (inspo image uploads)
                              └── Resend API (transactional emails)
```

No separate backend server. No CMS. No message queue. The ticketing system is a thin data layer on Supabase, called via Server Actions. This keeps the architecture flat and deployable by a single person.

---

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **Next.js** | 16.2.x (LTS) | Full-stack web framework | App Router, Server Components, Server Actions, ISR all first-class. Largest e-commerce ecosystem in 2026. Hosts catalog pages, API routes, and file upload endpoints in one deployable unit — no separate backend server needed. |
| **TypeScript** | 5.x | Type safety across full stack | Catches data-model mismatches between product schema, ticket schema, and DB at compile time. Non-negotiable for a solo dev. |
| **React** | 19.x | UI library | Bundled with Next.js 16. Server Components by default (zero JS shipped for static content). `useActionState`, `useOptimistic`, `useFormStatus` for form UX without extra deps. |

**Confidence:** HIGH — verified via npm registry (next@16.2.10, July 2026) and endoflife.date.

### Styling & Design

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **Tailwind CSS** | 4.3.x | Utility-first CSS | Single compiled CSS file, zero runtime JS. v4 dropped the legacy config file — now CSS-native with `@theme` directives. Faster builds via Lightning CSS. Matches the "minimalist, airy" brand aesthetic naturally (padding, whitespace, typography scales are one-liners). |
| **shadcn/ui** | 4.13.x (Base UI default) | Component primitives | Copy-paste components you own, not a dependency. Defaults to Base UI (since July 2026). Import only what you use: accordion (FAQ), dialog (ticket lookup), form fields, buttons. No heaviness — the Figma prototype is the source of truth, shadcn provides the accessible base. |
| **@tabler/icons** (or lucide-react) | 2.x | Icon set | Clean, consistent outline icons. One import per icon, tree-shaken. |

**Confidence:** HIGH — Tailwind v4.3.3 published July 16, 2026. shadcn/ui v4.13.1 with Base UI default confirmed via changelog.

### Database

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **PostgreSQL** (via Supabase) | 18.x | Primary database | Free tier: 500 MB storage, 50K MAU, 5 GB egress. More than enough for a boutique shop's catalog (~50 products) + ticket system. Managed hosting means zero ops. Branching for preview deploys. If the shop outgrows it, Supabase Pro is $25/month. |
| **Drizzle ORM** | 0.45.x / 1.0-rc | Type-safe query builder | SQL-shaped API, ~7 KB gzipped, zero dependencies. For a project with simple tables (products, tickets, orders) Drizzle's transparency beats Prisma's abstraction. No `prisma generate` step. No vendor lock-in — Supabase can be swapped for any Postgres without changing the ORM. |
| **Drizzle Kit** | same | Migrations | SQL migration files generated from `schema.ts`. You see and own every `ALTER TABLE`. No opaque migration state like Prisma's `_prisma_migrations` table. |

**Why not Prisma:** Prisma 7.x narrowed the gap but still carries ~600 KB gzipped, requires a `generate` step, and the migration diff has false-positive drift warnings on PostGIS and partial indexes (OpenDeck's own research confirms this). For a 6-table schema managed by one person, Drizzle's SQL transparency costs nothing and pays off when debugging.

**Confidence:** HIGH — Supabase pricing verified via supabase.com/pricing (July 2026). Drizzle v1.0-rc confirmed. Prisma v7 comparison data from multiple 2026 sources.

### File Storage

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **Vercel Blob** | @vercel/blob | Inspo image uploads | Native Next.js integration. Free tier on Hobby covers launch. Client uploads (direct browser→Blob, bypassing serverless function limits) for inspo images up to 5TB. Global CDN delivery. No separate S3 bucket to manage. |

**Upload pattern:** Server Action generates a presigned URL → browser uploads directly to Vercel Blob → `onUploadCompleted` callback writes the URL to Supabase. This avoids the 4.5 MB Vercel function payload limit and keeps the server out of the data path.

**Why not S3/Cloudinary:** Both are viable but add AWS complexity (S3) or monthly fees (Cloudinary). Vercel Blob is zero-config for a Next.js app on Vercel.

**Confidence:** HIGH — Vercel Blob pricing and docs verified.

### Email

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **Resend** | SDK latest | Transactional email | Free tier: 3,000 emails/month, 100/day — covers ticket confirmations and status updates for a boutique shop. Edge-compatible (uses `fetch`). Native React Email integration. |
| **React Email** | @react-email/components | Email templates | Type-safe JSX email components. Preview server (`npx react-email dev`) renders templates locally without sending. Share Tailwind tokens with the main site. |

**Email flows:**
1. Ticket confirmation with unique ID → sent from Server Action after form submission
2. Status update notifications → triggered by admin status change
3. Order receipt → triggered on order completion

**Why not SendGrid/Nodemailer:** SendGrid requires domain verification before any send and has a complex SDK. Nodemailer needs SMTP credentials and doesn't work on Edge Runtime. Resend is API-first, works everywhere, and the React Email integration is unmatched.

**Confidence:** HIGH — Resend docs verified. Free tier confirmed.

### Validation & Forms

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **Zod** | 3.x | Schema validation | De facto standard in the Next.js ecosystem. Works with next-safe-action, React Hook Form, and Drizzle (via `zod-schema` or manual types). |
| **next-safe-action** | latest | Type-safe Server Actions | Wraps every Server Action with input validation, typed errors, and middleware. Prevents the "Server Action is a public endpoint" footgun — every action validates before executing. Provides `useAction` hook with `onSuccess`/`onError` callbacks. |
| **React Hook Form** | 7.x | Form state management | For the custom inquiry form (multi-field with file upload). Lightweight, performant (isolated re-renders), integrates with Zod via `@hookform/resolvers`. Use only for complex forms — simple forms can use raw Server Actions. |

**Confidence:** HIGH — next-safe-action docs verified. RHF + Zod remains the dominant form pattern in 2026.

### Hosting & Deployment

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **Vercel** | Hobby (free) → Pro ($20/mo) | Hosting + CDN | Built by the Next.js team. Edge network, ISR, Server Actions, preview deployments, and Blob storage all first-class. Hobby plan includes 1M edge requests/month — plenty for a boutique launch. Pro at $20/month when traffic grows. |
| **Supabase** | Free → Pro ($25/mo) | Database hosting | Managed Postgres with dashboard, backups, connection pooling. Free tier doesn't auto-pause if you keep a ping (or just pay $25/month when live). |
| **GitHub** | Free | Source control + CI | Vercel auto-deploys from GitHub. Feature branch previews for every PR. |

**Why not self-hosted VPS:** Ops overhead (Postgres backups, TLS renewal, OS patches, Node process management) steals time from the actual product. At boutique scale (< 1K visitors/day), a $0-45/month managed stack outruns a $5 VPS in developer hours saved.

**Confidence:** HIGH — Vercel pricing verified.

---

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Framework | Next.js 16 | Remix | Smaller e-commerce ecosystem, fewer pre-built patterns for commerce. Next.js has ISR which is purpose-built for product catalogs. |
| Framework | Next.js 16 | Astro | Astro is static-first. The ticketing system needs dynamic API routes and a database. Could add a separate backend, but now you're managing two deploys. Next.js does both in one. |
| ORM | Drizzle | Prisma | Prisma 7 is viable but heavier. For a 6-table schema with simple queries, Drizzle's SQL transparency is a net win. Prisma's schema DSL and Studio add overhead without proportional value at this scale. |
| Database | Supabase (Postgres) | PlanetScale (MySQL) | Supabase's free tier (500 MB) is more generous than PlanetScale's free tier. Supabase also provides file storage and auth if needed later. Postgres is also more feature-rich than MySQL for JSON queries on ticket metadata. |
| File storage | Vercel Blob | Cloudinary | Cloudinary is $89/month for their "Advanced" plan with meaningful limits. Vercel Blob's free tier covers launch. Blob's CDN is already Vercel's edge. |
| Email | Resend | AWS SES | SES requires IAM configuration, domain verification through AWS's UI, and has a learning curve for DKIM/SPF setup. Resend abstracts DNS setup into a 5-minute dashboard flow. |
| Styling | Tailwind CSS v4 | CSS Modules | Tailwind v4's CSS-native config and Lightning CSS bundling make it faster to iterate than writing custom CSS for every component. Consistent with the boutique brand (rapid visual iteration). |
| Component lib | shadcn/ui (Base UI) | Radix | As of July 2026, shadcn/ui defaults to Base UI. Radix is still supported but Base UI is the future. Both are accessible headless primitives — the choice doesn't affect the app. |

---

## What NOT to Use

| Technology | Why To Avoid |
|------------|-------------|
| **Shopify** | The custom ticketing system is Zerya's differentiator. Shopify's template/app ecosystem fights against custom workflows. The ticket lookup by ID (no login) is trivial in Next.js + Postgres, painful in Shopify. Transaction fees (2.9% + $0.30) still apply via Stripe regardless. |
| **WordPress / WooCommerce** | PHP maintenance burden. Security updates, plugin conflicts, MySQL performance tuning. The "boutique" angle (custom ticketing, bespoke design) is fighting against a platform built for commodity stores. |
| **Redux / Zustand / Jotai** | Server Components handle most data fetching. The cart is the only client state that matters, and it can be a cookie + Server Actions (see Lazar Kapsarov's pattern). Zustand is fine if needed, but don't install it preemptively. |
| **Styled Components / Emotion** | Runtime CSS-in-JS adds JS bundle weight and has a runtime cost. Tailwind v4's compiled CSS approach is faster for users and simpler for developers. |
| **MongoDB** | Products, orders, tickets, and statuses are relational. A document DB would require emulating joins in app code. Postgres handles this naturally. |
| **tRPC** | Server Actions replace the type-safe RPC layer tRPC provided. Adding tRPC on top of Server Actions is redundant — Server Actions already give you end-to-end types. |
| **Auth.js / NextAuth** | No user accounts in v1. The ticket system is ID-based, not login-based. If accounts are added later, Supabase Auth is simpler (drop-in, same dashboard as the database) than wiring a separate auth library. |
| **Redis / Vercel KV** | Premature for launch. Cart state can live in a cookie. Ticket status reads hit Postgres directly. Add caching when you measure a problem, not before. |

---

## Installation (Project Bootstrap)

```bash
# 1. Create Next.js app with App Router + Tailwind
npx create-next-app@latest zerya-blooms --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# 2. Core dependencies
cd zerya-blooms
npm install drizzle-orm postgres @vercel/blob resend react-email @react-email/components
npm install next-safe-action zod @hookform/resolvers react-hook-form
npm install -D drizzle-kit

# 3. UI components (install only what you need)
npx shadcn@latest init
npx shadcn@latest add button card form input textarea accordion dialog select toast

# 4. Supabase client
npm install @supabase/supabase-js
```

---

## Schema Overview (6 tables)

This is intentionally flat. No complex joins, no inheritance patterns.

```
products
├── id (uuid PK)
├── name, slug, description, price, images (text[])
├── collection_id (FK → collections)
├── available (boolean)
└── created_at, updated_at

collections
├── id (uuid PK)
└── name, slug, description, cover_image

tickets (custom inquiries)
├── id (uuid PK)
├── ticket_id (text, UNIQUE — human-readable, e.g. "ZERYA-0001")
├── customer_name, email, phone
├── event_date, budget_range
├── occasion_type (text)
├── status (enum: submitted → consulting → approved → ready)
├── inspo_image_urls (text[])
├── notes (text, admin-only)
└── created_at, updated_at

orders (from standard e-commerce)
├── id (uuid PK)
├── customer_name, email
├── items (jsonb — product snapshots)
├── total (integer, cents)
├── status (text)
├── stripe_payment_intent_id (text)
└── created_at

contact_messages
├── id (uuid PK)
├── name, email, message
└── created_at

newsletter_subscribers
├── id (uuid PK)
├── email (UNIQUE)
└── created_at
```

---

## Data Flow: Custom Inquiry Ticketing

```
Customer fills form (incl. inspo uploads)
        │
        ▼
Client Component (React Hook Form + Zod validation)
        │
        │  file(s)  →  Vercel Blob (client upload, direct browser→CDN)
        │             Blob returns public URL(s)
        │
        ▼
Server Action (next-safe-action)
        ├── Validate all fields with Zod
        ├── Generate ticket ID ("ZERYA-" + padded sequence)
        ├── INSERT into Supabase `tickets` table
        ├── Send confirmation email via Resend
        └── Return { ticket_id, status } to client
                │
                ▼
Client shows success state with Ticket ID
Customer can now look up status by entering Ticket ID
        │
        ▼
Server Action → SELECT from tickets WHERE ticket_id = ?
        │
        ▼
Returns current status + timestamps
```

---

## Key Version Snapshot (verified July 2026)

| Package | Version | Source |
|---------|---------|--------|
| next | 16.2.10 | npm registry |
| react | 19.1.0 | Bundled with Next.js 16 |
| tailwindcss | 4.3.3 | npm registry |
| shadcn/ui | 4.13.1 | GitHub releases |
| @shadcn/react | 0.2.1 | GitHub releases |
| drizzle-orm | 0.45.2 / 1.0-rc.2 | npm registry + Drizzle docs |
| drizzle-kit | 0.30.x | npm registry |
| zod | 3.24.x | npm registry |
| next-safe-action | latest | next-safe-action.dev |
| resend | 4.x | npm registry |
| @vercel/blob | latest | npm registry |
| supabase (client) | 2.x | npm registry |

---

## Confidence Assessment

| Decision | Confidence | Rationale |
|----------|------------|-----------|
| Next.js 16 as framework | HIGH | Verified version (16.2.10 LTS). Dominant commerce framework in 2026. ISR + Server Actions directly solve catalog + ticketing. |
| Drizzle over Prisma | MEDIUM | Both are production-grade. Drizzle is lighter and more transparent. Prisma would also work. The difference matters at scale, not at 50 products. Flag for validation if the team prefers Prisma's schema DSL. |
| Supabase Postgres | HIGH | Free tier covers launch. Managed Postgres removes ops burden. Platform is mature (founded 2020, Series B, 2M+ databases created). |
| Vercel Blob for uploads | HIGH | Free tier, native Next.js integration, client uploads bypass serverless limits. The only realistic alternative at this scale is Cloudinary (paid) or raw S3 (ops overhead). |
| Resend + React Email | HIGH | 3K free emails/month. Type-safe templates. Edge-compatible. Industry standard for Next.js email in 2026. |
| Tailwind v4 + shadcn/ui | HIGH | Both are mature, well-maintained, and the dominant styling stack in the Next.js ecosystem. Tailwind v4's CSS-native config is a genuine improvement. |
| No Redis/queue/cache | HIGH | Premature optimization. The data volume (50 products, < 100 tickets/month at launch) doesn't warrant it. Add when measured. |

---

## Sources

- Next.js 16.2.10: [npm](https://www.npmjs.com/package/next) / [endoflife.date](https://endoflife.date/nextjs)
- Tailwind CSS v4.3.3: [npm](https://www.npmjs.com/package/tailwindcss) / [GitHub Releases](https://github.com/tailwindlabs/tailwindcss/releases)
- shadcn/ui v4.13.1: [GitHub Releases](https://github.com/shadcn-ui/ui/releases)
- Base UI as default (July 2026): [shadcn/ui changelog](https://ui.shadcn.com/docs/changelog/2026-07-base-ui-default)
- Drizzle vs Prisma (2026): [toolchew](https://toolchew.com/en/prisma-vs-drizzle/) / [QueryDeck](https://www.querydeck.app/drizzle-vs-prisma) / [Groundy](https://groundy.com/articles/drizzle-vs-prisma-choosing-a-typescript-orm-in-2026/)
- Supabase pricing: [supabase.com/pricing](https://supabase.com/pricing)
- Vercel Blob pricing & docs: [vercel.com/docs/vercel-blob](https://vercel.com/docs/vercel-blob/usage-and-pricing)
- Resend + Next.js: [resend.com/docs](https://resend.com/docs/send-with-nextjs)
- Next.js Server Actions guide: [nextjs.org/docs/app/guides/forms](https://nextjs.org/docs/app/guides/forms)
- next-safe-action: [next-safe-action.dev](https://next-safe-action.dev/)
- Next.js e-commerce patterns (Lazar Kapsarov): [lazarkapsarov.com](https://www.lazarkapsarov.com/notes/nextjs-ecommerce-patterns)
