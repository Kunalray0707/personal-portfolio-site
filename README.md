# Portfolio AI Pro — Phase 8

[![CI](https://github.com/OWNER/REPO/actions/workflows/ci.yml/badge.svg)](https://github.com/OWNER/REPO/actions/workflows/ci.yml)

This repository contains the Phase 8 implementation of Portfolio AI Pro, adding an Export & Deployment hub with standalone HTML/PDF/ZIP/JSON downloads, Vercel & GitHub deployment scaffolding, and custom domain management. Phase 7 (Razorpay payments) is also included.

Tech stack (confirmed by audit): Next.js 13.4.13 (App Router), React 18.2.0, TypeScript, Tailwind CSS, Framer Motion, GSAP, Prisma/PostgreSQL. shadcn/ui primitives (Button, Input, Card, Dialog, Toast) are included in `components/ui/`. Manual Google OAuth and Cloudinary uploads are wired with graceful mock fallbacks when env vars are absent.

Quick start (after cloning):

1. Install dependencies
   npm install

2. Run development server
   npm run dev

3. Open http://localhost:3000

Notes:
- Rename .env.example to .env.local and fill in values before using production integrations.
- shadcn/ui requires running `npx shadcn-ui@latest init` after dependencies are installed to scaffold components (see section below).

Phase 1 delivered items:
- Project initialization and configuration (TypeScript, Tailwind, ESLint, Prettier)
- Minimal landing page with responsive layout, navigation, footer, dark/light theme toggle, loading screen and animations
- GitHub Actions workflow for CI (install, lint, build)

Commands:
- npm run dev — start development server
- npm run build — build for production
- npm run start — start built app
- npm run lint — run ESLint and autofix
- npm run format — run Prettier
- npm run typecheck — run TypeScript checks
- npm run test — run unit & integration tests (Vitest)

Test Suite
- Location: tests/
- Run locally: npm run test
- What it covers: unit tests for lib/ai_impl (mock mode) and integration tests for app/api/ai/* route handlers. Tests run in CI on push/PR via .github/workflows/ci.yml.

Shadcn/ui setup (after npm install):
1. npx shadcn-ui@latest init
2. Follow the assistant to pick components. Commit the generated files.

Phase 2 (Authentication) — setup steps (run after filling .env.local)
1. Install dependencies
   npm install

2. Prisma setup (requires DATABASE_URL in .env.local)
   npx prisma generate
   npx prisma migrate dev --name init

Phase 5 (Portfolio Templates) — added features
- 25 premium portfolio templates across Developer, Designer, Photographer, Business, Minimal, Luxury, Cyber, Glass, AI, Creative, Corporate, Student, Freelancer, Dark, Light, Animated and more
- Templates are fully editable once created in the builder
- Browse templates from the public template library and apply them to new portfolios
- Improved dashboard onboarding with direct template browsing

3. Start development server
   npm run dev

Auth capabilities added in Phase 2:
- Email + password registration and login
- Phone OTP (Twilio) request & verify
- Email verification (Resend)
- Forgot password / reset
- Session handling with secure httpOnly cookie stored in DB
- Protected middleware for /dashboard and /api/protected/*

Environment variables required for Phase 2:
- DATABASE_URL — PostgreSQL connection string
- RESEND_API_KEY — Resend API key for sending emails
- TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM — Twilio credentials for SMS (optional; OTP will no-op with a console warning if missing)
- NEXT_PUBLIC_BASE_URL — base URL for email links (e.g. http://localhost:3000)

CI: See .github/workflows/ci.yml for GitHub Actions setup.

Phase 7 (Payments) — added features
- Full Razorpay integration with plans, subscriptions, and one-time checkout
- Backend order creation endpoint that returns a Razorpay checkout order
- Payment verification with HMAC signature validation
- Webhook handler with signature verification for payment events
- Automatic invoice generation and storage for every successful payment
- Payment history table with refund support
- Premium unlock based on active subscription status
- Billing dashboard page with pricing cards, checkout modal, and payment history
- Mock/sandbox mode that works without live Razorpay credentials (mirrors the existing AI mock pattern)

Phase 7 — Prisma setup (run after filling .env.local)
1. npx prisma generate
2. npx prisma migrate dev --name add_payments

Phase 7 — API routes
- GET /api/payments/plans — list active plans (public)
- POST /api/payments/create-order — create a Razorpay order (logged in)
- POST /api/payments/verify — verify signature, mark payment success, create invoice, activate subscription
- POST /api/payments/webhook — verify webhook signature and handle events
- GET /api/payments/history — list the user's payment history
- GET /api/payments/subscription — return the user's current subscription / premium status
- POST /api/payments/refund — initiate a refund for a payment

Environment variables required for Phase 7:
- RAZORPAY_KEY_ID — Razorpay public key id
- RAZORPAY_KEY_SECRET — Razorpay secret key
- RAZORPAY_WEBHOOK_SECRET — secret used to verify webhook signatures
- NEXT_PUBLIC_RAZORPAY_KEY_ID — public key id exposed to the client for checkout

(All Razorpay variables are optional. When omitted, the payment flow runs in local mock mode so you can test end-to-end without live credentials.)

Phase 8 (Export & Deployment) — added features
- Export any portfolio as a standalone self-contained HTML file (inline CSS, works offline)
- Print-ready PDF export (rendered as a print-optimized HTML document you can save as PDF)
- ZIP bundle containing index.html, vercel.json, portfolio.json, and a README
- JSON export for backups, migration, or portability
- Vercel deployment-ready bundle (vercel.json manifest + static files)
- GitHub export metadata and file scaffolding for pushing to a new repository
- Custom domain management: attach a domain to a portfolio, verify via a simulated TXT challenge, and track verified status
- New "Export" section in the dashboard sidebar and a Distribution hub page at /dashboard/export

Phase 8 — Prisma setup (run after filling .env.local)
1. npx prisma generate
2. npx prisma migrate dev --name add_custom_domains

Phase 8 — Export API routes (all require an authenticated session)
- POST /api/export/html — download portfolio as standalone HTML
- POST /api/export/pdf — get a print-ready HTML document to save/print as PDF
- POST /api/export/json — download portfolio as JSON
- POST /api/export/zip — download a ZIP bundle (HTML + vercel.json + JSON + README)
- POST /api/export/deploy — generate a static deployment bundle (base64 zip + metadata)
- POST /api/export/github — scaffold a GitHub export (metadata + base64 files)

Phase 8 — Custom domain API routes
- POST /api/domains/set — attach a custom domain to a portfolio
- POST /api/domains/verify — verify a domain using a TXT challenge token
- GET /api/domains/list — list the current user's custom domains
- POST /api/domains/delete — remove a custom domain

Phase 8 — dependencies
- archiver (runtime) — used by the ZIP and deploy export routes to build archives
- @types/archiver (dev) — TypeScript types for archiver

Note on custom domain verification
- Verification is simulated locally: the set endpoint returns a `_paip-challenge` TXT token, and the verify endpoint accepts that token to mark the domain verified. In production this would resolve the actual TXT record for the domain via a DNS provider API.

Next: Deploy with a PostgreSQL database, configure Razorpay credentials for production checkout, and wire DNS for custom domains.
