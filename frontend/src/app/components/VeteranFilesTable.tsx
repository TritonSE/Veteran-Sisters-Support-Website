import { useEffect, useState } from "react";

import { Comment, FileObject, getFilesByUploader } from "../api/fileApi";

import { NoDocuments } from "./EmptyStates";
import { Tabs } from "./Tabs";
import { VeteranFilePreview } from "./VeteranFilePreview";
import styles from "./VeteranFilesTable.module.css";

type VeteranFilesTableProps = {
  veteranId: string;
  refresh: boolean;
};

export function VeteranFilesTable({ veteranId, refresh }: VeteranFilesTableProps) {
  const [selectedProgram, setSelectedProgram] = useState<string>("All");
  const [fileObjects, setFileObjects] = useState<FileObject[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<FileObject[]>([]);

  useEffect(() => {
    getFilesByUploader(veteranId)
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

  return (
    <div>
      <div style={{ fontSize: 20, marginBottom: 20, fontWeight: 500 }}>Documents</div>
      <Tabs
        tabs={["All", "Battle Buddies", "Advocacy", "Operation Wellness"]}
        handlers={[
          () => {
            setSelectedProgram("All");
          },
          () => {
            setSelectedProgram("battle buddies");
          },
          () => {
            setSelectedProgram("advocacy");
          },
          () => {
            setSelectedProgram("operation wellness");
          },
        ]}
      />
      <div className={styles.documentTable}>
        {filteredFiles.length === 0 ? (
          <NoDocuments />
        ) : (
          filteredFiles.map((obj) => (
            <div key={obj._id}>
              <VeteranFilePreview
                documentId={obj._id}
                documentName={obj.filename}
                latestComment={getLatestComment(obj.comments)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
