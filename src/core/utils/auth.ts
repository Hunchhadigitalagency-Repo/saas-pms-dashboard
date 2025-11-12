import { BASE_URL } from "../api/constant";

/**
 * Checks the authentication status of the user.
 *
 * @returns {Promise<boolean>} - A promise that resolves to true if the user is authenticated, false otherwise.
 */
export const checkAuthStatus = async (): Promise<boolean> => {
  const accessToken = localStorage.getItem("accessToken");
  console.error("Access Token:", accessToken);

  if (!accessToken) {
    const refreshToken = localStorage.getItem("refreshToken");
    console.log("Refresh Token:", refreshToken);
    if (!refreshToken) {
      return false; // No tokens, not authenticated
    }
    return await refreshTokenAndRedirect();
  }

  try {
    const response = await fetch(`${BASE_URL}/token/verify/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: accessToken }),
    });

    if (response.ok) {
      return true; // Access token is valid
    } else {
      return await refreshTokenAndRedirect();
    }
  } catch (error) {
    console.error("Error verifying access token:", error);
    return await refreshTokenAndRedirect();
  }
};

const refreshTokenAndRedirect = async (): Promise<boolean> => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    return false; // No refresh token, cannot refresh
  }

  try {
    const response = await fetch(`${BASE_URL}/token/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (response.ok) {
      const { access } = await response.json();
      localStorage.setItem("accessToken", access);
      return true; // Token refreshed successfully
    } else {
      // If refresh fails, clear tokens
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return false;
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    return false;
  }
};