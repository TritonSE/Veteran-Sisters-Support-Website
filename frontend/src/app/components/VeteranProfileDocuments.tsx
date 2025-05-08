"use client";
import React, { useEffect, useState } from "react";

import { Comment, FileObject, getFilesByUploader } from "../api/fileApi";
import { Role as RoleEnum, UserProfile } from "../api/profileApi";
import { getUser } from "../api/userApi";
import { useAuth } from "../contexts/AuthContext";

import { VeteranFilePreview } from "./VeteranFilePreview";
import styles from "./VeteranFilesTable.module.css";

type VeteranDocumentProps = {
  uploader: string;
};

export function VeteranDocuments({ uploader }: VeteranDocumentProps) {
  const { userId } = useAuth();
  const [user, setUser] = useState<UserProfile>();

  const programs = ["operation wellness", "battle buddies", "advocacy"];
  const programMap: Record<string, string> = {
    "operation wellness": "Operation Wellness",
    "battle buddies": "Battle Buddies",
    advocacy: "Advocacy",
  };

  const [fileObjects, setFileObjects] = useState<FileObject[]>([]);

  const getLatestComment = (comments: Comment[]) => {
    let latest = new Date(Date.UTC(1900, 0, 1));
    let changed = false;
    for (const comment of comments) {
      const date = new Date(comment.datePosted);
      if (date > latest) {
        latest = date;
        changed = true;
      }
    }
    return changed ? latest : undefined;
  };

  const shouldLock = (file: FileObject) => {
    if (user?.role === RoleEnum.VOLUNTEER || user?.role === RoleEnum.STAFF) {
      for (const assignedUser of user.assignedUsers ?? []) {
        if (assignedUser._id === file.uploader._id) {
          return !user.assignedPrograms?.some((element) => file.programs.includes(element));
        }
      }
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    getFilesByUploader(uploader)
      .then((result) => {
        if (result.success) {
          setFileObjects(result.data);
        } else {
          console.log(result.error);
        }
      })
      .catch((err: unknown) => {
        console.error(err);
      });
    getUser(userId)
      .then((response) => {
        if (response.success) {
          setUser(response.data);
        }
      })
      .catch((error: unknown) => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      {user &&
        programs.map((program, index) => (
          <div
            key={index}
            style={{ marginBottom: 24, paddingTop: 30, borderTop: "1px solid #E0E0E0" }}
          >
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
              <div className={styles.programName}>{programMap[program]} Documents</div>
              <p style={{ color: "#057E6F" }}>See all documents</p>
            </div>
            <div className={styles.documentTable}>
              {fileObjects
                .filter((obj) => obj.programs.includes(program))
                .slice(0, 4)
                .map((file) => (
                  <div key={file._id}>
                    <VeteranFilePreview
                      documentId={file._id}
                      documentName={file.filename}
                      latestComment={getLatestComment(file.comments)}
                      lock={shouldLock(file)}
                    />
                  </div>
                ))}
            </div>
          </div>
        ))}
    </div>
  );
}
