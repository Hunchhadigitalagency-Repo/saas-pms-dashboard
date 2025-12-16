import axios from 'axios';
import { BASE_URL } from './constant';

/**
 * Configured axios instance for API calls with cookie-based authentication.
 * 
 * Key settings:
 * - withCredentials: true - Ensures cookies are sent with every request
 * - baseURL: Set to BASE_URL for relative URLs
 * 
 * The backend sets HttpOnly cookies during login.
 * This configuration ensures those cookies are automatically sent with every request.
 */
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Include credentials (cookies) with every request
});

// Response interceptor for global error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      if (status === 401) {
        console.error("Authentication failed - redirecting to login");
        // Clear local storage and redirect to login
        localStorage.clear();
        window.location.href = "/login";
      } else if (status === 403) {
        console.error("Access forbidden - insufficient permissions");
      } else if (status >= 500) {
        console.error("Server error:", error.response.statusText);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
