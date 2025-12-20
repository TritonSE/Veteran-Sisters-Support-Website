"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";

import { createAnnouncement } from "../../api/activities";
import { Button } from "../../components/Button";
import { NavBar } from "../../components/NavBar";
import { useAuth } from "../../contexts/AuthContext";
import { AuthContextWrapper } from "../../contexts/AuthContextWrapper";

import styles from "./page.module.css";

import ErrorMessage from "@/app/components/ErrorMessage";

function AnnouncementCreateContent() {
  const { userId } = useAuth();
  const [cancelPopup, setCancelPopup] = useState<boolean>(false);
  const [confirmPage, setConfirmPage] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [detail, setDetail] = useState<string>("");
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title === "" || detail === "") {
      return;
    }
    createAnnouncement({
      uploader: userId,
      title,
      description: detail,
    })
      .then((result) => {
        if (result.success) {
          setConfirmPage(true);
        } else {
          setErrorMessage(`Failed to create announcement: ${result.error}`);
        }
      })
      .catch((error: unknown) => {
        setErrorMessage(`Failed to create announcement: ${String(error)}`);
      });
  };

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
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.label}>
                <span>Title</span>
                <input
                  className={styles.inputTitle}
                  required
                  placeholder="Name your announcement"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                ></input>
              </div>
              <div className={styles.label}>
                <span>Details</span>
                <textarea
                  className={styles.inputDetails}
                  required
                  placeholder="Describe the announcement"
                  value={detail}
                  onChange={(e) => {
                    setDetail(e.target.value);
                  }}
                ></textarea>
              </div>
              <div className={styles.buttons}>
                <Button
                  label="Cancel"
                  className={styles.cancel}
                  type="button"
                  onClick={() => {
                    if (title !== "" || detail !== "") setCancelPopup(true);
                    else router.push("/announcements");
                  }}
                />
                <Button label="Send" filled={true} type="submit" />
              </div>
            </form>

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
                        router.push("/announcements");
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
                    setTitle("");
                    setDetail("");
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      {errorMessage && <ErrorMessage message={errorMessage} />}
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
