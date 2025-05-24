"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { getReportsByReporter } from "../api/reportApi";
import { getUser } from "../api/userApi";
import { useAuth } from "../contexts/AuthContext";

import styles from "./ReportTable.module.css";
import { ReportTableItem } from "./ReportTableItem";

type ReportObject = {
  _id: string;
  reporteeId: string;
  reporteeName: string;
  situation: string[];
  datePosted: Date;
  status: string;
};

export default function ReportTable() {
  const { userId, loading } = useAuth();
  const [reports, setReports] = useState<ReportObject[]>([]);
  const [page, setPage] = useState(0);
  const pageSize = 8;

  useEffect(() => {
    if (loading || !userId) return;

    void (async () => {
      const res = await getReportsByReporter(userId);
      if (!res.success) {
        console.error(res.error);
        return;
      }

      let withNames: ReportObject[] = [];
      try {
        withNames = await Promise.all(
          res.data.map(async (report) => {
            const userRes = await getUser(report.reporteeId);
            const firstName = userRes.success ? userRes.data.firstName : "Unknown";
            const lastName = userRes.success ? userRes.data.lastName : "";

            return {
              _id: report._id,
              reporteeId: report.reporteeId,
              reporteeName: `${firstName} ${lastName}`,
              situation: report.situation,
              datePosted: new Date(report.datePosted),
              status: report.status,
            };
          }),
        );
      } catch (err) {
        console.error(err);
        withNames = [];
      }

      setReports(withNames);
    })();
  }, [loading, userId]);

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
          {reports.length === 0 ? (
            <ReportTableItem key="none" date="None" reportee="" situation="" status="" />
          ) : (
            reports
              .slice(page * pageSize, (page + 1) * pageSize)
              .map((report) => (
                <ReportTableItem
                  key={report._id}
                  date={report.datePosted.toLocaleDateString()}
                  reportee={report.reporteeName}
                  situation={report.situation.join(", ")}
                  status={report.status}
                />
              ))
          )}
        </div>
      </div>

      {reports.length > 8 && (
        <div className={styles.pageSelect}>
          {page === Math.floor((reports.length - 1) / pageSize) ? (
            <div className={styles.arrowBoxDisabled}>
              <Image src="/caret_right_disabled.svg" alt="Right Arrow" width={20} height={20} />
            </div>
          ) : (
            <div
              className={styles.arrowBox}
              onClick={() => {
                setPage(page + 1);
              }}
            >
              <Image src="/caret_right.svg" alt="Right Arrow" width={20} height={20} />
            </div>
          )}

          <span className={styles.pageNumber}>
            {`${(page + 1).toString()} of ${Math.ceil(reports.length / pageSize).toString()}`}
          </span>

          {page === 0 ? (
            <div className={styles.arrowBoxDisabled}>
              <Image src="/caret_left_disabled.svg" alt="Left Arrow" width={20} height={20} />
            </div>
          ) : (
            <div
              className={styles.arrowBox}
              onClick={() => {
                setPage(page - 1);
              }}
            >
              <Image src="/caret_left.svg" alt="Left Arrow" width={20} height={20} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
