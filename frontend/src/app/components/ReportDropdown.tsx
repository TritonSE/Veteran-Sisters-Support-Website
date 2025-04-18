import Image from "next/image";
import React from "react";

import styles from "./ReportDropdown.module.css";

type ReportDropdownProps = {
  options: string[];
  isOpen: boolean;
  toggleDropdown: () => void;
  onSelect: (option: string) => void;
  selected?: string;
  fullWidth?: boolean;
};

const ReportDropdown: React.FC<ReportDropdownProps> = ({
  options,
  isOpen,
  toggleDropdown,
  onSelect,
  selected,
  fullWidth,
}) => {
  const handleSelect = (option: string) => {
    toggleDropdown();
    onSelect(option);
  };

  return (
    <div
      className={`${styles.ReportDropdownWrapper} ${fullWidth ? styles.fullWidth : ""} ${
        isOpen ? styles.expanded : ""
      }`}
    >
      <div className={`${styles.selectBox} ${isOpen ? styles.open : ""}`} onClick={toggleDropdown}>
        {selected && selected.trim() !== "" ? selected : "Select"}
        <Image
          id="arrowUp"
          width={20}
          height={20}
          src="/ic_dark-gray-arrow-drop-up.svg"
          alt=""
          style={{ objectFit: "contain", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </div>

      {isOpen && (
        <div className={styles.optionsContainer}>
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => {
                handleSelect(option);
              }}
              className={styles.dropdownItem}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportDropdown;
