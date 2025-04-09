"use client";

import { Button } from "../../components/Button";
import { NavBar } from "../../components/NavBar";

import styles from "./page.module.css";

export default function Page() {
  return (
    <div className={styles.container}>
      <NavBar />
      <div className={styles.page}>
        <div className={styles.frame}>
          <div className={styles.header}>
            <span style={{ height: "38px" }}>Announcements 📢 </span>
            <div className={styles.subheader}>
              <span>
                Share important updates, news, and information with all community members here.
                Messages posted in this section will be visible to everyone.
              </span>
            </div>
          </div>
          <form className={styles.form}>
            <div className={styles.label}>
              <span>Title</span>
              <input
                className={styles.inputTitle}
                required
                placeholder="Name your announcement"
              ></input>
            </div>
            <div className={styles.label}>
              <span>Details</span>
              <textarea
                className={styles.inputDetails}
                required
                placeholder="Describe the announcement"
              ></textarea>
            </div>
          </form>
          <div className={styles.buttons}>
            <Button label="Cancel" className={styles.cancel} />{" "}
            <Button label="Send" filled={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
