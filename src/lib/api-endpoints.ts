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
    HSN: "/api/masters/hsn",
  },

  // 👤 Auth & User
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    ME: "/api/auth/me",
  },
  
  // 🔔 Notifications
  NOTIFICATIONS: {
    BASE: "/api/notifications",
    MARK_ALL_READ: "/api/notifications/mark-all-read",
  },

  // 🛡️ Admin
  ADMIN: {
    USERS: "/api/admin/users",
    PLANS: "/api/admin/plans",
  }
};

export default API_ENDPOINTS;
