/**
 * 🔗 API ENDPOINTS CONFIGURATION
 * Centralized source of truth for all backend API routes.
 */

export const API_ENDPOINTS = {
  // 💼 Businesses
  BUSINESSES: "/api/businesses",

  // 📍 Location Masters
  MASTERS: {
    COUNTRIES: "/api/masters/countries",
    STATES: "/api/masters/states",
    DISTRICTS: "/api/masters/districts",
    CITIES: "/api/masters/cities",
    PINCODES: "/api/masters/pincodes",
  },

  // 👤 Auth & User
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    ME: "/api/auth/me",
  },

  // 🛡️ Admin
  ADMIN: {
    USERS: "/api/admin/users",
    PLANS: "/api/admin/plans",
  }
};

export default API_ENDPOINTS;
