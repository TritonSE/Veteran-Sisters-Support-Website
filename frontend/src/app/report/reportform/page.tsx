"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

import { UserProfile } from "../../api/profileApi";
import { createReport } from "../../api/reportApi";
import { getUser } from "../../api/userApi";
import { Button } from "../../components/Button";
import Checklist from "../../components/Checklist";
import CustomDatePicker from "../../components/CustomDatePicker";
import { NavBar } from "../../components/NavBar";
import ReportDropdown from "../../components/ReportDropdown";
import { useAuth } from "../../contexts/AuthContext";

import styles from "./page.module.css";

import { APIResult } from "@/app/api/requests";
import { AuthContextWrapper } from "@/app/contexts/AuthContextWrapper";

function ReportFormContent() {
  const router = useRouter();
  const { userId, userRole, loading } = useAuth();
  const [activeDropdown, setActiveDropdown] = useState("");
  const [proofOfLifeDate, setProofOfLifeDate] = useState<Date | null>(null);
  const [proofOfLifeTime, setProofOfLifeTime] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isTimeValid, setIsTimeValid] = useState(true);
  const [hasBlurred, setHasBlurred] = useState(false);
  const [confirmPage, setConfirmPage] = useState<boolean>(false);
  const [assignedUsersProfiles, setAssignedUsersProfiles] = useState<UserProfile[]>([]);
  const [selectedReporteeName, setSelectedReporteeName] = useState<string>("");
  const [selectedReporteeProfile, setSelectedReporteeProfile] = useState<UserProfile | null>(null);

  const resetForm = () => {
    setSelectedReporteeName("");
    setActiveDropdown("");
    setProofOfLifeDate(null);
    setProofOfLifeTime("");
    setShowDatePicker(false);
    setExplanation("");
    setSelectedOptions([]);
    setIsTimeValid(true);
    setHasBlurred(false);
  };

  const dropdownOptions = assignedUsersProfiles.map((u) => ({
    label: `${u.firstName} ${u.lastName}`,
    value: u._id ?? "",
  }));

  const veteranOptions = [
    "Veteran is unresponsive",
    "Veteran made offensive comment",
    "Proof of life requested",
    "Other, please specify",
  ];
  const volunteerOptions = [
    "Volunteer doesn’t respond",
    "Volunteer made offensive comment",
    "Other, please specify",
  ];

  const situationEnumMap: Record<
    string,
    "Unresponsive" | "Offensive comment" | "Proof of life" | "Other" | "Doesn’t respond"
  > = {
    "Veteran is unresponsive": "Unresponsive",
    "Volunteer doesn’t respond": "Doesn’t respond",
    "Veteran made offensive comment": "Offensive comment",
    "Volunteer made offensive comment": "Offensive comment",
    "Proof of life requested": "Proof of life",
    "Other, please specify": "Other",
  };

  const validTimeRegex = /^(1[0-2]|0?[1-9]):([0-5][0-9]) ?([AaPp][Mm])$/;

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

  const handleSubmit = async () => {
    if (selectedReporteeName === "" || explanation === "" || selectedOptions.length === 0) {
      return;
    }

    if (selectedOptions.includes("Proof of life requested")) {
      if (!proofOfLifeDate) {
        return;
      }
      if (!proofOfLifeTime || !validTimeRegex.test(proofOfLifeTime)) {
        return;
      }
    }

    const mappedSituation = selectedOptions.map((opt) => situationEnumMap[opt]);

    const others = mappedSituation.filter((v) => v === "Other");
    const core = mappedSituation.filter((v) => v !== "Other");

    const orderedSituations = [...core, ...others];

    try {
      const res = await createReport({
        reporterId: userId,
        reporteeId: selectedReporteeProfile?._id ?? "",
        situation: orderedSituations,
        proofOfLifeDate: proofOfLifeDate ?? null,
        proofOfLifeTime: proofOfLifeTime ?? null,
        explanation,
      });
      if (!res.success) {
        console.error("Failed to create report:", res.error);
        return;
      }
      setConfirmPage(true);
    } catch (err) {
      console.error("Unexpected error creating report:", err);
    }
  };

  function hasStringId(u: UserProfile): u is UserProfile & { _id: string } {
    return typeof u._id === "string";
  }

  useEffect(() => {
    if (loading || !userId) return;

    getUser(userId)
      .then((res: APIResult<UserProfile>) => {
        if (!res.success) {
          console.error("Error loading current user:", res.error);
          return;
        }
        const me = res.data;
        if (!me.assignedUsers?.length) {
          setAssignedUsersProfiles([]);
          return;
        }

        const validUsers = me.assignedUsers.filter(hasStringId);

        return Promise.all(validUsers.map((assignedUser) => getUser(assignedUser._id)))
          .then((results) => {
            const profiles = results
              .filter((r): r is APIResult<UserProfile> & { success: true } => r.success)
              .map((r) => r.data);
            setAssignedUsersProfiles(profiles);
          })
          .catch(console.error);
      })
      .catch(console.error);
  }, [loading, userId]);

  return (
    <div className={styles.container}>
      <NavBar />
      <div className={styles.page}>
        {!confirmPage && (
          <div className={styles.frame}>
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
                options={dropdownOptions}
                isOpen={activeDropdown === "selectReportee"}
                toggleDropdown={() => {
                  toggleDropdown("selectReportee");
                }}
                onSelect={(option) => {
                  setSelectedReporteeName(option.label);
                  const profile = assignedUsersProfiles.find((u) => u._id === option.value) ?? null;
                  setSelectedReporteeProfile(profile);
                }}
                selected={selectedReporteeName}
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
                value={explanation}
                onChange={(e) => {
                  setExplanation(e.target.value);
                }}
              />
              <div className={styles.buttonRow}>
                <Button
                  type="button"
                  label={"Cancel"}
                  filled={false}
                  onClick={() => {
                    router.push("/report");
                  }}
                ></Button>
                <Button
                  type="button"
                  label={"Submit"}
                  filled={true}
                  onClick={() => {
                    void handleSubmit();
                  }}
                ></Button>
              </div>
            </form>
          </div>
        )}
        {confirmPage && (
          <div className={styles.frame}>
            <p className={styles.title}>Report</p>
            <div className={styles.confirmMessage}>
              <Image src="/check_primary.svg" alt="Check" width={92} height={92}></Image>
              <span className={styles.confirmTextSub}>
                Submitted successfully against {selectedReporteeName}! The admin will contact you
                and your volunteer through email or text message.{" "}
              </span>
              <div className={styles.centerButtons}>
                <Button
                  label="View past reports"
                  onClick={() => {
                    router.push("/report");
                  }}
                />
                <Button
                  label="Send another report"
                  filled={true}
                  onClick={() => {
                    resetForm();
                    setConfirmPage(false);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ReportFormPage() {
  const { userRole } = useAuth();
  return (
    <AuthContextWrapper>
      <Suspense fallback={<div>Loading...</div>}>
        {userRole === "veteran" || userRole === "volunteer" ? (
          <ReportFormContent />
        ) : (
          <div className={styles.page}>
            <NavBar />
            <h1>Error: Invalid Permissions Report</h1>
          </div>
        )}
      </Suspense>
    </AuthContextWrapper>
  );
}
