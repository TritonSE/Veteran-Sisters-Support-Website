import { useEffect, useState } from "react";

import { FileObject, getFilesByUploader } from "../api/fileApi";

import styles from "./VeteranDashboard.module.css";

export function VeteranDashboard() {
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
  }, []);

  useEffect(() => {
    if (selectedProgram === "All") {
      setFilteredFiles(fileObjects);
    } else {
      setFilteredFiles(fileObjects.filter((obj) => obj.programs.includes(selectedProgram)));
    }
  }, [selectedProgram, fileObjects]);

  return (
    <div style={{ marginLeft: "100px" }}>
      <h1>Documents</h1>
      <div className={styles.nav}>
        <div
          className={styles.navItem}
          style={{
            backgroundColor: selectedProgram === "All" ? "rgba(5, 126, 111, 0.10)" : "white",
          }}
          onClick={() => {
            setSelectedProgram("All");
          }}
        >
          <p>All</p>
        </div>
        <div
          className={styles.navItem}
          style={{
            backgroundColor:
              selectedProgram === "BattleBuddies" ? "rgba(5, 126, 111, 0.10)" : "white",
          }}
          onClick={() => {
            setSelectedProgram("BattleBuddies");
          }}
        >
          <p>Battle Buddies</p>
        </div>
        <div
          style={{
            backgroundColor: selectedProgram === "IAdvocacy" ? "rgba(5, 126, 111, 0.10)" : "white",
          }}
          className={styles.navItem}
          onClick={() => {
            setSelectedProgram("IAdvocacy");
          }}
        >
          <p>I Advocacy</p>
        </div>
        <div
          style={{
            backgroundColor:
              selectedProgram === "OperationWellness" ? "rgba(5, 126, 111, 0.10)" : "white",
          }}
          className={styles.navItem}
          onClick={() => {
            setSelectedProgram("OperationWellness");
          }}
        >
          <p>Operation Wellness</p>
        </div>
      </div>

      <div>
        {filteredFiles.map((obj) => (
          <div key={obj._id}>{obj.filename}</div>
        ))}
      </div>
    </div>
  );
}
