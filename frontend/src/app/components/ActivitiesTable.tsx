import Image from "next/image";
import { useEffect, useState } from "react";

import { ActivityObject, ActivityType, getActivities } from "../api/activities";
import { Role as RoleEnum } from "../api/profileApi";

import styles from "./ActivitiesTable.module.css";
import { ActivitiesTableItem } from "./ActivitiesTableItem";
import { Tabs } from "./Tabs";

type ActivitiesTableProp = {
  userId: string;
  role: string;
};

export function ActivitiesTable({ userId, role }: ActivitiesTableProp) {
  const [activities, setActivities] = useState<ActivityObject[]>([]);
  const [allActivities, setAllActivities] = useState<ActivityObject[]>([]);
  const [page, setPage] = useState<number>(0);
  const [refresh, setRefresh] = useState<boolean>(false);
  const pageSize = 4;

  const handleChangeType = (type: ActivityType | undefined) => {
    if (!type) {
      setActivities(allActivities);
    } else {
      setActivities(allActivities.filter((activity) => activity.type === type));
    }
    setPage(0);
  };

  let tabs;
  let handlers;
  if (role === "admin" || role === "staff") {
    tabs = ["All", "Reports", "Requests"];
    handlers = [
      () => {
        handleChangeType(undefined);
      },
      () => {
        handleChangeType(ActivityType.REPORT);
      },
      () => {
        handleChangeType(ActivityType.REQUEST);
      },
    ];
  } else {
    tabs = ["All", "Documents", "Assignments"];
    handlers = [
      () => {
        handleChangeType(undefined);
      },
      () => {
        handleChangeType(ActivityType.DOCUMENT);
      },
      () => {
        handleChangeType(ActivityType.ASSIGNMENT);
      },
    ];
  }

  useEffect(() => {
    getActivities(userId)
      .then((result) => {
        if (result.success) {
          setAllActivities(result.data);
          setActivities(result.data);
        } else {
          console.error(result.error);
        }
      })
      .catch((reason: unknown) => {
        console.error(reason);
      });
  }, [refresh]);

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
        {activities.slice(page * pageSize, (page + 1) * pageSize).map((activity, idx, list) => (
          <ActivitiesTableItem
            key={activity._id}
            activityObject={activity}
            userRole={role as RoleEnum}
            last={(idx + 1) % pageSize === 0 || idx === list.length - 1}
          />
        ))}
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
    </div>
  );
}
