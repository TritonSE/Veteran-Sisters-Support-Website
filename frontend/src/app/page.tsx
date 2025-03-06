"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuth } from "../contexts/AuthContext";

import LoginForm from "./login/page";

const getUserRole = async (email: string, attempts = 0): Promise<string> => {
  try {
    const response = await fetch(
      `http://localhost:4000/api/users/role/${encodeURIComponent(email)}`,
    );

    if (response.status === 404 && attempts < 3) {
      console.warn("User record not found");
      await new Promise((resolve) => setTimeout(resolve, 500));
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

export default function Home() {
  const { loggedIn, currentUserId } = useAuth();
  const router = useRouter();
  const [role, setRole] = useState("");

  useEffect(() => {
    if (loggedIn && currentUserId) {
      getUserRole(currentUserId).then(setRole);
    }
  }, [loggedIn, currentUserId]);

  useEffect(() => {
    if (loggedIn) {
      switch (role) {
        case "admin":
          router.push("/adminview");
          break;
        case "staff":
          router.push("/staffview");
          break;
        case "veteran":
          router.push("/veteranDashboard");
          break;
        case "volunteer":
          router.push("/veteranDashboard"); // change after volunteer dashboard is merged
          break;
        default:
          break;
      }
    }
  }, [loggedIn, role, router]);

  return <>{!loggedIn && <LoginForm />}</>;
}
