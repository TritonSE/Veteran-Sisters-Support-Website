"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";

import { Button } from "../../components/Button";
import { NavBar } from "../../components/NavBar";
import { useAuth } from "../../contexts/AuthContext";
import { AuthContextWrapper } from "../../contexts/AuthContextWrapper";

import styles from "./page.module.css";

function AnnouncementCreateContent() {
  const [cancelPopup, setCancelPopup] = useState<boolean>(false);
  const [confirmPage, setConfirmPage] = useState<boolean>(false);
  const router = useRouter();

  return (
    <div className={styles.container}>
      <NavBar />
      <div className={styles.page}>
        {!confirmPage && (
          <div className={styles.frame}>
            <div className={styles.header}>
              <span style={{ height: "38px" }}>Announcements 📢 </span>
              <div className={styles.subheader}>
                <span>
                  Share important updates, news, and information with all community members here.
                  Messages posted in this section will be visible to everyone.
                </span>
              </div>
            </div>
            <form className={styles.form}>
              <div className={styles.label}>
                <span>Title</span>
                <input
                  className={styles.inputTitle}
                  required
                  placeholder="Name your announcement"
                ></input>
              </div>
              <div className={styles.label}>
                <span>Details</span>
                <textarea
                  className={styles.inputDetails}
                  required
                  placeholder="Describe the announcement"
                ></textarea>
              </div>
            </form>
            <div className={styles.buttons}>
              <Button
                label="Cancel"
                className={styles.cancel}
                onClick={() => {
                  setCancelPopup(true);
                }}
              />
              <Button
                label="Send"
                filled={true}
                onClick={() => {
                  setConfirmPage(true);
                }}
              />
            </div>
            {cancelPopup && (
              <div>
                <div className={styles.overlay}></div>
                <div className={styles.modal}>
                  <div className={styles.confirmText}>
                    <span className={styles.confirmTextTitle}>Are you sure you want to exit?</span>
                    <span className={styles.confirmTextSub}>Your changes will not be saved.</span>
                  </div>
                  <div className={styles.buttons}>
                    <Button
                      label="Go back"
                      onClick={() => {
                        setCancelPopup(false);
                      }}
                    />
                    <Button
                      label="Exit"
                      filled={true}
                      onClick={() => {
                        router.back();
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {confirmPage && (
          <div>
            <div className={styles.frame}>
              <div className={styles.confirmHeader}>
                <span style={{ height: "38px" }}>Announcements 📢 </span>
              </div>
            </div>
            <div className={styles.confirmMessage}>
              <Image src="/check_primary.svg" alt="Check" width={92} height={92}></Image>
              <span className={styles.confirmTextSub}>Announcement sent to all members!</span>
              <div className={styles.centerButtons}>
                <Button
                  label="View past announcements"
                  onClick={() => {
                    router.push("/announcements");
                  }}
                />
                <Button
                  label="Send another announcement"
                  filled={true}
                  onClick={() => {
                    setConfirmPage(false);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AnnouncementCreate() {
  const { userRole } = useAuth();
  return (
    <AuthContextWrapper>
      <Suspense fallback={<div>Loading...</div>}>
        {userRole === "admin" ? (
          <AnnouncementCreateContent />
        ) : (
          <div className={styles.page}>
            <NavBar />
            <h1>Error: Invalid Permissions</h1>
          </div>
        )}
      </Suspense>
    </AuthContextWrapper>
  );
}
