/**
 * ============================================================
 *  SITE CONFIGURATION — Single Source of Truth
 * ============================================================
 *  Change your app name, domain, tagline, and branding here.
 *  Every page across the project imports from this file.
 *
 *  To rename your app for publishing:
 *    1. Update SITE_NAME and SITE_DOMAIN below
 *    2. That's it — the whole app reflects the change ✅
 * ============================================================
 */

/** Display name shown in navbar, footer, meta tags, etc. */
export const SITE_NAME = "VyapaarBiz";

/** Full domain (without protocol) used for sitemap, robots, JSON-LD */
export const SITE_DOMAIN = "vyapaarbiz.com";

/** Full URL with protocol — used in metadata, canonical URLs, etc. */
export const SITE_URL = `https://${SITE_DOMAIN}`;

/** Short tagline shown in meta description and hero badge */
export const SITE_TAGLINE = "Global B2B Business Directory";

/** Default meta description for the app */
export const SITE_DESCRIPTION =
  "Find and connect with verified dealers, manufacturers, and distributors across India and the world. Search by HSN codes, products, location, and more.";

/** SEO keywords */
export const SITE_KEYWORDS = [
  "B2B directory",
  "business directory",
  "HSN code search",
  "dealer directory",
  "ceramic dealers",
];

/** Admin email */
export const ADMIN_EMAIL = `admin@${SITE_DOMAIN}`;

/** Favicon / icon letter (used in generated icon.tsx) */
export const SITE_ICON_LETTER = SITE_NAME.charAt(0).toUpperCase();

/** Copyright text */
export const SITE_COPYRIGHT = (year: number) =>
  `© ${year} ${SITE_NAME}. All rights reserved. | ${SITE_TAGLINE}`;
