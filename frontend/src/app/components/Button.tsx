"use client";

import Link from "next/link";
import React from "react";

import styles from "./Button.module.css";

export type ButtonProps = React.ComponentProps<"button"> & {
  label: string;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { label, className, ...props },
  ref,
) {
  let buttonClass = styles.button;
  if (className) {
    buttonClass += ` ${className}`;
  }
  return (
    <button ref={ref} className={buttonClass} {...props}>
      {label}
    </button>
  );
});
