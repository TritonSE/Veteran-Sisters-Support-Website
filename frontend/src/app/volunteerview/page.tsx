"use client";

import { NavBar } from "../components/NavBar";
import { VeteranList } from "../components/VeteranList";

import styles from "./page.module.css";

export default function StaffDashboard() {
  return (
    <div className={styles.container}>
      <NavBar />
      <div className={styles.page}>
        <div className={styles.frame}>
          <div className={styles.welcome}>
            <span>Welcome, !</span>
          </div>
          <VeteranList volunteerId="67aee20f06f004ded2926e23" />
        </div>
      </div>
    </div>
  );
}
