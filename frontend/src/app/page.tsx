"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "../contexts/AuthContext";

import LoginForm from "./login/page";

export default function Home() {
  const { loggedIn, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loggedIn) {
      // Redirect based on role:
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
          router.push("/volunteerDashboard");
          break;
        default:
          break;
      }
    }
  }, [loggedIn, role, router]);

  return <>{!loggedIn && <LoginForm />}</>;
}
