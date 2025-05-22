import Image from "next/image";

import { ActivityObject } from "../api/activities";

import styles from "./ActivitiesTableItem.module.css";
import { Role } from "./Role";

type ActivitiesTableItemProp = {
  activityObject: ActivityObject;
  last: boolean;
};

export function ActivitiesTableItem({ activityObject, last }: ActivitiesTableItemProp) {
  const getActivityMessage = (activity: ActivityObject) => {
    switch (activity.type) {
      case "document":
        return `${activity.uploader.firstName} uploaded a new document named "${activity.documentName}" to "${activity.programName
          ?.map((program) => {
            if (program === "battle buddies") return "Battle Buddies";
            else if (program === "advocacy") return "Advocacy";
            else return "Operation Wellness";
          })
          .join(", ")}"`;
      case "comment":
        return `${activity.uploader.firstName} made a comment on "${activity.documentName}"`;
      case "assignment":
        return `You've been assigned a new veteran!`;
      case "report":
        return `Your report has been resolved.`;
      case "request":
        return `You received access to "${activity.documentName}"`;
      case "announcement":
        return String(activity.title);
      case "signup":
        return `${activity.uploader.firstName} has signed up as a ${activity.uploader.role}`;
      default:
        return `Unknown Activity by ${activity.uploader.firstName}`;
    }
  };

  return (
    <div className={last ? styles.lastContainer : styles.container}>
      <div className={styles.info}>
        <Image
          id="pfp"
          width={40}
          height={40}
          src="/Veteran.svg"
          alt="Profile Photo"
          style={{ float: "left" }}
        ></Image>
        <div className={styles.horizontalDiv}>
          <div className={styles.subtitle}>
            <span>{activityObject.uploader.firstName}</span>
            <Role role={activityObject.uploader.role} />
          </div>
          <div>{getActivityMessage(activityObject)}</div>
          {["report", "announcement"].includes(activityObject.type) && (
            <p className={styles.description}>{activityObject.description}</p>
          )}
        </div>
      </div>
      <div style={{ fontWeight: "14px" }}>{activityObject.relativeTime}</div>
    </div>
  );
}
