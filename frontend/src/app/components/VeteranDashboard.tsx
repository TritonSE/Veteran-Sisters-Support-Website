import { useEffect, useState } from "react";

import { FileObject, getFilesByUploader } from "../api/fileApi";

export type SelectStates = {
  All: boolean;
  BattleBuddies: boolean;
  IAdvocacy: boolean;
  OperationWellness: boolean;
};

export function VeteranDashboard() {
  const [selectStates, setSelectStates] = useState<SelectStates>({
    All: true,
    BattleBuddies: false,
    IAdvocacy: false,
    OperationWellness: false,
  });

  const [fileObjects, setFileObjects] = useState<FileObject[]>([]);

  useEffect(() => {
    getFilesByUploader("Steve").then((result) => {
      if (result.success) {
        console.log(result.data);
        setFileObjects(result.data);
        console.log("fetched files");
      } else {
        console.log(result.error);
      }
    }).catch((err: unknown) => {
      console.error(err);
    })
  }, []);

  return (
    <div style={{ marginLeft: "100px" }}>
      <h1>Documents</h1>
      <div>
        {Object.keys(selectStates).map((val) => (
          <div key={val}>{val}</div>
        ))}
      </div>

      <div>
        {fileObjects.map((obj) => (
          <div key={obj._id}>{obj.filename}</div>
        ))}
      </div>
    </div>
  );
}
