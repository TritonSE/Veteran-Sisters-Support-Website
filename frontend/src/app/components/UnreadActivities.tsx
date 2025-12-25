import Image from "next/image";
import { useEffect, useState } from "react";

import { ActivityObject, ActivityType, getUnreadActivities } from "../api/activities";
import { Role as RoleEnum } from "../api/profileApi";
import { markActivityRead } from "../api/userApi";

import ErrorMessage from "./ErrorMessage";
import { Role } from "./Role";
import styles from "./UnreadActivities.module.css";

type UnreadActivitiesProps = {
  userId: string;
  userRole: RoleEnum;
  isOpen: boolean;
  toggleDropdown: () => void;
};

export const UnreadActivities: React.FC<UnreadActivitiesProps> = ({
  userId,
  userRole,
  isOpen,
  toggleDropdown,
}) => {
  const [activities, setActivities] = useState<ActivityObject[]>([]);
  const [totalUnreadCount, setTotalUnreadCount] = useState<number>(0);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    getUnreadActivities(userId)
      .then((result) => {
        if (result.success) {
          setActivities(result.data.recentUnread);
          setTotalUnreadCount(result.data.totalUnread);
        } else {
          console.error(result.error);
        }
      })
      .catch((err: unknown) => {
        console.error(err);
      });
  }, [refresh]);

  const handleSelect = (option: string) => {
    // Mark activity as read when selected
    markActivityRead(userId, option)
      .then((res) => {
        if (res.success) {
          setRefresh(!refresh);
        } else {
          setErrorMessage(`Error marking activity as read: ${res.error}`);
        }
      })
      .catch((err: unknown) => {
        setErrorMessage(`Error marking activity as read: ${String(err)}`);
      });
  };

  const getActivityMessage = (activity: ActivityObject) => {
    switch (activity.type) {
      case ActivityType.DOCUMENT:
        return `${activity.uploader.firstName} uploaded a new document named "${activity.documentName}" to "${activity.programName
          ?.map((program) => {
            if (program === "battle buddies") return "Battle Buddies";
            else if (program === "advocacy") return "Advocacy";
            else if (program === "operation wellness") return "Operation Wellness";
            else return program;
          })
          .join(", ")}"`;
      case ActivityType.COMMENT:
        return `${activity.uploader.firstName} made a comment on "${activity.documentName}"`;
      case ActivityType.ASSIGNMENT:
        return `You've been assigned a new ${userRole === RoleEnum.VETERAN ? "volunteer" : "veteran"}!`;
      case ActivityType.REPORT: {
        const reportStatus =
          activity.reportId && typeof activity.reportId === "object"
            ? (activity.reportId as { _id: string; status: string }).status
            : null;
        if (reportStatus === "Resolved") {
          return `A report regarding volunteer services has been resolved.`;
        } else {
          return `Issue regarding volunteer services!.`;
        }
      }
      case ActivityType.REQUEST:
        return `You received access to "${activity.documentName}"`;
      case ActivityType.ANNOUNCEMENT:
        return String(activity.title);
      case ActivityType.SIGNUP:
        return `${activity.uploader.firstName} has signed up as a ${activity.uploader.role}`;
      default:
        return `Unknown Activity by ${activity.uploader.firstName}`;
    }
  };

  return (
    <div className={styles.component}>
      <ul className={styles.customDropdown}>
        <li className={styles.selectBox} onClick={toggleDropdown}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Image
              id="arrowUp"
              width={35}
              height={35}
              src="/ic_round-arrow-drop-up.svg"
              alt="Dropdown arrow"
              style={{
                objectFit: "contain",
                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}
            ></Image>
            {activities.length > 0 ? (
              <span>Unread activity</span>
            ) : (
              <span>No new activity. You&apos;re all caught up!</span>
            )}
            <span className={styles.activityCount}>{totalUnreadCount}</span>
          </div>
          <a href="/activities" style={{ color: "#057E6F", fontSize: "14px", fontWeight: "600" }}>
            View all activities
          </a>
        </li>
        {isOpen &&
          activities.map((activity, index) => (
            <li className={styles.dropdownItem} key={index}>
              {activity.type === ActivityType.DOCUMENT
                ? "New Document"
                : activity.type === ActivityType.REPORT
                  ? "Reports"
                  : activity.type === ActivityType.ASSIGNMENT
                    ? "New Assignment"
                    : activity.type === ActivityType.REQUEST
                      ? "Requests"
                      : activity.type === ActivityType.COMMENT
                        ? "New Comment"
                        : activity.type === ActivityType.SIGNUP
                          ? "Sign Up"
                          : ""}
              <div>
                {activity.type === ActivityType.ANNOUNCEMENT && (
                  <div className={styles.urgentButton}>Urgent</div>
                )}
                <div
                  className={activity.type === ActivityType.ANNOUNCEMENT ? styles.announcement : ""}
                >
                  <Image
                    id="pfp"
                    width={40}
                    height={40}
                    src="/Veteran.svg"
                    alt="Profile Photo"
                    style={{ float: "left", margin: "16px 16px 16px 0px" }}
                  ></Image>
                  <div className={styles.horizontalDiv}>
                    <div className={styles.subtitle}>
                      {activity.type !== ActivityType.ASSIGNMENT ? (
                        <>
                          <span>{activity.uploader.firstName} </span>
                          <Role role={activity.uploader.role} />
                        </>
                      ) : userRole === RoleEnum.VOLUNTEER ? (
                        <>
                          <span>{activity.assignmentInfo.veteranId.firstName} </span>
                          <Role role={RoleEnum.VETERAN} />
                        </>
                      ) : (
                        <>
                          <span>{activity.assignmentInfo.volunteerId.firstName} </span>
                          <Role role={RoleEnum.VOLUNTEER} />
                        </>
                      )}
                    </div>
                    <div style={{ fontWeight: "14px" }}>{activity.relativeTime}</div>
                  </div>
                  <div className={styles.horizontalDiv}>
                    <div>{getActivityMessage(activity)}</div>
                    <button
                      className={styles.button}
                      onClick={() => {
                        handleSelect(activity._id);
                      }}
                    >
                      View
                    </button>
                  </div>

                  {[ActivityType.REPORT, ActivityType.ANNOUNCEMENT, ActivityType.COMMENT].includes(
                    activity.type,
                  ) && <p className={styles.description}>{activity.description}</p>}
                </div>
              </div>
            </li>
          ))}
      </ul>
      {errorMessage && <ErrorMessage message={errorMessage} />}
    </div>
  );
};
