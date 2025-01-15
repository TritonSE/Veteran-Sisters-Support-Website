"use client";
import { useState } from "react";

import { FileUpload } from "./components/FileUpload";
import styles from "./page.module.css";

export default function Home() {
  const [uploadPopup, setUploadPopup] = useState<boolean>(false);

  return (
    <div className={styles.page}>
      <button
        onClick={() => {
          setUploadPopup(true);
        }}
      >
        Upload
      </button>
      {uploadPopup && (
        <FileUpload
          onClose={() => {
            setUploadPopup(false);
          }}
        ></FileUpload>
      )}
    </div>
  );
}
