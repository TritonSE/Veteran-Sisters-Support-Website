import Image from "next/image";
import React from "react";

import styles from "./DocumentPreview.module.css";

type DocumentPreviewProps = {
  documentName: string;
  fileType: string;
};

export default function DocumentPreview({ documentName, fileType }: DocumentPreviewProps) {
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
}
