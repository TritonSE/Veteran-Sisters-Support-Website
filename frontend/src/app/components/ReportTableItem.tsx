import styles from "./ReportTableItem.module.css";

type ReportTableItemProps = {
  date: string;
  reportee: string;
  situation: string;
  status: string;
};

export function ReportTableItem({ date, reportee, situation, status }: ReportTableItemProps) {
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
      {status === "Pending" ? (
        <div className={styles.statusPending}>
          <span>{status}</span>
        </div>
      ) : null}
      {status === "Resolved" ? (
        <div className={styles.statusResolved}>
          <span>{status}</span>
        </div>
      ) : null}
    </div>
  );
}
