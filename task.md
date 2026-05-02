# Hetnex — Build Task List

## Phase 1 — Foundation
- <span style="color: #22c55e; font-weight: bold;">[x]</span> Initialize Next.js 15 project (TypeScript, Tailwind, App Router, src dir)
- <span style="color: #22c55e; font-weight: bold;">[x]</span> Install & configure shadcn/ui component library
- <span style="color: #22c55e; font-weight: bold;">[x]</span> Setup MongoDB connection (Mongoose)
- <span style="color: #22c55e; font-weight: bold;">[x]</span> Create all Mongoose models:
  - <span style="color: #22c55e; font-weight: bold;">[x]</span> `Business` model (mobiles[], cardImages[], hsnCodes[])
  - <span style="color: #22c55e; font-weight: bold;">[x]</span> `User` model (role, planId, planStartDate, planEndDate)
  - <span style="color: #22c55e; font-weight: bold;">[x]</span> `Plan` model (description, price, startDate, endDate, features[])
  - <span style="color: #22c55e; font-weight: bold;">[x]</span> `Country` model (name, code, flag, phoneCode, countryLogo)
  - <span style="color: #22c55e; font-weight: bold;">[x]</span> `State` model (name, countryId, code)
  - <span style="color: #22c55e; font-weight: bold;">[x]</span> `City` model (name, stateId)
  - <span style="color: #22c55e; font-weight: bold;">[x]</span> `Pincode` model (pincode, cityId, area)
  - <span style="color: #22c55e; font-weight: bold;">[x]</span> `HsnCode` model (code, description, unit)
- <span style="color: #22c55e; font-weight: bold;">[x]</span> Setup NextAuth.js (Admin + Subscriber roles, credentials provider)
- <span style="color: #22c55e; font-weight: bold;">[x]</span> Create middleware for route protection (admin vs subscriber)
- <span style="color: #22c55e; font-weight: bold;">[x]</span> Seed India master data (states, major cities, pincodes)
- <span style="color: #22c55e; font-weight: bold;">[x]</span> Seed HSN code reference data (JSON import)
- <span style="color: #22c55e; font-weight: bold;">[x]</span> Setup Cloudinary for image uploads
- <span style="color: #22c55e; font-weight: bold;">[x]</span> Setup environment variables (.env.local)

---

## Phase 2 — Admin Panel
- <span style="color: #22c55e; font-weight: bold;">[x]</span> Admin layout with sidebar navigation
- <span style="color: #22c55e; font-weight: bold;">[x]</span> `/admin` — Dashboard with stats (total users, listings, active plans)
- <span style="color: #22c55e; font-weight: bold;">[x]</span> `/admin/businesses` — All listings table (search, filter, activate/deactivate)
- <span style="color: #22c55e; font-weight: bold;">[x]</span> `/admin/users` — All subscribers (view plan, extend endDate, activate/deactivate)
- <span style="color: #22c55e; font-weight: bold;">[x]</span> `/admin/plans` — Create / edit / delete plans (with description, dates, limits)
- <span style="color: #22c55e; font-weight: bold;">[x]</span> `/admin/masters` — Manage Country / State / City / Pincode data
- <span style="color: #22c55e; font-weight: bold;">[x]</span> `/admin/import` — Bulk CSV import for 100k records (batch insert)

---

## Phase 3 — Subscriber Dashboard
- <span style="color: #22c55e; font-weight: bold;">[x]</span> `/login` — Login page (subscriber + admin)
- <span style="color: #22c55e; font-weight: bold;">[x]</span> `/register` — New subscriber registration page
- <span style="color: #22c55e; font-weight: bold;">[x]</span> `/dashboard` — My listings overview (count used vs plan limit)
- <span style="color: #22c55e; font-weight: bold;">[x]</span> `/dashboard/add` — Add new business card form:
  - <span style="color: #22c55e; font-weight: bold;">[x]</span> Integrate **React Hook Form** + **Yup Validation**
  - <span style="color: #22c55e; font-weight: bold;">[x]</span> Dynamic mobile number array (add/remove)
  - <span style="color: #22c55e; font-weight: bold;">[x]</span> Up to 10 card images (Cloudinary upload UI and Image Array logic)
  - <span style="color: #22c55e; font-weight: bold;">[x]</span> HSN code instant suggest dropdown & Multi-Select array
  - <span style="color: #22c55e; font-weight: bold;">[x]</span> Cascading location UI: Country → State → City → Pincode
- <span style="color: #22c55e; font-weight: bold;">[x]</span> `/dashboard/edit/[id]` — Edit existing card
- <span style="color: #22c55e; font-weight: bold;">[x]</span> `/dashboard/plan` — Current plan info + upgrade option

---

## Phase 3.5 — Unit Testing
- <span style="color: #22c55e; font-weight: bold;">[x]</span> Set up **Jest** and React Testing Library integration natively with Next.js 15
- <span style="color: #22c55e; font-weight: bold;">[x]</span> Write Unit test suite for `HomePage` rendering UI elements (e.g., stats and text fields)
- <span style="color: #22c55e; font-weight: bold;">[x]</span> Write Unit test suite for `BusinessCardForm` validation logic and edge cases
- <span style="color: #22c55e; font-weight: bold;">[x]</span> Expand unique test suites for edge cases on all future forms (Admin, Subscriber, and UI)

---

## Phase 4 — Public Website
- <span style="color: #22c55e; font-weight: bold;">[x]</span> `/` — Home page:
  - <span style="color: #22c55e; font-weight: bold;">[x]</span> Hero section with global search bar
  - <span style="color: #22c55e; font-weight: bold;">[x]</span> HSN code instant search
  - <span style="color: #22c55e; font-weight: bold;">[x]</span> Featured listings grid
- <span style="color: #22c55e; font-weight: bold;">[x]</span> `/businesses` — All listings with filters (HSN, city, state, country)
- <span style="color: #22c55e; font-weight: bold;">[x]</span> `/business/[slug]` — Business profile page:
  - <span style="color: #22c55e; font-weight: bold;">[x]</span> Logo + card images gallery
  - <span style="color: #22c55e; font-weight: bold;">[x]</span> All mobile numbers with country phoneCode prefix
  - <span style="color: #22c55e; font-weight: bold;">[x]</span> HSN codes list
  - <span style="color: #22c55e; font-weight: bold;">[x]</span> Location details
- <span style="color: #22c55e; font-weight: bold;">[x]</span> `/plans` — Public subscription plans page (pricing cards)
- <span style="color: #22c55e; font-weight: bold;">[x]</span> `/search` — Search results page

---

## Phase 5 — SEO & Polish
- <span style="color: #22c55e; font-weight: bold;">[x]</span> Dynamic `<title>` and `<meta description>` for every page
- <span style="color: #22c55e; font-weight: bold;">[x]</span> JSON-LD LocalBusiness schema on `/business/[slug]`
- <span style="color: #22c55e; font-weight: bold;">[x]</span> Auto-generated `sitemap.xml` (covers all 100k listings)
- <span style="color: #22c55e; font-weight: bold;">[x]</span> `robots.txt` configuration
- <span style="color: #22c55e; font-weight: bold;">[x]</span> Mobile responsive polish (all pages)
- <span style="color: #22c55e; font-weight: bold;">[x]</span> Dark/light mode
- <span style="color: #22c55e; font-weight: bold;">[x]</span> Implement Prettier code formatting
- <span style="color: #22c55e; font-weight: bold;">[x]</span> Lighthouse performance audit (target 90+)
- <span style="color: #22c55e; font-weight: bold;">[x]</span> Deploy to Vercel

---

## Phase 6 — Config & White-labeling (Publishing prep)
- <span style="color: #22c55e; font-weight: bold;">[x]</span> Centralize application config (name, domain, tagline) into a single file (`site-config.ts`).
- <span style="color: #22c55e; font-weight: bold;">[x]</span> Replace all hardcoded "VyapaarBiz" references across app pages and layouts.
- <span style="color: #22c55e; font-weight: bold;">[x]</span> Make SEO metadata and sitemap URLs dynamic based on site config.
- <span style="color: #22c55e; font-weight: bold;">[x]</span> Prepare app to be published under any new brand name easily.

---

## Best Build Approach (Recommended Order)

1. **Project init first** — Get the scaffold running locally
2. **Models before UI** — Build all Mongoose schemas before any page
3. **Auth early** — NextAuth setup before admin/dashboard pages
4. **Admin Panel before Public** — Lets you add real data to test with
5. **Seed data early** — India master data + HSN codes needed for forms
6. **Public last** — Build public pages with real data already in DB
7. **SEO at the end** — Polish after all pages are working
