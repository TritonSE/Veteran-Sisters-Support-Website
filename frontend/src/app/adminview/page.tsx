"use client";

import { NavBar } from "../components/NavBar";
import { UserTable } from "../components/UserTable";

import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <NavBar />
      <div className={styles.page}>
        <div className={styles.frame}>
          <div className={styles.welcome}>
            <span>Welcome, !</span>
          </div>
          <UserTable />
        </div>
      </div>
    </div>
  );
}
