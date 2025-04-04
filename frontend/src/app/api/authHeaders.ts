import { auth } from "../../../firebase/firebase";

// Store the current user's MongoDB ID and role
let currentUserId = "";
let currentUserRole = "";

/**
 * Set the current user's MongoDB ID and role
 * This should be called whenever the user's information changes in the AuthContext
 */
export const setCurrentUserInfo = (userId: string, userRole: string): void => {
  currentUserId = userId;
  currentUserRole = userRole;
};

/**
 * Get the current Firebase auth token
 * @returns The current Firebase auth token or null if not available
 */
export const getAuthToken = async (): Promise<string | null> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return null;
    }
    return await currentUser.getIdToken();
  } catch (error) {
    console.error("Error getting auth token:", error);
    return null;
  }
};

/**
 * Get the headers that should be included with every API request
 * @returns An object containing the auth headers
 */
export const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const token = await getAuthToken();
  const headers: Record<string, string> = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (currentUserId) {
    headers["X-User-ID"] = currentUserId;
  }

  if (currentUserRole) {
    headers["X-User-Role"] = currentUserRole;
  }

  return headers;
};
