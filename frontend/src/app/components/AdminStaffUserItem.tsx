import Link from "next/link";

import { AssignedProgram as ProgramEnum, Role as RoleEnum, UserProfile } from "../api/profileApi";

import styles from "./AdminStaffUserItem.module.css";
import { Program } from "./Program";
import { Role } from "./Role";

type AdminStaffUserItemProp = {
  user: UserProfile;
};

export function AdminStaffUserItem({ user }: AdminStaffUserItemProp) {
  let assignedText;
  let assignedStyle = styles.assignedText;
  const length = user.assignedUsers ? user.assignedUsers.length : 0;
  if (user.role === RoleEnum.STAFF) {
    assignedText = "Not applicable";
  } else if (length === 0) {
    assignedText = "Unassigned";
    assignedStyle = styles.unassignedText;
  } else if (user.role === RoleEnum.VOLUNTEER) {
    assignedText = `${length.toString()} veteran${length === 1 ? "" : "s"}`;
  } else {
    assignedText = `${length.toString()} volunteer${length === 1 ? "" : "s"}`;
  }

  return (
    <div className={styles.container}>
      <Link href={{ pathname: "/profile", query: { userId: user._id } }} className={styles.link}>
        <div className={styles.verticalDivider}></div>
        <div className={styles.name}>
          <div className={styles.nameFrame}>
            <span className={styles.nameText}>{`${user.firstName} ${user.lastName}`}</span>
            <span className={styles.emailText}>{user.email}</span>
          </div>
        </div>
        <div className={styles.role}>
          <Role role={user.role} />
        </div>
        <div className={styles.program}>
          <div className={styles.programList}>
            {user.assignedPrograms?.includes(ProgramEnum.BATTLE_BUDDIES) && (
              <Program program="battle buddies" />
            )}
            {user.assignedPrograms?.includes(ProgramEnum.ADVOCACY) && (
              <Program program="advocacy" />
            )}
            {user.assignedPrograms?.includes(ProgramEnum.OPERATION_WELLNESS) && (
              <Program program="operation wellness" />
            )}
          </div>
        </div>
        <div className={styles.assignedTo}>
          <span className={assignedStyle}>{assignedText}</span>
        </div>
      </Link>
    </div>
  );
}
