/**
 * 🗺️ PROJECT ROUTES ENUM
 * Centralized source of truth for all navigation paths.
 */
export enum AppRoutes {
  // 🌐 Public Routes
  HOME = "/",               // Main landing page & hero section
  LOGIN = "/login",         // User authentication - Sign In
  REGISTER = "/register",   // New user onboarding - Sign Up
  PLANS = "/plans",         // Public subscription tiers & pricing
  BUSINESSES = "/businesses",// Public business directory search

  // 👤 Customer Dashboard Routes
  DASHBOARD = "/dashboard", // Customer overview & personal settings
  
  // 🛡️ Admin Panel Routes
  ADMIN_DASHBOARD = "/admin",       // Admin system overview & analytics
  ADMIN_USERS = "/admin/users",     // User management & role assignment
  ADMIN_PLANS = "/admin/plans",     // Subscription plan configuration
  ADMIN_PLANS_ADD = "/admin/plans/add",
  ADMIN_PLANS_EDIT = "/admin/plans/edit",
  ADMIN_IMPORT = "/admin/import",   // Bulk data processing & imports

  // 📍 Location Masters (Admin Only)
  ADMIN_MASTERS = "/admin/masters",           // Overview of all location masters
  ADMIN_MASTERS_COUNTRIES = "/admin/masters/countries", // Country listing & search
  ADMIN_MASTERS_COUNTRIES_ADD = "/admin/masters/countries/add", // Create new country
  ADMIN_MASTERS_COUNTRIES_EDIT = "/admin/masters/countries/edit", // Edit existing country (base path)

  ADMIN_MASTERS_STATES = "/admin/masters/states",
  ADMIN_MASTERS_STATES_ADD = "/admin/masters/states/add",
  ADMIN_MASTERS_STATES_EDIT = "/admin/masters/states/edit",

  ADMIN_MASTERS_DISTRICTS = "/admin/masters/districts",
  ADMIN_MASTERS_DISTRICTS_ADD = "/admin/masters/districts/add",
  ADMIN_MASTERS_DISTRICTS_EDIT = "/admin/masters/districts/edit",

  ADMIN_MASTERS_CITIES = "/admin/masters/cities",
  ADMIN_MASTERS_CITIES_ADD = "/admin/masters/cities/add",
  ADMIN_MASTERS_CITIES_EDIT = "/admin/masters/cities/edit",

  ADMIN_MASTERS_PINCODES = "/admin/masters/pincodes",
  ADMIN_MASTERS_PINCODES_ADD = "/admin/masters/pincodes/add",
  ADMIN_MASTERS_PINCODES_EDIT = "/admin/masters/pincodes/edit",
}
