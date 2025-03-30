"use client";

import { useParams } from "next/navigation";

import EditProfile from "../../../components/EditProfile";

import styles from "./page.module.css";

export default function Page() {
    const params = useParams();
  return (
    <div className={styles.editProfilePage}>
      <EditProfile userId={params.userId as string} />
    </div>
  );
}
