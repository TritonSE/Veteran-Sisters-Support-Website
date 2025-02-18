import Link from "next/link";

import { User } from "../api/users";

import styles from "./AdminStaffUserItem.module.css";
import { Program } from "./Program";
import { Role } from "./Role";

type AdminStaffUserItemProp = {
  user: User;
};

export function AdminStaffUserItem({ user }: AdminStaffUserItemProp) {
  let assignedText;
  let assignedStyle = styles.assignedText;
  const vetLen = user.assignedVeterans.length;
  const volLen = user.assignedVolunteers.length;
  if (user.role === "staff") {
    assignedText = "Not applicable";
  } else if (vetLen === 0 && volLen === 0) {
    assignedText = "Unassigned";
    assignedStyle = styles.unassignedText;
  } else if (user.role === "volunteer") {
    assignedText = `${vetLen.toString()} veteran${vetLen === 1 ? "" : "s"}`;
  } else {
    assignedText = `${volLen.toString()} volunteer${volLen === 1 ? "" : "s"}`;
  }

  return (
    <div className={styles.container}>
      {/* Placeholder link  */}
      <Link href="/profile" className={styles.link}>
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
            {user.assignedPrograms.includes("battle buddies") && (
              <Program program="battle buddies" />
            )}
            {user.assignedPrograms.includes("advocacy") && <Program program="advocacy" />}
            {user.assignedPrograms.includes("operation wellness") && (
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
