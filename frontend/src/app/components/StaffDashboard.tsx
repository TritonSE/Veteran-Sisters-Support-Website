import { useEffect, useState } from "react";

import { Role, UserProfile } from "../api/profileApi";
import { getUser } from "../api/userApi";
import { AdminStaffUserTable } from "../components/AdminStaffUserTable";

import styles from "./StaffDashboard.module.css";
import { UnreadActivities } from "./UnreadActivities";

type StaffDashboardProp = {
  staffId: string;
};

export function StaffDashboard({ staffId }: StaffDashboardProp) {
  const [user, setUser] = useState<UserProfile>();
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(true);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

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
            <UnreadActivities
              userId={staffId}
              userRole={Role.STAFF}
              isOpen={dropdownOpen}
              toggleDropdown={toggleDropdown}
            />
          </div>
          <AdminStaffUserTable />
        </div>
      </div>
    </div>
  );
}
