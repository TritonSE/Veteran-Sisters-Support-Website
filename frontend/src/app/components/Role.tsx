import styles from "./Role.module.css";

import { Role as RoleEnum } from "../api/profileApi";

type RoleProp = {
  role: string | undefined;
};

export function Role({ role }: RoleProp) {
  let style;
  let roleName;
  if (role === RoleEnum.STAFF) {
    style = `${styles.container} ${styles.staff}`;
    roleName = "Staff";
  } else if (role === RoleEnum.VOLUNTEER) {
    style = `${styles.container} ${styles.volunteer}`;
    roleName = "Volunteer";
  } else if (role === RoleEnum.ADMIN) {
    style = `${styles.container} ${styles.admin}`;
    roleName = "Admin";
  } else if (role === RoleEnum.VETERAN) {
    style = `${styles.container} ${styles.veteran}`;
    roleName = "Veteran";
  }
  return (
    <div className={style}>
      <span className={styles.text}>{roleName}</span>
    </div>
  );
}
