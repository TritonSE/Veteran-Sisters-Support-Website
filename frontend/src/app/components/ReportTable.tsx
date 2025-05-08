"use client";

import styles from "./ReportTable.module.css";

export default function ReportTable() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span>Past Reports</span>
      </div>
      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <div className={styles.date}>
            <span>Date</span>
          </div>
          <div className={styles.reportAgainst}>
            <span>Report against</span>
          </div>
          <div className={styles.situationType}>
            <span>Type of Situation</span>
          </div>
          <div className={styles.status}>
            <span>Status</span>
          </div>
        </div>
      </div>
    </div>
  );
}
