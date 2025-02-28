import Image from "next/image";
import { useEffect, useState } from "react";

import { FileObject, getFilesByUploader } from "../api/fileApi";

import { Tabs } from "./Tabs";
import styles from "./VeteranFilesTable.module.css";

type VeteranFilesTableProps = {
  refresh: boolean;
};

export function VeteranFilesTable({ refresh }: VeteranFilesTableProps) {
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
        <div>
          <div
            style={{
              fontSize: 16,
              color: "#4D5358",
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {documentName}
          </div>
          <div
            style={{
              fontSize: 14,
              color: "#60696F",
              fontFamily: "Inconsolata",
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            No comments
          </div>
        </div>
      </div>
    );
  };

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
