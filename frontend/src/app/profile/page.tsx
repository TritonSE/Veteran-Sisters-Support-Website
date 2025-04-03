"use client";

import { useSearchParams } from "next/navigation";

import { NavBar } from "../components/NavBar";
import UserProfile from "../components/UserProfile";

import styles from "./page.module.css";

export default function Profile() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") ?? "";
  return (
    <div className={styles.profilePage}>
      <NavBar />
      <UserProfile profileUserId={userId} />
    </div>
  );
}
