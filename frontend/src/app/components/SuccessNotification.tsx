"use client";

import { useEffect, useState } from "react";

import styles from "./SuccessNotification.module.css";

export type SuccessNotificationProps = {
  message: string;
};

const SuccessNotification: React.FC<SuccessNotificationProps> = ({ message }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 10000); // Hide after 3 seconds

    return () => {
      clearTimeout(timer);
    };
  }, []);

  if (!visible) return null;

  return <div className={styles.notif}>{message}</div>;
};

export default SuccessNotification;
