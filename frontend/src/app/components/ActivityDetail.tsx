import Image from "next/image";
import { useEffect, useState } from "react";

import { ActivityObject, ActivityType, getActivity } from "../api/activities";
import { updateReportStatus } from "../api/reportApi";

import styles from "./ActivityDetail.module.css";
import NavigateBack from "./NavigateBack";
import { Role } from "./Role";

type ActivitiesDetailProp = {
  activityId: string;
};

export function ActivityDetail({ activityId }: ActivitiesDetailProp) {
  const [activity, setActivity] = useState<ActivityObject | undefined>(undefined);
  const [isUpdating, setIsUpdating] = useState(false);
  const [copied, setCopied] = useState(false);
  const formatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const fetchActivity = () => {
    getActivity(activityId)
      .then((result) => {
        if (result.success) {
          setActivity(result.data);
        } else {
          console.error(result.error);
        }
      })
      .catch((reason: unknown) => {
        console.error(reason);
      });
  };

  useEffect(() => {
    fetchActivity();
  }, [activityId]);

  const getReportStatus = (): string | null => {
    if (!activity || activity.type !== ActivityType.REPORT) return null;
    if (activity.reportId && typeof activity.reportId === "object") {
      return activity.reportId.status;
    }
    return null;
  };

  const getReportId = (): string | null => {
    if (!activity || activity.type !== ActivityType.REPORT) return null;
    if (activity.reportId && typeof activity.reportId === "object") {
      return activity.reportId._id;
    }
    if (typeof activity.reportId === "string") {
      return activity.reportId;
    }
    return null;
  };

  const handleStatusUpdate = async () => {
    const reportId = getReportId();
    if (!reportId) return;

    const currentStatus = getReportStatus();
    const newStatus = currentStatus === "Pending" ? "Resolved" : "Pending";

    setIsUpdating(true);
    try {
      const result = await updateReportStatus(reportId, newStatus);
      if (result.success) {
        // Refresh the activity to get updated report status
        fetchActivity();
      } else {
        console.error("Failed to update report status:", result.error);
      }
    } catch (error) {
      console.error("Error updating report status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCopyEmail = async () => {
    if (!activity?.uploader?.email) return;

    try {
      await navigator.clipboard.writeText(activity.uploader.email);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy email:", error);
    }
  };

  return (
    <div className={styles.container}>
      <NavigateBack />
      <div className={styles.body}>
        <div className={styles.title}>
          <span className={styles.titleText}>
            {activity?.type === ActivityType.REPORT
              ? "Issue regarding volunteer services"
              : activity?.title}
          </span>
          <span className={styles.titleDate}>
            {activity?.createdAt && formatter.format(new Date(activity?.createdAt))}
          </span>
        </div>
        <div className={styles.content}>
          <div className={styles.profile}>
            <div className={styles.profilePicture}>
              {(activity?.uploader?.firstName.length ?? 0) > 0
                ? activity?.uploader.firstName[0]
                : "?"}
            </div>
            <div className={styles.uploaderInfo}>
              <div className={styles.uploaderName}>
                {`${activity?.uploader?.firstName ?? ""} ${activity?.uploader?.lastName ?? ""}`}
                <Role role={activity?.uploader?.role} />
              </div>
              <div className={styles.uploaderContact}>
                <span className={styles.uploaderContactText}>{activity?.uploader?.email}</span>
                <Image src="/vertical_divider.svg" alt="Divider" width={16} height={16}></Image>
                <span className={styles.uploaderContactText}>
                  {activity?.uploader?.phoneNumber}
                </span>
              </div>
            </div>
          </div>
          <div className={styles.contentText}>{activity?.description}</div>
        </div>
      </div>
      {activity?.type === ActivityType.REPORT && (
        <div
          style={{
            marginTop: "12px",
            display: "flex",
            justifyContent: "space-between",
            gap: "12px",
            width: "1024px",
          }}
        >
          <button
            onClick={() => {
              void handleCopyEmail();
            }}
            style={{
              backgroundColor: "white",
              color: "#057e6f",
              border: "1px solid #057e6f",
              padding: "12px 24px",
              borderRadius: "4px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {copied ? "Copied!" : "Copy Email"}
          </button>
          <button
            onClick={() => {
              void handleStatusUpdate();
            }}
            disabled={isUpdating}
            style={{
              backgroundColor: "#057e6f",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "4px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: isUpdating ? "not-allowed" : "pointer",
              opacity: isUpdating ? 0.6 : 1,
            }}
          >
            {isUpdating
              ? "Updating..."
              : getReportStatus() === "Pending"
                ? "Mark as Resolved"
                : "Mark as Pending"}
          </button>
        </div>
      )}
    </div>
  );
}
