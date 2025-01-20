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
            <div className={styles.formContainer}>
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
              <div className={styles.form}>
                <div className={styles.subtitle}>Create a membership account</div>
                <Button label="Sign up as a Veteran" className={styles.signUpButton}></Button>
                <Button label="Sign up as a Volunteer" className={styles.signUpButton}></Button>
                <Button
                  label="Continue"
                  className={styles.continueButton}
                  onClick={handleNext}
                ></Button>
                <div className={styles.subtitle2}>
                  <div style={{ textAlign: "center" }}>
                    Already have an account?
                    <a style={{ color: "#057E6F" }}> Log in.</a>
                  </div>
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
