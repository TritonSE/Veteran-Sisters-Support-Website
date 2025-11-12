import { useEffect, useState } from "react";

import { Role, UserProfile } from "../api/profileApi";
import { getUser } from "../api/userApi";
import { AdminStaffUserTable } from "../components/AdminStaffUserTable";

import styles from "./AdminDashboard.module.css";
import { UnreadActivities } from "./UnreadActivities";

type AdminDashboardProp = {
  adminId: string;
};

export function AdminDashboard({ adminId }: AdminDashboardProp) {
  const [user, setUser] = useState<UserProfile>();
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(true);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    getUser(adminId)
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
              userId={adminId}
              userRole={Role.ADMIN}
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

// return (
//     <div className={styles.container}>
//       <div className={styles.page}>
//         <div className={styles.frame}>
//           <div className={styles.welcome}>
//             <span>Welcome, {user?.firstName}!</span>
//             <UnreadActivities
//               userId={volunteerId}
//               userRole={Role.VOLUNTEER}
//               isOpen={dropdownOpen}
//               toggleDropdown={toggleDropdown}
//             />
//           </div>
//           {user && <VeteranList volunteer={user} />}
//         </div>
//       </div>
//     </div>
//   );
