"use client";

import { NavBar } from "../components/NavBar";
import { useAuth } from "../../contexts/AuthContext";
import TextBox from "../components/TextBox";

import styles from "./page.module.css";
import { Button } from "../components/Button";

export default function ReportVeteran() {
  const { role } = useAuth();

  return (
    <>
      <NavBar />
      {
        <div className={styles.page}>
          <div className={styles.header}>
            <p className={styles.title}>Report</p>
            <p className={styles.subtitle}>
              {role === "volunteer"
                ? "If you are encountering a problem with your veteran, file a report below to the admins. The admin will get back to you as soon as possible."
                : "If you are encountering a problem with your volunteer, file a report below to the admins. The admin will get back to you as soon as possible."}
            </p>
          </div>
          <div className={styles.questionPanel}>
            <p className={styles.question}>
              {role === "volunteer"
                ? "Which veteran would you like to report?"
                : "Which volunteer would you like to report?"}
              <span className={styles.asterisk}> *</span>
            </p>
            <p className={styles.question}>
              What type of situation is this? <span className={styles.asterisk}> *</span>
            </p>
            <p className={styles.question}>
              Explain the situation<span className={styles.asterisk}> *</span>
            </p>
            <TextBox
              width="596px"
              height="134px"
              placeholder="Describe the situation in more detail"
              paddingLeft="18.23px"
              paddingTop="12.46px"
            />
            <div className={styles.buttonRow}>
              <Button label={"Cancel"}></Button>
              <Button label={"Submit"} filled={true}></Button>
            </div>
          </div>
        </div>
      }
    </>
  );
}
