"use client";

import React from "react";

import styles from "./ChecklistOption.module.css";

export type ChecklistOptionProps = {
  text: string;
  description?: string;
  isChecked: boolean;
  onClick: () => void;
};

const ChecklistOption: React.FC<ChecklistOptionProps> = ({ text, isChecked, onClick }) => {
  return (
    <div className={styles.flexContent} onClick={onClick}>
      <div className={styles.checkboxContainer}>
        <img
          src={isChecked ? "/checkbox.checked.svg" : "/checkbox.unchecked.green.svg"}
          className={styles.checkbox}
        />
      </div>
      <div className={styles.text}>{text}</div>
    </div>
  );
};

export default ChecklistOption;
