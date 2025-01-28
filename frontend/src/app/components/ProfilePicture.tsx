import styles from "./ProfilePicture.module.css";

export function ProfilePicture(params: { firstName?: string }) {
  const { firstName } = params;
  const firstLetter = firstName && firstName.length > 0 ? firstName[0] : "?";
  return <div className={styles.defaultProfileIcon}>{firstLetter}</div>;
}
