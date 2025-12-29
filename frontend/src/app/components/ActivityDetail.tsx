import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ActivityObject, ActivityType, getActivity } from "../api/activities";
import { AssignedProgram as ProgramEnum, Role as RoleEnum } from "../api/profileApi";

import styles from "./ActivityDetail.module.css";
import NavigateBack from "./NavigateBack";
import { Program } from "./Program";
import { Role } from "./Role";

type ActivitiesDetailProp = {
  activityId: string;
  userRole: string;
};

export function ActivityDetail({ activityId, userRole }: ActivitiesDetailProp) {
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

  const AnnouncementContent = () => {
    return (
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
              <span className={styles.uploaderContactText}>{activity?.uploader?.phoneNumber}</span>
            </div>
          </div>
        </div>
        <div className={styles.contentText}>{activity?.description}</div>
      </div>
    );
  };

  type AssignmentContentProps = {
    displayProfile: {
      _id: string;
      firstName: string;
      lastName: string;
      email?: string;
      phoneNumber?: string;
      assignedPrograms?: ProgramEnum[];
    };
    role: RoleEnum;
  };

  const AssignmentContent = ({ displayProfile, role }: AssignmentContentProps) => {
    const router = useRouter();

    return (
      <div className={styles.content}>
        <span className={styles.assignmentInfo}>
          {role === RoleEnum.VOLUNTEER ? "Volunteer" : "Veteran"} Info:
        </span>
        <div className={styles.assignmentProfile}>
          <div className={styles.profile}>
            <div className={styles.profilePicture}>
              {(displayProfile?.firstName.length ?? 0) > 0 ? displayProfile.firstName[0] : "?"}
            </div>
            <div className={styles.uploaderInfo}>
              <div className={styles.uploaderName}>
                {`${displayProfile?.firstName ?? ""} ${displayProfile?.lastName ?? ""}`}
                <Role role={role} />
                {displayProfile?.assignedPrograms?.includes(ProgramEnum.BATTLE_BUDDIES) && (
                  <Program program="battle buddies" />
                )}
                {displayProfile?.assignedPrograms?.includes(ProgramEnum.ADVOCACY) && (
                  <Program program="advocacy" />
                )}
                {displayProfile?.assignedPrograms?.includes(ProgramEnum.OPERATION_WELLNESS) && (
                  <Program program="operation wellness" />
                )}
              </div>
              <div className={styles.uploaderContact}>
                <span className={styles.contactText}>{displayProfile?.email}</span>
                <Image src="/vertical_divider.svg" alt="Divider" width={16} height={16}></Image>
                <span className={styles.contactText}>{displayProfile?.phoneNumber}</span>
              </div>
            </div>
          </div>
          <div
            className={styles.viewProfile}
            onClick={() => {
              router.push(`/profile?userId=${displayProfile._id}`);
            }}
          >
            View Profile
          </div>
        </div>
      </div>
    );
  };

  const getTitle = () => {
    if (activity?.type === ActivityType.ASSIGNMENT) {
      if ((userRole as RoleEnum) === RoleEnum.VETERAN) {
        return `You've been assigned to ${activity.assignmentInfo.volunteerId.firstName} ${activity.assignmentInfo.volunteerId.lastName}`;
      } else {
        return `You've been assigned to ${activity.assignmentInfo.veteranId.firstName} ${activity.assignmentInfo.veteranId.lastName}`;
      }
    } else if (activity?.type === ActivityType.ANNOUNCEMENT) {
      return activity?.title;
    } else {
      return "Unknown activity";
    }
  };

  return (
    <div className={styles.container}>
      <NavigateBack />
      <div className={styles.body}>
        <div className={styles.title}>
          <span className={styles.titleText}>{getTitle()}</span>
          <span className={styles.titleDate}>
            {activity?.createdAt && formatter.format(new Date(activity?.createdAt))}
          </span>
        </div>
        {activity?.type === ActivityType.ASSIGNMENT ? (
          <AssignmentContent
            displayProfile={
              (userRole as RoleEnum) === RoleEnum.VETERAN
                ? activity?.assignmentInfo.volunteerId
                : activity?.assignmentInfo.veteranId
            }
            role={
              (userRole as RoleEnum) === RoleEnum.VETERAN ? RoleEnum.VOLUNTEER : RoleEnum.VETERAN
            }
          />
        ) : (
          <AnnouncementContent />
        )}
      </div>
    </div>
  );
}
