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
        </li>
        {isOpen && (
          <li className={styles.dropdownItem}>
            New Document
            <div className={styles.subtitle}>
              Annie Wen <span className={styles.label}>Veteran</span>
            </div>
            <div className={styles.horizontalDiv}>
              <div>Veteran Annie Wen uploaded a new document named &quot;Document1&quot;</div>
              <button
                className={styles.button}
                onClick={() => {
                  handleSelect("New Document");
                }}
              >
                Mark as Read
              </button>
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
