import { User, onAuthStateChanged } from "firebase/auth";
import React, { ReactNode, useContext, useEffect, useMemo, useState } from "react";

import { auth } from "../../firebase/firebase";

const getUserRole = async (email: string, attempts = 0): Promise<string> => {
  try {
    const response = await fetch(
      `http://localhost:4000/api/users/role/${encodeURIComponent(email)}`,
    );

    if (response.status === 404 && attempts < 3) {
      console.warn("User record not found, retrying...");
      await new Promise((resolve) => setTimeout(resolve, 500)); // wait 500ms
      return getUserRole(email, attempts + 1);
    }

    if (!response.ok) {
      throw new Error("Failed to fetch user role");
    }
    const data = await response.json();
    console.log(data);
    return data.role;
  } catch (error) {
    console.error("Error fetching user role:", error);
    return "";
  }
};

type contextType = {
  currentUser: User | undefined | null;
  loggedIn: boolean;
  loading: boolean;
  role: string;
};

type ProviderProps = {
  children: ReactNode;
};

export const AuthContext = React.createContext<contextType>({
  currentUser: null,
  loggedIn: false,
  loading: false,
  role: "",
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }: ProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed: ", user);
      if (user) {
        setCurrentUser(user);
        const userRole = await getUserRole(user.email || "");
        setRole(userRole);
      } else {
        setCurrentUser(null);
        setRole("");
      }
      setLoading(false);
    });
    console.log("Unsubscribe: ", unsubscribe);
    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({ currentUser, loggedIn: !!currentUser, loading, role }),
    [currentUser, loading, role],
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
