import { BASE_URL } from "../api/constant";
import { checkAuthStatus } from "./auth";

interface UserProfile {
  profile_picture: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  profile: UserProfile;
}

/**
 * Fetches the list of users associated with the current user's workspace.
 *
 * @returns {Promise<User[] | null>} - A promise that resolves to an array of users or null if an error occurs.
 */
export const getMyClientUsers = async (): Promise<User[] | null> => {
  try {
    const response = await fetch(`${BASE_URL}/my-client-users/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Authorization header no longer needed - token is in HttpOnly cookie
      },
      credentials: "include", // Include cookies with request
    });

    if (response.status === 401) {
      checkAuthStatus();
    }

    if (response.ok) {
      const data: User[] = await response.json();
      return data;
    } else {
      console.error("Failed to fetch clients:", response.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error fetching clients:", error);
    return null;
  }
};
