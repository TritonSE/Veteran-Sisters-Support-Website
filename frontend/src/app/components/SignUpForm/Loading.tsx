"use client";

import Image from "next/image";

import styles from "./page.module.css";

// Changed from success to creating... as this shows up even if the user creation fails lol
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
          <h1>Creating your account...</h1>
          <p>Please wait while we set up your account.</p>
        </div>
      </div>
    </main>
  );
}
