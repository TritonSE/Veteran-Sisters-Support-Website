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
        id="back"
        width={18}
        height={18}
        src="/backButton.svg"
        alt="back"
        style={{ objectFit: "none" }}
        onClick={handlePrevious}
      ></Image>
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
