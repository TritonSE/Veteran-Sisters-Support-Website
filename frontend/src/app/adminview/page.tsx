"use client";

import { AdminStaffUserTable } from "../components/AdminStaffUserTable";
import { NavBar } from "../components/NavBar";

import styles from "./page.module.css";

export default function AdminDashboard() {
  return (
    <div className={styles.container}>
      <NavBar />
      <div className={styles.page}>
        <div className={styles.frame}>
          <div className={styles.welcome}>
            <span>Welcome, !</span>
          </div>
          <AdminStaffUserTable />
        </div>
      </div>
    </div>
  );
}
