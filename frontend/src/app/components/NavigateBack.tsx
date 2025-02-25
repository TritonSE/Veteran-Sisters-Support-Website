import Image from "next/image";
import { useRouter } from "next/navigation";

import styles from "./NavigateBack.module.css";

export default function NavigateBack() {
  const router = useRouter();

  return (
    <div
      className={styles.navigateBack}
      onClick={() => {
        router.back();
      }}
    >
      <Image src="/back_arrow_icon.svg" width={18} height={18} alt="Go back" />
      <div> Back</div>
    </div>
  );
}
