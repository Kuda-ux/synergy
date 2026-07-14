# Synergy Dynamics E-Commerce Platform

A modern, premium, production-ready e-commerce website for **Synergy Dynamics** — a Zimbabwean robotics, electronics, automation, and intelligent systems company.

Built with **Next.js 16** (App Router), **TypeScript**, **Tailwind CSS**, **Prisma**, and **Zustand**.

## Features

- Responsive, mobile-first design with light and dark themes.
- Full product catalogue with categories, search, filters, sorting, and pagination.
- Product detail pages with add-to-cart and add-to-quote flows.
- Persistent cart and wishlist (client-side storage + Zustand).
- Checkout and quotation request workflows with server-side validation.
- Track order page.
- Supporting pages: About, Services, Institutions, Training, Gallery, Resources, Contact, FAQ, Support, Delivery, Returns, Privacy, Terms.
- SEO metadata, sitemap, robots.txt, and structured data.
- Paynow webhook stub for payment notifications.
- Strong TypeScript, reusable components, and integer minor-unit money handling.

## Prerequisites

- Node.js 20+
- npm (or pnpm / yarn)

## Getting Started

1. Clone the repository and install dependencies:

   ```bash
   npm install
   ```

2. Copy the example environment file and configure as needed:

   ```bash
   cp .env.example .env
   ```

3. Generate the Prisma client and seed the database:

   ```bash
   npm run db:generate
   npm run db:seed
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build & Quality Checks

```bash
# Lint
npm run lint

# Type check
npm run typecheck

# Tests
npm run test

# Production build
npm run build
```

## Project Structure

```
src/
  app/           # Next.js App Router routes
  components/    # Reusable UI components
  lib/           # Utilities, validation, data access, store logic
  hooks/         # Custom React hooks
  styles/        # Global styles and fonts
prisma/
  schema.prisma  # Database schema
  seed.ts        # Demo data
public/          # Static assets
```

## Customisation

- Brand tokens and theme configuration live in `src/lib/theme.ts` and `src/app/globals.css`.
- Update business information, contact details, and policy copy in `src/lib/site.ts`.
- Add or edit demo products, categories, and brands in `prisma/seed.ts`.

## Deployment

The project is configured as a static Next.js app and can be deployed to any host that supports Next.js (Vercel, Netlify, etc.). For production, set real environment variables for payment, email, and database connections.

## License

Copyright © Synergy Dynamics. All rights reserved.
