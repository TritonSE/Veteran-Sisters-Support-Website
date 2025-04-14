"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { NavBar } from "../components/NavBar";
import UserProfile from "../components/UserProfile";
import { AuthContextWrapper } from "../contexts/AuthContextWrapper";

import styles from "./page.module.css";

function ProfileContent() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") ?? "";
  return (
    <div className={styles.profilePage}>
      <NavBar />
      <UserProfile key={userId} profileUserId={userId} />
    </div>
  );
}

export default function Profile() {
  return (
    <AuthContextWrapper>
      <Suspense fallback={<div>Loading...</div>}>
        <ProfileContent />
      </Suspense>
    </AuthContextWrapper>
  );
}
