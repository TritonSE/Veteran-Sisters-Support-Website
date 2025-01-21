"use client";

import React from "react";

import styles from "./ProgressBar.module.css";

export type ProgressBarProps = {
  percentCompleted: number;
};

const ProgressBar: React.FC<ProgressBarProps> = ({ percentCompleted }) => {
  return (
    <div className={styles.progressBarContainer}>
      <div
        className={styles.progressBar}
        style={{ width: `${percentCompleted}%` }}
        aria-valuenow={percentCompleted}
        aria-valuemin={0}
        aria-valuemax={100}
      ></div>
    </div>
  );
};

export default ProgressBar;
