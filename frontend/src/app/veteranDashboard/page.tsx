"use client";
import Image from "next/image";
import { useState } from "react";

import { FileUpload } from "../components/FileUpload";
import { NavBar } from "../components/NavBar";
import { UnreadActivities } from "../components/UnreadActivities";
import { VeteranFilesTable } from "../components/VeteranFilesTable";

import styles from "./veteranDashboard.module.css";

export default function VeteranDashboard() {
  const [uploadPopup, setUploadPopup] = useState<boolean>(false);
  const [refreshDashboard, setRefreshDashboard] = useState<boolean>(false);
  const [showUploadConfirm, setShowUploadConfirm] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(true);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  return (
    <>
      <NavBar />
      <div className={styles.page}>
        <div className={styles.topRow}>
          <h1>Welcome, Steve!</h1>
          <div
            onClick={() => {
              setUploadPopup(true);
            }}
            className={styles.uploadButton}
          >
            <Image src="./upload_icon.svg" alt="upload" width={24} height={24} />
            Upload document
          </div>
        </div>

        <UnreadActivities isOpen={dropdownOpen} toggleDropdown={toggleDropdown} />

        <br />
        <br />
        <br />
        <VeteranFilesTable refresh={refreshDashboard} />
      </div>
      {uploadPopup && (
        <FileUpload
          onClose={() => {
            setUploadPopup(false);
          }}
          onUpload={() => {
            setRefreshDashboard(!refreshDashboard);
            setShowUploadConfirm(true);
            setTimeout(() => {
              setShowUploadConfirm(false);
            }, 5000);
          }}
        />
      )}
      {showUploadConfirm && (
        <div className={styles.uploadConfirm}>
          <Image src="./check.svg" width={20} height={20} alt="check" />
          Document upload success!
        </div>
      )}
    </>
  );
}
