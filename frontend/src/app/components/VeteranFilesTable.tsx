import { useEffect, useState } from "react";

import { FileObject, getFilesByUploader } from "../api/fileApi";

import DocumentPreview from "./DocumentPreview";
import { Tabs } from "./Tabs";
import styles from "./VeteranFilesTable.module.css";

type VeteranFilesTableProps = {
  refresh: boolean;
};

export function VeteranFilesTable({ refresh }: VeteranFilesTableProps) {
  const [selectedProgram, setSelectedProgram] = useState<string>("All");
  const [fileObjects, setFileObjects] = useState<FileObject[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<FileObject[]>([]);

  // Note: Hardcoded a user ID for testing
  useEffect(() => {
    getFilesByUploader("67b2e046432b1fc7da8b533c")
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

  return (
    <div>
      <div style={{ fontSize: 20, marginBottom: 20, fontWeight: 500 }}>Documents</div>
      <Tabs
        OnAll={() => {
          setSelectedProgram("All");
        }}
        OnBattleBuddies={() => {
          setSelectedProgram("BattleBuddies");
        }}
        OnAdvocacy={() => {
          setSelectedProgram("Advocacy");
        }}
        OnOperationWellness={() => {
          setSelectedProgram("OperationWellness");
        }}
      />

      <div className={styles.documentTable}>
        {filteredFiles.map((obj) => (
          <div key={obj._id}>
            <DocumentPreview
              documentName={obj.filename}
              fileType={obj.filename.includes(".") ? (obj.filename.split(".").pop() ?? "") : ""}
              component={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
