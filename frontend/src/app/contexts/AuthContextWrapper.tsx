import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

import { useAuth } from "./AuthContext";

type AuthContextWrapperProps = {
  children: ReactNode;
};

export function AuthContextWrapper({ children }: AuthContextWrapperProps) {
  const { loggedIn, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Don't redirect while loading
    if (loading) return;

    // This is a protected route wrapper, so we don't need to check for public paths
    // If user is not logged in, redirect to login
    if (!loggedIn) {
      router.push("/login");
    }
  }, [loggedIn, loading, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  // Only render children if user is logged in
  return loggedIn ? <>{children}</> : null;
}
