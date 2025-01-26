import Image from "next/image";
import { useEffect, useState } from "react";

import { FileObject, getFilesByUploader } from "../api/fileApi";

import styles from "./VeteranDashboard.module.css";

type VeteranDashboardProps = {
  refresh: boolean;
};

export function VeteranDashboard({ refresh }: VeteranDashboardProps) {
  const [selectedProgram, setSelectedProgram] = useState<string>("All");
  const [fileObjects, setFileObjects] = useState<FileObject[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<FileObject[]>([]);

  useEffect(() => {
    getFilesByUploader("Steve")
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
  }, [refresh]);

  useEffect(() => {
    if (selectedProgram === "All") {
      setFilteredFiles(fileObjects);
    } else {
      setFilteredFiles(fileObjects.filter((obj) => obj.programs.includes(selectedProgram)));
    }
  }, [selectedProgram, fileObjects]);

  const DocumentPreview = (documentName: string, fileType: string) => {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 220 }}>
        <div className={styles.documentPreview}>
          {fileType === "pdf" ? (
            <Image src="./pdf_icon.svg" width={80} height={80} alt="pdf" />
          ) : (
            <Image src="./doc_icon.svg" width={80} height={80} alt="pdf" />
          )}
        </div>
        <div style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
          {documentName}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div style={{ fontSize: 20, marginBottom: 10, fontWeight: 500 }}>Documents</div>
      <div className={styles.nav}>
        <div
          className={selectedProgram === "All" ? styles.navItemSelected : styles.navItem}
          onClick={() => {
            setSelectedProgram("All");
          }}
        >
          All
        </div>
        <div
          className={selectedProgram === "BattleBuddies" ? styles.navItemSelected : styles.navItem}
          onClick={() => {
            setSelectedProgram("BattleBuddies");
          }}
        >
          Battle Buddies
        </div>
        <div
          className={selectedProgram === "IAdvocacy" ? styles.navItemSelected : styles.navItem}
          onClick={() => {
            setSelectedProgram("IAdvocacy");
          }}
        >
          I Advocacy
        </div>
        <div
          className={
            selectedProgram === "OperationWellness" ? styles.navItemSelected : styles.navItem
          }
          onClick={() => {
            setSelectedProgram("OperationWellness");
          }}
        >
          Operation Wellness
        </div>
      </div>

      <div className={styles.documentTable}>
        {filteredFiles.map((obj) => (
          <div key={obj._id}>
            {DocumentPreview(
              obj.filename,
              obj.filename.includes(".") ? (obj.filename.split(".").pop() ?? "") : "",
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
