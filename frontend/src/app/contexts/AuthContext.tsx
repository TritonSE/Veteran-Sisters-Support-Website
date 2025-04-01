import { User, onAuthStateChanged } from "firebase/auth";
import React, { ReactNode, useContext, useEffect, useMemo, useState } from "react";

import { auth } from "../../../firebase/firebase";

type UserReturn = {
  id: string;
  role: string;
};

type ApiUserResponse = {
  _id: string;
  role: string;
  email: string;
  firstName: string;
  lastName: string;
  address: Record<string, unknown>;
  roleSpecificInfo: Record<string, unknown>;
};

const getUserIdAndRole = async (email: string): Promise<UserReturn> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
    console.log(`Fetching user data for email: ${email} from ${apiUrl}`);

    const response = await fetch(`${apiUrl}/api/users/email/${encodeURIComponent(email)}`);

    if (response.status === 404) {
      console.log(`User not found for email: ${email}`);
      return { id: "", role: "" };
    }

    if (!response.ok) {
      console.error(
        `Failed to fetch user ID. Status: ${String(response.status)}, Status Text: ${response.statusText}`,
      );
      throw new Error(`Failed to fetch user ID: ${String(response.status)} ${response.statusText}`);
    }

    const data = (await response.json()) as ApiUserResponse;
    console.log(`Successfully fetched user data:`, data);
    return {
      id: data._id,
      role: data.role,
    };
  } catch (error) {
    console.error("Error fetching user ID:", error);
    return { id: "", role: "" };
  }
};

type AuthContextType = {
  user: User | null;
  userId: string;
  userRole: string;
  loading: boolean;
  loggedIn: boolean;
};

const AuthContext = React.createContext<AuthContextType>({
  user: null,
  userId: "",
  userRole: "",
  loading: true,
  loggedIn: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState("");
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Firebase auth state changed:", currentUser?.email);
      setUser(currentUser);
      if (currentUser?.email) {
        // Only make the API request if the user is signed in with Firebase
        void getUserIdAndRole(currentUser.email).then(({ id, role }) => {
          console.log("Setting user data:", { id, role });
          setUserId(id);
          setUserRole(role);
          setLoading(false);
        });
      } else {
        // If no user is signed in, reset the state
        console.log("No user email available, resetting state");
        setUserId("");
        setUserRole("");
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const value = useMemo(() => {
    console.log("AuthContext value:", { user: user?.email, userId, userRole, loading });
    return {
      user,
      userId,
      userRole,
      loading,
      loggedIn: !!user,
    };
  }, [user, userId, userRole, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
