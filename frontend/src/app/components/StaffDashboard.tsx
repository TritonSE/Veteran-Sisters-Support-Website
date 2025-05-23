import { useEffect, useState } from "react";

import { UserProfile } from "../api/profileApi";
import { getUser } from "../api/userApi";
import { AdminStaffUserTable } from "../components/AdminStaffUserTable";

import styles from "./StaffDashboard.module.css";

type StaffDashboardProp = {
  staffId: string;
};

export function StaffDashboard({ staffId }: StaffDashboardProp) {
  const [user, setUser] = useState<UserProfile>();

  useEffect(() => {
    getUser(staffId)
      .then((response) => {
        if (response.success) {
          setUser(response.data);
        }
      })
      .catch((error: unknown) => {
        console.error(error);
      });
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.page}>
        <div className={styles.frame}>
          <div className={styles.welcome}>
            <span>Welcome, {user?.firstName}!</span>
          </div>
          <AdminStaffUserTable />
        </div>
      </div>
    </div>
  );
}
