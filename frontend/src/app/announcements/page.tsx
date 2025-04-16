"use client";

import { useRouter } from "next/navigation";
import { Suspense } from "react";

import { AnnouncementTable } from "../components/AnnouncementTable";
import { Button } from "../components/Button";
import { NavBar } from "../components/NavBar";
import { useAuth } from "../contexts/AuthContext";
import { AuthContextWrapper } from "../contexts/AuthContextWrapper";

import styles from "./page.module.css";

function AnnouncementContent() {
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
          <div className={styles.spacing1}></div>
          <Button
            label="Create new announcement"
            filled={true}
            onClick={() => {
              router.push("/announcements/new");
            }}
          />
          <div className={styles.spacing2}></div>
          <AnnouncementTable />
          {/* <br></br>
          <AnnouncementTableItem
            date="1/23/2023"
            announcement="asdasjdoaisjdoaisjdoaisjdoaisjdoaisjdaoisjdaoisjdaosijdaoisjdoaisjdoaisjdoaisjdoaiosjdoasjdoaisjdoaisjdoaisjdoaisjdoaijsdoaisjodiajsdoiajsodiajsoidjaosidjaosijdoaisjdoaijsdoaijsodijaosidjoaisjodaijsoiajdoaisjdoaisjdaosijdoaisjdoaisjdoaisjdoaijsdoaisjdoaijsdoaisjdoaisjdoaijsdoaisjdoiasjodiajsodiajsodiajsodijasoidjaosidjaosijdaosijdaosijdoaisjdoaaijsdoiajsodaijsdoiajsodaijsdoiasjodijaosidjaosidjaosidjaosijdaoisjdaoisjdaoisjdoaisjdoaisjdoaisjdoaisjdoaisjdoaisjdoaisjdo"
          />
          <AnnouncementTableItem date="1/23/2023" announcement="asdasdasd" /> */}
        </div>
      </div>
    </div>
  );
}

export default function AnnouncementPage() {
  const { userRole } = useAuth();
  return (
    <AuthContextWrapper>
      <Suspense fallback={<div>Loading...</div>}>
        {userRole === "admin" ? (
          <AnnouncementContent />
        ) : (
          <div className={styles.page}>
            <NavBar />
            <h1>Error: Invalid Permissions</h1>
          </div>
        )}
      </Suspense>
    </AuthContextWrapper>
  );
}
