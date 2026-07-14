# Phase 1 — Discovery & Audit

Project: Synergy Dynamics E-Commerce Platform
Date: 2026-07-13

## 1. Supplied materials reviewed

| Material | Status | Notes |
| --- | --- | --- |
| Official logo (`logo.jpeg`) | ✅ Received | Magenta/plum rounded icon with circuit nodes + bold black futuristic wordmark on white. |
| Company profile PDF | ❌ **Not supplied** | Only the logo was present in the workspace. Business facts were taken from the live website instead. Must be supplied and reviewed before launch. |
| Existing website (`synergydynamics.co.zw`) | ✅ Reviewed | Static HTML brochure site (Home, About, Services, Gallery, Contact). |
| Existing repository | ❌ None provided | Greenfield build. |

## 2. Current website audit

The existing site is a static, non-commerce brochure site:

- **Pages:** `index.html`, `about.html`, `services.html`, `gallery.html`, `contact.html`.
- **Content confirmed from the live site (safe to reuse):**
  - Positioning: "Empowering Future Innovators — Robotics • Electronics • STEM Education".
  - Vision: "To become a leading provider of STEM and technology learning solutions that inspire innovation, creativity and technological excellence across Africa."
  - Mission: "To bridge the gap between theory and practice by delivering accessible, engaging and industry-relevant robotics, electronics and automation learning solutions."
  - Core values: Innovation, Excellence, Integrity, Continuous Learning.
  - Service pillars: Robotics Learning Kits, Electronics Systems, Embedded Systems, IoT Solutions, Automation Solutions, STEM Training.
  - Featured products (names only, **no prices/stock**): Robotic Arm Car Kit, STEM Rover Platform, TinkerBot Starter Kit; ACEBOTT-branded kits appear in the gallery.
  - Contact: +263 777 938 962, info@synergydynamics.co.zw, WhatsApp `wa.me/263777938962`.
- **Gaps in the current site:** no shop, no catalogue, no cart/checkout, no accounts, no quotations, no search, no dark mode, no structured data, no address shown (address supplied separately in the brief).

## 3. Inconsistencies & missing information

1. **Company profile PDF missing** — could not be reviewed; brand facts limited to the live site + brief.
2. **Address not on the current website** — brief supplies: Shop F04, Upstairs, Park City Village Mall, 26 Park Street, Harare. Used as the store-collection address (assumed correct).
3. **No store hours anywhere** — placeholder used, clearly marked.
4. **No prices, stock levels, SKUs, warranties, delivery rates or exchange rates exist** — all catalogue data in this build is **demo data**, flagged `isDemo` in the database and labelled "Demo" in the UI.
5. **No confirmed payment merchant accounts** (Paynow, PayPal, etc.) — payment layer is built as an abstraction running in mock/sandbox mode only.
6. **No social media URLs supplied** — footer contains disabled placeholders.
7. **Brand relationships unverified** (e.g. ACEBOTT reseller status) — demo brands are generic where not confirmed.
8. **ZWG exchange rate** — administrator-controlled; the seeded rate is demo-only and ZWG display is disabled until a real rate is configured.

## 4. Information the business owner must confirm before launch

- Company profile PDF + any certifications/registrations to publish.
- Store hours.
- Real product list: names, SKUs, USD prices, stock, images, datasheets, warranties.
- Delivery methods and real rates (Harare / nationwide courier partners).
- Payment providers + merchant credentials (Paynow integration ID/key, bank details for transfer, card/PayPal accounts).
- Whether ZWG pricing should be enabled and the rate-management process.
- Social media accounts.
- Approval of draft legal pages (Privacy, Terms, Returns & Warranty, Delivery Information).
- Email sending domain/provider for transactional mail.
- VAT/tax handling for invoices and quotations.

## 5. Assumptions made

- USD is the primary trading currency; ZWG is display-optional (per brief §12).
- Guest checkout is required from day one; full customer accounts are a later phase.
- Supabase/PostgreSQL is the production target; local development uses SQLite via Prisma with a Postgres-compatible schema (no enums, integer minor-unit money, JSON stored as validated text columns). See `02-architecture.md`.
- WhatsApp links use the confirmed number `+263 777 938 962` via `wa.me` deep links (no automation).
- All demo products are recognisable generic maker-market items with realistic but **clearly-labelled demo** prices.
