import Image from "next/image";
import { useEffect, useState } from "react";

import { ActivityObject, getUnreadActivities, markActivityRead } from "../api/activities";

import styles from "./UnreadActivities.module.css";

type UnreadActivitiesProps = {
  options: string[];
  isOpen: boolean;
  toggleDropdown: () => void;
};

export const UnreadActivities: React.FC<UnreadActivitiesProps> = ({ isOpen, toggleDropdown }) => {
  const [activities, setActivities] = useState<ActivityObject[]>([]);
  const [totalUnreadCount, setTotalUnreadCount] = useState<number>(0);

  useEffect(() => {
    getUnreadActivities()
      .then((result) => {
        if (result.success) {
          setActivities(result.data.recentUnread);
          setTotalUnreadCount(result.data.totalUnread);
        } else {
          console.log(result.error);
        }
      })
      .catch((err: unknown) => {
        console.error(err);
      });
  }, [isOpen]);

  const handleSelect = (option: string) => {
    // Mark activity as read when selected
    markActivityRead(option)
      .then(() => {
        toggleDropdown();
      })
      .catch((err: unknown) => {
        console.error(err);
      });
  };

  const getActivityMessage = (activity: ActivityObject) => {
    switch (activity.type) {
      case "document":
        return `${activity.firstName} uploaded a new document named "${activity.documentName}" to "${activity.programName?.join(", ")}"`;
      case "comment":
        return `${activity.firstName} made a comment on "${activity.documentName}"`;
      case "assignment":
        return `You've been assigned a new veteran!`;
      case "report":
        return `Your report has been resolved.`;
      case "request":
        return `You received access to "${activity.documentName}"`;
      default:
        return `Unknown Activity by ${activity.firstName}`;
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
              src="ic_round-arrow-drop-up.svg"
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
              New {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
              <div>
                <Image
                  id="pfp"
                  width={40}
                  height={40}
                  src="pfp.svg"
                  alt="Profile Photo"
                  style={{ float: "left", margin: "16px 16px 16px 0px" }}
                ></Image>
                <div className={styles.horizontalDiv}>
                  <div className={styles.subtitle}>
                    {activity.firstName} <span className={styles.label}>{activity.role}</span>
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
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};
