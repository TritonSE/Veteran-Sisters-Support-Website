"use client";

import Image from "next/image";
import React, { useState } from "react";

import styles from "./OnboardingOption.module.css";

export type OnboardingOptionProps = {
  mainText: string;
  description?: string;
  isChecked: boolean;
  onClick: () => void;
};

const OnboardingOption: React.FC<OnboardingOptionProps> = ({
  mainText,
  description,
  isChecked,
  onClick,
}) => {
  const [checked, setChecked] = useState(isChecked);

  const handleClick = () => {
    setChecked(!checked);
    onClick();
  };

  return (
    <div
      className={styles.flexContainer}
      style={{
        padding: description ? "12px 16px" : "8px 16px",
      }}
      onClick={handleClick}
    >
      <div className={styles.flexContent}>
        <div className={styles.textContent}>
          <div className={styles.mainText}>{mainText}</div>
          <div className={styles.description}>{description}</div>
        </div>
        <div className={styles.checkboxContainer}>
          <Image
            src={checked ? "/checkBox.checked.svg" : "/checkBox.unchecked.svg"}
            alt="checkbox"
            width={21}
            height={21}
            className={styles.checkbox}
          />
        </div>
      </div>
    </div>
  );
};

export default OnboardingOption;
