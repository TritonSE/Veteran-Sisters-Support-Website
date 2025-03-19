"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

import { useAuth } from "../contexts/AuthContext";

import LoginForm from "./login/page";
import styles from "./page.module.css";

export default function Home() {
  const { loggedIn, role } = useAuth();
  const router = useRouter();
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
          router.push("/volunteerview");
          break;
        default:
          break;
      }
    }
  }, [loggedIn, role, router]);

  return <>{!loggedIn && <LoginForm />}</>;
}
