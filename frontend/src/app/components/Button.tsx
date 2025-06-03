import React from "react";

import styles from "./Button.module.css";

export type ButtonProps = React.ComponentProps<"button"> & {
  label: string;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  filled?: boolean;
  width?: string;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { label, className, onClick, filled, width, ...props },
  ref,
) {
  return (
    <button
      className={`${styles.button} ${filled ? styles.filled : ""} ${className ?? ""}`}
      style={{ width }}
      ref={ref}
      {...props}
      onClick={onClick}
    >
      {label}
    </button>
  );
});
