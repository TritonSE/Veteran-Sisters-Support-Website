"use client";

import React from "react";

import styles from "./page.module.css";

import { Button } from "@/components/Button";
import "@fontsource/albert-sans";

export default function LoginForm() {
  // const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {

  // }
  return (
    <main className={styles.page}>
      <div className={styles.form}>
        <div className={styles.subtitle}>Log in to your account</div>
        <form className={styles.innerForm} id="contactForm">
          <label htmlFor="email" className={styles.formEntry}>
            Email
          </label>
          <a style={{ color: "#B80037" }}> *</a>
          <input type="text" id="email" className={styles.input} required></input>
          <label htmlFor="password" className={styles.formEntry}>
            Password
            <a style={{ color: "#B80037" }}> *</a>
            <a className={styles.forgotPassword}> Forgot your password?</a>
          </label>
          <input type="password" id="password" className={styles.input} required></input>

          <Button label="Continue" className={styles.signInButton}></Button>
        </form>
        <div className={styles.subtitle2}>
          <div>
            Don&apos;t have an account?
            <a href="/signup" style={{ color: "#057E6F" }}>
              {" "}
              Sign up.
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
