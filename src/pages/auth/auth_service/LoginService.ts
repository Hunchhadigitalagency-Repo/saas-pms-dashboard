import { BASE_URL } from "@/core/api/constant";

// --- Interfaces for the Login Response ---
interface User {
  email: string;
  first_name: string;
  last_name: string;
}

interface Profile {
  profile_picture: string;
}

interface Client {
  name: string;
  schema_name: string;
}

interface Domain {
  domain: string;
  is_primary: boolean;
}

interface Tokens {
  refresh: string;
  access: string;
}

interface LoginResponse {
  user: User;
  profile: Profile;
  client: Client;
  domains: Domain;
  user_role: string;
  tokens: Tokens;
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
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `Request failed with status ${response.status}`);
    }

    const data: LoginResponse = await response.json();

    // Clear old data and store new data in localStorage
    localStorage.clear();
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("profile", JSON.stringify(data.profile));
    localStorage.setItem("client", JSON.stringify(data.client));
    localStorage.setItem("domains", JSON.stringify(data.domains));
    localStorage.setItem("userRole", data.user_role);
    localStorage.setItem("accessToken", data.tokens.access);
    localStorage.setItem("refreshToken", data.tokens.refresh);

    return { success: true };

  } catch (error) {
    console.error("Login service error:", error);
    // Ensure local storage is cleared on failed login
    localStorage.clear();
    return { success: false, error: (error as Error).message };
  }
};