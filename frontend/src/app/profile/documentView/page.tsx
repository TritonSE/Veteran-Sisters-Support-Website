"use client";
import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";

import { DocumentProfileView } from "../../components/DocumentProfileView";
import { AuthContextWrapper } from "../../contexts/AuthContextWrapper";

import styles from "./page.module.css";

function ProfileDocWrapper() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") ?? "";

  return (
    <div className={styles.documentView}>
      <DocumentProfileView profileId={userId} />
    </div>
  );
}

export default function Page() {
  return (
    <AuthContextWrapper>
      <Suspense fallback={<div>Loading...</div>}>
        <ProfileDocWrapper />
      </Suspense>
    </AuthContextWrapper>
  );
}
