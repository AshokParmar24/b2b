# VyapaarBiz — Build Task List

## Phase 1 — Foundation
- [x] Initialize Next.js 15 project (TypeScript, Tailwind, App Router, src dir)
- [x] Install & configure shadcn/ui component library
- [x] Setup MongoDB connection (Mongoose)
- [x] Create all Mongoose models:
  - [x] `Business` model (mobiles[], cardImages[], hsnCodes[])
  - [x] `User` model (role, planId, planStartDate, planEndDate)
  - [x] `Plan` model (description, price, startDate, endDate, features[])
  - [x] `Country` model (name, code, flag, phoneCode, countryLogo)
  - [x] `State` model (name, countryId, code)
  - [x] `City` model (name, stateId)
  - [x] `Pincode` model (pincode, cityId, area)
  - [x] `HsnCode` model (code, description, unit)
- [x] Setup NextAuth.js (Admin + Subscriber roles, credentials provider)
- [x] Create middleware for route protection (admin vs subscriber)
- [ ] Seed India master data (states, major cities, pincodes)
- [ ] Seed HSN code reference data (JSON import)
- [x] Setup Cloudinary for image uploads
- [x] Setup environment variables (.env.local)

---

## Phase 2 — Admin Panel
- [x] Admin layout with sidebar navigation
- [x] `/admin` — Dashboard with stats (total users, listings, active plans)
- [/] `/admin/businesses` — All listings table (search, filter, activate/deactivate)
- [/] `/admin/users` — All subscribers (view plan, extend endDate, activate/deactivate)
- [/] `/admin/plans` — Create / edit / delete plans (with description, dates, limits)
- [/] `/admin/masters` — Manage Country / State / City / Pincode data
- [ ] `/admin/import` — Bulk CSV import for 100k records (batch insert)

---

## Phase 3 — Subscriber Dashboard
- [x] `/login` — Login page (subscriber + admin)
- [x] `/register` — New subscriber registration page
- [x] `/dashboard` — My listings overview (count used vs plan limit)
- [/] `/dashboard/add` — Add new business card form:
  - [x] Integrate **React Hook Form** + **Yup Validation**
  - [x] Dynamic mobile number array (add/remove)
  - [ ] Up to 10 card images (Cloudinary upload)
  - [ ] HSN code instant suggest dropdown
  - [ ] Cascading location: Country → State → City → Pincode
- [ ] `/dashboard/edit/[id]` — Edit existing card
- [ ] `/dashboard/plan` — Current plan info + upgrade option

---

## Phase 3.5 — Unit Testing
- [x] Set up **Jest** and React Testing Library integration natively with Next.js 15
- [x] Write Unit test suite for `HomePage` rendering UI elements (e.g., stats and text fields)
- [x] Write Unit test suite for `BusinessCardForm` validation logic and edge cases
- [ ] Expand unique test suites for edge cases on all future forms (Admin, Subscriber, and UI)

---

## Phase 4 — Public Website
- [ ] `/` — Home page:
  - [ ] Hero section with global search bar
  - [ ] HSN code instant search
  - [ ] Featured listings grid
- [ ] `/businesses` — All listings with filters (HSN, city, state, country)
- [ ] `/business/[slug]` — Business profile page:
  - [ ] Logo + card images gallery
  - [ ] All mobile numbers with country phoneCode prefix
  - [ ] HSN codes list
  - [ ] Location details
- [ ] `/plans` — Public subscription plans page (pricing cards)
- [ ] `/search` — Search results page

---

## Phase 5 — SEO & Polish
- [ ] Dynamic `<title>` and `<meta description>` for every page
- [ ] JSON-LD LocalBusiness schema on `/business/[slug]`
- [ ] Auto-generated `sitemap.xml` (covers all 100k listings)
- [ ] `robots.txt` configuration
- [ ] Mobile responsive polish (all pages)
- [ ] Dark/light mode
- [ ] Lighthouse performance audit (target 90+)
- [ ] Deploy to Vercel

---

## Best Build Approach (Recommended Order)

1. **Project init first** — Get the scaffold running locally
2. **Models before UI** — Build all Mongoose schemas before any page
3. **Auth early** — NextAuth setup before admin/dashboard pages
4. **Admin Panel before Public** — Lets you add real data to test with
5. **Seed data early** — India master data + HSN codes needed for forms
6. **Public last** — Build public pages with real data already in DB
7. **SEO at the end** — Polish after all pages are working
