import styles from "./Button.module.css";
export function Button(params: {
  text: string;
  onClick?: (event: React.MouseEvent) => void;
  filled?: boolean;
}) {
  const { text, onClick, filled } = params;
  return (
    <button className={`${styles.button} ${filled ? styles.filled : ""}`} onClick={onClick}>
      {text}
    </button>
  );
}
