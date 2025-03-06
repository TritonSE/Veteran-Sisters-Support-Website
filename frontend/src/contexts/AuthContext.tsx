import { User, onAuthStateChanged } from "firebase/auth";
import React, { ReactNode, useContext, useEffect, useMemo, useState } from "react";

import { auth } from "../../firebase/firebase";
import { User as UserType } from "../app/api/users";

const getUserRole = async (email: string, attempts = 0): Promise<UserType> => {
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
    const data = (await response.json()) as UserType;
    console.log(data);
    return data;
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
  const [mongoId, setMongoId] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed: ", user);
      if (user) {
        setCurrentUser(user);
        const currUser = await getUserRole(user.email || "");
        setRole(currUser.role);
        setMongoId(currUser._id);
      } else {
        setCurrentUser(null);
        setRole("");
        setMongoId("");
      }
      setLoading(false);
    });
    console.log("Unsubscribe: ", unsubscribe);
    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({ currentUser, loggedIn: !!currentUser, loading, role, mongoId }),
    [currentUser, loading, role, mongoId],
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
