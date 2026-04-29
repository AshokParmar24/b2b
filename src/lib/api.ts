import axios from "axios";
import { toast } from "react-hot-toast";

/**
 * 🛠️ COMMON API SERVICE
 * Centralized axios instance with interceptors for error handling and standard responses.
 */

const apiClient = axios.create({
  baseURL: "", // Use empty base for relative paths starting with /
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.response?.data?.error || "An unexpected error occurred";
    
    // Don't toast for 404 on GET requests (handled locally by pages)
    if (!(error.config.method === "get" && error.response?.status === 404)) {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

export const api = {
  get: <T>(url: string, config?: any) => apiClient.get<any, T>(url, config),
  post: <T>(url: string, data?: any, config?: any) => apiClient.post<any, T>(url, data, config),
  put: <T>(url: string, data?: any, config?: any) => apiClient.put<any, T>(url, data, config),
  patch: <T>(url: string, data?: any, config?: any) => apiClient.patch<any, T>(url, data, config),
  delete: <T>(url: string, config?: any) => apiClient.delete<any, T>(url, config),
};

export default api;
