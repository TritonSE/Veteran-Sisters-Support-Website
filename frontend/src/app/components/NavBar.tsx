import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { auth } from "../../firebase/firebase";
import { useAuth } from "../contexts/AuthContext";

import styles from "./NavBar.module.css";

export const NavBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { userId } = useAuth();

  const handleLogout = async () => {
    await auth.signOut();
    router.push("/login");
  };

  return (
    <div className={styles.container}>
      <div className={styles.navMenu}>
        <div className={styles.profile}>
          <Link href={{ pathname: "/profile", query: { userId } }}>
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
                  pathname === "/" ? styles.selectedBackground : styles.unselectedBackground
                }
              >
                <Image src="/home.svg" alt="Home" width={17.778} height={17.778}></Image>
              </div>
            </div>
          </Link>
          <Link href="/reportform">
            <div
              className={
                pathname.startsWith("/reportform")
                  ? styles.selectedBackground
                  : styles.unselectedBackground
              }
            >
              <Image src="/reports.svg" alt="Home" width={17.778} height={17.778}></Image>
            </div>
          </Link>
        </div>
      </div>
      <button
        className={styles.logoutFrame}
        onClick={() => {
          void handleLogout();
        }}
      >
        <div>
          <Image src="/logout.svg" alt="logout" width={20} height={20}></Image>
        </div>
      </button>
    </div>
  );
};
