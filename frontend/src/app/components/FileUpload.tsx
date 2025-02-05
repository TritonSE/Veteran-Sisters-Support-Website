import { ref, updateMetadata, uploadBytes } from "firebase/storage";
import Image from "next/image";
import React, { ChangeEvent, useState } from "react";

import createFileObject, { CreateFileObjectRequest } from "../api/fileApi";
import { storage } from "../../../firebase/firebase";

import styles from "./FileUpload.module.css";

type FileUploadProps = {
  onClose: () => void;
};

type CheckBoxStates = {
  BattleBuddies: boolean;
  IAdvocacy: boolean;
  OperationWellness: boolean;
};

export function FileUpload({ onClose }: FileUploadProps) {
  const [checkboxStates, setCheckboxStates] = useState<CheckBoxStates>({
    BattleBuddies: false,
    IAdvocacy: false,
    OperationWellness: false,
  });
  const [comments, setComments] = useState<string>();
  const [file, setFile] = useState<File | null>(null);
  const [sizeError, setSizeError] = useState<boolean>(false);

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
      (checkboxStates.BattleBuddies || checkboxStates.IAdvocacy || checkboxStates.OperationWellness)
    ) {
      const fileObjRequest: CreateFileObjectRequest = {
        filename: file.name,
        uploader: "Steve",
        comments: comments ? [comments] : [],
        programs: Object.keys(checkboxStates).filter(
          (key) => checkboxStates[key as keyof CheckBoxStates],
        ),
      };
      console.log(Object.keys(checkboxStates));
      createFileObject(fileObjRequest)
        .then((result) => {
          if (result.success) {
            console.log("file object created");
            const extension = file.name.includes(".") ? (file.name.split(".").pop() ?? "") : "";
            const storageRef = ref(storage, `files/${result.data._id}.${extension}`);
            uploadBytes(storageRef, file)
              .then(() => {
                console.log("uploaded!");
                const newMetadata = {
                  customMetadata: {
                    uploader: "Steve", // user id
                    permittedUsers: "Joe$Srikar$Andrew", // user ids encoded (has to be string)
                  },
                };
                updateMetadata(storageRef, newMetadata)
                  .then(() => {
                    console.log("updated!");
                    onClose();
                  })
                  .catch((err: unknown) => {
                    console.error(err);
                  });
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
            <Image src="./close_button.svg" width={24} height={24} alt="close_button" />
          </div>
        </div>
        <div className={styles.uploadWrapper}>
          <div className={styles.iconWrapper}>
            <Image src="./pdf_icon.svg" width={83} height={83} alt="pdf" />
            <span>or</span>
            <Image src="./doc_icon.svg" width={83} height={83} alt="doc" />
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
                <Image src="./close_button.svg" width={24} height={24} alt="close_button" />
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
                setCheckboxStates({ ...checkboxStates, IAdvocacy: !checkboxStates.IAdvocacy });
              }}
            >
              <input
                type="checkbox"
                onChange={() => {
                  console.log("clicked IAdvocacy");
                }}
                className={styles.checkBox}
                checked={checkboxStates.IAdvocacy}
              />{" "}
              <span>I Advocacy</span>
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
                setComments(e.target.value);
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
            <Image src="./error_symbol.svg" alt="error" width={20} height={20} /> File size was too
            big, please upload one smaller than 1 GB!
          </div>
        )}
      </div>
    </>
  );
}
