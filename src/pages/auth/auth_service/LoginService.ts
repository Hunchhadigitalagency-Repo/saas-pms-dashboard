import { BASE_URL } from "@/core/api/constant";

// --- Interfaces for the Login Response ---
interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

interface Profile {
  profile_picture: string | null;
}

interface Client {
  name: string;
  schema_name: string;
}

interface Domain {
  domain: string;
  is_primary: boolean;
}

interface LoginResponse {
  user: User;
  profile: Profile | null;
  client: Client;
  domains: Domain;
  user_role: string;
  // NOTE: Tokens are NO LONGER in the response body!
  // They are automatically set as HttpOnly cookies by the server
}

// --- Interface for the credentials sent to the service ---
interface LoginCredentials {
  email: string;
  password: string;
}

// --- The Login Service Function ---
export const loginService = async (
  credentials: LoginCredentials
): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch(`${BASE_URL}/login/email/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Important: include cookies with request
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || errorData.error || `Request failed with status ${response.status}`);
    }

    const data: LoginResponse = await response.json();

    // Clear old data and store only non-sensitive user data in localStorage
    localStorage.clear();
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("profile", JSON.stringify(data.profile));
    localStorage.setItem("client", JSON.stringify(data.client));
    localStorage.setItem("domains", JSON.stringify(data.domains));
    localStorage.setItem("userRole", data.user_role);

    // DO NOT store tokens in localStorage anymore!
    // Tokens are now automatically set as HttpOnly cookies by the server
    // The browser handles them automatically and they cannot be accessed by JavaScript

    return { success: true };

  } catch (error) {
    console.error("Login service error:", error);
    // Ensure local storage is cleared on failed login
    localStorage.clear();
    return { success: false, error: (error as Error).message };
  }
};