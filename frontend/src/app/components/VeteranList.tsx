import { useEffect, useState } from "react";

import { ActiveVolunteer, getAssignedUsers } from "../api/activeVolunteers";
import { UserProfile } from "../api/profileApi";

import styles from "./VeteranList.module.css";
import { VeteranProfileCard } from "./VeteranProfileCard";

type VeteranListProp = {
  volunteer: UserProfile;
};

export function VeteranList({ volunteer }: VeteranListProp) {
  const [users, setUsers] = useState<ActiveVolunteer[]>([]);

  useEffect(() => {
    getAssignedUsers(volunteer)
      .then((result) => {
        if (result.success) {
          setUsers(result.data);
        } else {
          console.error(result.error);
        }
      })
      .catch((reason: unknown) => {
        console.error(reason);
      });
  }, []);

  return (
    <div className={styles.container}>
      <span className={styles.title}>Your Veterans</span>

      <div className={styles.table}>
        {users.map((user) => (
          <VeteranProfileCard
            key={user.veteranUser._id}
            user={{
              _id: user.veteranUser._id,
              email: user.veteranUser.email,
              firstName: user.veteranUser.firstName,
              lastName: user.veteranUser.lastName,
              role: user.veteranUser.role,
              assignedPrograms: user.veteranUser.assignedPrograms,
              assignedUsers: user.veteranUser.assignedUsers,
            }}
          />
        ))}
      </div>
    </div>
  );
}
