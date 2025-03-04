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
import {
  Comment,
  CreateCommentRequest,
  FileObject,
  createCommentObject,
  deleteCommentObject,
  editCommentObject,
  editFileObject,
  getFileById,
} from "../api/fileApi";
import { User } from "../api/users";

import styles from "./DocumentView.module.css";
import { Program } from "./Program";
import { Role } from "./Role";

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

  const [comments, setComments] = useState<Comment[]>([]);
  const [currComment, setCurrComment] = useState<number>();
  const [currCommentBody, setCurrCommentBody] = useState<string>();

  const [editingTitle, setEditingTitle] = useState<boolean>();
  const [currTitle, setCurrTitle] = useState<string>();

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
    getFileById(documentId)
      .then((response) => {
        if (response.success) {
          setFile(response.data);
          setCurrTitle(response.data.filename);
          setComments(response.data.comments);
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
  }, []);

  const writeCommentHandler = (edit: boolean, commentKey: number, commentBody: string) => {
    if (edit) {
      setCurrComment(commentKey);
      setCurrCommentBody(commentBody);
    } else {
      if (currComment === undefined) {
        const dummyUser: User = {
          _id: "",
          firstName: "Andrew",
          lastName: "Zhou",
          email: "anz008@ucsd.edu",
          role: "volunteer",
          assignedPrograms: ["battle buddies"],
          assignedVeterans: [],
          assignedVolunteers: [],
        };
        const newCommentFrame: Comment = {
          _id: "",
          comment: "",
          commenterId: dummyUser,
          datePosted: "",
        };
        setComments([newCommentFrame].concat(comments));
        setCurrCommentBody("");
        setCurrComment(0);
      }
    }
  };

  const cancelCommentHandler = (edit: boolean) => {
    if (!edit) {
      setComments(comments.slice(1));
    }
    setCurrComment(undefined);
  };

  const postCommentHandler = (edit: boolean, key: number, id: string) => {
    if (currCommentBody?.trim() && file) {
      if (edit) {
        editCommentObject(id, currCommentBody)
          .then((response) => {
            if (response.success) {
              comments[key] = response.data;
              setFile({ ...file, comments });
              setCurrComment(undefined);
              setCurrCommentBody("");
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        const newComment: CreateCommentRequest = {
          commenterId: "67b2e046432b1fc7da8b533c",
          comment: currCommentBody,
        };
        createCommentObject(newComment)
          .then((response) => {
            if (response.success) {
              const newCommentsList = [response.data].concat(comments.slice(1));
              editFileObject(file._id, { comments: newCommentsList })
                .then((response2) => {
                  if (response2.success) {
                    setFile(response2.data);
                    setComments(response2.data.comments);
                    setCurrComment(undefined);
                    setCurrCommentBody("");
                  }
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  };

  const deleteCommentHandler = (id: string, key: number) => {
    deleteCommentObject(id)
      .then((response) => {
        if (response.success && file) {
          const newCommentList = comments.slice(0, key).concat(comments.slice(key + 1));
          editFileObject(file._id, { comments: newCommentList }).then((response2) => {
            if (response2.success) {
              setFile(response2.data);
              setComments(response2.data.comments);
              setCurrComment(undefined);
              setCurrCommentBody("");
            }
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

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

  const formatDate = (datePosted: string) => {
    const date = new Date(datePosted);
    const month = months[date.getMonth()];
    const day = date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`;
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
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

  const Comment = (key: number, comment: Comment) => {
    const borderColor =
      comment.commenterId.assignedPrograms[0] === "battle buddies"
        ? "#0093EB"
        : comment.commenterId.assignedPrograms[0] === "advocacy"
          ? "#3730A3"
          : "#337357";
    const name = `${comment.commenterId.firstName} ${comment.commenterId.lastName}`;
    return (
      <div key={key}>
        {key != currComment ? (
          <div
            className={styles.comment}
            style={{ border: `1px solid ${borderColor}` } as React.CSSProperties}
          >
            <div className={styles.commentTopRow}>
              <div className={styles.profileIcon}>{name.trim().substring(0, 1).toUpperCase()}</div>
              <div style={{ maxWidth: 100 }}>{name}</div>
              <Role role={comment.commenterId.role} />
              {comment.commenterId.assignedPrograms.map((program, i) => {
                return <Program key={i} program={program} iconOnly />;
              })}
            </div>
            <div className={styles.commentBody}>{comment.comment}</div>
            <div className={styles.commentBottomRow}>
              <div
                className={styles.commentDate}
              >{`${formatDate(comment.datePosted)} ${comment.edited ? "(edited)" : ""}`}</div>
              <div className={styles.commentBottomIcons}>
                <Image
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    writeCommentHandler(true, key, comment.comment);
                  }}
                  src="/pencil_icon_2.svg"
                  width={16}
                  height={16}
                  alt="edit"
                />
                <Image
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    deleteCommentHandler(comment._id, key);
                  }}
                  src="/trash_icon.svg"
                  width={16}
                  height={16}
                  alt="trash"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.selectedComment}>
            <div className={styles.commentTopRow}>
              <div className={styles.profileIcon}>{name.trim().substring(0, 1).toUpperCase()}</div>
              <div style={{ maxWidth: 100 }}>{name}</div>
              <Role role={comment.commenterId.role} />
              {comment.commenterId.assignedPrograms.map((program, i) => {
                return <Program key={i} program={program} iconOnly />;
              })}
            </div>
            <textarea
              onChange={(e) => {
                setCurrCommentBody(e.target.value);
              }}
              value={currCommentBody}
              className={styles.commentInput}
            />
            <div className={styles.commentBottomRow}>
              <div
                className={styles.commentCancelButton}
                onClick={() => {
                  cancelCommentHandler(comment.comment !== "");
                }}
              >
                Cancel
              </div>
              <div
                className={styles.commentPostButton}
                onClick={() => {
                  postCommentHandler(comment.comment !== "", key, comment._id);
                }}
              >
                {comment.comment !== "" ? "Save" : "Post"}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {file && comments && (
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
              {comments.map((comment, i) => {
                return Comment(i, comment);
              })}
            </div>
          </div>
          <div
            className={
              currComment === undefined ? styles.addCommentButton : styles.disabledCommentButton
            }
            onClick={() => {
              writeCommentHandler(false, 0, "");
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
