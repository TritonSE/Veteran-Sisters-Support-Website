import Image from "next/image";
import Link from "next/link";

import styles from "./NavMenu.module.css";

export const NavMenu = () => {
  return (
    <div className={styles.container}>
      <div className={styles.profile}>
        <div className={styles.profileFrame}>
          <Link href="/dummy?word=profile">
            <Image src="/profile_icon.svg" alt="Profile" width={24} height={24}></Image>
          </Link>
        </div>
      </div>
      <div className={styles.home}>
        <div className={styles.homeFrame}>
          <div className={styles.homeBackground}>
            <Link href="/dummy?word=home">
              <Image src="/home.svg" alt="Home" width={17.778} height={17.778}></Image>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
