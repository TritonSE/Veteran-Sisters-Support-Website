import { useEffect, useState } from "react";

import {
  ProfileComment,
  ProfileCommentPostRequest,
  getComments,
  postComment,
} from "../api/profileApi";
import { useAuth } from "../contexts/AuthContext";

import { NoNotes } from "./EmptyStates";
import { ProfilePicture } from "./ProfilePicture";
import styles from "./VolunteerNotes.module.css";

export function VolunteerNotes({ profileUserId }: { profileUserId: string }) {
  const [profileNotes, setProfileNotes] = useState<ProfileComment[] | undefined>([]);
  const [currentComment, setCurrentComment] = useState<string>("");
  // use this to trigger a re-fetch of the notes when new note posted
  const [profileNotesChanged, setProfileNotesChanged] = useState<boolean>(false);
  const { userId } = useAuth();

  useEffect(() => {
    const fetchProfileNotes = async () => {
      const res = await getComments(profileUserId);
      console.log(res);
      console.log(profileUserId);
      if (res.success) {
        return res.data;
      }
    };
    fetchProfileNotes()
      .then((res) => {
        setProfileNotes(res);
      })
      .catch((err: unknown) => {
        console.error(err);
      });
  }, [profileNotesChanged]);

  const postProfileNote = async (comment: ProfileCommentPostRequest) => {
    const res = await postComment(comment);
    if (res.success) {
      setProfileNotesChanged(!profileNotesChanged);
    }
  };
  return (
    <div className={styles.volunteerNotes}>
      <div className={styles.noteHeader}>Notes from Volunteers</div>
      <div className={styles.noteSection}>
        <div className={styles.postNoteSection}>
          <input
            className={styles.postNoteInputField}
            placeholder="Add a comment..."
            value={currentComment}
            onChange={(event) => {
              setCurrentComment(event.target.value);
            }}
          ></input>
          <button
            onClick={(event) => {
              event.preventDefault();
              const comment = {
                profileId: profileUserId,
                commenterId: userId,
                comment: currentComment,
                datePosted: new Date(),
              };
              postProfileNote(comment)
                .then(() => {
                  setCurrentComment("");
                })
                .catch((err: unknown) => {
                  console.error(err);
                });
            }}
            className={styles.postNoteButton}
          >
            Post
          </button>
        </div>
        <div className={styles.postedNotes}>
          {profileNotes && profileNotes.length > 0 ? (
            profileNotes
              .slice()
              .reverse()
              .map((comment, ind) => {
                return (
                  <div key={ind} className={styles.postedNote}>
                    <ProfilePicture firstName={comment.user} size="small" />
                    <div className={styles.noteContent}>
                      <div className={styles.noteHeader}>
                        <div className={styles.noteAuthor}>{comment.user}</div>
                        <div className={styles.notePostedDate}>
                          {Math.floor(
                            (new Date().getTime() - new Date(comment.datePosted).getTime()) /
                              (1000 * 60 * 60 * 24),
                          )}{" "}
                          days ago
                        </div>
                      </div>
                      <div className={styles.noteBody}>{comment.comment}</div>
                    </div>
                  </div>
                );
              })
          ) : (
            <NoNotes />
          )}
        </div>
      </div>
    </div>
  );
}
