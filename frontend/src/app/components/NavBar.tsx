import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

import { auth } from "../../../firebase/firebase";

import styles from "./NavBar.module.css";

export const NavBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    console.log("Logging out...");
    await auth.signOut();
    router.push("/login");
  };

  return (
    <div className={styles.container}>
      <div className={styles.navMenu}>
        <div className={styles.profile}>
          <Link href="/dummy?word=profile">
            <div className={styles.profileFrame}>
              <Image src="/profile_icon.svg" alt="Profile" width={24} height={24}></Image>
            </div>
          </Link>
        </div>
        <div className={styles.home}>
          <Link href="/">
            <div className={styles.homeFrame}>
              <div
                className={
                  pathname === "/" ||
                  pathname === "/veteranDashboard" ||
                  pathname === "/staffview" ||
                  pathname === "/adminview" ||
                  pathname === "/volunteerview"
                    ? styles.selectedBackground
                    : styles.unselectedBackground
                }
              >
                <Image src="/home.svg" alt="Home" width={17.778} height={17.778}></Image>
              </div>
            </div>
          </Link>
          <Link href="/reportform">
            <div
              className={
                pathname === "/reportform" ? styles.selectedBackground : styles.unselectedBackground
              }
            >
              <Image src="/reports.svg" alt="Home" width={17.778} height={17.778}></Image>
            </div>
          </Link>
        </div>
      </div>
      <button
        onClick={() => {
          handleLogout();
        }}
      >
        <div className={styles.logoutFrame}>
          <Image src="/logout.svg" alt="logout" width={20} height={20}></Image>
        </div>
      </button>
    </div>
  );
};
