"use client";

import Image from "next/image";
import React, { MouseEvent, useState } from "react";

import styles from "./page.module.css";
import "@fontsource/albert-sans";

import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/Button";
import CustomDropdown from "@/components/CustomDropdown";
import OnboardingOption from "@/components/OnboardingOption";
import ProgressBar from "@/components/ProgressBar";

export default function SignUpForm() {
  const [currentPage, setCurrentPage] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeButton, setActiveButton] = useState("");
  const [isVeteran, setIsVeteran] = useState(false);
  const [selected, setSelected] = useState("");
  const [activeDropdown, setActiveDropdown] = useState("");

  const handleNext = () => {
    // Go to the next form step

    if (currentPage === 0 && !activeButton) {
      alert("Please select a sign-up option to continue.");
      return;
    }

    // Skip "Tell Us About Your Service" if not a Veteran
    if (currentPage === 1 && !isVeteran) {
      setCurrentPage(currentPage + 2);
    } else {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    // Go to the previous form step
    if (currentPage > 0) {
      if (currentPage === 3 && !isVeteran) {
        // Skip "Tell Us About Your Service" when going back and not a veteran
        setCurrentPage(1);
      } else {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleDropdown = () => {
    // Show Address Dropdown
    setShowDropdown((prev) => !prev);
  };

  const handleButton = (e: MouseEvent<HTMLButtonElement>, buttonType: string) => {
    e.preventDefault();

    setActiveButton(buttonType);

    // Update isVeteran based on the button clicked
    if (buttonType === "button1") {
      setIsVeteran(true);
    } else {
      setIsVeteran(false);
    }
  };

  // Case 2 Custom Dropdown
  const handleSelect = (option: string) => {
    setSelected(option);
  };
  const toggleDropdown = (id: string) => {
    setActiveDropdown((prev) => (prev === id ? null : id));
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
                    handleButton(e, "button1");
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
                    if (activeButton !== "button2")
                      e.currentTarget.style.backgroundColor = "#f2f2f2";
                  }}
                  onMouseLeave={(e) => {
                    if (activeButton !== "button2") e.currentTarget.style.backgroundColor = "white";
                  }}
                />
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
                <label htmlFor="email" className={styles.formEntry}>
                  Email
                </label>
                <a style={{ color: "#B80037" }}> *</a>
                <input type="text" id="email" className={styles.input} required></input>
                <label htmlFor="phone" className={styles.formEntry}>
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
                    <label htmlFor="firstName" className={styles.formEntry}>
                      First name
                      <a style={{ color: "#B80037" }}> *</a>
                    </label>
                    <input type="text" id="firstName" className={styles.input} required></input>
                  </div>
                  <div>
                    <label htmlFor="lastName" className={styles.formEntry}>
                      Last name
                    </label>
                    <input type="text" id="lastName" className={styles.input}></input>
                  </div>
                </div>
                <div className={styles.addressDropdown} onClick={handleDropdown}>
                  <div className={styles.subHeader}>
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
                    style={{
                      objectFit: "contain",
                      transform: showDropdown ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  ></Image>
                </div>
                {showDropdown && (
                  <div style={{ marginTop: "16px" }}>
                    <label htmlFor="address" className={styles.formEntry}>
                      Street address
                    </label>
                    <input type="text" id="address" className={styles.input}></input>
                    <label htmlFor="address2" className={styles.formEntry}>
                      Street address line 2
                    </label>
                    <input type="text" id="address2" className={styles.input}></input>
                    <div className={styles.doubleInput}>
                      <div style={{ marginRight: "16px" }}>
                        <label htmlFor="city" className={styles.formEntry}>
                          City
                        </label>
                        <input type="text" id="city" className={styles.input} required></input>
                      </div>
                      <div style={{ marginRight: "16px" }}>
                        <label htmlFor="state" className={styles.formEntry}>
                          State
                        </label>
                        <input type="text" id="state" className={styles.input}></input>
                      </div>
                      <div>
                        <label htmlFor="zip" className={styles.formEntry}>
                          Zip code
                        </label>
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
      case 2: {
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
                <div className={styles.title}>Tell Us About Your Service</div>
                <div className={styles.description}>
                  This helps us match you with the right benefits and community.
                </div>
                <label htmlFor="date" className={styles.formEntry}>
                  Date service ended
                </label>
                <a style={{ color: "#B80037" }}> *</a>
                <input
                  type="text"
                  id="date"
                  className={styles.inputGreen}
                  placeholder="MM-DD-YYYY"
                  required
                ></input>
                <div className={styles.formEntry}>
                  Branch of service
                  <a style={{ color: "#B80037" }}> *</a>
                </div>
                <CustomDropdown
                  options={[
                    "Air Force",
                    "Army",
                    "Coast Guard",
                    "National Guard",
                    "Marine Corps",
                    "Space Force",
                    "First responder",
                    "Navy",
                  ]}
                  isOpen={activeDropdown === "select1"}
                  toggleDropdown={() => {
                    toggleDropdown("select1");
                  }}
                  onSelect={handleSelect}
                />

                <label htmlFor="status" className={styles.formEntry}>
                  Current military status
                  <a style={{ color: "#B80037" }}> *</a>
                </label>
                <CustomDropdown
                  options={[
                    "Active Duty",
                    "Reservist",
                    "Veteran",
                    "Veteran Medically Retired",
                    "Veteran 20+ years Retired",
                    "First responder (no military service)",
                  ]}
                  isOpen={activeDropdown === "select2"}
                  toggleDropdown={() => {
                    toggleDropdown("select2");
                  }}
                  onSelect={handleSelect}
                />

                <label htmlFor="gender" className={styles.formEntry}>
                  Gender
                  <a style={{ color: "#B80037" }}> *</a>
                </label>
                <CustomDropdown
                  options={["Female", "Male", "Other"]}
                  onSelect={handleSelect}
                  isOpen={activeDropdown === "select3"}
                  toggleDropdown={() => {
                    toggleDropdown("select3");
                  }}
                />

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
      }
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
