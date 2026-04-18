# VyapaarBiz — Final Implementation Plan

## Overview
**VyapaarBiz** is a full-stack Next.js B2B global business directory. Dealers can register visiting cards with multiple HSN codes, multiple mobile numbers, and up to 10 card images. The platform includes a **subscription/plan system** with start & end dates and a full **Admin Panel** to manage all data.

---

## ✅ Confirmed Decisions

| Item | Choice |
|---|---|
| Website Name | **VyapaarBiz** |
| Framework | Next.js 15 (App Router) |
| Database | **MongoDB + Mongoose** |
| Styling | **Tailwind CSS + shadcn/ui** |
| Auth | NextAuth.js (Admin + Subscriber roles) |
| Mobile Numbers | Array — multiple per card |
| Card Images | Array — max **10** images per card (Cloudinary) |
| HSN Codes | Multiple per card + instant suggestions |
| Location | Master Data — Country → State → City → Pincode (cascading dropdowns) |
| Country Field | Includes `phoneCode` (e.g. `91`) + `countryLogo` image |
| Plan Dates | `startDate` + `endDate` per subscription |
| Categories | ❌ Not needed |
| Plans | Free / Basic ₹299 / Pro ₹799 / Enterprise ₹1999 |

---

## Technology Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| State/Forms | React Hook Form + Yup (schema validation) |
| Testing | Jest + React Testing Library |
| Styling | Tailwind CSS + shadcn/ui |
| Database | MongoDB (Mongoose ODM) |
| Auth | NextAuth.js (credentials) |
| Image Storage | Cloudinary |
| Deployment | Vercel |

---

## MongoDB Data Models

### 1. 🪪 Business Card
```js
{
  businessName: String,       // Company name
  ownerName: String,          // Contact person
  mobiles: [String],          // ← Array of mobile numbers
  whatsapp: String,
  email: String,
  website: String,
  address: String,

  // Location — linked to Master Data
  countryId:  ObjectId,       // → Country Master
  stateId:    ObjectId,       // → State Master
  cityId:     ObjectId,       // → City Master
  pincodeId:  ObjectId,       // → Pincode Master

  gstNumber: String,
  logoUrl: String,            // Single business logo
  cardImages: [String],       // ← Array of card images (max 10)

  hsnCodes: [                 // ← Array of HSN codes
    {
      code: String,           // e.g. "6908"
      description: String,    // e.g. "Glazed Ceramic Tiles"
      productName: String,
      unit: String            // e.g. SQM, PCS, KG
    }
  ],

  slug: String,               // Auto-generated SEO URL
  userId: ObjectId,           // Linked subscriber
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

### 🗺️ Location Master Models

#### Country Master
```js
{
  name: String,         // e.g. "India", "USA"
  code: String,         // e.g. "IN", "US"
  flag: String,         // Emoji flag — "🇮🇳"
  phoneCode: String,    // ← e.g. "91" shown as +91 on mobile field
  countryLogo: String,  // ← Flag image URL for dropdown display
  isActive: Boolean
}
```

#### State Master
```js
{
  name: String,         // e.g. "Gujarat"
  countryId: ObjectId,  // → Country
  code: String,         // e.g. "GJ"
  isActive: Boolean
}
```

#### City Master
```js
{
  name: String,         // e.g. "Morbi"
  stateId: ObjectId,    // → State
  isActive: Boolean
}
```

#### Pincode Master
```js
{
  pincode: String,      // e.g. "363641"
  cityId: ObjectId,     // → City
  area: String,         // e.g. "Morbi Industrial Area"
  isActive: Boolean
}
```

> **Cascading dropdowns:** Country selected → States load → State selected → Cities load → City selected → Pincodes load. Powered by Next.js API routes.

---

### 2. 👤 User / Subscriber Model
```js
{
  name: String,
  email: String,                  // Login email
  password: String,               // Bcrypt hashed
  role: "admin" | "subscriber",   // Role-based access
  planId: ObjectId,               // Subscribed plan reference
  planStartDate: Date,            // ← When current plan started
  planEndDate: Date,              // ← When current plan expires
  isActive: Boolean,
  createdAt: Date
}
```

---

### 3. 📦 Plan Model (Subscriptions)
```js
{
  name: String,           // e.g. "Basic", "Pro", "Enterprise"
  description: String,    // Short plan description shown on /plans page
  price: Number,          // Monthly price in ₹
  maxListings: Number,    // How many cards subscriber can add
  maxImages: Number,      // Max card images per listing (up to 10)
  maxHsnCodes: Number,    // Max HSN codes per card (null = unlimited)
  features: [String],     // Feature list displayed on /plans page
  isActive: Boolean
}
```

> 💡 **Note:** `startDate` & `endDate` are stored on the **User model** as `planStartDate` and `planEndDate` — tracking when *this user's* subscription starts and expires. The Plan model is just the product definition.


---

## Subscription Tiers

| Plan | Description | Price | Max Cards | Max Images | Max HSN Codes |
|---|---|---|---|---|---|
| **Free** | Try VyapaarBiz with basic features | ₹0 | 1 | 3 | 2 |
| **Basic** | Perfect for small dealers getting started | ₹299/mo | 10 | 5 | 5 |
| **Pro** | For growing businesses with large catalogs | ₹799/mo | 100 | 10 | Unlimited |
| **Enterprise** | Unlimited power for large-scale distributors | ₹1999/mo | Unlimited | 10 | Unlimited |

- Subscribers manage only **their own listings**
- Admin manages **everything**
- Plan limits enforced server-side on every card add/edit

---

## MongoDB Collections Summary

| Collection | Purpose |
|---|---|
| `businesses` | All visiting cards |
| `users` | Subscribers + Admin |
| `plans` | Subscription plan definitions |
| `hsncodes` | HSN code reference master |
| `countries` | Country master (with phoneCode + logo) |
| `states` | State master |
| `cities` | City master |
| `pincodes` | Pincode master |

---

## Pages & Routes

### 🌐 Public Pages
| Route | Page |
|---|---|
| `/` | Home — Search bar, HSN instant search, featured listings |
| `/businesses` | All listings with filters (HSN, city, country) |
| `/business/[slug]` | Full business profile — logo, card images, mobiles array, HSN codes |
| `/search?q=&hsn=&city=` | Search results page |
| `/plans` | Subscription plans page |

### 🔐 Auth Pages
| Route | Page |
|---|---|
| `/login` | Subscriber + Admin login |
| `/register` | New subscriber registration |

### 📊 Subscriber Dashboard
| Route | Page |
|---|---|
| `/dashboard` | My listings overview |
| `/dashboard/add` | Add new business card |
| `/dashboard/edit/[id]` | Edit existing card |
| `/dashboard/plan` | Current plan info + upgrade |

### 🛠️ Admin Panel
| Route | Page |
|---|---|
| `/admin` | Dashboard — total users, listings, plan stats |
| `/admin/businesses` | All listings management |
| `/admin/users` | All subscribers — extend plan dates |
| `/admin/plans` | Create / edit subscription plans |
| `/admin/masters` | Manage Country / State / City / Pincode data |
| `/admin/import` | Bulk CSV import for 100k records |

---

## Key Features

### 🏷️ HSN Code — Instant Suggestions
- As you type an HSN code, a dropdown appears with matching codes + descriptions
- Reference data pre-loaded from standard HSN JSON

### 📱 Multiple Mobile Numbers
- Dynamically add/remove mobile numbers on the card form
- Each number shows country `phoneCode` prefix (e.g. `+91`)

### 🖼️ Card Images — Up to 10
- Upload multiple images per card (product photos / visiting card scans)
- Hosted on Cloudinary, optimized URLs stored in array

### 📥 Bulk Import (Admin)
- Upload CSV/Excel → auto-parse → batch insert to MongoDB
- For onboarding all 100,000 existing records

---

## SEO Strategy
- Dynamic `<title>` and `<meta description>` per business page
- JSON-LD `LocalBusiness` schema markup
- Clean URL slugs: `/business/rajesh-ceramic-tiles-pvt-ltd`
- Auto-generated `sitemap.xml` for all 100k pages
- `robots.txt` configured for full indexing

---

## Build Phases

| Phase | Work |
|---|---|
| **Phase 1** | Next.js init, MongoDB + all Mongoose models, NextAuth, shadcn/ui setup |
| **Phase 2** | Admin Panel — dashboard, user/plan/master management, bulk import |
| **Phase 3** | Subscriber Dashboard — add/edit cards, plan view |
| **Phase 4** | Public Website — home, listing, business profile pages |
| **Phase 5** | SEO — sitemaps, meta tags, JSON-LD, Lighthouse optimization |

---

> [!IMPORTANT]
> **All decisions are locked in. Ready to start Phase 1 — please approve the project initialization command to begin building!**
