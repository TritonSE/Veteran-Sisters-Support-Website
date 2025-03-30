"use client";

import { useParams } from "next/navigation";

import UserProfile from "../../components/UserProfile";

import styles from "./page.module.css";

export default function Page() {
    const params = useParams();
  return (
    <div className={styles.profilePage}>
      <UserProfile userId={params.userId as string} />
    </div>
  );
}
