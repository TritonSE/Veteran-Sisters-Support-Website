"use client";

import Image from "next/image";

import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import styles from "./ReportTable.module.css";
import { getReportsByReporter } from "../api/reportApi";
import { APIResult } from "../api/requests";
import { ReportTableItem } from "./ReportTableItem";

type ReportObject = {
  _id: string;
  reporteeId: string;
  situation: string[];
  datePosted: Date;
};

export default function ReportTable() {
  const { userId, loading } = useAuth();
  const [reports, setReports] = useState<ReportObject[]>([]);
  const [page, setPage] = useState(0);
  const pageSize = 8;

  useEffect(() => {
    if (loading || !userId) return;

    getReportsByReporter(userId).then((res: APIResult<any[]>) => {
      if (!res.success) {
        console.error("Failed to load reports:", res.error);
        return;
      }

      const data: ReportObject[] = res.data.map((r) => ({
        _id: r._id,
        reporteeId: r.reporteeId,
        situation: r.situation,
        datePosted: new Date(r.datePosted),
      }));
      setReports(data);
    });
  }, [loading, userId]);

  const start = page * pageSize;
  const end = (page + 1) * pageSize;
  const visible = reports.slice(start, end);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span>Past Reports</span>
      </div>
      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <div className={styles.date}>
            <span>Date</span>
          </div>
          <div className={styles.reportAgainst}>
            <span>Report against</span>
          </div>
          <div className={styles.situationType}>
            <span>Type of Situation</span>
          </div>
          <div className={styles.status}>
            <span>Status</span>
          </div>
        </div>

        <div className={styles.tableItems}>
          {visible.length === 0 ? (
            <ReportTableItem key="none" date="None" reportee="None" situation="" />
          ) : (
            visible.map((r) => (
              <ReportTableItem
                key={r._id}
                date={r.datePosted.toLocaleDateString()}
                reportee={"Name"}
                situation={r.situation.join(", ")}
              />
            ))
          )}
        </div>
      </div>

      {reports.length > pageSize && (
        <div className={styles.pageSelect}>
          {page === Math.floor(reports.length / pageSize) ? (
            <div className={styles.arrowBoxDisabled}>
              <Image src="/caret_right_disabled.svg" alt="Right Arrow" width={20} height={20} />
            </div>
          ) : (
            <div className={styles.arrowBox} onClick={() => setPage(page + 1)}>
              <Image src="/caret_right.svg" alt="Right Arrow" width={20} height={20} />
            </div>
          )}

          <span className={styles.pageNumber}>
            {`${page + 1} of ${Math.ceil(reports.length / pageSize)}`}
          </span>

          {page === 0 ? (
            <div className={styles.arrowBoxDisabled}>
              <Image src="/caret_left_disabled.svg" alt="Left Arrow" width={20} height={20} />
            </div>
          ) : (
            <div className={styles.arrowBox} onClick={() => setPage(page - 1)}>
              <Image src="/caret_left.svg" alt="Left Arrow" width={20} height={20} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
