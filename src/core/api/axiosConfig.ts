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

export default axiosInstance;
