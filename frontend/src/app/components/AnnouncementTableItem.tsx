import styles from "./AnnouncementTableItem.module.css";

type AnnouncementTableItemProps = {
  date: string;
  announcement: string;
};

export function AnnouncementTableItem({ date, announcement }: AnnouncementTableItemProps) {
  return (
    <div className={styles.container}>
      <div className={styles.date}>{date}</div>
      <div className={styles.announcement}>
        <div className={styles.announcementText}>{announcement}</div>
      </div>
    </div>
  );
}
