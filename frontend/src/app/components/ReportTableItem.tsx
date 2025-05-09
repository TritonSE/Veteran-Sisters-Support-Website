import styles from "./ReportTableItem.module.css";

type ReportTableItemProps = {
  date: string;
  reportee: string;
  situation: string;
};

export function ReportTableItem({ date, reportee, situation }: ReportTableItemProps) {
  return (
    <div className={styles.container}>
      <div className={styles.date}>
        <span>{date}</span>
      </div>
      <div className={styles.reportee}>
        <span>{reportee}</span>
      </div>
      <div className={styles.situation}>
        <span>{situation}</span>
      </div>
      {/* <div className={statusPending ? styles.statusPending : styles.statusResolved}>
        <span>{statusPending}</span>
      </div> */}
    </div>
  );
}
