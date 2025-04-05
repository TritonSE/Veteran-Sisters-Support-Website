import { User, onAuthStateChanged } from "firebase/auth";
import React, { ReactNode, useContext, useEffect, useMemo, useState } from "react";

import { auth } from "../../../firebase/firebase";
import { setCurrentUserInfo } from "../api/authHeaders";
import { get } from "../api/requests";

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
    const response = await get(`/users/email/${encodeURIComponent(email)}`);

    if (response.status === 404) {
      console.log(`User not found for email: ${email}`);
      return { id: "", role: "" };
    }

    const data = (await response.json()) as ApiUserResponse;
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
      setUser(currentUser);
      if (currentUser?.email) {
        // Only make the API request if the user is signed in with Firebase
        void getUserIdAndRole(currentUser.email).then(({ id, role }) => {
          setUserId(id);
          setUserRole(role);
          setLoading(false);
          // Update the auth headers with the current user info
          setCurrentUserInfo(id, role);
        });
      } else {
        // If no user is signed in, reset the state
        console.log("No user email available, resetting state");
        setUserId("");
        setUserRole("");
        setLoading(false);
        // Clear the auth headers
        setCurrentUserInfo("", "");
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const value = useMemo(() => {
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
