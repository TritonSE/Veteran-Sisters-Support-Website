"use client";

import Image from "next/image";
import React, { MouseEvent } from "react";

import { Button } from "../Button";

import styles from "./page.module.css";

type RoleSelectionProps = {
  activeButton: string;
  handleButton: (e: MouseEvent<HTMLButtonElement>, buttonType: string) => void;
  formErrors: { signUpOption?: string };
  setFormErrors: React.Dispatch<
    React.SetStateAction<{ signUpOption?: string; [key: string]: string | undefined }>
  >;
  onNext: () => void;
};

export default function RoleSelection({
  activeButton,
  handleButton,
  formErrors,
  setFormErrors,
  onNext,
}: RoleSelectionProps) {
  const handleContinue = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!activeButton) {
      setFormErrors((prev) => ({ ...prev, signUpOption: "Please select an option." }));
      return;
    }
    setFormErrors((prev) => ({ ...prev, signUpOption: "" }));
    onNext();
  };

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
        <form className={styles.form}>
          <div className={styles.subtitle}>Create a membership account</div>
          {formErrors.signUpOption && <p className={styles.error}>{formErrors.signUpOption}</p>}
          <Button
            label="Sign up as a Veteran"
            className={styles.signUpButton}
            onClick={(e) => {
              handleButton(e, "button1");
            }}
            style={{
              backgroundColor: activeButton === "button1" ? "lightgrey" : "white",
            }}
            onMouseEnter={(e) => {
              if (activeButton !== "button1") e.currentTarget.style.backgroundColor = "#f2f2f2";
            }}
            onMouseLeave={(e) => {
              if (activeButton !== "button1") e.currentTarget.style.backgroundColor = "white";
            }}
          />
          <Button
            label="Sign up as a Volunteer"
            className={styles.signUpButton}
            onClick={(e) => {
              handleButton(e, "button2");
            }}
            style={{
              backgroundColor: activeButton === "button2" ? "lightgrey" : "white",
            }}
            onMouseEnter={(e) => {
              if (activeButton !== "button2") e.currentTarget.style.backgroundColor = "#f2f2f2";
            }}
            onMouseLeave={(e) => {
              if (activeButton !== "button2") e.currentTarget.style.backgroundColor = "white";
            }}
          />
          <Button label="Continue" className={styles.continueButton} onClick={handleContinue} />
          <div className={styles.subtitle2}>
            <div style={{ textAlign: "center" }}>
              Already have an account?
              <a href="/login" style={{ color: "#057E6F" }}>
                {" "}
                Log in.
              </a>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
