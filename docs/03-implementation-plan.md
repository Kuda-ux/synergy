# Phased Implementation Plan & Task List

## Phase status

| Phase | Scope | Status |
| --- | --- | --- |
| 1. Discovery & audit | Materials audit, architecture, schema, route/component maps | ✅ This slice |
| 2. Design system | Tokens, typography, themes, base UI kit | ✅ This slice |
| 3. Core storefront | Layout, homepage, catalogue, category, search/filters, product page, cart, wishlist | ✅ This slice |
| 4. Commerce foundation | DB, checkout, order creation, stock validation, notifications abstraction | ✅ This slice (guest checkout; accounts deferred) |
| 5. Local business features | Paynow structure (mock), collection/delivery methods, USD/ZWG, WhatsApp, quotations | ✅ This slice |
| 6. Administration | Product/order/quotation/customer management, RBAC | ⏳ Next phase |
| 7. Quality & release | Full test suite expansion, accessibility & performance audits, deployment docs | ✅ Baseline in this slice; expand next phase |

## Prioritised task list (this slice)

1. Design tokens (logo-derived palette), fonts (Sora / Inter / IBM Plex Mono), light+dark themes.
2. Prisma schema + seed with clearly-labelled demo catalogue (8 top categories, subcategories, ~28 demo products).
3. Global layout: announcement bar, sticky header (search, nav, currency, theme, wishlist, cart, WhatsApp), footer.
4. Homepage sections A–L per brief §5.
5. `/shop` engine: predictive search, category/brand/price/stock filters, sorting, pagination.
6. Product detail page: gallery, specs tabs, package contents, stock badge, add-to-cart, WhatsApp enquiry, related products, reviews architecture (disabled — no fake reviews).
7. Persistent cart + wishlist (localStorage-persisted stores; server-validated at checkout).
8. Quotation basket + request form → DB with reference number + statuses.
9. Guest checkout → order + audit event + payment abstraction (mock Paynow, bank transfer, pay-on-collection).
10. Track order lookup (order number + email).
11. Supporting/company pages incl. clearly-marked draft legal pages.
12. SEO: metadata, Open Graph, JSON-LD (Organisation, LocalBusiness, Product, Breadcrumb), sitemap, robots.
13. Tests: money, cart maths, validation schemas, quotation reference; lint; typecheck; production build.
14. README + `.env.example`.

## Deferred (requires business input or later phase)

- Customer accounts & saved server-side carts/wishlists (Supabase Auth planned).
- Admin area with RBAC (Super Admin, Store Manager, Inventory, Sales, Content, Support).
- Live Paynow/EcoCash/OneMoney/Zimswitch/PayPal credentials + webhook go-live.
- Real delivery rates; coupon engine; abandoned-cart emails; invoice PDFs.
- Real product data import; real exchange-rate management UI.
- Reviews go-live (architecture exists; launches only with genuine reviews).
