import { BASE_URL } from "@/core/api/constant";

export const logoutService = async (): Promise<{ success: boolean; error?: string }> => {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    // If no refresh token, we can't invalidate it on the server,
    // but we can still log out the user locally.
    localStorage.clear();
    return { success: true };
  }

  try {
    const response = await fetch(`${BASE_URL}/logout/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `Request failed with status ${response.status}`);
    }

    // Clear all user data from storage upon successful logout
    localStorage.clear();

    return { success: true };

  } catch (error) {
    console.error("Logout service error:", error);
    // Even if the server call fails, clear local data to log the user out on the client-side.
    localStorage.clear();
    // We can return success as the user is logged out from the client perspective,
    // or return an error to let the caller know the server part failed.
    // Let's return error to be more informative.
    return { success: false, error: (error as Error).message };
  }
};
