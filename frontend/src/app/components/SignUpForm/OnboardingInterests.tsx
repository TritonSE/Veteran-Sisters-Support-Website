"use client";

import Image from "next/image";
import React, { MouseEvent } from "react";

import { Role } from "../Role";

import styles from "./page.module.css";

import { Role as RoleEnum } from "@/app/api/profileApi";
import { BackButton } from "@/app/components/BackButton";
import { Button } from "@/app/components/Button";
import OnboardingOption from "@/app/components/OnboardingOption";
import ProgressBar from "@/app/components/ProgressBar";

type OnboardingInterestsProps = {
  selectedOptions: string[];
  setSelectedOptions: React.Dispatch<React.SetStateAction<string[]>>;
  formErrors: Record<string, string | undefined>;
  setFormErrors: React.Dispatch<React.SetStateAction<Record<string, string | undefined>>>;
  onSubmit: (e: MouseEvent<HTMLButtonElement>) => void;
  onPrevious: () => void;
  isVeteran: boolean;
};

export default function OnboardingInterests({
  selectedOptions,
  setSelectedOptions,
  formErrors,
  setFormErrors,
  onSubmit,
  onPrevious,
  isVeteran,
}: OnboardingInterestsProps) {
  const handleToggleOption = (option: string) => {
    setSelectedOptions((prevOptions: string[]) => {
      if (prevOptions.includes(option)) {
        return prevOptions.filter((item: string) => item !== option);
      } else {
        return [...prevOptions, option];
      }
    });
  };

  const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (selectedOptions.length === 0) {
      setFormErrors((prev) => ({ ...prev, onboarding: "Please select at least one option." }));
      return;
    } else {
      setFormErrors((prev) => ({ ...prev, onboarding: "" }));
    }
    onSubmit(e);
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
        <div className={styles.form}>
          <div className={styles.interestsBox}>
            <BackButton handlePrevious={onPrevious} />
            <ProgressBar percentCompleted={75} />
            <div style={{ width: "80px", marginBottom: "20px" }}>
              <Role role={isVeteran ? RoleEnum.VETERAN : RoleEnum.VOLUNTEER} />
            </div>
            <div className={styles.title}>
              What are your interests? <a style={{ color: "#B80037" }}> *</a>
            </div>
            <div className={styles.subtext}>
              Select multiple and we&apos;ll help personalize your experience.
            </div>
            {formErrors.onboarding && <p className={styles.error}>{formErrors.onboarding}</p>}
            {formErrors.alreadyExists && <p className={styles.error}>{formErrors.alreadyExists}</p>}
            <OnboardingOption
              isChecked={selectedOptions.includes("Get a battle buddy")}
              mainText={"Get a battle buddy"}
              description={"Description about this option and why it's good"}
              onClick={() => {
                handleToggleOption("Get a battle buddy");
              }}
            />
            <OnboardingOption
              isChecked={selectedOptions.includes("Be a battle buddy")}
              mainText={"Be a battle buddy"}
              description={"Description about this option and why it's good"}
              onClick={() => {
                handleToggleOption("Be a battle buddy");
              }}
            />
            <OnboardingOption
              isChecked={selectedOptions.includes("Get help filing for VA benefits")}
              mainText={"Get help filing for VA benefits"}
              description={"Description about this option and why it's good"}
              onClick={() => {
                handleToggleOption("Get help filing for VA benefits");
              }}
            />
            <OnboardingOption
              isChecked={selectedOptions.includes("Get help filing for VA benefits")}
              mainText={"Get help filing for VA benefits"}
              description={"Description about this option and why it's good"}
              onClick={() => {
                handleToggleOption("Get help filing for VA benefits");
              }}
            />
            <OnboardingOption
              isChecked={selectedOptions.includes(
                "Learn more about becoming a peer support specialist",
              )}
              mainText={"Learn more about becoming a peer support specialist"}
              description={"Description about this option and why it's good"}
              onClick={() => {
                handleToggleOption("Learn more about becoming a peer support specialist");
              }}
            />
            <OnboardingOption
              isChecked={selectedOptions.includes("Wellness events")}
              mainText={"Wellness events"}
              description={"Description about this option and why it's good"}
              onClick={() => {
                handleToggleOption("Wellness events");
              }}
            />
            <OnboardingOption
              isChecked={selectedOptions.includes("Social events")}
              mainText={"Social events"}
              description={"Description about this option and why it's good"}
              onClick={() => {
                handleToggleOption("Social events");
              }}
            />
            <OnboardingOption
              isChecked={selectedOptions.includes("Other")}
              mainText={"Other"}
              onClick={() => {
                handleToggleOption("Other");
              }}
            />
            <div style={{ marginTop: "20px" }}>
              <Button
                label="Submit"
                className={styles.continueButton}
                onClick={handleSubmit}
                filled={true}
                width="88%"
              />
            </div>
            <div className={styles.subtitle2}>
              <div style={{ textAlign: "center", marginTop: "20px" }}>
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
