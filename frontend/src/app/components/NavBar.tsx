import Image from "next/image";
import Link from "next/link";

import styles from "./NavBar.module.css";

type NavBarProp = {
  userId: string;
};

export const NavBar = ({ userId }: NavBarProp) => {
  return (
    <div className={styles.container}>
      <div className={styles.navMenu}>
        <div className={styles.profile}>
          <Link href={`/profile/${userId}`}>
            <div className={styles.profileFrame}>
              <Image src="/profile_icon.svg" alt="Profile" width={24} height={24}></Image>
            </div>
          </Link>
        </div>
        <div className={styles.home}>
          <Link href="/">
            <div className={styles.homeFrame}>
              <div className={styles.homeBackground}>
                <Image src="/home.svg" alt="Home" width={17.778} height={17.778}></Image>
              </div>
            </div>
          </Link>
        </div>
      </div>
      <Link href="/dummy?word=logout">
        <div className={styles.logoutFrame}>
          <Image src="/logout.svg" alt="logout" width={20} height={20}></Image>
        </div>
      </Link>
    </div>
  );
};
