"use client";

import Image from "next/image";
import React from "react";

import styles from "./page.module.css";

export default function LoginForm() {
  // const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {

  // }
  return (
    <main className={styles.page}>
      <div className={styles.form}>
        <div className={styles.titleBar}>
          <Image
            id="logo"
            width={142.288}
            height={16.66}
            src="Logo.svg"
            alt=""
            style={{ objectFit: "contain" }}
          ></Image>
        </div>
        <div className={styles.subtitle}>Sign in to your account</div>
        <form className={styles.innerForm} id="contactForm">
          <label htmlFor="email">Email</label>
          <input type="text" id="email" className={styles.input} required></input>
          <label htmlFor="password">Password</label>
          <input type="text" id="password" className={styles.input} required></input>
        </form>
      </div>
    </main>
  );
}
