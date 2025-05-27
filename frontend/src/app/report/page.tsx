"use client";

import { useRouter } from "next/navigation";
import { Suspense } from "react";

import { Button } from "../components/Button";
import { NavBar } from "../components/NavBar";
import ReportTable from "../components/ReportTable";
import { useAuth } from "../contexts/AuthContext";
import { AuthContextWrapper } from "../contexts/AuthContextWrapper";

import styles from "./page.module.css";

function ReportContent() {
  const { userRole } = useAuth();
  const router = useRouter();
  return (
    <div className={styles.container}>
      <NavBar />
      <div className={styles.page}>
        <div className={styles.frame}>
          <p className={styles.header}>Report</p>
          <p className={styles.subtitle}>
            {userRole === "volunteer"
              ? "If you are encountering a problem with your veteran, file a report below to the admins. The admin will get back to you as soon as possible."
              : "If you are encountering a problem with your volunteer, file a report below to the admins. The admin will get back to you as soon as possible."}
          </p>
          <Button
            type="button"
            label={"File a report"}
            filled={true}
            className={styles.reportButton}
            onClick={() => {
              router.push("/report/reportform");
            }}
          ></Button>
          <div className={styles.spacing}></div>
          <ReportTable />
        </div>
      </div>
    </div>
  );
}

export default function ReportPage() {
  const { userRole } = useAuth();
  return (
    <AuthContextWrapper>
      <Suspense fallback={<div>Loading...</div>}>
        {userRole === "veteran" || userRole === "volunteer" ? (
          <ReportContent />
        ) : (
          <div className={styles.page}>
            <NavBar />
            <h1>Error: Invalid Permissions</h1>
          </div>
        )}
      </Suspense>
    </AuthContextWrapper>
  );
}
