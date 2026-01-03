import Image from "next/image";
import React, { useState } from "react";

import { Role as RoleEnum } from "../api/profileApi";

import ChangeProgramDialog from "./ChangeProgramDialog";
import ChangeRoleDialog from "./ChangeRoleDialog";
import styles from "./EditProfileDialog.module.css";

type ProfileActionsProps = {
  isProfileEditable: boolean;
  isProgramAndRoleEditable: boolean;
  minimized: boolean;
  showDocuments: boolean;
  searchParams: URLSearchParams;
  router: { push: (url: string) => void };
  pathname: string;
  firstName: string | undefined;
  email: string | undefined;
  role: RoleEnum | undefined;
  selectedRole: RoleEnum | undefined;
  userPrograms: string[];
  handleRoleNext: (newRole: RoleEnum) => void;
  handleProgramsChange: (newPrograms: string[]) => void;
  didProgramChange: boolean;
  programsChanged: (programChanged: boolean) => void;
  callback: () => void;
};

const ProfileActions = ({
  isProfileEditable,
  isProgramAndRoleEditable,
  minimized,
  showDocuments,
  searchParams,
  router,
  pathname,
  firstName,
  email,
  role,
  selectedRole,
  userPrograms,
  didProgramChange,
  handleRoleNext,
  handleProgramsChange,
  programsChanged,
  callback, // optional: parent can listen when menu toggles
}: ProfileActionsProps) => {
  const [showRoleChangeDialog, setShowRoleChangeDialog] = useState(false);
  const [showProgramChangeDialog, setShowProgramChangeDialog] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // controls visibility of dropdown

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
    if (callback) callback();
  };

  const onRoleNext = (newRole: RoleEnum) => {
    handleRoleNext(newRole); // 1️⃣ lift state to the header
    setShowRoleChangeDialog(false); // 2️⃣ close role dialog
    setShowProgramChangeDialog(true); // 3️⃣ open program dialog
  };

  // Navigate to personal‑profile edit route
  const handleEditProfile = () => {
    const linkSearchParams = new URLSearchParams(searchParams);
    router.push(`${pathname}/edit?${linkSearchParams.toString()}`);
    setMenuOpen(false); // close menu after navigation
  };

  const handleDocumentView = () => {
    const linkSearchParams = new URLSearchParams(searchParams);
    router.push(`${pathname}/documentView?${linkSearchParams.toString()}`);
    if (menuOpen) {
      setMenuOpen(false);
    }
  };

  // Build action list ---------------------------------------------------
  type Action = {
    label: string;
    onClick: () => void;
  };

  const rawActions = [
    isProgramAndRoleEditable && {
      label: "Edit program",
      onClick: () => {
        setShowProgramChangeDialog(true);
        setMenuOpen(false);
      },
    },
    isProgramAndRoleEditable && {
      label: "Change role",
      onClick: () => {
        setShowRoleChangeDialog(true);
        setMenuOpen(false);
      },
    },
    isProfileEditable && {
      label: "Edit profile",
      onClick: handleEditProfile,
    },
  ];

  const actions = rawActions.filter(Boolean) as Action[];
  if (actions.length === 0 && !showDocuments) return null;

  // Render --------------------------------------------------------------
  return (
    <div className={styles.profileActionsWrapper}>
      {/* Three‑dots trigger */}
      {!minimized && showDocuments && isProgramAndRoleEditable ? (
        <div className={styles.headerTopRight}>
          <p className={styles.documentView} onClick={handleDocumentView}>
            View all documents
          </p>
          <Image
            src="/meatball_menu.svg"
            width={20}
            height={20}
            alt="Open actions menu"
            onClick={toggleMenu}
            className={styles.meatballMenu}
          />
        </div>
      ) : isProgramAndRoleEditable || isProfileEditable ? (
        <div className={styles.headerTopRight}>
          <Image
            src="/meatball_menu.svg"
            width={20}
            height={20}
            alt="Open actions menu"
            onClick={toggleMenu}
            className={styles.meatballMenu}
          />
        </div>
      ) : showDocuments ? (
        <div className={styles.headerTopRight}>
          <p className={styles.documentView} onClick={handleDocumentView}>
            View all documents
          </p>
        </div>
      ) : (
        <></>
      )}

      {/* Dropdown card (conditionally rendered) */}
      {menuOpen && (
        <div className={styles.profileActionsCard}>
          {actions.map(({ label, onClick }) => (
            <button key={label} className={styles.profileActionsButton} onClick={onClick}>
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Secondary dialogs --------------------------------------------- */}
      {showRoleChangeDialog && role && (
        <div
          className={styles.modalOverlay}
          onClick={() => {
            setShowRoleChangeDialog(false);
          }}
        >
          {/* stopPropagation prevents closing when clicking inside dialog */}
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <ChangeRoleDialog
              firstName={firstName}
              email={email}
              role={role}
              onNext={onRoleNext}
              onSavePrograms={handleProgramsChange}
              onCancel={() => {
                setShowRoleChangeDialog(false);
              }}
            />
          </div>
        </div>
      )}

      {showProgramChangeDialog && role && (
        <div
          className={styles.modalOverlay}
          onClick={() => {
            setShowProgramChangeDialog(false);
          }}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <ChangeProgramDialog
              firstName={firstName}
              email={email}
              role={selectedRole}
              userPrograms={userPrograms}
              didProgramChange={didProgramChange}
              programsChanged={programsChanged}
              callback={setShowProgramChangeDialog}
              onSavePrograms={handleProgramsChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileActions;
