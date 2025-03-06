import { User, onAuthStateChanged } from "firebase/auth";
import React, { ReactNode, useContext, useEffect, useMemo, useState } from "react";

import { auth } from "../../firebase/firebase";

const getUserId = async (email: string, attempts = 0): Promise<string> => {
  try {
    const response = await fetch(`http://localhost:4000/api/users/id/${encodeURIComponent(email)}`);

    if (response.status === 404 && attempts < 3) {
      console.warn("User record not found");
      await new Promise((resolve) => setTimeout(resolve, 500));
      return getUserId(email, attempts + 1);
    }

    if (!response.ok) {
      throw new Error("Failed to fetch user ID");
    }
    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error("Error fetching user ID:", error);
    return "";
  }
};

type contextType = {
  currentUser: User | undefined | null;
  currentUserId: string;
  loggedIn: boolean;
  loading: boolean;
};

type ProviderProps = {
  children: ReactNode;
};

export const AuthContext = React.createContext<contextType>({
  currentUser: null,
  loggedIn: false,
  loading: false,
  currentUserId: "",
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }: ProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentUserId, setCurrentUserId] = useState(String);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed: ", user);
      if (user) {
        setCurrentUser(user);
        const userId = await getUserId(user.email || "");
        setCurrentUserId(userId);
      } else {
        setCurrentUser(null);
        setCurrentUserId("");
      }
      setLoading(false);
    });
    console.log("Unsubscribe: ", unsubscribe);
    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({ currentUser, loggedIn: !!currentUser, loading, currentUserId }),
    [currentUser, loading],
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
