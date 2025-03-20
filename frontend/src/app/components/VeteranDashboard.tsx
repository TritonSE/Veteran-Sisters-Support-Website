import Image from "next/image";
import { useEffect, useState } from "react";

import { getUser } from "../api/userApi";
import { User } from "../api/users";
import { FileUpload } from "../components/FileUpload";
import { VeteranFilesTable } from "../components/VeteranFilesTable";

import styles from "./VeteranDashboard.module.css";

type VeteranDashboardProp = {
  veteranId: string;
};

export function VeteranDashboard({ veteranId }: VeteranDashboardProp) {
  const [uploadPopup, setUploadPopup] = useState<boolean>(false);
  const [refreshDashboard, setRefreshDashboard] = useState<boolean>(false);
  const [showUploadConfirm, setShowUploadConfirm] = useState<boolean>(false);

  const [currVeteran, setCurrVeteran] = useState<User>();

  useEffect(() => {
    getUser(veteranId)
      .then((response) => {
        if (response.success) {
          setCurrVeteran(response.data);
          console.log(response.data);
        }
      })
      .catch((error: unknown) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      {currVeteran && (
        <div className={styles.page}>
          <div className={styles.topRow}>
            <h1>Welcome, {currVeteran?.firstName}!</h1>
            <div
              onClick={() => {
                setUploadPopup(true);
              }}
              className={styles.uploadButton}
            >
              <Image src="/upload_icon.svg" alt="upload" width={24} height={24} />
              Upload document
            </div>
          </div>
          <br />
          <br />
          <br />
          <VeteranFilesTable veteranId={currVeteran?._id} refresh={refreshDashboard} />
        </div>
      )}
      {uploadPopup && currVeteran && (
        <FileUpload
          veteranId={currVeteran?._id}
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
          <Image src="/check.svg" width={20} height={20} alt="check" />
          Document upload success!
        </div>
      )}
    </>
  );
}
