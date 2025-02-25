import styles from "./Button.module.css";
import React from "react";

export type ButtonProps = React.ComponentProps<"button"> & {
  label: string;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  filled?: boolean;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { label, className, onClick, filled, ...props },
  ref,
) {
  return (
    <button
      className={`${styles.button} ${filled ? styles.filled : ""} ${className}`}
      ref={ref}
      {...props}
      onClick={onClick}
    >
      {label}
    </button>
  );
});
