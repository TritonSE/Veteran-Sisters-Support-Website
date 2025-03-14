import styles from "./ProfilePicture.module.css";

export function ProfilePicture(params: { firstName?: string; size?: string }) {
  const { firstName, size } = params;
  const sizeClass = size === "small" ? "small" : "large";

  const firstLetter = firstName && firstName.length > 0 ? firstName[0] : "?";
  return <div className={`${styles.profilePicture} ${styles[sizeClass]}`}>{firstLetter}</div>;
}
