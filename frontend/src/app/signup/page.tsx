"use client";

import Image from "next/image";
import React, { MouseEvent, useState } from "react";

import styles from "./page.module.css";
import "@fontsource/albert-sans";

import { BackButton } from "@/app/components/BackButton";
import { Button } from "@/app/components/Button";
import CustomDropdown from "@/app/components/CustomDropdown";
import OnboardingOption from "@/app/components/OnboardingOption";
import ProgressBar from "@/app/components/ProgressBar";

import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from "firebase/auth";
import { initFirebase } from "../../../firebase/firebase";
import { FirebaseError } from "firebase/app";
const { auth } = initFirebase();

export default function SignUpForm() {
  const [currentPage, setCurrentPage] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeButton, setActiveButton] = useState("");
  const [isVeteran, setIsVeteran] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [streetAddressLine2, setStreetAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [serviceDate, setServiceDate] = useState("");
  const [branch, setBranch] = useState("");
  const [militaryStatus, setMilitaryStatus] = useState("");
  const [gender, setGender] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<{
    signUpOption?: string; // Choosing veteran vs volunteer
    email?: string; // An account with this email already exists
    password?: string; // Password must be 6 characters
    confirmPassword?: string; // Confirm password and password inputs must match
    zip?: string; // Zip is required (special error message since it is hidden in dropdown)
    requiredFields?: string; // On page 1, some text fields are required
    service?: string; // On service page, all fields are required
    onboarding?: string; // At least one interest must be chosen on last page
  }>({});

  const handleNext = async (e?: MouseEvent<HTMLButtonElement>) => {
    if (e) e.preventDefault();

    if (currentPage === 0 && !activeButton) {
      setFormErrors((prev) => ({
        ...prev,
        signUpOption: "Please select an option.",
      }));
      return;
    }

    let hasError = false;

    if (currentPage === 1) {
      // Check if email is valid
      const emailRegex =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!emailRegex.test(email)) {
        setFormErrors((prev) => ({
          ...prev,
          email: "Please enter a valid email address.",
        }));
        return;
      }

      // Validate password length
      if (password.length < 6 && password.length > 0) {
        setFormErrors((prev) => ({
          ...prev,
          password: "Password must be at least 6 characters long.",
        }));
        hasError = true;
      } else {
        setFormErrors((prev) => ({
          ...prev,
          password: "",
        }));
      }

      // Validate confirm password matches password
      if (password !== confirmPassword) {
        setFormErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords do not match.",
        }));
        hasError = true;
      } else {
        setFormErrors((prev) => ({
          ...prev,
          confirmPassword: "",
        }));
      }

      // Validate required fields
      if (!zip) {
        setFormErrors((prev) => ({
          ...prev,
          zip: "Zip code is required.",
        }));
        hasError = true;
      }

      if (!email || !password || !confirmPassword || !phone || !firstName) {
        setFormErrors((prev) => ({
          ...prev,
          requiredFields: "All required fields must be filled.",
        }));
        hasError = true;
      }

      // If any error exists, return early
      if (hasError) return;
    }

    if (currentPage === 2 && isVeteran) {
      // Regex for MM-DD-YYYY format
      const dateRegex = /^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])-\d{4}$/;
      if (!serviceDate || !dateRegex.test(serviceDate) || !branch || !militaryStatus || !gender) {
        setFormErrors((prev) => ({
          ...prev,
          service: "All fields are required.",
        }));
        return;
      } else {
        setFormErrors((prev) => ({ ...prev, service: "" }));
      }
    }

    setShowDropdown(false);
    setActiveDropdown("");
    setFormErrors({});

    setCurrentPage((prev) => (prev === 1 && !isVeteran ? prev + 2 : prev + 1));
  };

  const handlePrevious = () => {
    setShowDropdown(false);
    setActiveDropdown("");

    if (currentPage > 0) {
      if (currentPage === 3 && !isVeteran) {
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
  const toggleDropdown = (id: string) => {
    setActiveDropdown((prev) => (prev === id ? null : id));
  };

  const handleSignup = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    let hasError = false;

    if (password.length < 6) {
      setFormErrors((prev) => ({
        ...prev,
        password: "Password must be at least 6 characters long.",
      }));
      hasError = true;
    } else {
      setFormErrors((prev) => ({
        ...prev,
        password: "",
      }));
    }

    if (password !== confirmPassword) {
      setFormErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match..",
      }));
      hasError = true;
    } else {
      setFormErrors((prev) => ({
        ...prev,
        confirmPassword: "",
      }));
    }

    // New validation for onboarding options
    if (selectedOptions.length === 0) {
      setFormErrors((prev) => ({
        ...prev,
        onboarding: "Please select at least one option.",
      }));
      hasError = true;
    } else {
      setFormErrors((prev) => ({
        ...prev,
        onboarding: "",
      }));
    }

    if (hasError) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User signed up:", userCredential.user);
      // Proceed with further logic upon successful signup
    } catch (error: unknown) {
      // Check if the error is an instance of FirebaseError
      if (error instanceof FirebaseError) {
        if (error.code === "auth/email-already-in-use") {
          // Set your form error state with an appropriate message
          setFormErrors((prevErrors) => ({
            ...prevErrors,
            email: "An account with this email already exists.",
          }));
        } else {
          // Log or handle other Firebase-related errors
          console.error("Signup error:", error.message);
        }
      } else {
        // Handle unexpected errors
        console.error("Unexpected error:", error);
      }
    }
  };

  const handleToggleOption = (option: string) => {
    setSelectedOptions((prevOptions) => {
      if (prevOptions.includes(option)) {
        return prevOptions.filter((item) => item !== option);
      } else {
        return [...prevOptions, option];
      }
    });
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
                {formErrors.signUpOption && (
                  <p className={styles.error}>{formErrors.signUpOption}</p>
                )}
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
                {formErrors.requiredFields && (
                  <p className={styles.error}>{formErrors.requiredFields}</p>
                )}
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
                  onChange={(e) => setEmail(e.target.value)}
                ></input>
                <label htmlFor="password" className={styles.formEntry}>
                  Password
                </label>
                <a style={{ color: "#B80037" }}> *</a>
                {formErrors.password && <p className={styles.error}>{formErrors.password}</p>}
                <input
                  type="password"
                  id="password"
                  className={styles.input}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (e.target.value.length >= 6) {
                      setFormErrors((prev) => ({ ...prev, password: "" }));
                    }
                  }}
                ></input>
                <label htmlFor="confirmPassword" className={styles.formEntry}>
                  Confirm password
                </label>
                <a style={{ color: "#B80037" }}> *</a>
                {formErrors.confirmPassword && (
                  <p className={styles.error}>{formErrors.confirmPassword}</p>
                )}
                <input
                  type="password"
                  id="confirmPassword"
                  className={styles.input}
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                  }}
                  onBlur={() => {
                    if (confirmPassword && confirmPassword !== password) {
                      setFormErrors((prev) => ({
                        ...prev,
                        confirmPassword: "Passwords do not match.",
                      }));
                    } else {
                      setFormErrors((prev) => ({ ...prev, confirmPassword: "" }));
                    }
                  }}
                ></input>
                <label htmlFor="phone" className={styles.formEntry}>
                  Phone number
                  <a style={{ color: "#B80037" }}> *</a>
                </label>
                <input
                  type="tel"
                  id="phone"
                  placeholder="XXX-XXX-XXXX"
                  className={styles.input}
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                ></input>
                <div className={styles.doubleInput}>
                  <div style={{ marginRight: "16px" }}>
                    <label htmlFor="firstName" className={styles.formEntry}>
                      First name
                      <a style={{ color: "#B80037" }}> *</a>
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      className={styles.input}
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    ></input>
                  </div>
                  <div>
                    <label htmlFor="lastName" className={styles.formEntry}>
                      Last name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      className={styles.input}
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    ></input>
                  </div>
                </div>
                <div className={styles.addressDropdown} onClick={handleDropdown}>
                  <div className={styles.subHeader}>Address Information</div>
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
                {formErrors.zip && <p className={styles.error}>{formErrors.zip}</p>}
                {showDropdown && (
                  <div style={{ marginTop: "16px" }}>
                    <label htmlFor="address" className={styles.formEntry}>
                      Street address
                    </label>
                    <input
                      type="text"
                      id="address"
                      className={styles.input}
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                    ></input>
                    <label htmlFor="address2" className={styles.formEntry}>
                      Street address line 2
                    </label>
                    <input
                      type="text"
                      id="address2"
                      className={styles.input}
                      value={streetAddressLine2}
                      onChange={(e) => setStreetAddressLine2(e.target.value)}
                    ></input>
                    <div className={styles.doubleInput}>
                      <div style={{ marginRight: "16px" }}>
                        <label htmlFor="city" className={styles.formEntry}>
                          City
                        </label>
                        <input
                          type="text"
                          id="city"
                          className={styles.input}
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                        ></input>
                      </div>
                      <div style={{ marginRight: "16px" }}>
                        <label htmlFor="state" className={styles.formEntry}>
                          State
                        </label>
                        <input
                          type="text"
                          id="state"
                          className={styles.input}
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                        ></input>
                      </div>
                      <div>
                        <label htmlFor="zip" className={styles.formEntry}>
                          Zip code
                          <a style={{ color: "#B80037" }}> *</a>
                        </label>
                        <input
                          type="text"
                          id="zip"
                          className={styles.input}
                          required
                          value={zip}
                          onChange={(e) => {
                            setZip(e.target.value);
                            if (e.target.value.trim() !== "") {
                              setFormErrors((prev) => ({ ...prev, zip: "" }));
                            }
                          }}
                        ></input>
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
                {formErrors.service && <p className={styles.error}>{formErrors.service}</p>}
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
                  value={serviceDate}
                  onChange={(e) => setServiceDate(e.target.value)}
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
                  onSelect={(option) => setBranch(option)}
                  selected={branch}
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
                  onSelect={(option) => setMilitaryStatus(option)}
                  selected={militaryStatus}
                />

                <label htmlFor="gender" className={styles.formEntry}>
                  Gender
                  <a style={{ color: "#B80037" }}> *</a>
                </label>
                <CustomDropdown
                  options={["Female", "Male", "Other"]}
                  onSelect={(option) => setGender(option)}
                  isOpen={activeDropdown === "select3"}
                  toggleDropdown={() => {
                    toggleDropdown("select3");
                  }}
                  selected={gender}
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
                  {formErrors.onboarding && <p className={styles.error}>{formErrors.onboarding}</p>}
                  {formErrors.email && <p className={styles.error}>{formErrors.email}</p>}

                  <OnboardingOption
                    isChecked={false}
                    mainText={"Get a battle buddy"}
                    description={"Description about this option and why it’s good"}
                    onClick={() => handleToggleOption("Get a battle buddy")}
                  ></OnboardingOption>
                  <OnboardingOption
                    isChecked={false}
                    mainText={"Be a battle buddy"}
                    description={"Description about this option and why it’s good"}
                    onClick={() => handleToggleOption("Be a battle buddy")}
                  ></OnboardingOption>
                  <OnboardingOption
                    isChecked={false}
                    mainText={"Get help filing for VA benefits"}
                    description={"Description about this option and why it’s good"}
                    onClick={() => handleToggleOption("Get help filing for VA benefits")}
                  ></OnboardingOption>
                  <OnboardingOption
                    isChecked={false}
                    mainText={"Get help filing for VA benefits"}
                    description={"Description about this option and why it’s good"}
                    onClick={() => handleToggleOption("Get help filing for VA benefits")}
                  ></OnboardingOption>
                  <OnboardingOption
                    isChecked={false}
                    mainText={"Learn more about becoming a peer support specialist"}
                    description={"Description about this option and why it’s good"}
                    onClick={() =>
                      handleToggleOption("Learn more about becoming a peer support specialist")
                    }
                  ></OnboardingOption>
                  <OnboardingOption
                    isChecked={false}
                    mainText={"Wellness events"}
                    description={"Description about this option and why it’s good"}
                    onClick={() => handleToggleOption("Wellness events")}
                  ></OnboardingOption>
                  <OnboardingOption
                    isChecked={false}
                    mainText={"Social events"}
                    description={"Description about this option and why it’s good"}
                    onClick={() => handleToggleOption("Social events")}
                  ></OnboardingOption>
                  <OnboardingOption
                    isChecked={false}
                    mainText={"Other"}
                    onClick={() => handleToggleOption("Other")}
                  ></OnboardingOption>
                  <Button
                    label="Submit"
                    className={styles.continueButton}
                    onClick={handleSignup}
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
