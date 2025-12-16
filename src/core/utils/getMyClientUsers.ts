import axios from "axios";
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
    const url = `${BASE_URL}/my-client-users/`;
    const response = await axios.get<User[]>(url, {
      withCredentials: true, // Include cookies with request
    });

    return response.data;
  } catch (error) {
    // Axios throws errors for non-2xx status codes
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        console.error("Authentication failed - cookies may not be set or expired");
        checkAuthStatus();
      } else {
        console.error("Failed to fetch clients:", error.response?.statusText || error.message);
      }
    } else {
      console.error("Error fetching clients:", error);
    }
    return null;
  }
};
