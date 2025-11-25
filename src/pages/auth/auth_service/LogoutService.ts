import { BASE_URL } from "@/core/api/constant";

export const logoutService = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    // Call logout endpoint - cookies are automatically included by the browser
    const response = await fetch(`${BASE_URL}/logout/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Important: include cookies so backend can identify user
    });

    // Clear all user data from storage
    localStorage.clear();

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `Request failed with status ${response.status}`);
    }

    return { success: true };

  } catch (error) {
    console.error("Logout service error:", error);
    // Even if the server call fails, clear local data to log the user out on the client-side
    localStorage.clear();
    return { success: false, error: (error as Error).message };
  }
};
