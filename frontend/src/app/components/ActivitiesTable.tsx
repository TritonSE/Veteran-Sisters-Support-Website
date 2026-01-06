import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import {
  ActivityObject,
  ActivityType,
  getActivities,
  getUnreadActivities,
} from "../api/activities";
import { Role as RoleEnum } from "../api/profileApi";
import { markActivityRead } from "../api/userApi";

import styles from "./ActivitiesTable.module.css";
import { ActivitiesTableItem } from "./ActivitiesTableItem";
import ErrorMessage from "./ErrorMessage";
import { Tabs } from "./Tabs";

type ActivitiesTableProp = {
  userId: string;
  role: string;
};

export function ActivitiesTable({ userId, role }: ActivitiesTableProp) {
  const [allActivities, setAllActivities] = useState<ActivityObject[]>([]);
  const [activityTypes, setActivityTypes] = useState<ActivityType[] | null>(null);
  const [page, setPage] = useState<number>(0);
  const [unreadIds, setUnreadIds] = useState<Set<string>>(new Set());
  const [errorMessage, setErrorMessage] = useState("");
  const activities = useMemo(
    () =>
      activityTypes
        ? allActivities.filter((activity) => activityTypes.includes(activity.type))
        : allActivities,
    [allActivities, activityTypes],
  );

  const [refresh, setRefresh] = useState<boolean>(false);
  const pageSize = 4;

  const handleChangeType = (types: ActivityType[] | null) => {
    setActivityTypes(types);
    setPage(0);
  };

  let tabs;
  let handlers;
  if (role === "admin" || role === "staff") {
    tabs = ["All", "Reports"];
    handlers = [
      () => {
        handleChangeType(null);
      },
      () => {
        handleChangeType([ActivityType.REPORT]);
      },
    ];
  } else {
    tabs = ["All", "Documents", "Assignments"];
    handlers = [
      () => {
        handleChangeType(null);
      },
      () => {
        handleChangeType([ActivityType.DOCUMENT, ActivityType.COMMENT]);
      },
      () => {
        handleChangeType([ActivityType.ASSIGNMENT]);
      },
    ];
  }
  useEffect(() => {
    Promise.all([getActivities(userId), getUnreadActivities(userId)])
      .then(([allRes, unreadRes]) => {
        if (allRes.success) setAllActivities(allRes.data);
        else setErrorMessage(`Failed to get activities: ${allRes.error}`);

        if (unreadRes.success) {
          setUnreadIds(new Set(unreadRes.data.recentUnread.map((a) => a._id)));
        } else {
          setErrorMessage(`Failed to get unread activities: ${unreadRes.error}`);
        }
      })
      .catch((error: unknown) => {
        setErrorMessage(`Error getting activities: ${String(error)}`);
      });
  }, [refresh, userId]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.titleText}>Activity</span>
        <Image
          src="/refresh.svg"
          alt="Refresh"
          width={20}
          height={20}
          className={styles.refreshButton}
          onClick={() => {
            setRefresh(!refresh);
          }}
        />
      </div>
      <Tabs tabs={tabs} handlers={handlers} />
      <div className={styles.table}>
        {activities.slice(page * pageSize, (page + 1) * pageSize).map((activity, idx, list) => {
          const isUnread = unreadIds.has(activity._id);
          return (
            <ActivitiesTableItem
              key={activity._id}
              activityObject={activity}
              userRole={role as RoleEnum}
              last={(idx + 1) % pageSize === 0 || idx === list.length - 1}
              onView={
                isUnread
                  ? (activityId) => {
                      markActivityRead(userId, activityId)
                        .then(() => {
                          setRefresh((prev) => !prev);
                        })
                        .catch((error: unknown) => {
                          setErrorMessage(`Error getting activities: ${String(error)}`);
                        });
                    }
                  : undefined
              }
            />
          );
        })}
      </div>
      {activities.length > pageSize && (
        <div className={styles.pageSelect}>
          {page === Math.floor((activities.length - 1) / pageSize) ? (
            <div className={styles.arrowBoxDisabled}>
              <Image
                src="/caret_right_disabled.svg"
                alt="Right Arrow"
                width={20}
                height={20}
              ></Image>
            </div>
          ) : (
            <div
              className={styles.arrowBox}
              onClick={() => {
                setPage(page + 1);
              }}
            >
              <Image src="/caret_right.svg" alt="Right Arrow" width={20} height={20}></Image>
            </div>
          )}
          <span
            className={styles.pageNumber}
          >{`${(page + 1).toString()} of ${Math.ceil(activities.length / pageSize).toString()}`}</span>
          {page === 0 ? (
            <div className={styles.arrowBoxDisabled}>
              <Image src="/caret_left_disabled.svg" alt="Left Arrow" width={20} height={20}></Image>
            </div>
          ) : (
            <div
              className={styles.arrowBox}
              onClick={() => {
                setPage(page - 1);
              }}
            >
              <Image src="/caret_left.svg" alt="Left Arrow" width={20} height={20}></Image>
            </div>
          )}
        </div>
      )}
      {errorMessage && <ErrorMessage message={errorMessage}></ErrorMessage>}
    </div>
  );
}
