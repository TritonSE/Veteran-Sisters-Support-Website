import styles from "./Button.module.css";
export function Button(params: { text: string; onClick?: (event: React.MouseEvent) => void }) {
  const { text, onClick } = params;
  return (
    <button className={styles.button} onClick={onClick}>
      {text}
    </button>
  );
}
