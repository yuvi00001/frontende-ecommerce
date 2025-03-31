import axios from "axios";
import { auth } from "../firebase/config";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
});

// Request interceptor to add Firebase token
api.interceptors.request.use(
  async (config) => {
    // Skip token for public endpoints
    if (
      config.url.includes("/products") && 
      (config.method === "get" || config.method === "GET") &&
      !config.url.includes("/products/admin")
    ) {
      return config;
    }

    try {
      // Get current Firebase user
      const currentUser = auth.currentUser;
      
      if (currentUser) {
        // Get fresh Firebase token
        const firebaseToken = await currentUser.getIdToken(true);
        config.headers.Authorization = `Bearer ${firebaseToken}`;
      }
    } catch (error) {
      console.error("Failed to get Firebase token:", error);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 error and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Force refresh the Firebase token
        const currentUser = auth.currentUser;
        if (currentUser) {
          const newToken = await currentUser.getIdToken(true);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // If refresh fails, redirect to login
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api; 