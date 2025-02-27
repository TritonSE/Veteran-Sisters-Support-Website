import { useEffect, useState } from "react";

import { User, getVeteransByVolunteerEmail } from "../api/users";

import styles from "./VeteranList.module.css";
import { VeteranProfileCard } from "./VeteranProfileCard";

type VeteranListProp = {
  volunteerEmail: string;
};

export function VeteranList({ volunteerEmail }: VeteranListProp) {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    getVeteransByVolunteerEmail(volunteerEmail)
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
  });

  return (
    <div className={styles.container}>
      <span className={styles.title}>Your Veterans</span>

      <div className={styles.table}>
        {users.map((user) => (
          <VeteranProfileCard
            key={user._id}
            user={{
              _id: user._id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              role: user.role,
              assignedPrograms: user.assignedPrograms,
              assignedUsers: user.assignedUsers,
            }}
          />
        ))}
      </div>
    </div>
  );
}
