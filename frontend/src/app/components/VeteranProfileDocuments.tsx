"use client";
import React, { useEffect, useState } from "react";

import { FileObject, getFilesByUploader } from "../api/fileApi";

import DocumentPreview from "./DocumentPreview";
import styles from "./VeteranFilesTable.module.css";

type VeteranDocumentProps = {
  uploader: string;
};

export function VeteranDocuments({ uploader }: VeteranDocumentProps) {
  const programs = ["OperationWellness", "BattleBuddies", "Advocacy"];
  const programMap: Record<string, string> = {
    OperationWellness: "Operation Wellness",
    BattleBuddies: "Battle Buddies",
    Advocacy: "Advocacy",
  };

  const [fileObjects, setFileObjects] = useState<FileObject[]>([]);

  useEffect(() => {
    getFilesByUploader(uploader)
      .then((result) => {
        if (result.success) {
          setFileObjects(result.data);
          console.log(
            "Data: ",
            result.data.filter((file) => file.programs.includes("OperationWellness")),
          );
        } else {
          console.log(result.error);
        }
      })
      .catch((err: unknown) => {
        console.error(err);
      });
  }, []);

  return (
    <div>
      {programs.map((program, index) => (
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
                  <DocumentPreview
                    documentName={file.filename}
                    fileType={
                      file.filename.includes(".") ? (file.filename.split(".").pop() ?? "") : ""
                    }
                  />
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
