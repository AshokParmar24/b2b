# HETNEX x Volza: Comprehensive Global Trade Intelligence Implementation Plan

This document provides a highly detailed, technical, and sprint-wise roadmap to transform HETNEX into an enterprise-grade global trade intelligence platform (similar to Volza.com). It outlines the exact technology stack, database relationships (ERD), API data flows, and UI/UX behaviors required.

---

## 🏗️ Core Technology Stack
- **Frontend & Framework:** Next.js 16.2 (App Router, Turbopack) for server-side rendering (SSR) and SEO optimization.
- **Styling & UI:** Tailwind CSS v4, Shadcn UI, Framer Motion (for micro-animations), Recharts (for complex data visualization).
- **Primary Database:** MongoDB (via Mongoose) for Users, Plans, Transactions, and Master Data.
- **Search & Analytics Engine:** Elasticsearch or Meilisearch. (Crucial: MongoDB cannot efficiently perform full-text fuzzy searches or aggregate millions of shipment records in real-time. Shipments must be indexed in a dedicated search engine).
- **Caching & Rate Limiting:** Redis (Upstash) to cache heavy aggregation queries for the Details Page and to rate-limit public API scraping.
- **Authentication:** NextAuth.js (Session-based).
- **Payments:** Stripe or Razorpay (Webhook integration for plan upgrades/downgrades).

---

## 🗄️ Database Relationships (ERD & Schema Details)

Proper data handling requires strict relational mapping between collections.

### 1. User & Subscription Ecosystem
- `User` (1) ➔ (1) `Subscription` (Tracks active plan, expiry, and current month's "Unlock Credits").
- `User` (1) ➔ (M) `CreditTransaction` (Ledger of every credit spent, e.g., "-1 Credit: Unlocked Company X Contact").
- `User` (1) ➔ (M) `Notification` (Alerts for followed entities).
- `User` (1) ➔ (M) `FollowedEntity` (Polymorphic: Tracks which HS Codes or Companies a user is monitoring).

### 2. Trade Data Ecosystem (The Core Engine)
- `Company` (Entity acting as Exporter or Importer)
  - Fields: `name`, `taxId`, `countryId`, `website`, `isBlurred` (boolean), `contactEmails`, `contactPhones`.
- `HsnCode` (Master Data)
  - Represents the product taxonomy (2-digit chapter up to 8-digit specific product).
- `ShipmentRecord` (Massive Collection / Indexed in Search Engine)
  - **Relationships:** 
    - `exporterId` ➔ References `Company`
    - `importerId` ➔ References `Company`
    - `hsnCodeId` ➔ References `HsnCode`
    - `originPortId` & `destinationPortId` ➔ References Master Location Data.
  - **Metrics:** `date`, `quantity`, `unitType`, `valueUSD`, `productDescription`.

---

## 🏃‍♂️ Sprint 1: Data Architecture & Pipeline Engineering
**Goal:** Build the heavy-lifting backend to handle massive datasets without crashing.

1. **Schema Initialization:** Create all Mongoose models (`Company`, `ShipmentRecord`, `CreditTransaction`, `FollowedEntity`).
2. **Search Engine Sync:** Implement a pipeline (using MongoDB Change Streams or a batch cron job) that syncs newly inserted `ShipmentRecord` documents directly into Elasticsearch/Meilisearch.
3. **Mock Data Generation:** Write a Node.js seed script to generate 500,000+ realistic shipment records linking random companies and HSN codes to test system load limits.

---

## 🏃‍♂️ Sprint 2: The Public Landing Page & SEO
**Goal:** A high-converting gateway that mimics Volza's immediate value proposition.

1. **The Universal Search Component:** 
   - A prominent hero search bar.
   - **Tech:** React `useDebounce` hook querying the Elasticsearch API. It must auto-suggest mixed results: "HS Code: 8517 (Phones)" or "Company: Apple Inc."
2. **Live Stats & Trust Signals:**
   - Real-time animated counters (using `framer-motion`) showing "Total Shipments Tracked".
3. **SEO & Routing:**
   - Implement dynamic metadata for routes like `/import-data/usa` or `/hs-code/8517` so Google indexes these pages.

---

## 🏃‍♂️ Sprint 3: The Details Page (Data Visualization & Blurring)
**Goal:** The core application page where users analyze a company or product.

1. **Layout Structure:**
   - **Header:** Company Name (or HS Code), Total Trade Value, Total Shipments.
   - **Charts (Recharts):** 
     - A Line Chart for "Monthly Trade Volume".
     - A Pie Chart for "Top Partner Countries".
   - **Data Table:** Paginated list of recent shipments.
2. **Data Blurring (The Paywall Logic):**
   - **Backend Handling:** The `/api/shipments` route checks the user's `Subscription`. If the user has not "unlocked" this specific company, the API intercepts the response and replaces `exporterName` with `"***LOCKED***"` before it ever reaches the browser.
   - **UI Rendering:** If the UI receives `"***LOCKED***"`, it renders a blurred CSS skeleton block with a padlock icon.
3. **The Unlock Action:**
   - User clicks "Unlock Decision Makers".
   - API deducts 1 credit from `Subscription`, creates a `CreditTransaction`, and adds this Company to the user's `UnlockedEntities` array.
   - The UI re-fetches the clear data.

---

## 🏃‍♂️ Sprint 4: Subscription Plans & Payment Integration
**Goal:** Ensure foolproof monetization and feature gating.

1. **Plan Tiers:**
   - Free: 0 Credits, 5 rows of data visible, no Excel export.
   - Pro: 100 Credits/mo, 10,000 row export limit.
   - Enterprise: Custom Credits, API Access.
2. **Payment Gateway (Stripe):**
   - Create Stripe Checkout sessions.
   - **Crucial:** Implement a secure Stripe Webhook (`/api/webhooks/stripe`) to automatically renew credits on the 1st of every month or upgrade a user immediately upon payment success.
3. **Feature Gating Middleware:**
   - Extend `src/proxy.ts` (Next.js Middleware) to completely block access to `/api/export` if the user's plan is 'Free'.

---

## 🏃‍♂️ Sprint 5: Real-Time Notifications & Tracking
**Goal:** Retention mechanics. Keep users coming back.

1. **Watchlist Feature:** 
   - Users click a "Follow" star next to an HS Code or Company (creates a `FollowedEntity` record).
2. **The Notification Engine:**
   - When a new `ShipmentRecord` is inserted into the database, a background worker checks if the `importerId` or `hsnCodeId` matches any `FollowedEntity`.
   - If yes, it creates a `Notification` record for that user.
3. **UI Integration:**
   - The `NotificationBell` component (already implemented) polls `/api/notifications` and drops down alerts like: *"Alert: Apple Inc just imported 500 units of HS 8517."*
4. **Email Digests:**
   - Implement a Cron Job (using Vercel Cron or standard Node cron) + Nodemailer to send a weekly HTML email summarizing all tracked alerts.

---

## 🏃‍♂️ Sprint 6: End-to-End Testing & Performance Polish
**Goal:** Enterprise readiness.

1. **Caching Strategies:** 
   - Company detail pages rarely change historically. Use Next.js `generateStaticParams` or `revalidate: 3600` (ISR) to cache public-facing profiles for 1 hour, vastly reducing database load.
2. **Pagination Optimization:** 
   - For tables with 1M+ rows, standard MongoDB `skip()` is disastrously slow. We will implement "Cursor-based pagination" (using `_id` greater than X) for the Data Table.
3. **UAT (User Acceptance Testing):** 
   - Sprint sign-off. Test the complete funnel: Google Search -> Landing Page -> Search HS Code -> Hit Paywall -> Upgrade via Stripe -> Unlock Data -> Export to Excel.
