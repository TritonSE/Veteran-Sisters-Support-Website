"use client";
import { ref, updateMetadata, uploadBytes } from "firebase/storage";
import { ChangeEvent, useState } from "react";

import { FileUpload } from "./components/FileUpload";
import { storage } from "./firebase";
import styles from "./page.module.css";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadPopup, setUploadPopup] = useState<boolean>(false);

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
    <div className={styles.page}>
      <input onChange={handleFileChange} type="file" className={styles.button} />
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
