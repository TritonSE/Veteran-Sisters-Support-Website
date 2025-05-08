import React from "react";

import styles from "./ProfileInterests.module.css";

type ProfileInterestsProps = {
  interests: string[] | undefined;
};

const ProfileInterests: React.FC<ProfileInterestsProps> = ({ interests }) => {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>What they are looking for:</h3>
      <div className={styles.interestsWrapper}>
        {interests?.map((interest, index) => (
          <span key={index} className={styles.interestTag}>
            {interest}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProfileInterests;
