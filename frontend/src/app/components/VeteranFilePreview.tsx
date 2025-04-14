import { getDownloadURL, ref } from "firebase/storage";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import { storage } from "../../firebase/firebase";

import styles from "./VeteranFilePreview.module.css";

type VeteranFilePreviewProps = {
  documentId: string;
  documentName: string;
  latestComment?: Date;
};

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

export function VeteranFilePreview({
  documentId,
  documentName,
  latestComment,
}: VeteranFilePreviewProps) {
  const [fileURL, setFileURL] = useState<string>();
  const [numPages, setNumPages] = useState<number>();

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  useEffect(() => {
    getDownloadURL(ref(storage, `files/${documentId}`))
      .then((url) => {
        setFileURL(url);
      })
      .catch((error: unknown) => {
        console.log(error);
      });
  }, []);

  function onDocumentLoadSuccess({ numPages: totalPages }: { numPages: number }): void {
    setNumPages(totalPages);
  }

  function formatAMPM(date: Date) {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const min = String(minutes).padStart(2, "0");
    const strTime = `${String(hours)}:${min} ${ampm}`;
    return strTime;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 220 }}>
      <Link
        className={styles.documentPreview}
        href={{ pathname: "/document", query: { documentId } }}
      >
        {fileURL ? (
          <Document
            className={styles.document}
            file={fileURL}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            {Array.from(Array(numPages).slice(0, 2), (e, i) => {
              return (
                <Page
                  key={i}
                  pageNumber={i + 1}
                  canvasBackground="white"
                  height={250}
                  width={220}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                />
              );
            })}
          </Document>
        ) : (
          <Image src="/pdf_icon.svg" width={80} height={80} alt="pdf" />
        )}
      </Link>
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
            fontSize: 12,
            color: "#60696F",
            fontFamily: "Inconsolata",
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          {latestComment
            ? `Commented ${months[latestComment.getMonth()]} ${String(latestComment.getDate())}, ${String(latestComment.getFullYear())} at ${formatAMPM(latestComment)}`
            : "No comments"}
        </div>
      </div>
    </div>
  );
}
