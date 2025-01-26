"use client";
import Image from "next/image";
import { useState } from "react";

import { FileUpload } from "./components/FileUpload";
import { NavBar } from "./components/NavBar";
import { VeteranDashboard } from "./components/VeteranDashboard";
import styles from "./page.module.css";

export default function Home() {
  const [uploadPopup, setUploadPopup] = useState<boolean>(false);
  const [refreshDashboard, setRefreshDashboard] = useState<boolean>(false);

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
        <br />
        <br />
        <br />
        <VeteranDashboard refresh={refreshDashboard} />
      </div>
      {uploadPopup && (
        <FileUpload
          onClose={() => {
            setUploadPopup(false);
          }}
          onUpload={() => {
            setRefreshDashboard(!refreshDashboard);
          }}
        />
      )}
    </>
  );
}
