"use client";

import { useSearchParams } from "next/navigation";

import EditProfile from "../../components/EditProfile";

import styles from "./page.module.css";

export default function Page() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") ?? "";
  return (
    <div className={styles.editProfilePage}>
      <EditProfile userId={userId} />
    </div>
  );
}
