"use client";

import React from "react";
import Image from "next/image";

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
        <Image
          src={isChecked ? "/checkBox.checked.svg" : "/checkbox.unchecked.green.svg"}
          alt="Checkbox"
          width={24}
          height={24}
          className={styles.checkbox}
        />
      </div>
      <div className={styles.text}>{text}</div>
    </div>
  );
};

export default ChecklistOption;
