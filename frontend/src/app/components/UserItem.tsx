import { User } from "../api/users";

import { Program } from "./Program";
import { Role } from "./Role";
import styles from "./UserItem.module.css";

type UserItemProp = {
  user: User;
};

export function UserItem({ user }: UserItemProp) {
  let assignedText;
  let assignedStyle = styles.assignedText;
  if (user.role === "staff") {
    assignedText = "Not applicable";
  } else if (user.assignedVeterans.length === 0) {
    assignedText = "Unassigned";
    assignedStyle = styles.unassignedText;
  } else if (user.role === "volunteer") {
    assignedText = `${user.assignedVeterans.length.toString()} veterans`;
  } else {
    assignedText = "1 volunteer";
  }

  return (
    <div className={styles.container}>
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
          {user.assignedPrograms.includes("battle buddies") && <Program program="battle buddies" />}
          {user.assignedPrograms.includes("advocacy") && <Program program="advocacy" />}
          {user.assignedPrograms.includes("operation wellness") && (
            <Program program="operation wellness" />
          )}
        </div>
      </div>
      <div className={styles.assignedTo}>
        <span className={assignedStyle}>{assignedText}</span>
      </div>
    </div>
  );
}
