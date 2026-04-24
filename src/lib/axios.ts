import axios from "axios";

const api = axios.create({
  baseURL: "/api", // Base URL for all API calls
  headers: {
    "Content-Type": "application/json",
  },
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    // You can add logic here to attach tokens if needed
    // const token = localStorage.getItem("token");
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle global error codes like 401 (Unauthorized)
    if (error.response?.status === 401) {
      // Global logic for session expiry could go here
    }
    
    // Transform the error so it's easier to handle in components
    const message = error.response?.data?.error || error.message || "An unexpected error occurred";
    return Promise.reject({ ...error, message });
  }
);

export default api;
