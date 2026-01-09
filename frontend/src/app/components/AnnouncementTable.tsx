import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ActivityObject, getAnnouncements } from "../api/activities";

import styles from "./AnnouncementTable.module.css";
import { AnnouncementTableItem } from "./AnnouncementTableItem";

type AnnouncementTableProp = {
  userId: string;
};

export function AnnouncementTable({ userId }: AnnouncementTableProp) {
  const [announcements, setAnnouncements] = useState<ActivityObject[]>([]);
  const [page, setPage] = useState<number>(0);
  const pageSize = 8;

  const router = useRouter();

  useEffect(() => {
    getAnnouncements(userId)
      .then((result) => {
        if (result.success) {
          setAnnouncements(result.data);
        } else {
          console.error(result.error);
        }
      })
      .catch((reason: unknown) => {
        console.error(reason);
      });
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
            announcements.slice(page * pageSize, (page + 1) * pageSize).map((announcement) => (
              <AnnouncementTableItem
                key={announcement._id}
                date={announcement.createdAt.toLocaleDateString()}
                announcement={announcement.title}
                onClick={() => {
                  router.push(`/activities?activityId=${announcement._id}`);
                }}
              />
            ))
          )}
        </div>
      </div>
      {announcements.length > pageSize && (
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
