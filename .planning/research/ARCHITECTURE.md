# Architecture Patterns: Zerya Blooms

**Domain:** Boutique floral e-commerce + custom inquiry ticketing
**Researched:** 2026-07-21
**Overall confidence:** HIGH

## Recommended Architecture

**Modular Monolith** — one deployable, two logical domains (E-Commerce + Ticketing), clean internal boundaries. Microservices are premature for a single boutique shop launching in 2026; the cost of distributed complexity buys nothing until there's a second team or a second service. The two domains share a database but never cross-contaminate — each has its own tables, its own service layer, and its own API prefix.

### High-Level Structure

```
┌─────────────────────────────────────────────────────────┐
│                  PUBLIC SITE (Next.js)                    │
│  /            Homepage                                    │
│  /shop        Catalog (listing + detail)                  │
│  /cart        Shopping cart                               │
│  /order       Checkout/order form                         │
│  /custom      Custom inquiry form + ticket lookup         │
│  /portfolio   Gallery of past custom work                 │
│  /faq         FAQ & policies                              │
│  /contact     Contact form + studio info                  │
├─────────────────────────────────────────────────────────┤
│                 ADMIN INTERFACE (Next.js)                  │
│  /admin       Dashboard                                   │
│  /admin/products     Product CRUD                         │
│  /admin/tickets      Ticket queue + status management     │
│  /admin/orders       Order management                     │
├─────────────────────────────────────────────────────────┤
│              API ROUTES (Next.js API handlers)             │
│  ├─ /api/products/*        Public catalog                  │
│  ├─ /api/cart/*            Cart operations                 │
│  ├─ /api/orders/*          Order submission + lookup       │
│  ├─ /api/tickets/*         Ticket CRUD + status            │
│  ├─ /api/portfolio/*       Gallery data                    │
│  ├─ /api/contact/*         Inquiry submission              │
│  └─ /api/admin/*           Admin (auth-guarded)            │
├─────────────────────────────────────────────────────────┤
│                  SERVICE LAYER                              │
│  productService    ticketService       orderService        │
│  cartService       portfolioService    contactService       │
│  fileUploadService notificationService                     │
├─────────────────────────────────────────────────────────┤
│                  DATA LAYER                                 │
│  SQLite (v1) / PostgreSQL (scale)                          │
│  Local filesystem / Cloudinary (images)                    │
└─────────────────────────────────────────────────────────┘
```

### Why Monolith + Clear Boundaries

- **One deploy, one process** — zero orchestration, zero networking bugs, zero serialization surprises
- **Two logical domains** — E-Commerce (products, cart, orders) and Ticketing (tickets, statuses, updates). Each domain owns its tables and its service classes. Cross-domain reads are intentional, not accidental leaks
- **Single `next start`** to run the whole thing. A microservice split is a 2-hour extraction if revenue proves the site needs it; building it now would take weeks

---

## Component Boundaries

| Component | Responsibility | Communicates With | Data Owned |
|-----------|---------------|-------------------|------------|
| **Catalog** | Product listing, detail pages, categories/collections, search/filter | Public API routes → productService → DB | Products, Categories |
| **Cart** | Add/remove items, update quantities, session persistence | Client-side localStorage → Cart API → Order flow | None (session transient) |
| **Order** | Capture ready-made bouquet orders, confirmation, admin viewing | Order form → orderService → DB | Orders, OrderItems |
| **Ticket** | Custom inquiry intake, status lifecycle (4 states), update timeline, lookup-by-ID | Public + Admin API → ticketService → DB | Tickets, TicketUpdates |
| **Portfolio** | Gallery of past custom designs, occasion-type filtering | Public API → portfolioService → DB | PortfolioItems |
| **FAQ** | Accordion content, category grouping | Static or API-backed → DB | FaqItems |
| **Contact** | General inquiry form submission | contactService → DB (or email) | ContactMessages |
| **File Upload** | Drag-and-drop inspo image uploads, product images | Direct to storage, URL stored in DB | Image files |
| **Admin Auth** | Simple auth gate for /admin/* routes | Auth middleware → password check | Admin credentials |
| **Admin Dashboard** | CRUD for products, ticket queue with status transitions, order viewing | Admin API → service layer → DB | (reads all) |

---

## Data Flow

### Flow 1: Browse & Buy Ready-Made Bouquet

```
User clicks "Shop Collections"
  → Next.js renders product grid from /api/products
  → User views product detail with images, price, description
  → Clicks "Add to Cart"
    → Client-side: localStorage cart updated (no API call needed)
  → User opens cart, adjusts quantities, clicks "Order Now"
  → Checkout form: name, email, phone, delivery address, notes
  → POST /api/orders → orderService.create()
    → Insert into orders + order_items tables
    → Generate order confirmation number
    → Return confirmation to user
  → Admin sees new order in /admin/orders
```

**Key decisions:**
- Cart lives in `localStorage` — no API calls until checkout. Removes a whole class of "logged out cart lost" problems and zero server-side cart infrastructure.
- Order submission is a single POST. No multi-step checkout wizard needed for a boutique shop selling bouquets (typically 1-3 items).

### Flow 2: Custom Inquiry Ticketing

```
User clicks "Start Your Custom Order"
  → Custom inquiry form: name, email, phone, event date, budget range,
    occasion type dropdown, drag-and-drop inspo image upload
  → POST /api/tickets → ticketService.create()
    → Generate UUID-based ticket ID (e.g., "ZRY-a8f3e2b1")
    → Insert ticket with status = "submitted"
    → Store uploaded file references
    → Return ticket ID to user with confirmation
  → User sees: "Your ticket #ZRY-a8f3e2b1 has been submitted"
  → User can bookmark /custom/status?ticket=ZRY-a8f3e2b1

Later:
  → User visits /custom/status, enters ticket ID (or uses URL param)
  → GET /api/tickets/:id → Returns current status + timeline of updates
  → Admin logs in, sees ticket in /admin/tickets queue
  → Admin updates status: Submitted → Consulting → Approved & Processing → Ready
  → Each status change creates a TicketUpdate record
  → Customer sees status change on next lookup
```

**Key decisions:**
- No user accounts. Ticket ID is the auth token. Simplifies security model — there's nothing to hack except your own ticket status.
- UUID-based ticket IDs (not sequential) so customers can't guess others' tickets.
- Admin replies create `is_internal: false` updates visible to customer; internal notes use `is_internal: true`.

### Flow 3: Admin Operations

```
Admin visits /admin → password challenge (bcrypt + session cookie)
  → Dashboard: counts of new tickets, pending orders by status
  → Products: CRUD table, create/edit form with image upload
  → Tickets: sortable/filterable queue, click to view thread
    → Can change status via dropdown
    → Can post internal notes + customer-visible replies
    → Status change auto-records in TicketUpdates table
  → Orders: view incoming orders, mark as fulfilled
```

---

## Ticket Status Lifecycle

```
                         ┌──────────────┐
                         │  Submitted   │  ← Customer submits form
                         └──────┬───────┘
                                │
                                ▼
                         ┌──────────────┐
                  ┌─────▶│  Consulting  │  ← Admin reviews, may contact customer
                  │      └──────┬───────┘
                  │             │
                  │             ▼
                  │      ┌──────────────────┐
                  │      │ Approved &        │  ← Quote approved, work begins
                  │      │ Processing        │
                  │      └──────┬───────────┘
                  │             │
                  │             ▼
                  │      ┌──────────────────┐
                  │      │ Ready for         │  ← Arrangement complete
                  │      │ Delivery/Pickup   │
                  │      └──────────────────┘
                  │
                  └── (Admin can reopen to Consulting at any time)
```

Four states, one direction, no forks. Deliberate — a boutique shop processing maybe 5-20 custom orders a week doesn't need a petri-dish of state transitions. Admin has a single "reopen" path back to Consulting for edge cases.

---

## Data Model (Core Tables)

### E-Commerce Domain

```
products
  id (int PK), name, slug, description, price, images (json array),
  category_id (FK), collection_id (FK), in_stock (bool), featured (bool),
  created_at, updated_at

categories
  id (int PK), name, slug, description, image, sort_order

orders
  id (int PK), order_number (display), customer_name, customer_email,
  customer_phone, delivery_address, total, status (pending/confirmed/fulfilled),
  notes, created_at, updated_at

order_items
  id (int PK), order_id (FK), product_id (FK), product_name (snapshot),
  quantity, unit_price
```

### Ticketing Domain

```
tickets
  id (int PK), ticket_id (uuid, unique — shown to customer),
  customer_name, customer_email, customer_phone, event_date,
  budget_range, occasion_type, description, inspo_images (json array),
  status (enum: submitted/consulting/approved/ready),
  admin_notes (text), created_at, updated_at

ticket_updates
  id (int PK), ticket_id (FK), message (text), author_type (customer/admin),
  is_internal (bool), created_at

  -- One auto-created on each status change for timeline view
```

### Shared / Content

```
portfolio_items
  id (int PK), title, description, images (json array), occasion_type,
  featured (bool), created_at

faq_items
  id (int PK), question, answer, category, sort_order

contact_messages
  id (int PK), name, email, message, created_at
```

**Why snapshot `product_name` on `order_items`?** Products change (rename, reprice), but an order is a historical record. The price and name at time of purchase belong on the line item, not looked up from a mutable product row.

---

## Patterns to Follow

### Pattern 1: Service Layer with Tiny Interfaces

```
productService = {
  list: ({ category, collection, featured, page }) => Product[]
  getBySlug: (slug) => Product | null
  create: (data) => Product
  update: (id, data) => Product
  delete: (id) => void
}
```

Every public function is one thing, one return type, one file. No BaseService, no generic repository. The ticketService and orderService follow the same shape. `ponytail:` Three standalone objects are smaller than an inheritance hierarchy.

### Pattern 2: Ticket Status as Enum + Guard

```typescript
const TICKET_STATUS = {
  submitted: "submitted",
  consulting: "consulting",
  approved: "approved",
  ready: "ready",
} as const;

const VALID_TRANSITIONS = {
  [TICKET_STATUS.submitted]:  [TICKET_STATUS.consulting],
  [TICKET_STATUS.consulting]: [TICKET_STATUS.approved, TICKET_STATUS.submitted], // reopen
  [TICKET_STATUS.approved]:   [TICKET_STATUS.ready, TICKET_STATUS.consulting],
  [TICKET_STATUS.ready]:      [TICKET_STATUS.consulting], // reopen
};
```

One object encodes all allowed moves. The `ticketService.updateStatus()` function checks the transition table before writing. No FSM library needed — 6 lines of config.

### Pattern 3: Ticket ID as UUID for Customer Lookup

```typescript
import { randomUUID } from "node:crypto";

function generateTicketId(): string {
  const short = randomUUID().split("-")[0]; // "a8f3e2b1"
  return `ZRY-${short}`;
}
```

Prefix `ZRY-` makes IDs brand-identifiable. Short UUID segment is long enough to be unguessable (4 billion combinations) and short enough to type from a business card. Full UUID stored internally if needed, but the customer-facing short form is the primary lookup key.

### Pattern 4: Cart as localStorage Only

```typescript
// ponytail: cart lives entirely in the browser. No API until checkout.
// Swap to server-side cart if (!) multi-device shopping becomes a real request.

type CartItem = { productId: number; name: string; price: number; quantity: number; image: string };

function getCart(): CartItem[] {
  return JSON.parse(localStorage.getItem("zerya-cart") || "[]");
}

function addToCart(item: CartItem): void {
  const cart = getCart();
  const existing = cart.find((c) => c.productId === item.productId);
  if (existing) existing.quantity += item.quantity;
  else cart.push(item);
  localStorage.setItem("zerya-cart", JSON.stringify(cart));
}
```

No server-side session storage, no cart API endpoints to maintain, no "cart lost on browser close" complaints because localStorage persists. The checkout form captures the cart payload in a single POST.

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: User Accounts for Custom Orders

**What:** Requiring registration before submitting a custom inquiry.
**Why bad:** Adds friction to the primary conversion funnel. A bride-to-be browsing on her phone at 11pm won't create an account — she'll close the tab.
**Instead:** Ticket-ID-based lookup. Zero registration. The ticket ID is scoped to that single order. If repeat customers emerge later, add a lightweight "my tickets" email-based lookup — after the site proves demand.

### Anti-Pattern 2: Multi-Step Checkout Wizard

**What:** Cart → Shipping → Review → Payment → Confirmation (5 steps).
**Why bad:** Bouquet purchases are high-impulse, low-consideration. Every extra step drops conversion by ~20% (Baymard Institute data).
**Instead:** Single-page checkout form. Collect name, email, phone, delivery address, notes. One POST. Done.

### Anti-Pattern 3: Admin Roles & Permissions System

**What:** Role-based access control (admin, manager, editor, viewer) with per-action permissions.
**Why bad:** This is a one-person or two-person shop launching. You don't need RBAC until you have 5+ staff.
**Instead:** Single admin gate — password protects the `/admin/*` route tree. If a second role is needed later, add it then, not now.

### Anti-Pattern 4: Real-Time Notifications

**What:** WebSocket connections, push notifications, live admin dashboard updates.
**Why bad:** Adds deployment complexity (WebSocket server, sticky sessions or pub/sub), and the boutique does not process orders fast enough to need sub-second updates.
**Instead:** Admin refreshes the ticket queue. Email notification when a new ticket arrives. That's enough.

---

## Scalability Considerations

| Concern | At Launch (50 orders/mo) | At 500 orders/mo | At 5,000 orders/mo |
|---------|--------------------------|------------------|-------------------|
| **Database** | SQLite, single file | Migrate to PostgreSQL | PostgreSQL read replicas |
| **Hosting** | Single VPS or Vercel Pro | Same, bump resources | Load-balanced app servers |
| **Images** | Local filesystem | Migrate to Cloudinary/S3 | CDN (already handled by Cloudinary) |
| **Cart** | localStorage | localStorage still fine | Consider server-side cart |
| **Admin** | Password gate | Same | Add basic roles if >3 staff |
| **Caching** | None needed | Next.js ISR for catalog | Redis for session + fragments |

The site has an easy growth path: SQLite → PostgreSQL is a connection string change and schema dump. Local files → Cloudinary is a service swap. Neither requires re-architecture.

---

## Build Order (Dependency Chain)

```
Phase 1: Foundation + Catalog
  Dependencies: None (start here)
  Components: Project scaffolding, DB schema, product CRUD, homepage, catalog pages
  Rationale: Fastest visible output. Catalog is the simplest domain and establishes data patterns.

Phase 2: E-Commerce Flow
  Dependencies: Phase 1 (products exist)
  Components: Cart, checkout form, order submission, order confirmation
  Rationale: Cart and checkout depend on products and categories existing.

Phase 3: Custom Inquiry & Ticketing
  Dependencies: Phase 1 (project structure), no dependency on Phase 2
  Components: Ticket form, file upload, status lookup, status lifecycle
  Rationale: Independent domain from e-commerce — can be built in parallel or after.
  Note: Could ship Phase 2 + Phase 3 together in one milestone if resources allow.

Phase 4: Admin Panel
  Dependencies: Phases 2 + 3 (data to manage exists)
  Components: Auth gate, product management UI, ticket queue, order viewer
  Rationale: Admin has nothing to manage until products, tickets, and orders exist.

Phase 5: Portfolio, Content Pages, Polish
  Dependencies: Phase 1 (structure exists)
  Components: Portfolio gallery, FAQ, contact, SEO, responsive tuning
  Rationale: Content pages are independent and can be slotted anywhere after Phase 1.
```

### Phase Ordering Rationale

Phases are ordered by **dependency depth** and **visibility**. Phase 1 gives the shop owner something to see and iterate on. Phase 2 and Phase 3 are the two core revenue funnels — they have zero dependency on each other and could be done in parallel by two developers, or sequentially by one. Phase 4 waits because an admin interface without data to administer is a blank screen. Phase 5 is polish and content that fills gaps.

### Research Flags for Phases

| Phase | Flag | Reason |
|-------|------|--------|
| Phase 3 | File upload | Need to evaluate Cloudinary vs local storage for inspo images. Local is simpler for v1, Cloudinary handles transformation + CDN. Decision belongs in Phase 3 research. |
| Phase 3 | Email notification | Ticket creation notification to admin. Needs confirmation on SMTP vs transactional email service (Resend, SendGrid, etc.). Requires env config research. |
| Phase 4 | Admin auth | bcrypt + session cookie vs JWT vs HTTP basic. For single-admin, HTTP basic + HTTPS is actually fine and requires zero session infrastructure. Research to confirm. |

---

## Sources

- Research on three-tier e-commerce architecture patterns (IJISREM 2026 — Bloomora flower platform case study)
- Support ticket system design patterns (DEV Community 2026 — dual-interface ticket system)
- Flat-file and minimal e-commerce patterns (Nano Cart — catalogue-mode architecture)
- Firebase custom e-commerce architecture patterns (DEV Community 2026)
- Ticket state machine patterns (techinterview.org 2026 — LLD ticketing system)
- Baymard Institute checkout optimization research (multi-step vs single-page checkout conversion data)
