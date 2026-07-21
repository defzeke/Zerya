# Project Research Summary

**Project:** Zerya Blooms
**Domain:** Boutique Floral E-Commerce + Custom Inquiry Ticketing
**Researched:** 2026-07-21
**Confidence:** HIGH (all four research files rate HIGH overall — versions verified against registries, industry patterns confirmed by multiple sources)

## Executive Summary

Zerya Blooms is a boutique floral e-commerce site with a dual revenue model: standard ready-made bouquet sales (via a typical product catalog and cart) and a bespoke custom inquiry ticketing system where customers submit inspiration photos, receive quotes, and track order status from consultation to delivery — without ever creating an account. Florist e-commerce diverges from general e-commerce in critical ways: delivery date capacity, zone checking, card messages, and mobile-first checkout are table stakes, not nice-to-haves. The custom ticketing system is Zerya's core differentiator — most boutique florists do either standard e-commerce OR custom consultation, not both with transparent status tracking.

The recommended approach is a **modular monolith** on Next.js 16 (App Router) with Supabase Postgres (via Drizzle ORM), Tailwind CSS v4 + shadcn/ui for styling, Vercel Blob for image uploads, and Resend for transactional emails. No separate backend, no CMS, no message queue — the entire site runs as a single `next start` deployable on Vercel. This keeps architecture flat enough for a solo developer to build and maintain, while providing clear domain boundaries between the E-Commerce and Ticketing domains within the same codebase.

**Key risks:** (1) Hidden pricing and delivery fees — the #1 cause of lost orders in florist e-commerce, requiring price prominence as a non-negotiable design requirement; (2) Mobile checkout friction — ~70% cart abandonment in floral e-commerce, mitigated by guest checkout defaults, Apple/Google Pay, and touch-optimized date pickers; (3) Custom ticketing silence — the status portal must be built alongside the submission form, not as a later add-on, to avoid the "did you get my order?" support loop; (4) Image bloat killing mobile performance — a WebP compression pipeline must be in place before product pages go live.

## Key Findings

### Recommended Stack

A flat, single-deploy stack optimized for a solo developer building a boutique-scale site (~50 products, <100 tickets/month at launch). No separate backend, no CMS, no Redis — the philosophy is "add when measured, not before."

**Core technologies:**
- **Next.js 16 + TypeScript 5**: Full-stack framework — App Router, Server Components (static catalog pages), Server Actions (form submissions, ticket creation), and ISR (product catalog caching) in one deployable unit. Verified v16.2.10 LTS on npm.
- **Supabase (Postgres 18) + Drizzle ORM 0.45**: Managed Postgres with 500 MB free tier. Drizzle's SQL-shaped API (~7 KB gzipped) beats Prisma's abstraction weight for a 6-table schema. No `prisma generate` step, no vendor lock-in.
- **Tailwind CSS 4.3 + shadcn/ui 4.13**: Tailwind v4 uses CSS-native `@theme` directives (no legacy config file), builds via Lightning CSS. shadcn defaults to Base UI as of July 2026 — copy-paste components you own, not a dependency.
- **Vercel Blob**: Direct browser-to-CDN uploads for inspo images, bypassing the 4.5 MB serverless function payload limit. Native Next.js integration, free tier covers launch.
- **Resend + React Email**: 3,000 free emails/month. Type-safe JSX email templates that share Tailwind tokens with the main site. Edge-compatible SDK.
- **Zod + next-safe-action + React Hook Form**: Zod for schema validation, next-safe-action wraps Server Actions with input validation preventing the "Server Action is a public endpoint" footgun, RHF for the multi-field custom inquiry form.
- **Vercel (Hobby → Pro) + GitHub**: Auto-deploys from GitHub, preview deployments per branch. Hobby free tier covers launch traffic.

**Key exclusions:** No Shopify (fights custom workflows), no WordPress (PHP maintenance burden), no auth library (no user accounts in v1), no Redis/KV (premature), no state management library (Server Components + localStorage cart suffice).

### Expected Features

**Must have (table stakes for florist e-commerce):**
- Delivery date picker with per-day capacity limits — most critical florist-specific feature
- Delivery zone checker (postcode) — shown before cart, not at checkout
- Card message field with character limit — tiny feature, huge operational impact
- Mobile-responsive checkout with tap targets ≥44px, text ≥16px, digital wallets
- Apple Pay / Google Pay — eliminates manual card entry on mobile
- Automated order confirmation email (seconds, not minutes)
- Occasion-based product categories — customers think "birthday" not "garden roses"
- SEO basics: meta descriptions, Product schema, LocalBusiness schema

**Should have (differentiators):**
- Custom Inquiry Ticketing with Status Portal — core differentiator, 4-stage flow (Submitted → Consulting → Approved → Ready), no account required
- Inspiration photo upload (drag-and-drop) — file upload with preview, 5-10 MB limit
- Dual CTA hero ("Shop Collections" / "Start Your Custom Order") — sets expectation early
- "How It Works" custom order guide — 3-step visual above the inquiry form
- Delivery notification email — 40-60% reduction in failed-delivery calls
- Portfolio gallery by occasion type — drives custom inquiry conversions
- Add-on products at checkout (cards, vases, chocolates) — 8-20% AOV increase

**Defer (v2+):**
- Customer accounts / social login (guest checkout + ticket-ID lookup is the right v1 balance)
- Subscription flower boxes (complex recurring billing, Phase 3 if demand materializes)
- Live chat (response obligation > value at boutique scale)
- Customer loyalty portal (CRM backend > frontend portal)
- Multi-language support (English-only for v1)
- Gift registry / wishlist (niche demand, year 2+)

### Architecture Approach

**Modular Monolith** — one Next.js deployable, two logical domains (E-Commerce + Ticketing), clean internal boundaries with separate tables, service objects, and route prefixes, but a shared database. No microservices, no message queue, no WebSocket — the shop processes orders slowly enough that email notifications and page refreshes suffice.

**Major components:**
1. **Catalog** — Product listing, detail pages, collections/categories — renders as Server Components for zero JS payload
2. **Cart** — Entirely client-side via `localStorage`, no API calls until checkout — single POST to create order (no multi-step wizard)
3. **Order** — Single-page checkout form → orderService → DB → Stripe payment → confirmation email
4. **Ticket** — Custom inquiry form → ticketService → DB → 4-stage status lifecycle — lookup by UUID-based ticket ID (no auth), prefix `ZRY-`
5. **Admin Panel** — Simple password gate (no RBAC), ticket queue with status transitions, product CRUD, order viewer
6. **File Upload** — Direct browser-to-Vercel-Blob via presigned URL, callback writes URL to ticket record

**Key patterns:**
- Service layer with tiny interfaces (no BaseService, no generic repository)
- Ticket status as enum + transition guard table (6 lines of config, no FSM library)
- localStorage cart (no server-side cart infrastructure, persists across sessions)
- Snapshot order items (product name/price at time of purchase, not looked up from mutable product rows)

### Critical Pitfalls

1. **Hidden Product Pricing** — #1 cause of lost florist e-commerce orders. Every standard product page must show a clear starting price. "From $X" is fine; "Call for price" kills conversions. Address in Catalog phase — price prominence is a design requirement, not an afterthought.

2. **Mobile Checkout Friction** — ~70% cart abandonment in floral e-commerce, largely from desktop-first checkout design. Tap targets ≥44px, text ≥16px, Apple Pay / Google Pay, guest checkout default, delivery date picker that works on touch. Test a real order on a phone before launch.

3. **Custom Ticketing Silence After Submission** — Customer submits photos and details, gets an automated confirmation, then radio silence for days. Prevention: build the status portal alongside the submission form, auto-email on status changes, display "we review inquiries within 24 hours" on the form itself.

4. **Hidden Delivery Fees Shown at Last Step** — The #1 cart abandonment cause in floral e-commerce. Show delivery fee on the product page or immediately after zip code entry — never at the final payment screen.

5. **Image Bloat Killing Mobile Page Speed** — Florist sites are image-heavy. <200 KB per product photo in WebP format, explicit width+height to prevent CLS, lazy loading below-fold, single static hero image (no auto-playing carousel). Set up the compression pipeline before any product pages go live.

## Implications for Roadmap

Based on dependency analysis across all four research files, I recommend a **6-phase structure** that prioritizes the two revenue funnels (E-Commerce + Ticketing) as independently buildable tracks after a shared foundation:

### Phase 1: Foundation & Design System
**Rationale:** Everything depends on the scaffolding. This phase establishes project structure, design tokens, navigation, and core layout before any feature logic.
**Delivers:** Next.js scaffold with Tailwind v4 + shadcn/ui, brand design system (colors, typography, spacing), global header with 5-item navigation (Shop, Custom Order, Portfolio, About, Contact), global footer with NAP (Name, Address, Phone — must match Google Business Profile exactly), SEO metadata, mobile responsive grid foundation.
**Addresses features:** SEO basics, mobile-responsive base, navigation structure, trust signals (NAP in footer).
**Avoids pitfalls:** Navigation overload (Pitfall 7 — limit to 5 primary items), Weak homepage CTA (Pitfall 8), No local trust signals (Pitfall 5).
**Stack used:** Next.js 16, TypeScript, Tailwind v4, shadcn/ui, @tabler/icons.
**Research flag:** None — well-established scaffolding patterns. Skip `--research-phase`.

### Phase 2: Product Catalog
**Rationale:** Products must exist before cart and checkout can work. This phase establishes the product data model, admin CRUD, and public-facing catalog pages. Parallelizable with Phase 3.
**Delivers:** Database schema (products, collections, categories), Drizzle ORM setup and migrations, product CRUD (seed data or admin form), catalog listing page with collection filtering, product detail page with multi-image gallery, price prominence design, WebP image compression pipeline, Product schema + LocalBusiness schema markup.
**Addresses features:** Shop/catalog, occasion-based categories, real-time inventory (basic stock toggle).
**Avoids pitfalls:** Hidden pricing (Pitfall 1 — price prominence as design requirement), Image bloat (Pitfall 3 — WebP pipeline before any product images go live), Single-photo pages (Pitfall 13 — multi-image gallery template from day one), Missing schema markup (Pitfall 14 — template-level schema generation).
**Stack used:** Supabase + Drizzle ORM + Drizzle Kit, Vercel Blob (for product images), Zod (schema validation).
**Research flag:** None — standard catalog patterns, well-documented. Skip `--research-phase`.

### Phase 3A: E-Commerce Flow (Revenue Track 1)
**Rationale:** Cart, checkout, and payment form the first revenue funnel. This phase can run in parallel with Phase 3B since the ticketing domain has zero dependency on e-commerce.
**Delivers:** localStorage cart with add/remove/quantity, single-page checkout form (name, email, phone, delivery address, card message, notes), delivery zone checker (postcode verification, shown before checkout), delivery date picker with capacity limits, Apple Pay / Google Pay, Stripe payment intent integration, order submission → confirmation → automated email, order confirmation screen with order number.
**Addresses features:** Cart, checkout, delivery date picker, delivery zone checker, card message field, Apple Pay / Google Pay, order confirmation emails.
**Avoids pitfalls:** Mobile checkout friction (Pitfall 2 — mobile-first design requirements baked in), Hidden delivery fees (Pitfall 4 — fee shown on product page or at zip entry, never at final step), Unclear delivery cutoff (Pitfall 6 — cutoff time on product page and checkout), Forcing account creation (Pitfall 12 — guest checkout default).
**Stack used:** React Hook Form + Zod + next-safe-action (form validation), Stripe SDK (payment), Resend + React Email (order confirmation), localStorage API (cart).
**Research flag:** None — well-documented Stripe + Next.js patterns, standard e-commerce flow. Skip `--research-phase`.

### Phase 3B: Custom Inquiry & Ticketing (Revenue Track 2)
**Rationale:** The second revenue funnel is independent from e-commerce — it shares the foundation but has its own tables, service layer, and API routes. Can be built in parallel with Phase 3A.
**Delivers:** Ticket schema (tickets, ticket_updates tables), Drizzle migrations, custom inquiry form (name, email, phone, event date, budget range, occasion dropdown), drag-and-drop inspo file upload (direct-to-Blob via presigned URL), UUID-based ticket ID generation (prefix `ZRY-`), 4-stage status lifecycle with transition guard, status portal (lookup by ticket ID, no auth required), admin ticket queue with status transitions, automated email on status changes ("your ticket has been updated"), "How It Works" 3-step guide above the form, SLA expectation ("we review within 24 hours") on the form.
**Addresses features:** Custom inquiry form, inspo upload, ticket status portal, ticket-based transparency without account creation, "How It Works" guide.
**Avoids pitfalls:** Silent after submission (Pitfall 9 — status portal + proactive notifications built alongside the form), No how-it-works (Pitfall 10 — 3-step guide on the form page), Over-engineered ticketing (Pitfall 17 — explicit YAGNI on 4-stage flow only, no RBAC, no analytics), Email-based file uploads (Pitfall 16 — drag-and-drop upload in the spec, not "email us photos").
**Stack used:** Vercel Blob (direct client upload for inspo images), Resend + React Email (status change notifications), Zod + React Hook Form (form validation), `node:crypto` randomUUID (ticket ID generation).
**Research flag:** **WILL NEED `--research-phase` during planning.** Three sub-questions to resolve: (1) File upload UX — Vercel Blob presigned URL flow with mobile drag-and-drop UX needs pattern validation; (2) Email notification triggering — simplest approach for auto-email on status changes (webhook? cron? direct in Server Action?); (3) ID generation — short UUID approach vs sequential vs nanoid, confirm the collision analysis for <10K tickets.

### Phase 4: Admin Panel
**Rationale:** Admin has nothing to manage until products, tickets, and orders exist. Wait until Phases 2 + 3 have data.
**Delivers:** Simple password auth gate for `/admin/*` routes (bcrypt + session cookie, no RBAC), admin dashboard with counts (new tickets, pending orders by status), product management UI (CRUD table with inline editing + image upload), ticket queue (sortable/filterable, click to view thread, status change dropdown + internal notes + customer-visible replies), order viewer (list incoming orders, mark as fulfilled).
**Addresses features:** Admin operations for all domains.
**Avoids pitfalls:** Over-engineered admin (Anti-Pattern 3 from ARCHITECTURE — no RBAC, no audit log, no analytics for v1).
**Stack used:** bcrypt (password hashing), cookies (session), same Next.js app (no separate admin SPA).
**Research flag:** **WILL NEED `--research-phase` during planning.** Admin auth approach — bcrypt + session cookie vs HTTP basic vs JWT. The ARCHITECTURE research notes that HTTP basic + HTTPS "is actually fine and requires zero session infrastructure" for single-admin. Needs validation. Also confirm session cookie pattern with Next.js Server Components / Server Actions.

### Phase 5: Portfolio + Content Pages & Polish
**Rationale:** Content pages (gallery, FAQ, contact) are independent of all other phases and can be slotted anywhere after Phase 1. Portfolio requires professional photography, which may not be available at launch.
**Delivers:** Portfolio gallery page with occasion-type filtering and lightbox, FAQ accordion page with schema markup, contact page with form, delivery info page, blog structure (optional), mobile responsive tuning and cross-browser QA, final PageSpeed Insights optimization.
**Addresses features:** Portfolio gallery, FAQ, contact form, newsletter signup (footer).
**Avoids pitfalls:** Outdated portfolio (Pitfall 11 — build with easy replacement mechanism, not hardcoded paths).
**Stack used:** Same Next.js patterns, FAQ schema markup, newsletter provider (Mailchimp/ConvertKit integration).
**Research flag:** None — standard content page patterns.

### Phase 6: Operations, Emails & Launch Readiness
**Rationale:** Post-purchase communications and inventory management are operations concerns, not feature development. Best addressed after the core site functions and real data starts flowing.
**Delivers:** Delivery notification email ("your order is on its way!"), post-delivery care instructions email, manual stock toggle for products (out of stock / discontinued), same-day cutoff time logic (auto-hide past-cutoff dates), delivery time window selection (morning/afternoon/evening), final pre-launch checklist: real mobile order test, PageSpeed Insights audit, Google Search Console submission, schema validation.
**Addresses features:** Delivery notifications, same-day cutoff visibility, delivery time windows, inventory management (basic).
**Avoids pitfalls:** No post-purchase communication (Pitfall 18 — confirmation + delivery + care emails), Inventory not reflected (Pitfall 15 — manual stock toggle minimum), Unclear delivery cutoff (Pitfall 6 — auto-show next available date after cutoff).
**Research flag:** **WILL NEED `--research-phase` during planning.** Delivery time window selection UX patterns — how to let customers pick morning/afternoon/evening without overcomplicating the single-page checkout.

### Phase Ordering Rationale

- **Foundation first (Phase 1)** — scaffolding, design system, and navigation are prerequisites for every other phase. Also establishes the global footer with NAP, which must exist from day one for SEO consistency with Google Business Profile.
- **Catalog before E-Commerce (Phase 2 before Phase 3A)** — logical dependency: you need products before you can sell them. Catalog also establishes the image pipeline (WebP compression) before any product images go live.
- **E-Commerce and Ticketing are parallel tracks (Phase 3A + 3B)** — the two domains share zero tables and communicate via no API. A solo developer can build them sequentially (order doesn't matter) or a pair could split them. Both must ship for launch since they represent the two revenue funnels.
- **Admin after data exists (Phase 4)** — an admin panel with no products, tickets, or orders to manage is a blank screen with a login form. Wait until Phases 2 + 3 are producing data.
- **Content and polish last (Phase 5)** — portfolio needs photography, FAQ needs policy decisions, and these pages drive incremental conversion rather than enabling core flows.
- **Operations final (Phase 6)** — post-purchase email flows and inventory toggles matter most once orders are actually coming in.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 3B (Ticketing):** Three sub-decisions — (1) Vercel Blob presigned URL flow for mobile upload UX, (2) simplest auto-email trigger on status change, (3) ticket ID generation strategy (short UUID vs nanoid vs sequential). All are small decisions that benefit from a focused 15-minute research pass.
- **Phase 4 (Admin):** Auth approach for single-admin — bcrypt + session cookie vs HTTP basic + HTTPS. ARCHITECTURE research notes HTTP basic "is actually fine" for this scale, but the standard Next.js pattern should be confirmed.
- **Phase 6 (Operations):** Delivery time window selection UX patterns — how to present morning/afternoon/evening (or 2-hour windows) without bloating the single-page checkout.

Phases with standard patterns (skip `--research-phase`):
- **Phase 1 (Foundation):** Scaffolding, Tailwind setup, shadcn/ui init, NAP footer — all well-documented standard patterns.
- **Phase 2 (Catalog):** Drizzle schema + migrations, product CRUD, Next.js catalog pages, ISR — every pattern is standard and documented.
- **Phase 3A (E-Commerce):** Stripe integration, Server Actions for orders, localStorage cart — Battle-tested patterns with official Next.js + Stripe guides.
- **Phase 5 (Content):** Static content pages with MDX or hardcoded data — trivial patterns.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Every version verified against npm registry, endoflife.date, or GitHub releases (July 2026). Next.js 16.2.10, Tailwind 4.3.3, shadcn/ui 4.13.1 confirmed. Drizzle v1.0-rc confirmed via changelog. |
| Features | HIGH | Feature requirements validated against 2026 florist industry sources (Hana Florist POS, gotFlowers?, Thursd, Bird Chime) and direct competitor analysis (FLOWERBX, H.Bloom, Calyx, Farmgirl, Rouvalis). MVP recommendations are opinionated and well-supported. |
| Architecture | HIGH | Patterns validated against multiple 2026 sources — three-tier e-commerce architecture patterns (IJISREM), ticket system design patterns (DEV Community), e-commerce checkout optimization (Baymard Institute). The modular monolith + clear boundary approach is the standard recommendation for this scale. |
| Pitfalls | HIGH | Every pitfall is sourced from florist-industry-specific research (Hana Florist POS, Floranext, Mayesh, Living Flowers) with multiple concurring sources. The "critical" classification aligns with industry data on conversion loss. |

**Overall confidence:** HIGH

### Gaps to Address

- **Vercel Blob presigned URL flow for mobile uploads:** The STACK research recommends direct browser-to-Blob uploads via presigned URLs, but the exact implementation pattern (Server Action generates URL → client uploads → callback writes to DB) needs validation. The `onUploadCompleted` callback availability in the Hobby tier should be confirmed during Phase 3B planning.
- **Stripe integration specifics:** The payment integration is mentioned but not deeply researched — Stripe Checkout vs Payment Elements vs raw PaymentIntent API for a single-page checkout. These are well-documented Stripe decisions but need a decision during Phase 3A implementation.
- **Delivery date capacity limits:** The feature is essential but the implementation approach (per-date capacity stored where? checked when? handled at cart level or order level?) needs a concrete plan. The capacity data needs an operational estimate (how many arrangements per day?) before coding.
- **Admin auth approach:** bcrypt + session cookie vs HTTP basic + HTTPS for single-admin. The ARCHITECTURE research notes HTTP basic is "actually fine" for this scale but most Next.js tutorials use session cookies. Needs a concrete decision during Phase 4 planning.
- **Newsletter provider integration:** Footer newsletter signup is in the spec but the email marketing provider (Mailchimp, ConvertKit, Buttondown) isn't selected. This affects the API integration pattern. Defer to Phase 5 but flag for decision.

## Sources

### Stack (from STACK.md — HIGH confidence)
- Next.js 16.2.10: npm registry, endoflife.date
- Tailwind CSS v4.3.3: npm registry, GitHub Releases
- shadcn/ui v4.13.1: GitHub Releases, Base UI changelog (July 2026)
- Drizzle vs Prisma (2026): toolchew, QueryDeck, Groundy comparisons
- Supabase pricing: supabase.com/pricing (July 2026)
- Vercel Blob pricing & docs: vercel.com/docs/vercel-blob
- Resend + Next.js: resend.com/docs/send-with-nextjs
- next-safe-action: next-safe-action.dev
- Next.js e-commerce patterns: lazarkapsarov.com

### Features (from FEATURES.md — HIGH confidence)
- Hana Florist POS, "Essential Florist eCommerce Features" (Jan 2026) — florist-industry-specific
- gotFlowers?, "Pickup, Timed & Rush Delivery" (June 2026) — florist-operations-specific
- Colorlib, "35 Best Florist & Flower Shop Website Examples" (Mar 2026)
- Thursd, "How Consumer Trends Are Redefining The Global Floral Industry" (Mar 2026)
- Accio Business, "2026 Flower Industry Trends: Sustainability & Personalization" (July 2026)
- Bird Chime, "The Florist's Guide to Delivery Scheduling on Shopify" (Apr 2026)
- Direct observation: FLOWERBX, H.Bloom, Calyx Flowers, Farmgirl Flowers, Rouvalis Flowers

### Architecture (from ARCHITECTURE.md — HIGH confidence)
- Three-tier e-commerce architecture patterns (IJISREM 2026 — Bloomora case study)
- Support ticket system design patterns (DEV Community 2026 — dual-interface ticket system)
- Flat-file and minimal e-commerce patterns (Nano Cart — catalogue-mode architecture)
- Ticket state machine patterns (techinterview.org 2026 — LLD ticketing system)
- Baymard Institute checkout optimization research (multi-step vs single-page checkout)

### Pitfalls (from PITFALLS.md — HIGH confidence)
- Hana Florist POS: "7 Florist Website Design Mistakes That Cost Orders" (Mar 2026)
- Floranext: "Florist Website Mistakes You Can't Afford to Ignore" (Mar 2026) — multiple sources concur
- Mayesh: "Why Most Florist Websites Fall Short" — reviewed 20 florist sites
- Living Flowers / Kathleen: "Why Most Florist Websites Fail to Convert" (2025) — reviewed 22 sites
- WhiteBox: "Flower Inventory Management" (June 2026) — 15-20% waste statistics
- BloomyBox: "Hidden Fees in Flower Delivery" (Mar 2026)

---

*Research completed: 2026-07-21*
*Ready for roadmap: yes*
