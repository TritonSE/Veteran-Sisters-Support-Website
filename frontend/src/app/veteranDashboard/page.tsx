"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

import { User, getUser } from "../api/userApi";
import { FileUpload } from "../components/FileUpload";
import { NavBar } from "../components/NavBar";
import { VeteranFilesTable } from "../components/VeteranFilesTable";
import { useAuth } from "../contexts/AuthContext";

import styles from "./page.module.css";

export default function VeteranDashboard() {
  const { userId, loading: authLoading } = useAuth();
  const [uploadPopup, setUploadPopup] = useState<boolean>(false);
  const [refreshDashboard, setRefreshDashboard] = useState<boolean>(false);
  const [showUploadConfirm, setShowUploadConfirm] = useState<boolean>(false);
  const [currVeteran, setCurrVeteran] = useState<User>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Auth state:", { userId, authLoading });

    if (!authLoading && userId) {
      console.log("Fetching user data for ID:", userId);
      setLoading(true);
      getUser(userId)
        .then((response) => {
          if (response.success) {
            console.log("Successfully fetched user data:", response.data);
            setCurrVeteran(response.data);
          } else {
            console.error("Failed to fetch user data:", response.error);
          }
        })
        .catch((error: unknown) => {
          console.error("Error fetching user data:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (!authLoading) {
      console.log("No user ID available");
      setLoading(false);
    }
  }, [userId, authLoading]);

  if (loading || authLoading) {
    return (
      <>
        <NavBar />
        <div className={styles.page}>
          <div className={styles.loading}>Loading...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
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
