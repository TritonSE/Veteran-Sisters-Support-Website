import React from "react";

import styles from "./FileUpload.module.css";

type FileUploadProps = {
  onClose: () => void;
};
export function FileUpload({ onClose }: FileUploadProps) {
  return (
    <>
      <div className={styles.overlay} />
      <div className={styles.modal}>
        <div className={styles.xwrapper}>
          <div onClick={onClose} className={styles.xbutton}>
            <img src="./close_button.svg" />
          </div>
        </div>
        <div className={styles.uploadWrapper}>
          <div className={styles.iconWrapper}>
            <img src="./pdf_icon.svg" />
            <span>or</span>
            <img src="./doc_icon.svg" />
          </div>
          <button className={styles.selectButton}>Select a file</button>
        </div>
        <div className={styles.fileTypeLabel}>Accepted File Types: PDF, DOC, DOCX</div>
        <div className={styles.bottomWrapper}>
          <div className={styles.programWrapper}>
            <div>
              <span>Upload to </span>
              <span style={{ color: "red" }}>* required</span>
            </div>
            <div className={styles.checkRow}>
              <div className={styles.checkBox} /> <span>Battle Buddies</span>
            </div>
            <div className={styles.checkRow}>
              <div className={styles.checkBox} /> <span>I Advocacy</span>
            </div>
            <div className={styles.checkRow}>
              <div className={styles.checkBox} /> <span>Operation Wellness</span>
            </div>
          </div>
          <div className={styles.commentsWrapper}>
            <div>Additional comments</div>
            <textarea placeholder="Add a comment..." className={styles.commentsBox} />
          </div>
        </div>
      </div>
    </>
  );
}
