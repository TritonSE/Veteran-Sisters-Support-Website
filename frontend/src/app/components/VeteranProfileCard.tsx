import Link from "next/link";

import { UserProfile } from "../api/profileApi";

import styles from "./VeteranProfileCard.module.css";

type VeteranProfileCardProp = {
  user: UserProfile;
};

export function VeteranProfileCard({ user }: VeteranProfileCardProp) {
  return (
    <div className={styles.container}>
      {/* Placeholder link  */}
      <Link href={{ pathname: "/profile", query: { userId: user._id } }} className={styles.link}>
        <div className={styles.profile}>
          <span className={styles.p}>P</span>
        </div>
        <div className={styles.name}>
          <span className={styles.firstName}>{`${user.firstName} ${user.lastName}`}</span>
          <span className={styles.email}>{user.email}</span>
        </div>
      </Link>
    </div>
  );
}
