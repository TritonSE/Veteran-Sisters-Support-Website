"use client";

import React, { useState } from "react";

import styles from "./OnboardingOption.module.css";

export type OnboardingOptionProps = {
  mainText: string;
  description?: string;
  isChecked: boolean;
};

const OnboardingOption: React.FC<OnboardingOptionProps> = ({
  mainText,
  description,
  isChecked,
}) => {
  const [checked, setChecked] = useState(isChecked);

  const handleCheckboxClick = () => {
    setChecked(!checked);
  };

  return (
    <div
      className={styles.flexContainer}
      style={{
        padding: description ? "12px 16px" : "8px 16px",
      }}
    >
      <div className={styles.flexContent}>
        <div className={styles.textContent}>
          <div className={styles.mainText}>{mainText}</div>
          <div className={styles.description}>{description}</div>
        </div>
        <div className={styles.checkboxContainer} onClick={handleCheckboxClick}>
          <img
            src={checked ? "/checkbox.checked.svg" : "/checkbox.unchecked.svg"}
            className={styles.checkbox}
          />
        </div>
      </div>
    </div>
  );
};

export default OnboardingOption;
