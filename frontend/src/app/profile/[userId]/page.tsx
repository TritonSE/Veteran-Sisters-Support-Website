"use client";

import { useParams } from "next/navigation";

import { NavBar } from "../../components/NavBar";
import UserProfile from "../../components/UserProfile";

import styles from "./page.module.css";

export default function Page() {
  const params = useParams();
  return (
    <div className={styles.profilePage}>
      <NavBar />
      <UserProfile profileUserId={params.userId as string} />
    </div>
  );
}
