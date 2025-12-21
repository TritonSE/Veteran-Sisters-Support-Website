import Image from "next/image";
import { useEffect, useState } from "react";

import { ActivityObject, getActivity } from "../api/activities";

import styles from "./ActivityDetail.module.css";
import NavigateBack from "./NavigateBack";
import { Role } from "./Role";

type ActivitiesDetailProp = {
  activityId: string;
};

export function ActivityDetail({ activityId }: ActivitiesDetailProp) {
  const [activity, setActivity] = useState<ActivityObject | undefined>(undefined);
  const formatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  useEffect(() => {
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
  }, []);

  return (
    <div className={styles.container}>
      <NavigateBack />
      <div className={styles.body}>
        <div className={styles.title}>
          <span className={styles.titleText}>{activity?.title}</span>
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
    </div>
  );
}
