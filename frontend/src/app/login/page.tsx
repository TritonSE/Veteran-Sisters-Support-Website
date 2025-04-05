"use client";

import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

import { auth } from "../../firebase/firebase";
import { Button } from "../components/Button";
import SuccessNotification from "../components/SuccessNotification";

import styles from "./page.module.css";

import "@fontsource/albert-sans";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams(); // Search for query parameters
  const [showSuccess, setShowSuccess] = useState(false); // If user successfully signed up and was redirected
  const [showLoggedin, setShowLoggedin] = useState(false); // Once user logs in
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setShowSuccess(true);
    }
  }, [searchParams]);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setShowLoggedin(true);

      if (window.location.pathname === "/") {
        window.location.reload();
      } else {
        router.push("/");
      }
    } catch {
      setError("Account not found.");
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.form}>
        <div className={styles.subtitle}>Log in to your account</div>
        {error && <p className={styles.error}>{error}</p>}
        <form className={styles.innerForm} id="contactForm" onSubmit={(e) => void handleLogin(e)}>
          <label htmlFor="email" className={styles.formEntry}>
            Email
          </label>
          <a style={{ color: "#B80037" }}> *</a>
          <input
            type="email"
            id="email"
            className={styles.input}
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          ></input>
          <label htmlFor="password" className={styles.formEntry}>
            Password
            <a style={{ color: "#B80037" }}> *</a>
            <a className={styles.forgotPassword}> Forgot your password?</a>
          </label>
          <input
            type="password"
            id="password"
            className={styles.input}
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></input>

          <Button label="Continue" className={styles.signInButton} type="submit"></Button>
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
      {showSuccess && <SuccessNotification message="User Created Successfully" />}
      {showLoggedin && <SuccessNotification message="User Logged In Successfully" />}
    </main>
  );
}

export default function LoginForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
