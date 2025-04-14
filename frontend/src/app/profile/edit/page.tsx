"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import EditProfile from "../../components/EditProfile";
import { AuthContextWrapper } from "../../contexts/AuthContextWrapper";

import styles from "./page.module.css";

function EditProfileWrapper() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") ?? "";
  return (
    <div className={styles.editProfilePage}>
      <EditProfile userId={userId} />
    </div>
  );
}

export default function Page() {
  return (
    <AuthContextWrapper>
      <Suspense fallback={<div>Loading...</div>}>
        <EditProfileWrapper />
      </Suspense>
    </AuthContextWrapper>
  );
}
