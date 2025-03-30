"use client";
import { getDownloadURL, ref } from "firebase/storage";
import fileDownload from "js-file-download";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import { storage } from "../../../firebase/firebase";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Comment, FileObject, editFileObject, getFileById } from "../api/fileApi";
import { getUser } from "../api/userApi";
import { User } from "../api/users";

import { DocumentComment } from "./DocumentComment";
import styles from "./DocumentView.module.css";

import axios from "axios";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

type DocumentViewProps = {
  documentId: string;
};

export function DocumentView({ documentId }: DocumentViewProps) {
  const [file, setFile] = useState<FileObject>();
  const [fileURL, setFileURL] = useState<string>();
  const [numPages, setNumPages] = useState<number>();

  const [currComment, setCurrComment] = useState<number>();

  const [editingTitle, setEditingTitle] = useState<boolean>();
  const [currTitle, setCurrTitle] = useState<string>();

  const [currUser, setCurrUser] = useState<User>();

  useEffect(() => {
    getFileById(documentId)
      .then((response) => {
        if (response.success) {
          setFile(response.data);
          setCurrTitle(response.data.filename);
        } else {
          console.log(response.error);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    getDownloadURL(ref(storage, `files/${documentId}`))
      .then((url) => {
        setFileURL(url);
        console.log(url);
      })
      .catch((error) => {
        console.log(error);
      });
    getUser("67b2e046432b1fc7da8b533c")
      .then((response) => {
        if (response.success) {
          setCurrUser(response.data);
          console.log(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const changeTitleHandler = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && file) {
      e.preventDefault();
      e.stopPropagation();
      editFileObject(file?._id, { filename: currTitle })
        .then((response) => {
          if (response.success) {
            setFile(response.data);
            setCurrTitle(response.data.filename);
            setEditingTitle(false);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  //don't ask me how these next two functions work I got them straight from stack overflow
  const handleDownload = () => {
    if (fileURL && file) {
      axios
        .get(fileURL, {
          responseType: "blob",
        })
        .then((res) => {
          fileDownload(res.data, file?.filename);
        });
    }
  };

  const handlePrint = () => {
    if (fileURL && file) {
      axios
        .get(fileURL, {
          responseType: "blob",
        })
        .then((res) => {
          const blobURL = URL.createObjectURL(res.data);
          const iframe = document.createElement("iframe");
          document.body.appendChild(iframe);

          iframe.style.display = "none";
          iframe.src = blobURL;
          iframe.onload = function () {
            setTimeout(function () {
              iframe.focus();
              if (iframe.contentWindow) iframe.contentWindow.print();
            }, 1);
          };
        });
    }
  };

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const HeaderBar = (filename: string) => {
    return (
      <div className={styles.header}>
        <Link href="/veteranDashboard">
          <Image src="/logo_black.svg" width={143} height={32} alt="logo" />
        </Link>
        {editingTitle ? (
          <input
            className={styles.editTitle}
            type="text"
            defaultValue={currTitle}
            onChange={(e) => {
              setCurrTitle(e.target.value);
            }}
            onKeyDown={changeTitleHandler}
          />
        ) : (
          <div
            className={styles.headerSection}
            onClick={() => {
              setEditingTitle(true);
            }}
          >
            {filename}
            <Image src="/pencil_icon.svg" width={16} height={16} alt="edit" />
          </div>
        )}
        {fileURL && (
          <div className={styles.headerSection}>
            <Image
              src="/download_icon.svg"
              width={24}
              height={24}
              alt="download"
              onClick={handleDownload}
            />
            {/* <Link href={fileURL} target="_blank" download> */}
            <Image src="/print_icon.svg" width={24} height={24} alt="print" onClick={handlePrint} />
            {/* </Link> */}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {file && currUser && (
        <>
          <div style={{ background: "#f5f5f5" }}>
            {HeaderBar(file.filename)}
            {fileURL && (
              <>
                <Document
                  className={styles.document}
                  file={fileURL}
                  onLoadSuccess={onDocumentLoadSuccess}
                >
                  {Array.from(Array(numPages), (e, i) => {
                    return (
                      <Page
                        key={i}
                        pageNumber={i + 1}
                        canvasBackground="white"
                        height={window.innerHeight}
                        width={window.innerWidth * 0.5}
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                      />
                    );
                  })}
                </Document>
              </>
            )}
            <div className={styles.commentsWrapper}>
              {file.comments.map((comment, i) => {
                return (
                  <DocumentComment
                    key={i}
                    comment={comment}
                    file={file}
                    user={currUser}
                    commentKey={i}
                    selected={currComment === i}
                    setSelected={(selected) => {
                      if (selected) {
                        setCurrComment(i);
                      } else {
                        setCurrComment(undefined);
                      }
                    }}
                    setFile={setFile}
                  />
                );
              })}
            </div>
          </div>
          <div
            className={
              currComment === undefined ? styles.addCommentButton : styles.disabledCommentButton
            }
            onClick={() => {
              const newCommentFrame: Comment = {
                _id: "",
                comment: "",
                commenterId: currUser,
                datePosted: "",
              };
              setFile({ ...file, comments: [newCommentFrame].concat(file.comments) });
              setCurrComment(0);
            }}
          >
            <Image src="/add_icon.svg" width={20} height={20} alt="add"></Image>
            Add a comment
          </div>
        </>
      )}
    </>
  );
}
