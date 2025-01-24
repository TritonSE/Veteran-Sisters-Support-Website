"use client";

import Image from "next/image";
import React, { MouseEvent, useState } from "react";

import styles from "./page.module.css";

import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/Button";
import OnboardingOption from "@/components/OnboardingOption";
import ProgressBar from "@/components/ProgressBar";

export default function SignUpForm() {
  const [currentPage, setCurrentPage] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeButton, setActiveButton] = useState("");

  const handleNext = () => {
    // Go to the next form step
    if (currentPage < 3) setCurrentPage(currentPage + 1);
  };

  const handlePrevious = () => {
    // Go to the previous form step
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const handleDropdown = () => {
    // Show Address Dropdown
    setShowDropdown((prev) => !prev);
  };

  const handleButton = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
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
                <Button
                  label="Sign up as a Veteran"
                  className={styles.signUpButton}
                  onClick={(e) => {
                    setActiveButton("button1");
                    handleButton(e);
                  }}
                  style={{
                    backgroundColor: activeButton === "button1" ? "lightgrey" : "white",
                  }}
                  onMouseEnter={(e) => {
                    if (activeButton !== "button1")
                      e.currentTarget.style.backgroundColor = "#f2f2f2";
                  }}
                  onMouseLeave={(e) => {
                    if (activeButton !== "button1") e.currentTarget.style.backgroundColor = "white";
                  }}
                ></Button>
                <Button
                  label="Sign up as a Volunteer"
                  className={styles.signUpButton}
                  onClick={(e) => {
                    setActiveButton("button2");
                    handleButton(e);
                  }}
                  style={{
                    backgroundColor: activeButton === "button2" ? "lightgrey" : "white",
                  }}
                  onMouseEnter={(e) => {
                    if (activeButton !== "button2")
                      e.currentTarget.style.backgroundColor = "#f2f2f2";
                  }}
                  onMouseLeave={(e) => {
                    if (activeButton !== "button2") e.currentTarget.style.backgroundColor = "white";
                  }}
                ></Button>
                <Button
                  label="Continue"
                  className={styles.continueButton}
                  onClick={handleNext}
                ></Button>
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
                  <ProgressBar percentCompleted={25}></ProgressBar>
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
                <div className={styles.addressDropdown} onClick={handleDropdown}>
                  <div style={{ fontSize: "16px", fontWeight: "600" }}>
                    Address Information
                    <a style={{ color: "#60696F", fontWeight: "400", fontSize: "13px" }}>
                      {" "}
                      Optional
                    </a>
                  </div>
                  <Image
                    id="caret"
                    width={20}
                    height={20}
                    src="ic_caretdown.svg"
                    alt=""
                    style={{ objectFit: "contain" }}
                  ></Image>
                </div>
                {showDropdown && (
                  <div style={{ marginTop: "16px" }}>
                    <label htmlFor="address">Street address</label>
                    <input type="text" id="address" className={styles.input}></input>
                    <label htmlFor="address2">Street address line 2</label>
                    <input type="text" id="address2" className={styles.input}></input>
                    <div className={styles.doubleInput}>
                      <div style={{ marginRight: "16px" }}>
                        <label htmlFor="city">City</label>
                        <input type="text" id="city" className={styles.input} required></input>
                      </div>
                      <div style={{ marginRight: "16px" }}>
                        <label htmlFor="state">State</label>
                        <input type="text" id="state" className={styles.input}></input>
                      </div>
                      <div>
                        <label htmlFor="zip">Zip code</label>
                        <input type="text" id="zip" className={styles.input}></input>
                      </div>
                    </div>
                  </div>
                )}
                <Button
                  label="Continue"
                  className={styles.continueButton}
                  onClick={handleNext}
                ></Button>
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
      case 2:
        // sign up 2
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
                  <ProgressBar percentCompleted={50}></ProgressBar>
                </div>
                <div className={styles.subtitle}>Tell Us About Your Service</div>
                <div style={{ marginBottom: "24px" }}>
                  This helps us match you with the right benefits and community.
                </div>
                <label htmlFor="date">Date service ended</label>
                <a style={{ color: "#B80037" }}> *</a>
                <input
                  type="text"
                  id="date"
                  className={styles.input}
                  placeholder="MM-DD-YYYY"
                  required
                ></input>
                <label htmlFor="branch">
                  Branch of service
                  <a style={{ color: "#B80037" }}> *</a>
                </label>
                <select id="branch" className={styles.input} required>
                  <option value="">Please select</option>
                </select>
                <label htmlFor="status">
                  Current military status
                  <a style={{ color: "#B80037" }}> *</a>
                </label>
                <select id="status" className={styles.input} required>
                  <option value="">Please select</option>
                </select>
                <label htmlFor="gender">
                  Gender
                  <a style={{ color: "#B80037" }}> *</a>
                </label>
                <select id="gender" className={styles.input} required>
                  <option value="">Please select</option>
                </select>

                <Button
                  label="Continue"
                  className={styles.continueButton}
                  onClick={handleNext}
                ></Button>
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
      // sign up 3
      case 3:
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
                  <ProgressBar percentCompleted={75}></ProgressBar>
                  <div className={styles.title}>
                    What are your interests? <a style={{ color: "#B80037" }}> *</a>
                  </div>
                  <div className={styles.subtext}>
                    Select multiple and we&apos;ll help personalize your experience.
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
                    label="Submit"
                    className={styles.continueButton}
                    onClick={handleNext}
                  ></Button>
                  <div className={styles.subtitle2}>
                    <div style={{ textAlign: "center" }}>
                      Already have an account?
                      <a href="/login" style={{ color: "#057E6F" }}>
                        {" "}
                        Log in.
                      </a>
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
