"use client";

import Image from "next/image";
import React, { MouseEvent, useEffect, useRef, useState } from "react";

import styles from "./page.module.css";

import { BackButton } from "@/app/components/BackButton";
import { Button } from "@/app/components/Button";
import CustomDropdown from "@/app/components/CustomDropdown";
import ProgressBar from "@/app/components/ProgressBar";

type ServiceDetailsProps = {
  serviceDate: string;
  setServiceDate: (value: string) => void;
  branch: string;
  setBranch: (value: string) => void;
  militaryStatus: string;
  setMilitaryStatus: (value: string) => void;
  gender: string;
  setGender: (value: string) => void;
  activeDropdown: string;
  toggleDropdown: (id: string) => void;
  formErrors: Record<string, string | undefined>;
  setFormErrors: React.Dispatch<React.SetStateAction<Record<string, string | undefined>>>;
  onNext: () => void;
  onPrevious: () => void;
};

export default function ServiceDetails({
  serviceDate,
  setServiceDate,
  branch,
  setBranch,
  militaryStatus,
  setMilitaryStatus,
  gender,
  setGender,
  activeDropdown,
  toggleDropdown,
  formErrors,
  setFormErrors,
  onNext,
  onPrevious,
}: ServiceDetailsProps) {
  const errorRef = useRef<HTMLParagraphElement>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    if (hasSubmitted && formErrors.service && formErrors.service !== "" && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth" });
    }
    setHasSubmitted(false);
  }, [hasSubmitted, formErrors.service]);

  const handleContinue = (e: MouseEvent<HTMLButtonElement>) => {
    setHasSubmitted(true);
    e.preventDefault();
    const dateRegex = /^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])-\d{4}$/;
    if (!serviceDate || !dateRegex.test(serviceDate) || !branch || !militaryStatus || !gender) {
      setFormErrors((prev) => ({ ...prev, service: "All fields are required." }));
      return;
    } else {
      setFormErrors((prev) => ({ ...prev, service: "" }));
    }
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
            <ProgressBar percentCompleted={50} />
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
            onChange={(e) => {
              setServiceDate(e.target.value);
            }}
          />
          <div className={styles.formEntry}>
            Branch of service<a style={{ color: "#B80037" }}> *</a>
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
            onSelect={(option) => {
              setBranch(option);
            }}
            selected={branch}
          />
          <label htmlFor="status" className={styles.formEntry}>
            Current military status<a style={{ color: "#B80037" }}> *</a>
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
            onSelect={(option) => {
              setMilitaryStatus(option);
            }}
            selected={militaryStatus}
          />
          <label htmlFor="gender" className={styles.formEntry}>
            Gender<a style={{ color: "#B80037" }}> *</a>
          </label>
          <CustomDropdown
            options={["Female", "Male", "Other"]}
            isOpen={activeDropdown === "select3"}
            toggleDropdown={() => {
              toggleDropdown("select3");
            }}
            onSelect={(option) => {
              setGender(option);
            }}
            selected={gender}
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
