import Image from "next/image";
import { useEffect, useState } from "react";

import {
  Comment,
  CreateCommentRequest,
  FileObject,
  createCommentObject,
  deleteCommentObject,
  editCommentObject,
  editFileObject,
} from "../api/fileApi";
import { AssignedProgram as ProgramEnum, Role as RoleEnum, UserProfile } from "../api/profileApi";

import styles from "./DocumentComment.module.css";
import ErrorMessage from "./ErrorMessage";
import { Program } from "./Program";
import { Role } from "./Role";
import SuccessNotification from "./SuccessNotification";

type DocumentCommentProps = {
  comment: Comment;
  file: FileObject;
  user: UserProfile;
  commentKey: number;
  selected: boolean;
  setSelected: (selected: boolean) => void;
  setFile: (file: FileObject) => void;
};

export function DocumentComment({
  comment,
  file,
  user,
  commentKey,
  selected,
  setSelected,
  setFile,
}: DocumentCommentProps) {
  const borderColor =
    comment.commenterId.assignedPrograms?.[0] === ProgramEnum.BATTLE_BUDDIES
      ? "#0093EB"
      : comment.commenterId.assignedPrograms?.[0] === ProgramEnum.ADVOCACY
        ? "#3730A3"
        : "#337357";
  const name = `${comment.commenterId.firstName} ${comment.commenterId.lastName}`;

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

  const [currComment, setCurrComment] = useState<Comment>(comment);
  const [tempCommentBody, setTempCommentBody] = useState<string>(comment.comment);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    setCurrComment(comment);
    setTempCommentBody(comment.comment);
  }, [comment]);

  const formatDate = (datePosted: string) => {
    const date = new Date(datePosted);
    const month = months[date.getMonth()];
    const day = String(date.getDate()).padStart(2, "0");
    const year = String(date.getFullYear());
    return `${month} ${day}, ${year}`;
  };

  const postCommentHandler = () => {
    if (tempCommentBody?.trim() && file && user._id) {
      if (currComment.comment !== "") {
        editCommentObject(comment._id, tempCommentBody)
          .then((response) => {
            if (response.success) {
              file.comments[commentKey] = response.data;
              setSuccessMessage("Successfully updated comment");
              setFile(file);
              setCurrComment(response.data);
              setTempCommentBody(response.data.comment);
              setSelected(false);
            } else {
              setErrorMessage(`Error updating comment: ${response.error}`);
            }
          })
          .catch((error: unknown) => {
            setErrorMessage(`Error updating comment: ${String(error)}`);
          });
      } else {
        const newComment: CreateCommentRequest = {
          commenterId: user._id,
          comment: tempCommentBody,
        };
        createCommentObject(newComment)
          .then((response) => {
            if (response.success) {
              const newCommentsList = [response.data].concat(file.comments.slice(1));
              editFileObject(file._id, { comments: newCommentsList })
                .then((response2) => {
                  if (response2.success) {
                    setSuccessMessage("Successfully created comment");
                    setFile(response2.data);
                    setCurrComment(response.data);
                    setTempCommentBody(response.data.comment);
                    setSelected(false);
                  } else {
                    setErrorMessage(`Error updating comment: ${response2.error}`);
                  }
                })
                .catch((error: unknown) => {
                  setErrorMessage(`Error updating comment: ${String(error)}`);
                });
            } else {
              setErrorMessage(`Error creating comment: ${response.error}`);
            }
          })
          .catch((error: unknown) => {
            setErrorMessage(`Error updating comment: ${String(error)}`);
          });
      }
    }
  };

  const deleteCommentHandler = (id: string, key: number) => {
    deleteCommentObject(id)
      .then((response) => {
        if (response.success) {
          const newCommentList = file.comments.slice(0, key).concat(file.comments.slice(key + 1));
          editFileObject(file._id, { comments: newCommentList })
            .then((response2) => {
              if (response2.success) {
                setSuccessMessage("Successfully deleted comment");
                setFile(response2.data);
              } else {
                setErrorMessage(`Error deleting comment: ${response2.error}`);
              }
            })
            .catch((error: unknown) => {
              setErrorMessage(`Error deleting comment: ${String(error)}`);
            });
        } else {
          setErrorMessage(`Error deleting comment: ${response.error}`);
        }
      })
      .catch((error: unknown) => {
        setErrorMessage(`Error deleting comment: ${String(error)}`);
      });
  };

  return (
    <div>
      {!selected ? (
        <div
          className={styles.comment}
          style={{ border: `1px solid ${borderColor}` } as React.CSSProperties}
        >
          <div className={styles.commentTopRow}>
            <div className={styles.profileIcon}>{name.trim().substring(0, 1).toUpperCase()}</div>
            <div style={{ maxWidth: 100 }}>{name}</div>
            <Role role={comment.commenterId.role} />
            {comment.commenterId.assignedPrograms?.map((program, i) => {
              return <Program key={i} program={program} iconOnly />;
            })}
          </div>
          <div className={styles.commentBody}>{comment.comment}</div>
          <div className={styles.commentBottomRow}>
            <div
              className={styles.commentDate}
            >{`${formatDate(comment.datePosted)} ${comment.edited ? "(edited)" : ""}`}</div>
            <div className={styles.commentBottomIcons}>
              {(user._id === comment.commenterId._id || user.role === RoleEnum.ADMIN) && (
                <>
                  <Image
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      if (user._id === comment.commenterId._id) setSelected(true);
                    }}
                    src="/pencil_icon_2.svg"
                    width={16}
                    height={16}
                    alt="edit"
                  />
                  <Image
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      deleteCommentHandler(comment._id, commentKey);
                    }}
                    src="/trash_icon.svg"
                    width={16}
                    height={16}
                    alt="trash"
                  />
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.selectedComment}>
          <div className={styles.commentTopRow}>
            <div className={styles.profileIcon}>{name.trim().substring(0, 1).toUpperCase()}</div>
            <div style={{ maxWidth: 100 }}>{name}</div>
            <Role role={comment.commenterId.role} />
            {comment.commenterId.assignedPrograms?.map((program, i) => {
              return <Program key={i} program={program} iconOnly />;
            })}
          </div>
          <textarea
            onChange={(e) => {
              setTempCommentBody(e.target.value);
            }}
            value={tempCommentBody}
            className={styles.commentInput}
          />
          <div className={styles.commentBottomRow}>
            <div
              className={styles.commentCancelButton}
              onClick={() => {
                if (currComment.comment === "") {
                  setFile({
                    ...file,
                    comments: file.comments
                      .slice(0, commentKey)
                      .concat(file.comments.slice(commentKey + 1)),
                  });
                }
                setSelected(false);
              }}
            >
              Cancel
            </div>
            <div
              className={styles.commentPostButton}
              onClick={() => {
                postCommentHandler();
              }}
            >
              {comment.comment !== "" ? "Save" : "Post"}
            </div>
          </div>
        </div>
      )}
      {errorMessage && <ErrorMessage message={errorMessage} />}
      {successMessage && <SuccessNotification message={successMessage} />}
    </div>
  );
}
