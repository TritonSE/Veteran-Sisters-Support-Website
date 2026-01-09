import Image from "next/image";
import { useRouter } from "next/navigation";

import { ActivityObject, ActivityType } from "../api/activities";
import { Role as RoleEnum } from "../api/profileApi";

import styles from "./ActivitiesTableItem.module.css";
import { Role } from "./Role";

type ActivitiesTableItemProp = {
  activityObject: ActivityObject;
  userRole: RoleEnum;
  last: boolean;
  onView?: (activityId: string) => void;
};

export function ActivitiesTableItem({
  activityObject,
  userRole,
  last,
  onView,
}: ActivitiesTableItemProp) {
  const router = useRouter();

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

  // temporary measure until we get other pages
  const handleClick = (activity: ActivityObject) => {
    if (activity.type === ActivityType.ANNOUNCEMENT) {
      router.push(`/activities?activityId=${activity._id}`);
    }
  };

  return (
    <div className={last ? styles.lastContainer : styles.container}>
      {activityObject.type === ActivityType.ANNOUNCEMENT && (
        <div className={styles.urgentButton}>Urgent</div>
      )}
      <div
        className={`${styles.content} ${activityObject.type === ActivityType.ANNOUNCEMENT ? styles.announcement : ""}`}
        onClick={() => {
          handleClick(activityObject);
        }}
      >
        <div className={styles.info}>
          <Image
            id="pfp"
            width={40}
            height={40}
            src="/Veteran.svg"
            alt="Profile Photo"
            style={{ float: "left" }}
          ></Image>
          <div className={styles.textColumn}>
            <div className={styles.horizontalDiv}>
              <div className={styles.subtitle}>
                {activityObject.type !== ActivityType.ASSIGNMENT ? (
                  <>
                    <span>{activityObject.uploader.firstName} </span>
                    <Role role={activityObject.uploader.role} />
                  </>
                ) : userRole === RoleEnum.VOLUNTEER ? (
                  <>
                    <span>{activityObject.assignmentInfo.veteranId.firstName} </span>
                    <Role role="veteran" />
                  </>
                ) : (
                  <>
                    <span>{activityObject.assignmentInfo.volunteerId.firstName} </span>
                    <Role role="volunteer" />
                  </>
                )}
              </div>
              <div style={{ fontWeight: "14px", flexShrink: "0" }}>
                {activityObject.relativeTime}
              </div>
            </div>
            <div className={styles.horizontalDiv}>
              <div>{getActivityMessage(activityObject)}</div>
              {onView && (
                <button
                  className={styles.button}
                  onClick={(e) => {
                    e.stopPropagation();
                    onView(activityObject._id);
                  }}
                  style={{ whiteSpace: "nowrap" }}
                >
                  Mark as read
                </button>
              )}
            </div>
            {[ActivityType.REPORT, ActivityType.ANNOUNCEMENT, ActivityType.COMMENT].includes(
              activityObject.type,
            ) && <p className={styles.description}>{activityObject.description}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
