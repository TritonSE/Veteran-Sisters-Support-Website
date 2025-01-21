"use client";

import Image from "next/image";
import React, { useState } from "react";

import styles from "./page.module.css";

import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/Button";
import OnboardingOption from "@/components/OnboardingOption";
import ProgressBar from "@/components/ProgressBar";

export default function SignUpForm() {
  const [currentPage, setCurrentPage] = useState(4);

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
              <form className={styles.form}>
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
              </form>
            </div>
          </main>
        );
      case 1:
        // sign up 1
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
              <form className={styles.form}>
                <div style={{ marginBottom: "24px" }}>
                  <BackButton handlePrevious={handlePrevious} />
                </div>
                <div className={styles.subtitle}>Create a membership account</div>
                <label htmlFor="email">Email</label>
                <a style={{ color: "#B80037" }}> *</a>
                <input type="text" id="email" className={styles.input} required></input>
                <label htmlFor="phone">
                  Phone number
                  <a style={{ color: "#B80037" }}> *</a>
                </label>
                <input
                  type="text"
                  id="phone"
                  placeholder="XXX-XXX-XXXX"
                  className={styles.input}
                  required
                ></input>
                <div className={styles.doubleInput}>
                  <div style={{ marginRight: "16px" }}>
                    <label htmlFor="firstName">
                      First name
                      <a style={{ color: "#B80037" }}> *</a>
                    </label>
                    <input type="text" id="firstName" className={styles.input} required></input>
                  </div>
                  <div>
                    <label htmlFor="lastName">Last name</label>
                    <input type="text" id="lastName" className={styles.input}></input>
                  </div>
                </div>
                <div>Address Information</div>
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
              </form>
            </div>
          </main>
        );
      case 2:
      // sign up 2
      case 3:
      // sign up 3
      case 4:
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
                <div className={styles.interestsBox}>
                  <BackButton handlePrevious={handlePrevious}></BackButton>
                  <ProgressBar percentCompleted={80}></ProgressBar>
                  <div className={styles.title}>
                    What are your interests? <a style={{ color: "#B80037" }}> *</a>
                  </div>
                  <div className={styles.subtext}>
                    Select multiple and we'll help personalize your experience.
                  </div>
                  <OnboardingOption
                    isChecked={false}
                    mainText={"Get a battle buddy"}
                    description={"Description about this option and why it’s good"}
                  ></OnboardingOption>
                  <OnboardingOption
                    isChecked={false}
                    mainText={"Be a battle buddy"}
                    description={"Description about this option and why it’s good"}
                  ></OnboardingOption>
                  <OnboardingOption
                    isChecked={false}
                    mainText={"Get help filing for VA benefits"}
                    description={"Description about this option and why it’s good"}
                  ></OnboardingOption>
                  <OnboardingOption
                    isChecked={false}
                    mainText={"Get help filing for VA benefits"}
                    description={"Description about this option and why it’s good"}
                  ></OnboardingOption>
                  <OnboardingOption
                    isChecked={false}
                    mainText={"Learn more about becoming a peer support specialist"}
                    description={"Description about this option and why it’s good"}
                  ></OnboardingOption>
                  <OnboardingOption
                    isChecked={false}
                    mainText={"Wellness events"}
                    description={"Description about this option and why it’s good"}
                  ></OnboardingOption>
                  <OnboardingOption
                    isChecked={false}
                    mainText={"Social events"}
                    description={"Description about this option and why it’s good"}
                  ></OnboardingOption>
                  <OnboardingOption isChecked={false} mainText={"Other"}></OnboardingOption>
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
            </div>
          </main>
        );
    }
  };

  return <>{renderPage()}</>;
}
