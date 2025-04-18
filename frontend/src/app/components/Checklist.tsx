"use client";

import React from "react";

import styles from "./Checklist.module.css";
import ChecklistOption from "./ChecklistOption";

type ChecklistProps = {
  options: string[];
  selectedOptions: string[];
  onOptionClick: (option: string) => void;
  customClassName?: string;
};

const Checklist: React.FC<ChecklistProps> = ({
  options,
  selectedOptions,
  onOptionClick,
  customClassName,
}) => {
  return (
    <div className={`${styles.checklistContainer} ${customClassName ?? ""}`}>
      {options.map((option, index) => (
        <ChecklistOption
          key={index}
          text={option}
          isChecked={selectedOptions.includes(option)}
          onClick={() => {
            onOptionClick(option);
          }}
        />
      ))}
    </div>
  );
};

export default Checklist;
