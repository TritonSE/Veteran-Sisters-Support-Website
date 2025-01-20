"use client";

import Image from "next/image";
import React, { useState } from "react";

import styles from "./page.module.css";

import { Button } from "@/components/Button";

export default function SignUpForm() {
  const [currentPage, setCurrentPage] = useState(0);

  const handleNext = () => {
    if (currentPage < 4) setCurrentPage(currentPage + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 0:
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
                <label htmlFor="password">
                  Password
                  <a style={{ color: "#057E6F", marginLeft: "263px", marginRight: "0px" }}>
                    {" "}
                    Forgot your password?
                  </a>
                </label>
                <input type="password" id="password" className={styles.input} required></input>

                <div className={styles.rememberMeContainer}>
                  <input
                    type="checkbox"
                    id="rememberMe"
                    className={styles.checkbox}
                    defaultChecked
                  />
                  <label htmlFor="rememberMe" className={styles.rememberMeLabel}>
                    Remember me
                  </label>
                </div>

                <Button label="Sign In" className={styles.signInButton}></Button>
              </form>
              <div className={styles.subtitle2}>
                <div style={{ textAlign: "center" }}>
                  Don&apos;t have an account?
                  <a style={{ color: "#057E6F" }}> Fill out a form.</a>
                </div>
              </div>
            </div>
          </main>
        );
      case 1:
      // sign up 1
      case 2:
      // sign up 1
      case 3:
      // sign up 1
      case 4:
      // sign up 1
    }
  };

  return <>{renderPage()}</>;
}
