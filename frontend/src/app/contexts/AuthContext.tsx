import { User, onAuthStateChanged } from "firebase/auth";
import React, { ReactNode, useContext, useEffect, useMemo, useState } from "react";

import { auth } from "../../firebase/firebase";
import { setCurrentUserInfo } from "../api/authHeaders";
import { get } from "../api/requests";
import ErrorMessage from "../components/ErrorMessage";

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
  const response = await get(`/users/email/${encodeURIComponent(email)}`);

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status.toString()}`);
  }

  if (response.status === 404) {
    console.log(`User not found for email: ${email}`);
    return { id: "", role: "" };
  }

  const data = (await response.json()) as ApiUserResponse;
  return {
    id: data._id,
    role: data.role,
  };
};

type AuthContextType = {
  user: User | null;
  userId: string;
  userRole: string;
  loading: boolean;
  loggedIn: boolean;
  isSigningUp: boolean;
  setIsSigningUp: (value: boolean) => void;
};

const AuthContext = React.createContext<AuthContextType>({
  user: null,
  userId: "",
  userRole: "",
  loading: true,
  loggedIn: false,
  isSigningUp: false,
  setIsSigningUp: () => {
    console.warn("setIsSigningUp called outside of AuthProvider");
  },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState("");
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser?.email && !isSigningUp) {
        // Only make the API request if the user is signed in with Firebase and not signing up
        getUserIdAndRole(currentUser.email)
          .then(({ id, role }) => {
            setUserId(id);
            setUserRole(role);
            setLoading(false);
            // Update the auth headers with the current user info
            setCurrentUserInfo(id, role);
          })
          .catch((error: unknown) => {
            setErrorMessage(`Unable to fetch current user: ${String(error)}`);
          });
      } else {
        // If no user is signed in or is signing up, reset the state
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
  }, [isSigningUp]);

  const value = useMemo(() => {
    return {
      user,
      userId,
      userRole,
      loading,
      loggedIn: !!user,
      isSigningUp,
      setIsSigningUp,
    };
  }, [user, userId, userRole, loading, isSigningUp, setIsSigningUp]);

  return (
    <AuthContext.Provider value={value}>
      {children}
      {errorMessage ? <ErrorMessage message={errorMessage} /> : null}
    </AuthContext.Provider>
  );
};
