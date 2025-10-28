"use client";

import Image from "next/image";
import React, { MouseEvent, useEffect, useState } from "react";

import { Role } from "../Role";

import styles from "./page.module.css";

import { Role as RoleEnum, checkIfUserEmailExists } from "@/app/api/profileApi";
import { BackButton } from "@/app/components/BackButton";
import { Button } from "@/app/components/Button";
import ProgressBar from "@/app/components/ProgressBar";

type UserDetailsProps = {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  streetAddress: string;
  setStreetAddress: (value: string) => void;
  streetAddressLine2: string;
  setStreetAddressLine2: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  stateVal: string;
  setStateVal: (value: string) => void;
  zip: string;
  setZip: (value: string) => void;
  showDropdown: boolean;
  setShowDropdown: (value: boolean) => void;
  activeDropdown: string;
  toggleDropdown: (id: string) => void;
  formErrors: Record<string, string | undefined>;
  setFormErrors: React.Dispatch<React.SetStateAction<Record<string, string | undefined>>>;
  onNext: () => void;
  onPrevious: () => void;
  isVeteran: boolean;
};

export default function UserDetails({
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  phone,
  setPhone,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  streetAddress,
  setStreetAddress,
  streetAddressLine2,
  setStreetAddressLine2,
  city,
  setCity,
  stateVal,
  setStateVal,
  zip,
  setZip,
  showDropdown,
  setShowDropdown,
  formErrors,
  setFormErrors,
  onNext,
  onPrevious,
  isVeteran,
}: UserDetailsProps) {
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    const hasErrorText = Object.values(formErrors).some((error) => error && error.trim() !== "");
    if (hasSubmitted && hasErrorText) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setHasSubmitted(false);
  }, [formErrors, hasSubmitted]);

  const handleContinue = async (e: MouseEvent<HTMLButtonElement>) => {
    setHasSubmitted(true);
    e.preventDefault();
    let hasError = false;
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email && !emailRegex.test(email)) {
      setFormErrors((prev) => ({ ...prev, email: "Please enter a valid email address." }));
      hasError = true;
    }
    const doesEmailExist = await checkIfUserEmailExists(email);
    // User email already exists in mongo DB
    if (doesEmailExist.success && doesEmailExist.data) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        alreadyExists: "An account with this email already exists.",
      }));
      hasError = true;
    }
    if (password.length < 6 && password.length > 0) {
      setFormErrors((prev) => ({
        ...prev,
        password: "Password must be at least 6 characters long.",
      }));
      hasError = true;
    } else {
      setFormErrors((prev) => ({ ...prev, password: "" }));
    }
    if (password !== confirmPassword) {
      setFormErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match." }));
      hasError = true;
    } else {
      setFormErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    if (phone && !phoneRegex.test(phone)) {
      setFormErrors((prev) => ({
        ...prev,
        phone: "Please enter a valid phone number in the format XXX-XXX-XXXX.",
      }));
      hasError = true;
    }
    if (!zip) {
      setFormErrors((prev) => ({ ...prev, zip: "Zip code is required." }));
      hasError = true;
    }
    const zipRegex = /^\d{5}$/;
    if (zip && !zipRegex.test(zip)) {
      setFormErrors((prev) => ({ ...prev, zipValid: "Please enter a valid Zip Code" }));
      hasError = true;
    }
    if (!email || !password || !confirmPassword || !phone || !firstName || !lastName) {
      setFormErrors((prev) => ({ ...prev, requiredFields: "All required fields must be filled." }));
      hasError = true;
    }
    if (hasError) return;
    setFormErrors({});
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
          <div style={{ marginBottom: "24px" }}>
            <BackButton handlePrevious={onPrevious} />
            <ProgressBar percentCompleted={25} />
          </div>
          <div style={{ width: "80px", marginBottom: "20px" }}>
            <Role role={isVeteran ? RoleEnum.VETERAN : RoleEnum.VOLUNTEER} />
          </div>
          <div className={styles.subtitle}>Create a membership account</div>
          {formErrors.requiredFields && <p className={styles.error}>{formErrors.requiredFields}</p>}
          {formErrors.email && <p className={styles.error}>{formErrors.email}</p>}
          {formErrors.alreadyExists && <p className={styles.error}>{formErrors.alreadyExists}</p>}
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
          />
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
            onBlur={() => {
              if (confirmPassword && confirmPassword !== "" && confirmPassword !== password) {
                setFormErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match." }));
              } else {
                setFormErrors((prev) => ({ ...prev, confirmPassword: "" }));
              }
            }}
          />
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
                setFormErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match." }));
              } else {
                setFormErrors((prev) => ({ ...prev, confirmPassword: "" }));
              }
            }}
          />
          {formErrors.phone && <p className={styles.error}>{formErrors.phone}</p>}
          <label htmlFor="phone" className={styles.formEntry}>
            Phone number<a style={{ color: "#B80037" }}> *</a>
          </label>
          <input
            type="tel"
            id="phone"
            placeholder="XXX-XXX-XXXX"
            className={styles.input}
            required
            value={phone}
            onChange={(e) => {
              const value = e.target.value;
              setPhone(value);
              const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
              if (phoneRegex.test(value)) {
                setFormErrors((prev) => ({ ...prev, phone: "" }));
              }
            }}
          />
          <div className={styles.doubleInput}>
            <div style={{ marginRight: "16px" }}>
              <label htmlFor="firstName" className={styles.formEntry}>
                First name<a style={{ color: "#B80037" }}> *</a>
              </label>
              <input
                type="text"
                id="firstName"
                className={styles.input}
                required
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
              />
            </div>
            <div>
              <label htmlFor="lastName" className={styles.formEntry}>
                Last name<a style={{ color: "#B80037" }}> *</a>
              </label>
              <input
                type="text"
                id="lastName"
                className={styles.input}
                required
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
              />
            </div>
          </div>
          <div
            className={styles.addressDropdown}
            onClick={() => {
              setShowDropdown(!showDropdown);
            }}
          >
            <div className={styles.subHeader}>Address Information</div>
            <Image
              id="caret"
              width={20}
              height={20}
              src="/ic_caretdown.svg"
              alt=""
              style={{
                objectFit: "contain",
                transform: showDropdown ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </div>
          {formErrors.zip && <p className={styles.error}>{formErrors.zip}</p>}
          {formErrors.zipValid && <p className={styles.error}>{formErrors.zipValid}</p>}
          {showDropdown && (
            <div>
              <label htmlFor="address" className={styles.formEntry}>
                Street address
              </label>
              <input
                type="text"
                id="address"
                className={styles.input}
                value={streetAddress}
                onChange={(e) => {
                  setStreetAddress(e.target.value);
                }}
              />
              <label htmlFor="address2" className={styles.formEntry}>
                Street address line 2
              </label>
              <input
                type="text"
                id="address2"
                className={styles.input}
                value={streetAddressLine2}
                onChange={(e) => {
                  setStreetAddressLine2(e.target.value);
                }}
              />
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
                    onChange={(e) => {
                      setCity(e.target.value);
                    }}
                  />
                </div>
                <div style={{ marginRight: "16px" }}>
                  <label htmlFor="state" className={styles.formEntry}>
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    className={styles.input}
                    value={stateVal}
                    onChange={(e) => {
                      setStateVal(e.target.value);
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="zip" className={styles.formEntry}>
                    Zip code<a style={{ color: "#B80037" }}> *</a>
                  </label>
                  <input
                    type="text"
                    id="zip"
                    className={styles.input}
                    required
                    value={zip}
                    onChange={(e) => {
                      const value = e.target.value;
                      setZip(value);
                      if (value.trim() !== "") {
                        setFormErrors((prev) => ({ ...prev, zip: "" }));
                      }
                      const zipRegex = /^\d{5}$/;
                      if (zipRegex.test(value)) {
                        setFormErrors((prev) => ({ ...prev, zipValid: "" }));
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          )}
          <Button
            label="Continue"
            className={styles.continueButton}
            onClick={(e) => {
              void handleContinue(e);
            }}
            filled={true}
            width="88%"
          />
          <div className={styles.subtitle2}>
            <div style={{ textAlign: "center", marginTop: "16px" }}>
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
