"use client";
import { NavBar } from "./components/NavBar";
import { VeteranDashboard } from "./components/VeteranDashboard";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <NavBar />
      <VeteranDashboard />
    </div>
  );
}
