import { User, onAuthStateChanged } from "firebase/auth";
import React, { ReactNode, useContext, useEffect, useMemo, useState } from "react";

import { auth } from "../../firebase/firebase";

type contextType = {
  currentUser: User | undefined | null;
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
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }: ProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed: ", user);
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    console.log("Unsubscribe: ", unsubscribe);
    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({ currentUser, loggedIn: !!currentUser, loading }),
    [currentUser, loading],
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
