// ChangeProgramDialog.tsx
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

import {
  removeAllAssignedVeteransWithVolunteerId,
  removeAllAssignedVolunteersWithVeteranEmail,
} from "../api/activeVolunteers";
import { Role as RoleEnum } from "../api/profileApi";
import { updateUserProgramsAndRole } from "../api/userApi";

import styles from "./ChangeProgramDialog.module.css";
import { Role } from "./Role";

type ProgramOption = { label: string; value: string };

export const AVAILABLE_PROGRAMS: ProgramOption[] = [
  { label: "Battle Buddies", value: "battle buddies" },
  { label: "Operational Wellness", value: "operation wellness" },
  { label: "Advocacy", value: "advocacy" },
];

type ChangeProgramDialogProps = {
  email: string | undefined;
  firstName?: string;
  role: RoleEnum | undefined;
  userPrograms?: string[];
  callback: (show: boolean) => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
  onSavePrograms?: (newPrograms: string[]) => void;
  programsChanged?: (didProgramChange: boolean) => void;
  didProgramChange?: boolean; // optional prop to track if programs changed
};

const ChangeProgramDialog = ({
  email,
  firstName,
  userPrograms,
  role,
  callback,
  onSuccess,
  onError,
  onSavePrograms,
  programsChanged,
  didProgramChange,
}: ChangeProgramDialogProps) => {
  const [programs, setPrograms] = useState<string[]>(userPrograms ?? []);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // close dropdown on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  useEffect(() => {
    setPrograms(userPrograms ?? []);
  }, [userPrograms]);

  const handleCheckboxChange = (value: string) => {
    setPrograms((prev) =>
      prev.includes(value) ? prev.filter((p) => p !== value) : [...prev, value],
    );
  };

  const savePrograms = async () => {
    onError("");
    onSuccess("");

    try {
      const res = await updateUserProgramsAndRole(programs, role, email);
      if (!res.success) {
        onError(`Error updating programs: ${res.error}`);
        return;
      }
      // When changing TO volunteer, remove all volunteers assigned to this veteran
      if (role === RoleEnum.VOLUNTEER) {
        if (!email) {
          console.error("Email is required to remove assigned volunteers");
        } else {
          const res2 = await removeAllAssignedVolunteersWithVeteranEmail(email);
          if (!res2.success) {
            onError(`Error removing assigned volunteers: ${res2.error}`);
            return;
          }
        }
      }
      // When changing TO veteran, remove all veterans assigned to this volunteer
      else if (role === RoleEnum.VETERAN) {
        if (!email) {
          console.error("Email is required to remove assigned veterans");
        } else {
          const res2 = await removeAllAssignedVeteransWithVolunteerId(email);
          if (!res2.success) {
            onError(`Error removing assigned veterans: ${res2.error}`);
            return;
          }
        }
      }
      onSuccess("Successfully updated programs");
      onSavePrograms?.(programs);
      programsChanged?.(!didProgramChange);
      callback(false);
    } catch (error) {
      onError(`Error updating programs: ${String(error)}`);
    }
  };

  return (
    <div className={styles.dialog}>
      <h2 className={styles.title}>
        {firstName ? firstName : ""} <Role role={role} />
        {"'s Programs"}
      </h2>

      <div className={styles.dropdownWrapper} ref={containerRef}>
        <button
          type="button"
          className={styles.button}
          onClick={() => {
            setOpen((o) => !o);
          }}
        >
          {programs.length > 0
            ? AVAILABLE_PROGRAMS.filter((opt) => programs.includes(opt.value))
                .map((opt) => opt.label)
                .join(", ")
            : "Choose programs"}
          <span>▾</span>
        </button>

        {open && (
          <div className={styles.dropdownList}>
            {AVAILABLE_PROGRAMS.map((opt) => (
              <label key={opt.value} className={styles.dropdownItem}>
                <div className={styles.checkboxContainer}>
                  <input
                    id={`${opt.value}-checkbox`}
                    type="checkbox"
                    value={opt.value}
                    checked={programs.includes(opt.value)}
                    onChange={() => {
                      handleCheckboxChange(opt.value);
                    }}
                    className={styles.checkbox}
                  />
                  <label
                    htmlFor={`${opt.value}-checkbox`}
                    className={styles.checkmarkIcon}
                    style={programs.includes(opt.value) ? {} : { display: "none" }}
                  >
                    <Image width={20} height={20} src="/checkbox.svg" alt="Checkbox" />
                  </label>
                </div>
                {opt.label}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <button
          onClick={() => {
            callback(false);
          }}
          className={styles.btnSecondary}
        >
          Cancel
        </button>
        <button
          onClick={() => {
            void savePrograms();
          }}
          className={styles.btnPrimary}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default ChangeProgramDialog;
