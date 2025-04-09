"use client";

import { useRouter } from "next/navigation";

import { AnnouncementTableItem } from "../components/AnnouncementTableItem";
import { Button } from "../components/Button";
import { NavBar } from "../components/NavBar";

import styles from "./page.module.css";

export default function Page() {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <NavBar />
      <div className={styles.page}>
        <div className={styles.frame}>
          <div className={styles.header}>
            <span style={{ height: "38px" }}>
              Announcements 📢 <br></br>
            </span>
            <div className={styles.subheader}>
              <span>
                Share important updates, news, and information with all community members here.
                Messages posted in this section will be visible to everyone.
              </span>
            </div>
          </div>
          <Button
            label="Create new announcement"
            filled={true}
            className={styles.button}
            onClick={() => {
              router.push("announcements/new");
            }}
          />
          <AnnouncementTableItem
            date="1/23/2023"
            announcement="asdasjdoaisjdoaisjdoaisjdoaisjdoaisjdaoisjdaoisjdaosijdaoisjdoaisjdoaisjdoaisjdoaiosjdoasjdoaisjdoaisjdoaisjdoaisjdoaijsdoaisjodiajsdoiajsodiajsoidjaosidjaosijdoaisjdoaijsdoaijsodijaosidjoaisjodaijsoiajdoaisjdoaisjdaosijdoaisjdoaisjdoaisjdoaijsdoaisjdoaijsdoaisjdoaisjdoaijsdoaisjdoiasjodiajsodiajsodiajsodijasoidjaosidjaosijdaosijdaosijdoaisjdoaaijsdoiajsodaijsdoiajsodaijsdoiasjodijaosidjaosidjaosidjaosijdaoisjdaoisjdaoisjdoaisjdoaisjdoaisjdoaisjdoaisjdoaisjdoaisjdo"
          />
          <AnnouncementTableItem date="1/23/2023" announcement="asdasdasd" />
        </div>
      </div>
    </div>
  );
}
