import Image from "next/image";
import React from "react";

import styles from "./BackButton.module.css";

export type BackButtonProps = {
  handlePrevious: () => void;
};

export const BackButton: React.FC<BackButtonProps> = ({ handlePrevious }) => {
  return (
    <div className={styles.backButton}>
      <Image
        src="/back_arrow_icon.svg"
        width={18}
        height={18}
        alt="Go back"
        onClick={() => {
          handlePrevious();
        }}
      />
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault(); // Prevent default link behavior (no navigation)
          handlePrevious(); // Call the provided handleNext function
        }}
      >
        {" "}
        Back
      </a>
    </div>
  );
};
