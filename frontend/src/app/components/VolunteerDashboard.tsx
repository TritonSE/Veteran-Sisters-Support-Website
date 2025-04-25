import { useEffect, useState } from "react";

import { UserProfile } from "../api/profileApi";
import { getUser } from "../api/userApi";
import { VeteranList } from "../components/VeteranList";

import styles from "./VolunteerDashboard.module.css";

type VolunteerDashboardProp = {
  volunteerId: string;
};

export function VolunteerDashboard({ volunteerId }: VolunteerDashboardProp) {
  const [user, setUser] = useState<UserProfile>();

  useEffect(() => {
    getUser(volunteerId)
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
          {user && <VeteranList volunteer={user} />}
        </div>
      </div>
    </div>
  );
}
