"use client";
import React, { useEffect, useState } from "react";

import { Comment, FileObject, getFilesByUploader } from "../api/fileApi";

import { VeteranFilePreview } from "./VeteranFilePreview";
import styles from "./VeteranFilesTable.module.css";

type VeteranDocumentProps = {
  uploader: string;
};

type ShowMoreFiles = {
  "battle buddies": boolean;
  advocacy: boolean;
  "operation wellness": boolean;
};

export function VeteranDocuments({ uploader }: VeteranDocumentProps) {
  const [showMoreFiles, setShowMoreFiles] = useState<ShowMoreFiles>({
    "battle buddies": false,
    advocacy: false,
    "operation wellness": false,
  });
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
  }, [uploader]);

  return (
    <div>
      {programs.map((program, index) => (
        <div
          key={index}
          style={{ marginBottom: 24, paddingTop: 30, borderTop: "1px solid #E0E0E0" }}
        >
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
            <div className={styles.programName}>{programMap[program]} Documents</div>
            <p
              style={{ color: "#057E6F", cursor: "pointer" }}
              onClick={() => {
                const prev = showMoreFiles[program as keyof ShowMoreFiles];
                setShowMoreFiles({
                  ...showMoreFiles,
                  [program]: !prev,
                });
              }}
            >
              See {showMoreFiles[program as keyof ShowMoreFiles] ? "less" : "more"} documents
            </p>
          </div>
          <div className={styles.documentTable}>
            {fileObjects
              .filter((obj) => obj.programs.includes(program))
              .slice(0, !showMoreFiles[program as keyof ShowMoreFiles] ? 4 : undefined)
              .map((file) => (
                <div key={file._id}>
                  <VeteranFilePreview
                    documentId={file._id}
                    documentName={file.filename}
                    latestComment={getLatestComment(file.comments)}
                  />
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
