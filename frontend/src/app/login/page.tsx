"use client";

import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

import { auth } from "../../firebase/firebase";
import SuccessNotification from "../components/SuccessNotification";

import styles from "./page.module.css";

import "@fontsource/albert-sans";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams(); // Search for query parameters
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // If user successfully signed up and was redirected
  const [showLoggedin, setShowLoggedin] = useState(false); // Once user logs in
  const [showResetPasswordSuccess, setShowResetPasswordSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setShowSuccess(true);
    }
  }, [searchParams]);

  const handleLogin = async () => {
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

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setShowResetPasswordSuccess(true);
    } catch {
      setError("Could not reset password.");
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Clear success & error messages
    setShowSuccess(false);
    setShowLoggedin(false);
    setShowResetPasswordSuccess(false);
    setError("");

    if (showResetPassword) {
      void handleResetPassword();
    } else {
      void handleLogin();
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.form}>
        <div className={styles.subtitle}>
          {showResetPassword ? "Reset your password" : "Log in to your account"}
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <form className={styles.innerForm} id="contactForm" onSubmit={handleSubmit}>
          {showResetPassword ? (
            <p className={styles.subtitle2} style={{ marginTop: 0, marginBottom: 24 }}>
              We&apos;ll email you with a link to reset your password!
            </p>
          ) : null}
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
          {showResetPassword ? null : (
            <>
              {" "}
              <label htmlFor="password" className={styles.formEntry}>
                Password
                <a style={{ color: "#B80037" }}> *</a>
                <a
                  className={styles.linkText}
                  onClick={() => {
                    setShowResetPassword(true);
                  }}
                >
                  {" "}
                  Forgot your password?
                </a>
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
            </>
          )}

          <button className={styles.signInButton} type="submit">
            Continue
          </button>
        </form>
        {showResetPassword ? (
          <div className={styles.subtitle2}>
            <div>
              Remembered your password?
              <div
                className={styles.linkText}
                onClick={() => {
                  setShowResetPassword(false);
                }}
              >
                &nbsp;Log in.
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.subtitle2}>
            <div>
              Don&apos;t have an account?
              <a className={styles.linkText} href="/signup">
                &nbsp;Sign up.
              </a>
            </div>
          </div>
        )}
      </div>
      {showSuccess && <SuccessNotification message="User Created Successfully" />}
      {showLoggedin && <SuccessNotification message="User Logged In Successfully" />}
      {showResetPasswordSuccess && <SuccessNotification message="Password Reset Email Sent" />}
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
