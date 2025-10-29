"use client";

import Image from "next/image";

import styles from "./page.module.css";

export default function Loading() {
  return (
    <main className={styles.page}>
      <div className={styles.formContainer}>
        <div className={styles.titleBar}>
          <Image
            id="logo"
            width={142.288}
            height={16.66}
            src="/logo.svg"
            alt="logo"
            style={{ objectFit: "contain" }}
          />
        </div>
        <div className={styles.spinner} />
        <div className={styles.loadingText}>
          <h1>Account created successfully!</h1>
          <p>We&apos;re taking you to the portal...</p>
        </div>
      </div>
    </main>
  );
}
