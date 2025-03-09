import { ref, uploadBytes } from "firebase/storage";
import Image from "next/image";
import React, { ChangeEvent, useState } from "react";

import { storage } from "../../../firebase/firebase";
import { CreateFileObjectRequest, createFileObject } from "../api/fileApi";

import styles from "./FileUpload.module.css";

type FileUploadProps = {
  veteranId: string
  onClose: () => void;
  onUpload: () => void;
};

type CheckBoxStates = {
  BattleBuddies: boolean;
  Advocacy: boolean;
  OperationWellness: boolean;
};

export function FileUpload({ veteranId, onClose, onUpload }: FileUploadProps) {
  const [checkboxStates, setCheckboxStates] = useState<CheckBoxStates>({
    BattleBuddies: false,
    Advocacy: false,
    OperationWellness: false,
  });
  const [comment, setComment] = useState<string>();
  const [file, setFile] = useState<File | null>(null);
  const [sizeError, setSizeError] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const currFile = e.target.files[0];
      if (currFile.size > 1000000000) {
        setSizeError(true);
      } else {
        setSizeError(false);
        setFile(e.target.files[0]);
      }
    }
  };

  const uploadFile = () => {
    if (
      file &&
      (checkboxStates.BattleBuddies ||
        checkboxStates.Advocacy ||
        checkboxStates.OperationWellness) &&
      !uploading
    ) {
      setUploading(true);
      const fileObjRequest: CreateFileObjectRequest = {
        filename: file.name,
        uploaderId: veteranId,
        comment: comment ?? "",
        programs: Object.keys(checkboxStates).filter(
          (key) => checkboxStates[key as keyof CheckBoxStates],
        ),
      };
      createFileObject(fileObjRequest)
        .then((result) => {
          if (result.success) {
            console.log("file object created");
            const storageRef = ref(storage, `files/${result.data._id}`);
            uploadBytes(storageRef, file)
              .then(() => {
                setUploading(false);
                onClose();
                onUpload();
              })
              .catch((error: unknown) => {
                console.error(error);
              });
          } else {
            console.error(result.error);
          }
        })
        .catch((err: unknown) => {
          console.error(err);
        });
    }
  };

  return (
    <>
      <div className={styles.overlay} />
      <div className={styles.modal}>
        <div className={styles.xwrapper}>
          <div onClick={onClose} className={styles.xbutton}>
            <Image src="/close_button.svg" width={24} height={24} alt="close_button" />
          </div>
        </div>
        <div className={styles.uploadWrapper}>
          <div className={styles.iconWrapper}>
            <Image src="/pdf_icon.svg" width={83} height={83} alt="pdf" />
            <span>or</span>
            <Image src="/doc_icon.svg" width={83} height={83} alt="doc" />
          </div>
          {!file ? (
            <>
              <label htmlFor="file-upload" className={styles.selectButton}>
                Select a File
              </label>
              <input
                accept=".doc,.docx,.pdf"
                onChange={handleFileChange}
                style={{ display: "none" }}
                type="file"
                id="file-upload"
              />
            </>
          ) : (
            <div className={styles.filenameWrapper}>
              {file.name}
              <div
                onClick={() => {
                  setFile(null);
                }}
                className={styles.xbutton}
              >
                <Image src="/close_button.svg" width={24} height={24} alt="close_button" />
              </div>
            </div>
          )}
        </div>
        <div className={styles.fileTypeLabel}>Accepted File Types: PDF, DOC, DOCX</div>
        <div className={styles.bottomWrapper}>
          <div className={styles.programWrapper}>
            <div>
              <span>Upload to </span>
              <span style={{ color: "red" }}>* required</span>
            </div>
            <div
              className={styles.checkRow}
              onClick={() => {
                setCheckboxStates({
                  ...checkboxStates,
                  BattleBuddies: !checkboxStates.BattleBuddies,
                });
              }}
            >
              <input
                type="checkbox"
                onChange={() => {
                  console.log("clicked BattleBuddies");
                }}
                className={styles.checkBox}
                checked={checkboxStates.BattleBuddies}
              />{" "}
              <span>Battle Buddies</span>
            </div>
            <div
              className={styles.checkRow}
              onClick={() => {
                setCheckboxStates({ ...checkboxStates, Advocacy: !checkboxStates.Advocacy });
              }}
            >
              <input
                type="checkbox"
                onChange={() => {
                  console.log("clicked Advocacy");
                }}
                className={styles.checkBox}
                checked={checkboxStates.Advocacy}
              />{" "}
              <span>Advocacy</span>
            </div>
            <div
              className={styles.checkRow}
              onClick={() => {
                setCheckboxStates({
                  ...checkboxStates,
                  OperationWellness: !checkboxStates.OperationWellness,
                });
              }}
            >
              <input
                type="checkbox"
                onChange={() => {
                  console.log("clicked OperationWellness");
                }}
                className={styles.checkBox}
                checked={checkboxStates.OperationWellness}
              />{" "}
              <span>Operation Wellness</span>
            </div>
          </div>
          <div className={styles.commentsWrapper}>
            <div>Additional comments</div>
            <textarea
              placeholder="Add a comment..."
              className={styles.commentsBox}
              onChange={(e) => {
                setComment(e.target.value);
              }}
            />
          </div>
        </div>
        <div className={styles.buttonsRow}>
          <div className={styles.buttonsWrapper}>
            <div className={styles.cancelButton} onClick={onClose}>
              Cancel
            </div>
            <div className={styles.uploadButton} onClick={uploadFile}>
              Upload
            </div>
          </div>
        </div>
        {sizeError && (
          <div className={styles.error}>
            <Image src="/error_symbol.svg" alt="error" width={20} height={20} /> File size was too
            big, please upload one smaller than 1 GB!
          </div>
        )}
      </div>
    </>
  );
}
