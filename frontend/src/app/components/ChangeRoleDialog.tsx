import React, { useEffect, useRef, useState } from "react";

import { Role as RoleEnum } from "../api/profileApi";

import ChangeProgramDialog from "./ChangeProgramDialog";
import styles from "./ChangeRoleDialog.module.css";
import { Role } from "./Role";

type RoleOption = { label: string; value: RoleEnum };

const AVAILABLE_ROLES: RoleOption[] = [
  { label: "Staff", value: RoleEnum.STAFF },
  { label: "Volunteer", value: RoleEnum.VOLUNTEER },
  { label: "Veteran", value: RoleEnum.VETERAN },
];

type ChangeRoleDialogProps = {
  email?: string;
  firstName?: string;
  role: RoleEnum;
  onNext: (newrole: RoleEnum) => void;
  onCancel: () => void;
};

const ChangeRoleDialog = ({ email, firstName, role, onNext, onCancel }: ChangeRoleDialogProps) => {
  const [newRole, setNewRole] = useState<RoleEnum>();
  const [availableRoles, setAvailableRoles] = useState<RoleOption[]>([]);
  const [open, setOpen] = useState(false);
  const [showProgramDialog, setShowProgramDialog] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // update available roles based on initial role
  useEffect(() => {
    if (role === RoleEnum.STAFF || role === RoleEnum.VETERAN) {
      setAvailableRoles(AVAILABLE_ROLES.filter((opt) => opt.label === "Volunteer"));
    } else if (role === RoleEnum.VOLUNTEER) {
      setAvailableRoles(
        AVAILABLE_ROLES.filter((opt) => opt.label === "Veteran" || opt.label === "Staff"),
      );
    } else {
      setAvailableRoles(AVAILABLE_ROLES);
    }
  }, [role]);

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

  const handleDropdownSelect = (value: RoleEnum) => {
    setNewRole(value);
    setOpen(false);
  };

  const handleNext = () => {
    if (newRole) {
      onNext(newRole); // bubble up the newRole to the parent
    }
  };

  const selectedLabel =
    AVAILABLE_ROLES.find((opt) => opt.value === newRole)?.label ?? "Choose role";

  return (
    <div className={styles.dialog}>
      <h2 className={styles.title}>
        {firstName ? `Change ${firstName}'s Role from ` : "Change Role from "} <Role role={role} />{" "}
        To {newRole ? <Role role={newRole} /> : "..."}
      </h2>

      <div className={styles.dropdownWrapper} ref={containerRef}>
        <button
          type="button"
          className={styles.button}
          onClick={() => {
            setOpen((o) => !o);
          }}
        >
          {selectedLabel}
          <span className={styles.arrow}>▾</span>
        </button>

        {open && (
          <div className={styles.dropdownList}>
            {availableRoles.map((opt) => (
              <div
                key={opt.value}
                className={styles.dropdownItem}
                onClick={() => {
                  handleDropdownSelect(opt.value);
                }}
              >
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <button onClick={handleNext} className={styles.btnPrimary}>
          Next
        </button>
        <button onClick={onCancel} className={styles.btnSecondary}>
          Cancel
        </button>
      </div>

      {showProgramDialog && (
        <ChangeProgramDialog
          firstName={firstName}
          role={newRole}
          email={email}
          callback={setShowProgramDialog}
        />
      )}
    </div>
  );
};

export default ChangeRoleDialog;
