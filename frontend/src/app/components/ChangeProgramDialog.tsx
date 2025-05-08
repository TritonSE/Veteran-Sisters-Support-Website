// ChangeProgramDialog.tsx
import React, { useEffect, useRef, useState } from "react";

import { Role as RoleEnum } from "../api/profileApi";
import { updateUserProgramsAndRole } from "../api/userApi";

import styles from "./ChangeProgramDialog.module.css";
import { Role } from "./Role";

type ProgramOption = { label: string; value: string };

const AVAILABLE_PROGRAMS: ProgramOption[] = [
  { label: "Battle Buddies", value: "battle buddies" },
  { label: "Operational Wellness", value: "operation wellness" },
  { label: "Advocacy", value: "advocacy" },
];

type ChangeProgramDialogProps = {
  email: string | undefined;
  firstName?: string;
  role: RoleEnum | undefined;
  callback: (show: boolean) => void;
};

const ChangeProgramDialog = ({ email, firstName, role, callback }: ChangeProgramDialogProps) => {
  const [programs, setPrograms] = useState<string[]>([]);
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

  const handleCheckboxChange = (value: string) => {
    setPrograms((prev) =>
      prev.includes(value) ? prev.filter((p) => p !== value) : [...prev, value],
    );
  };

  const savePrograms = async () => {
    await updateUserProgramsAndRole(programs, role, email);
    callback(false);
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
                <input
                  type="checkbox"
                  value={opt.value}
                  checked={programs.includes(opt.value)}
                  onChange={() => {
                    handleCheckboxChange(opt.value);
                  }}
                  className={styles.checkbox}
                />
                {opt.label}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <button
          onClick={() => {
            void savePrograms();
          }}
          className={styles.btnPrimary}
        >
          Save
        </button>
        <button
          onClick={() => {
            callback(false);
          }}
          className={styles.btnSecondary}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ChangeProgramDialog;
