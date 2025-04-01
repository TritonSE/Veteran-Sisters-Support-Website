import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

import { useAuth } from "./AuthContext";

type AuthContextWrapperProps = {
  children: ReactNode;
};

const PUBLIC_PATHS = ["/login", "/signup"];

export function AuthContextWrapper({ children }: AuthContextWrapperProps) {
  const { loggedIn, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't redirect while loading
    if (loading) return;

    // Allow access to public paths
    if (PUBLIC_PATHS.includes(pathname)) return;

    // Redirect to login if not logged in
    if (!loggedIn) {
      console.log("User not logged in, redirecting to login");
      router.push("/login");
    }
  }, [loggedIn, loading, pathname, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}
