"use client";

// import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { ActivitiesTable } from "../components/ActivitiesTable";
import { ActivityDetail } from "../components/ActivityDetail";
import { NavBar } from "../components/NavBar";
import { useAuth } from "../contexts/AuthContext";
import { AuthContextWrapper } from "../contexts/AuthContextWrapper";

import styles from "./page.module.css";

type ActivitiesContentProp = {
  userId: string;
  userRole: string;
};

function ActivitiesContent({ userId, userRole }: ActivitiesContentProp) {
  const searchParams = useSearchParams();
  const activityId = searchParams.get("activityId") ?? "";
  return (
    <div className={styles.container}>
      <NavBar />
      <div className={styles.page}>
        <div className={styles.frame}>
          {activityId ? (
            <ActivityDetail activityId={activityId} />
          ) : (
            <ActivitiesTable userId={userId} role={userRole} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function ActivitiesPage() {
  const { userId, userRole } = useAuth();
  return (
    <AuthContextWrapper>
      <Suspense fallback={<div>Loading...</div>}>
        <ActivitiesContent userId={userId} userRole={userRole} />
      </Suspense>
    </AuthContextWrapper>
  );
}
