"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { NavBar } from "../components/NavBar";
import UserProfile from "../components/UserProfile";

import styles from "./page.module.css";

export default function Profile() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Force a re-render when the component mounts or when the URL changes
    const currentUserId = searchParams.get("userId") ?? "";
    console.log("Profile page - userId changed:", currentUserId);

    if (currentUserId) {
      setUserId(currentUserId);
    } else {
      // If no userId is provided, redirect to the home page
      console.log("No userId provided, redirecting to home");
      router.push("/");
    }

    setIsLoading(false);
  }, [pathname, searchParams, router]);

  // Force a re-render when the component mounts
  useEffect(() => {
    const handleRouteChange = () => {
      console.log("Route changed");
      setIsLoading(true);
    };

    window.addEventListener("popstate", handleRouteChange);

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

  return (
    <div className={styles.profilePage}>
      <NavBar />
      {isLoading ? (
        <div>Loading...</div>
      ) : userId ? (
        <UserProfile key={userId} profileUserId={userId} />
      ) : (
        <div>No user selected</div>
      )}
    </div>
  );
}
