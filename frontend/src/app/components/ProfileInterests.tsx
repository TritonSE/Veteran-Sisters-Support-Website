import React from "react";

import styles from "./ProfileInterests.module.css";

export type ProfileInterestsProps = {
  interests: string[] | undefined;
  minimized: boolean;
};

const ProfileInterests: React.FC<ProfileInterestsProps> = ({ interests, minimized }) => {
  return (
    <div className={`${styles.container} ${minimized ? styles.containerMinimized : ""}`}>
      <h3 className={`${styles.title} ${minimized ? styles.titleMinimized : ""}`}>
        What they are looking for:
      </h3>
      <div className={styles.interestsWrapper}>
        {interests?.map((interest, idx) => (
          <span
            key={idx}
            className={`${styles.interestTag} ${minimized ? styles.interestTagMinimized : ""}`}
          >
            {interest}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProfileInterests;
