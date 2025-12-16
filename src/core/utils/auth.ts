import { BASE_URL } from "../api/constant";

/**
 * Checks the authentication status of the user.
 * With cookie-based auth, we verify the token with the backend.
 * The token is automatically included in cookies by the browser.
 *
 * @returns {Promise<boolean>} - true if authenticated, false otherwise
 */
export const checkAuthStatus = async (): Promise<boolean> => {
  // First, check if user data exists in localStorage
  const user = localStorage.getItem("user");
  if (!user) {
    return false; // No user data stored
  }

  try {
    // Verify the access token cookie with backend
    // The cookie is automatically included due to credentials: 'include'
    // No need to manually send token - it's in the cookie!
    const response = await fetch(`${BASE_URL}/token/verify/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Important: include cookies
      body: JSON.stringify({}), // Empty body - token is in cookie
    });

    if (response.ok) {
      return true; // Token is valid
    } else {
      // Token invalid or expired, clear user data
      // localStorage.clear();
      return false;
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    localStorage.clear();
    return false;
  }
};