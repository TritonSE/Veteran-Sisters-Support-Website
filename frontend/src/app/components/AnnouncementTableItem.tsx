import styles from "./AnnouncementTableItem.module.css";

type AnnouncementTableItemProps = {
  date: string;
  announcement: string;
  onClick?: () => void;
};

export function AnnouncementTableItem({ date, announcement, onClick }: AnnouncementTableItemProps) {
  return (
    <div
      className={`${styles.container} ${onClick ? styles.linked : ""}`}
      {...(onClick && { onClick })}
    >
      <div className={styles.date}>
        <span>{date}</span>
      </div>
      <div className={styles.announcement}>
        <div className={styles.announcementText}>{announcement}</div>
      </div>
    </div>
  );
}
