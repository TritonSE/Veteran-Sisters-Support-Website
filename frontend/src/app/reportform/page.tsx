"use client";

import React, { useState } from "react";
import Image from "next/image";

import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/Button";
import Checklist from "../components/Checklist";
import CustomDatePicker from "../components/CustomDatePicker";
import { NavBar } from "../components/NavBar";
import ReportDropdown from "../components/ReportDropdown";

import styles from "./page.module.css";

export default function ReportVeteran() {
  const { userRole } = useAuth();
  const [reportee, setReportee] = useState("");
  const [activeDropdown, setActiveDropdown] = useState("");
  const [proofOfLifeDate, setProofOfLifeDate] = useState<Date | null>(null);
  const [proofOfLifeTime, setProofOfLifeTime] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [situation, setSituation] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isTimeValid, setIsTimeValid] = useState(true);
  const [hasBlurred, setHasBlurred] = useState(false);

  const handleOptionClick = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option],
    );

    if (option === "Proof of life requested") {
      setHasBlurred(false);
    }
  };

  const toggleDropdown = (id: string) => {
    setActiveDropdown((prev) => (prev === id ? "" : id));
  };

  const volunteerOptions = [
    "Veteran is unresponsive",
    "Veteran made offensive comment",
    "Proof of life requested",
    "Other, please specify",
  ];
  const veteranOptions = [
    "Volunteer doesn’t respond",
    "Volunteer made offensive comment",
    "Other, please specify",
  ];

  const validTimeRegex = /^(1[0-2]|0?[1-9]):([0-5][0-9]) ?([AaPp][Mm])$/;

  return (
    <>
      <NavBar />
      <div className={styles.page}>
        <div className={styles.header}>
          <p className={styles.title}>Report</p>
          <p className={styles.subtitle}>
            {userRole === "volunteer"
              ? "If you are encountering a problem with your veteran, file a report below to the admins. The admin will get back to you as soon as possible."
              : "If you are encountering a problem with your volunteer, file a report below to the admins. The admin will get back to you as soon as possible."}
          </p>
        </div>
        <form className={styles.questionPanel}>
          <p className={styles.question}>
            {userRole === "volunteer"
              ? "Which veteran would you like to report?"
              : "Which volunteer would you like to report?"}
            <span className={styles.asterisk}> *</span>
          </p>
          <ReportDropdown
            options={
              userRole === "volunteer" ? ["Veteran A", "Veteran B"] : ["Volunteer A", "Volunteer B"]
            }
            isOpen={activeDropdown === "selectReportee"}
            toggleDropdown={() => {
              toggleDropdown("selectReportee");
            }}
            onSelect={(option) => {
              setReportee(option);
            }}
            selected={reportee}
          />
          <p className={styles.question}>
            What type of situation is this? <span className={styles.asterisk}> *</span>
          </p>
          <Checklist
            options={userRole === "volunteer" ? veteranOptions : volunteerOptions}
            onOptionClick={handleOptionClick}
            selectedOptions={selectedOptions}
          />
          {selectedOptions.includes("Proof of life requested") && (
            <div>
              <p className={styles.question}>
                When did you send proof of life? <span className={styles.asterisk}>*</span>
              </p>
              <div className={styles.dateTimeContainer}>
                <button
                  type="button"
                  className={styles.dateTimeDropdownButton}
                  style={{ width: "236px" }}
                  onClick={() => {
                    if (!proofOfLifeDate) {
                      const today = new Date();
                      setProofOfLifeDate(today);
                    }
                    setShowDatePicker((prev) => !prev);
                  }}
                >
                  <Image
                    src="/calendar.svg"
                    alt="Calendar Icon"
                    width={24}
                    height={24}
                    className={styles.calendarIcon}
                  />
                  <span className={styles.dateText}>
                    {proofOfLifeDate
                      ? proofOfLifeDate.toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        })
                      : "Select date"}
                  </span>
                </button>
                <button
                  type="button"
                  className={styles.dateTimeDropdownButton}
                  style={{
                    width: "156px",
                    borderColor: !isTimeValid && hasBlurred ? "#B93B3B" : "#bdc9d2",
                  }}
                >
                  <Image
                    src={!isTimeValid && hasBlurred ? "/clock-red.svg" : "/clock.svg"}
                    className={styles.calendarIcon}
                    alt="clock icon"
                    width={24}
                    height={24}
                  />
                  <input
                    type="text"
                    className={styles.timeInput}
                    placeholder="Enter time"
                    value={proofOfLifeTime}
                    onChange={(e) => {
                      const input = e.target.value;
                      const lastChar = input[input.length - 1];
                      const isDeleting = input.length < proofOfLifeTime.length;
                      let output = proofOfLifeTime;

                      if (isDeleting) {
                        if (output.endsWith("M")) {
                          output = output.slice(0, -2);
                        } else if (output.endsWith(" A") || output.endsWith(" P")) {
                          output = output.slice(0, -2);
                        } else {
                          output = output.slice(0, -1);
                        }
                        setProofOfLifeTime(output);
                        return;
                      }

                      if (proofOfLifeTime === "1" && lastChar === ":") {
                        setProofOfLifeTime("01:");
                        return;
                      }

                      const cleaned = input.replace(/[^0-9aApPmM: ]/g, "");
                      const digitsOnly = cleaned.replace(/[^0-9]/g, "");

                      if (digitsOnly.length === 1) {
                        const digit = parseInt(digitsOnly);
                        if (digit >= 2 && digit <= 9) {
                          output = `0${digit.toString()}:`;
                        } else if (digit === 1) {
                          output = `1`;
                        }
                      } else if (digitsOnly.length === 2) {
                        const hour = parseInt(digitsOnly);
                        if (hour >= 10 && hour <= 12) {
                          output = `${hour.toString()}:`;
                        } else {
                          return;
                        }
                      } else if (digitsOnly.length === 3) {
                        const minFirst = parseInt(digitsOnly[2]);
                        if (minFirst >= 0 && minFirst <= 5) {
                          output = `${digitsOnly.slice(0, 2)}:${digitsOnly[2]}`;
                        } else {
                          return;
                        }
                      } else if (digitsOnly.length === 4) {
                        const minutes = parseInt(digitsOnly.slice(2));
                        if (minutes >= 0 && minutes <= 59) {
                          output = `${digitsOnly.slice(0, 2)}:${digitsOnly.slice(2)} `;
                        } else {
                          return;
                        }
                      }

                      if (proofOfLifeTime.endsWith(" ") && /[aApP]/.test(lastChar)) {
                        output = proofOfLifeTime + lastChar.toUpperCase() + "M";
                      }

                      if (output.length <= 8) {
                        setProofOfLifeTime(output);
                      }
                    }}
                    onBlur={() => {
                      setHasBlurred(true);
                      setIsTimeValid(validTimeRegex.test(proofOfLifeTime));
                    }}
                    onFocus={() => {
                      setHasBlurred(false);
                    }}
                  />
                </button>
              </div>
              {showDatePicker && (
                <div className={styles.datePickerPopup}>
                  <CustomDatePicker
                    date={proofOfLifeDate}
                    onChange={(date: Date) => {
                      setProofOfLifeDate(date);
                    }}
                  />
                </div>
              )}
            </div>
          )}
          <p className={styles.question}>
            Explain the situation<span className={styles.asterisk}> *</span>
          </p>
          <textarea
            className={styles.situationTextBox}
            placeholder="Describe the situation in more detail"
            value={situation}
            onChange={(e) => {
              setSituation(e.target.value);
            }}
          />
          <div className={styles.buttonRow}>
            <Button type="button" label={"Cancel"} filled={false}></Button>
            <Button type="submit" label={"Submit"} filled={true}></Button>
          </div>
        </form>
      </div>
    </>
  );
}
