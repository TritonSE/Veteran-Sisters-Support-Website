import React, { ChangeEvent, useEffect, useState } from "react";
import Image from "next/image"
import styles from "./FileUpload.module.css";
import { ref, updateMetadata, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";

type FileUploadProps = {
  onClose: () => void;
};
export function FileUpload({ onClose }: FileUploadProps) {
  const [checkboxStates, setCheckboxStates] = useState({BattleBuddies: false, IAdvocacy: false, OperationWellness: false})
  const [comments, setComments] = useState<string>()
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const uploadFile = () => {
    if (file) {
      const storageRef = ref(storage, file.name);
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
            .catch((error: unknown) => {
              console.error(error);
            });
        })
        .catch((error: unknown) => {
          console.error(error);
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
            <Image src="./doc_icon.svg" width={83} height={83} alt="doc"/>
          </div>
          {!file?(<>
          <label htmlFor="file-upload" className={styles.selectButton}>
            Select a File
          </label>
          <input accept=".doc,.docx,.pdf" onChange={handleFileChange} style={{display: "none"}} type="file" id="file-upload"/></>):(
            <div className={styles.filenameWrapper}>
              {file.name}
              <div onClick={()=>setFile(null)} className={styles.xbutton}>
                <Image src="./close_button.svg" width={24} height={24} alt="close_button" />
              </div>
            </div>
          )
          }
        </div>
        <div className={styles.fileTypeLabel}>Accepted File Types: PDF, DOC, DOCX</div>
        <div className={styles.bottomWrapper}>
          <div className={styles.programWrapper}>
            <div>
              <span>Upload to </span>
              <span style={{ color: "red" }}>* required</span>
            </div>
            <div className={styles.checkRow} onClick={()=>setCheckboxStates({...checkboxStates, BattleBuddies: !checkboxStates.BattleBuddies})}>
              <input type="checkbox" onChange={()=>{}} className={styles.checkBox} checked={checkboxStates.BattleBuddies}/> <span>Battle Buddies</span>
            </div>
            <div className={styles.checkRow} onClick={()=>setCheckboxStates({...checkboxStates, IAdvocacy: !checkboxStates.IAdvocacy})}>
              <input type="checkbox" onChange={()=>{}} className={styles.checkBox} checked={checkboxStates.IAdvocacy}/> <span>I Advocacy</span>
            </div>
            <div className={styles.checkRow} onClick={()=>setCheckboxStates({...checkboxStates, OperationWellness: !checkboxStates.OperationWellness})}>
              <input type="checkbox" onChange={()=>{}} className={styles.checkBox} checked={checkboxStates.OperationWellness}/> <span>Operation Wellness</span>
            </div>
          </div>
          <div className={styles.commentsWrapper}>
            <div>Additional comments</div>
            <textarea placeholder="Add a comment..." className={styles.commentsBox} onChange={(e)=>setComments(e.target.value)} />
          </div>
        </div>
        <div className={styles.buttonsRow}>
          <div className={styles.buttonsWrapper}>
            <div className={styles.cancelButton} onClick={onClose}>Cancel</div>
            <div className={styles.uploadButton} onClick={uploadFile}>Upload</div>
          </div>
        </div>
      </div>
    </>
  );
}
