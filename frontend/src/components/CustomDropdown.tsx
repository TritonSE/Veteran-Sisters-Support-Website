import Image from "next/image";
import React, { useState } from "react";

import styles from "./CustomDropdown.module.css";

type CustomDropdownProps = {
  options: string[];
  isOpen: boolean;
  toggleDropdown: () => void;
  onSelect: (option: string) => void;
};

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  isOpen,
  toggleDropdown,
  onSelect,
}) => {
  const [selectedOption, setSelectedOption] = useState("");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    toggleDropdown();
    onSelect(option);
  };
  return (
    <div>
      <div className={styles.selectBox} onClick={toggleDropdown}>
        {selectedOption || "Please Select"}
        <Image
          id="arrowUp"
          width={35}
          height={35}
          src="ic_round-arrow-drop-up.svg"
          alt=""
          style={{ objectFit: "contain", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        ></Image>
      </div>

      {isOpen && (
        <ul className={styles.customDropdown}>
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
