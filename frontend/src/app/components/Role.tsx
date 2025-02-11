import styles from "./Role.module.css";

type RoleProp = {
  role: string;
};

export function Role({ role }: RoleProp) {
  let style;
  let roleName;
  if (role === "staff") {
    style = `${styles.container} ${styles.staff}`;
    roleName = "Staff";
  } else if (role === "volunteer") {
    style = `${styles.container} ${styles.volunteer}`;
    roleName = "Volunteer";
  } else {
    style = `${styles.container} ${styles.veteran}`;
    roleName = "Veteran";
  }
  return (
    <div className={style}>
      <span className={styles.text}>{roleName}</span>
    </div>
  );
}