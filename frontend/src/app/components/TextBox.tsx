import React, { useState } from "react";
import styles from "./TextBox.module.css";

type TextBoxProps = {
  width?: string;
  height?: string;
  placeholder?: string;
  paddingTop?: string;
  paddingLeft?: string;
};

export default function TextBox({
  width = "300px",
  height = "40px",
  placeholder = "",
  paddingTop = "8px",
  paddingLeft = "8px",
}: TextBoxProps) {
  const [value, setValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  return (
    <textarea
      className={styles.textBox}
      style={{
        width: width,
        height: height,
        paddingTop: paddingTop,
        paddingLeft: paddingLeft,
      }}
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
    />
  );
}
