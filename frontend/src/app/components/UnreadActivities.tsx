import Image from "next/image";
import { useEffect, useState } from "react";

import { getUnreadActivities, markActivityRead } from "../api/activities";

import styles from "./UnreadActivities.module.css";

type UnreadActivitiesProps = {
  options: string[];
  isOpen: boolean;
  toggleDropdown: () => void;
};

export const UnreadActivities: React.FC<UnreadActivitiesProps> = ({ isOpen, toggleDropdown }) => {
  const [activities, setActivities] = useState([""]);
  const activityCount = activities.length;

  useEffect(() => {
    getUnreadActivities()
      .then((result) => {
        if (result.success) {
          setActivities(result.data);
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
            Unread activity
            <span className={styles.activityCount}>{activityCount}</span>
          </div>
          <a href="/activities" style={{ color: "#057E6F", fontSize: "14px", fontWeight: "600" }}>
            View all activities
          </a>
        </li>
        {isOpen && (
          <li className={styles.dropdownItem}>
            New Document
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
                  Annie Wen <span className={styles.label}>Veteran</span>
                </div>
                <div style={{ fontWeight: "14px" }}>Today</div>
              </div>
              <div>
                Veteran Annie Wen uploaded a new document named &quot;Document1&quot; to
                &quot;Battle Buddies&quot;
              </div>
              {/* <button
                className={styles.button}
                onClick={() => {
                  handleSelect("New Document");
                }}
              >
                Mark as Read
              </button> */}
            </div>
          </li>
        )}
        {/* {activities.length > 0 ? (
            activities.map((activity, index) => (
              <li key={index} className={styles.dropdownItem}>
                {activity}
                <button
                  className={styles.markReadButton}
                  onClick={() => {
                    handleSelect(activity);
                  }}
                >
                  Mark as Read
                </button>
              </li>
            ))
          ) : (
            <li className={styles.dropdownItem}>No unread activities</li>
          )} */}
      </ul>
    </div>
  );
};
