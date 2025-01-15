import Image from "next/image";
import Link from "next/link";

import styles from "./NavBar.module.css";
import { NavMenu } from "./NavMenu";

export const NavBar = () => {
  return (
    <div className={styles.container}>
      <NavMenu></NavMenu>
      <Link href="/dummy?word=logout">
        <Image src="/logout.svg" alt="logout" width={20} height={20}></Image>
      </Link>
    </div>
  );
};
