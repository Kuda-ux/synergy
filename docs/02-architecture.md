# Architecture, Database Schema, Route Map & Component Hierarchy

## 1. Recommended architecture

| Layer | Choice | Rationale |
| --- | --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) | Server components, server actions, strong SEO, image optimisation. |
| Language | TypeScript (strict) | Type safety across data layer, actions and UI. |
| Styling | Tailwind CSS v4 + CSS design tokens | Token-driven light/dark theming, fast iteration. |
| Database | PostgreSQL (production, e.g. Supabase) / SQLite (local dev) | Prisma keeps the schema portable. Dev runs with zero external services. |
| ORM | Prisma 7 | Strongly typed data layer. |
| State | Zustand (persisted) for cart/wishlist/currency | Minimal client JS; server remains source of truth for prices & stock. |
| Validation | Zod v4 | Shared server-side validation for all actions/forms. |
| Payments | Provider abstraction (`src/lib/payments`) | Paynow structure in mock/sandbox mode; PayPal/card providers pluggable. |
| Notifications | Provider abstraction (`src/lib/notifications`) | Console/log transport in dev; SMTP/API provider pluggable. |
| Testing | Vitest | Unit tests for money, cart, validation, quotation logic. |

### Portability rules (SQLite dev → PostgreSQL prod)

- **No Prisma enums** — status fields are strings constrained by Zod validators and TS union types (`src/lib/constants.ts`).
- **Money as integer minor units** (USD cents) — never floats. Formatting via `src/lib/money.ts`.
- **JSON-ish fields** (specs, package contents) stored as validated JSON text columns with typed accessors.
- Switching to Postgres = change `provider` in `prisma/schema.prisma` + `DATABASE_URL`; no model changes.

### Security posture (first slice)

- All mutations go through server actions with Zod validation; prices/stock always re-read server-side.
- No secrets in client bundles; `.env.example` documents placeholders only.
- Payment providers run in `mock` mode until credentials exist; webhook verification + idempotency implemented in the abstraction contract.
- Security headers set in `next.config.ts`.

## 2. Database schema (implemented in `prisma/schema.prisma`)

- **Category** — id, slug, name, description, parentId (self-relation), icon key, sort order, featured flag. Database-driven navigation and category cards.
- **Brand** — id, slug, name, isDemo.
- **Product** — id, slug, sku, name, shortDescription, description, brandId, categoryId, tags (csv), specsJson, packageContentsJson, compatibilityJson, downloadsJson, priceUsdCents, compareAtUsdCents, costUsdCents (admin-only, never selected in storefront queries), stockQty, lowStockThreshold, status (`draft|active|archived|preorder`), weightGrams, dimensions, warranty, isFeatured, isNewArrival, isBestSeller, isDemo, seoTitle, seoDescription, timestamps.
- **ProductImage** — productId, url, alt, sortOrder.
- **Order** — id, orderNumber, email, phone, customer name, company/PO fields, addresses, deliveryMethod, deliveryNotes, currency, subtotal/delivery/discount/total (cents), status (`pending_payment|payment_processing|paid|processing|ready_for_collection|dispatched|delivered|cancelled|refunded`), paymentProvider, paymentRef, notes, timestamps.
- **OrderItem** — orderId, productId, name/sku/unitPrice snapshot, quantity, lineTotal.
- **OrderStatusEvent** — orderId, fromStatus, toStatus, note, createdAt (audit history).
- **QuotationRequest** — id, reference, organisation fields, contact fields, type (`school|university|government|business|individual`), requirements text, poReference, status (`new|under_review|info_required|quoted|accepted|rejected|converted`), internal notes, timestamps.
- **QuotationItem** — quotationId, productId?, description, quantity.
- **Setting** — key/value store: exchange rate (ZWG per USD, admin-controlled), announcement messages, store hours, feature flags (e.g. `zwgEnabled`).
- **NewsletterSubscriber** — email, createdAt, source.

Deferred to later phases: `User`/`Address`/`Wishlist` server persistence (accounts), `Coupon`, `Review` (architecture only — never faked), `DeliveryRate`.

## 3. Route map

### Storefront
| Route | Purpose |
| --- | --- |
| `/` | Homepage (sections A–L) |
| `/shop` | All products + search/filter/sort/pagination |
| `/shop/[category]` | Category listing (db-driven, nested categories) |
| `/shop/[category]/[product]` | Product detail |
| `/new-arrivals` | New arrivals listing |
| `/search?q=` | Search results (same engine as /shop) |
| `/cart` | Cart |
| `/checkout` | One-page guest checkout |
| `/checkout/confirmation/[orderNumber]` | Order confirmation |
| `/wishlist` | Wishlist |
| `/quote` | Quotation basket + request form |
| `/quote/confirmation/[reference]` | Quotation confirmation |
| `/track-order` | Order tracking lookup (order number + email) |

### Company & support
`/about`, `/services` (Engineering Services), `/institutions` (Schools & Institutions), `/training`, `/gallery` (Project Gallery), `/resources` + `/resources/[slug]`, `/support`, `/contact`, `/faq`, `/delivery`, `/returns`, `/privacy`, `/terms`

### System
`/sitemap.xml`, `/robots.txt`, `/api/paynow/webhook` (verification stub, mock mode)

### Future phases
`/account/*` (auth, orders, addresses, quotes), `/admin/*` (RBAC admin area)

## 4. Component hierarchy

```
src/
  app/                      — routes (server components by default)
  components/
    layout/                 — AnnouncementBar, SiteHeader, MegaNav, MobileNav,
                              SearchBar, SiteFooter, ThemeToggle, CurrencyToggle,
                              WhatsAppButton
    ui/                     — Button, Badge, Card, Input, Select, Textarea, Skeleton,
                              EmptyState, ErrorState, Price, SectionHeading, Tabs,
                              QuantityStepper, CircuitPattern (brand background)
    product/                — ProductCard, ProductGrid, ProductGallery, StockBadge,
                              SpecsTable, ProductTabs, AddToCartButton, WishlistButton,
                              QuickAdd, RelatedProducts, DemoDataNotice
    home/                   — Hero, TrustStrip, CategoryCards, NewArrivals,
                              RoboticsShowcase, InstitutionsBand, ServicesGrid,
                              ResourcesPreview, FinalCta
    cart/                   — CartLine, CartSummary, CartProvider (zustand hydration)
    filters/                — FilterSidebar, SortSelect, ActiveFilters, Pagination
    forms/                  — CheckoutForm, QuoteForm, ContactForm, NewsletterForm,
                              TrackOrderForm
  lib/
    db.ts                   — Prisma client singleton
    constants.ts            — statuses, contact info, nav config
    money.ts                — minor-unit arithmetic + formatting + ZWG conversion
    catalog.ts              — product/category queries (server-only)
    settings.ts             — Setting accessors
    validation/             — Zod schemas (checkout, quote, contact, newsletter)
    actions/                — server actions (createOrder, createQuote, subscribe, trackOrder)
    payments/               — provider interface + PaynowProvider (mock) + registry
    notifications/          — provider interface + ConsoleProvider
    seo.ts                  — metadata + JSON-LD builders
  store/                    — cartStore, wishlistStore, currencyStore (zustand persisted)
```
