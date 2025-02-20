import { User } from "../api/users";

import styles from "./VeteranProfileCard.module.css";

type VeteranListUserItemProp = {
  user: User;
};

export function VeteranListUserItem({ user }: VeteranListUserItemProp) {
  return (
    <div className={styles.container}>
      <div className={styles.profile}>
        <span className={styles.p}>P</span>
      </div>
      <div className={styles.name}>
        <span className={styles.firstName}>{`${user.firstName} ${user.lastName}`}</span>
        <span className={styles.email}>{user.email}</span>
      </div>
    </div>
  );
}
