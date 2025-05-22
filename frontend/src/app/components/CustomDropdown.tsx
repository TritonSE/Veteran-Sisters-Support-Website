import Image from "next/image";
import React from "react";

import styles from "./CustomDropdown.module.css";

type CustomDropdownProps = {
  options: string[];
  isOpen: boolean;
  toggleDropdown: () => void;
  onSelect: (option: string) => void;
  selected?: string;
  fullWidth?: boolean;
  dropdownWidth?: string;
  marginLeft?: string;
};

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  isOpen,
  toggleDropdown,
  onSelect,
  selected,
  fullWidth,
  dropdownWidth,
  marginLeft,
}) => {
  const handleSelect = (option: string) => {
    toggleDropdown();
    onSelect(option);
  };
  return (
    <div className={`${styles.customDropdownWrapper} ${fullWidth ? styles.fullWidth : ""}`}>
      <div className={styles.selectBox} onClick={toggleDropdown}>
        {selected ?? "Please Select"}
        <Image
          id="arrowUp"
          width={35}
          height={35}
          src="/ic_round-arrow-drop-up.svg"
          alt=""
          style={{
            objectFit: "contain",
            marginLeft: marginLeft ?? undefined,
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        ></Image>
      </div>

      {isOpen && (
        <ul
          className={`${styles.customDropdown} ${fullWidth ? styles.fullWidth : ""}`}
          style={{ width: dropdownWidth ? `${dropdownWidth}px` : "" }}
        >
          {options.map((option, index) => (
            <li
              key={index}
              onClick={() => {
                handleSelect(option);
              }}
              className={styles.dropdownItem}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;
