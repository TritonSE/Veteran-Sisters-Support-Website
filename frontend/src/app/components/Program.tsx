import Image from "next/image";

import styles from "./Program.module.css";

type ProgramProp = {
  program: string;
  iconOnly?: boolean;
};

export function Program({ program, iconOnly }: ProgramProp) {
  let style;
  let programName;
  let icon;
  if (program === "battle buddies") {
    style = `${styles.container} ${styles.battleBuddies}`;
    programName = "Battle Buddles";
    icon = "/battle_buddies_icon.svg";
  } else if (program === "advocacy") {
    style = `${styles.container} ${styles.advocacy}`;
    programName = "Advocacy";
    icon = "/advocacy_icon.svg";
  } else {
    style = `${styles.container} ${styles.operationWellness}`;
    programName = "Operation Wellness";
    icon = "/operation_wellness_icon.svg";
  }
  return (
    <div className={style}>
      <Image src={icon} alt="Program" width={14} height={14} />
      {!iconOnly && <span className={styles.text}>{programName}</span>}
    </div>
  );
}