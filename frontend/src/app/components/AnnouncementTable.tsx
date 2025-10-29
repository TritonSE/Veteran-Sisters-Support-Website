import Image from "next/image";
import { useEffect, useState } from "react";

import styles from "./AnnouncementTable.module.css";
import { AnnouncementTableItem } from "./AnnouncementTableItem";

//PH
type ActivityObject = {
  _id: string;
  firstName: string;
  lastName: string;
  role: string;
  type: "document" | "comment" | "assignment" | "report" | "request" | "announcement";
  title: string;
  description: string;
  documentName: string;
  programName: string[];
  isRead: boolean;
  createdAt: Date;
  relativeTime: string;
};

export function AnnouncementTable() {
  const [announcements, setAnnouncements] = useState<ActivityObject[]>([]);
  const [page, setPage] = useState<number>(0);
  const pageSize = 8;

  useEffect(() => {
    const announcementList = [];
    for (let i = 0; i < 5; i++) {
      const act = {
        _id: String(i),
        firstName: "fname",
        lastName: "lname",
        role: "admin",
        type: "announcement",
        title: "AnnouncementTitle",
        description: "asd",
        documentName: "name",
        programName: ["battle buddies"],
        isRead: false,
        createdAt: new Date(),
        relativeTime: "a",
      } as ActivityObject;
      announcementList.push(act);
    }
    const j = announcementList.length;
    for (let i = announcementList.length; i < j + 5; i++) {
      const act = {
        _id: String(i),
        firstName: "fname",
        lastName: "lname",
        role: "admin",
        type: "announcement",
        title:
          "AnnouncementTitleAnnouncementTitleAnnouncementTitleAnnouncementTitleAnnouncementTitleAnnouncementTitleAnnouncementTitleAnnouncementTitleAnnouncementTitleAnnouncementTitleAnnouncementTitleAnnouncementTitleAnnouncementTitleAnnouncementTitleAnnouncementTitleAnnouncementTitleAnnouncementTitleAnnouncementTitleAnnouncementTitleAnnouncementTitleAnnouncementTitleAnnouncementTitleAnnouncementTitleAnnouncementTitleAnnouncementTitleAnnouncementTitleAnnouncementTitleAnnouncementTitleAnnouncementTitleAnnouncementTitleAnnouncementTitleAnnouncementTitleAnnouncementTitleAnnouncementTitleAnnouncementTitleAnnouncementTitleAnnouncementTitleAnnouncementTitleAnnouncementTitleAnnouncementTitleAnnouncementTitleAnnouncementTitleAnnouncementTitleAnnouncementTitleAnnouncementTitleAnnouncementTitleAnnouncementTitleAnnouncementTitleAnnouncementTitle",
        description: "asd",
        documentName: "name",
        programName: ["battle buddies"],
        isRead: false,
        createdAt: new Date(),
        relativeTime: "a",
      } as ActivityObject;
      announcementList.push(act);
    }
    setAnnouncements(announcementList);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span>Past Announcements</span>
      </div>
      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <div className={styles.date}>
            <span>Date</span>
          </div>
          <div className={styles.announcement}>
            <span>Announcements</span>
          </div>
        </div>
        <div className={styles.tableItems}>
          {announcements.length === 0 ? (
            <AnnouncementTableItem date="None" announcement="None" />
          ) : (
            announcements
              .slice(page * pageSize, (page + 1) * pageSize)
              .map((announcement) => (
                <AnnouncementTableItem
                  key={announcement._id}
                  date={announcement.createdAt.toLocaleDateString()}
                  announcement={announcement.title}
                />
              ))
          )}
        </div>
      </div>
      {announcements.length > 8 && (
        <div className={styles.pageSelect}>
          {page === Math.floor((announcements.length - 1) / pageSize) ? (
            <div className={styles.arrowBoxDisabled}>
              <Image
                src="/caret_right_disabled.svg"
                alt="Right Arrow"
                width={20}
                height={20}
              ></Image>
            </div>
          ) : (
            <div
              className={styles.arrowBox}
              onClick={() => {
                setPage(page + 1);
              }}
            >
              <Image src="/caret_right.svg" alt="Right Arrow" width={20} height={20}></Image>
            </div>
          )}
          <span
            className={styles.pageNumber}
          >{`${(page + 1).toString()} of ${Math.ceil(announcements.length / pageSize).toString()}`}</span>
          {page === 0 ? (
            <div className={styles.arrowBoxDisabled}>
              <Image src="/caret_left_disabled.svg" alt="Left Arrow" width={20} height={20}></Image>
            </div>
          ) : (
            <div
              className={styles.arrowBox}
              onClick={() => {
                setPage(page - 1);
              }}
            >
              <Image src="/caret_left.svg" alt="Left Arrow" width={20} height={20}></Image>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
