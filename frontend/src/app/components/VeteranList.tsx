import { useEffect, useState } from "react";

import { User, getVeteransByVolunteer } from "../api/users";

import styles from "./VeteranList.module.css";
import { VeteranProfileCard } from "./VeteranProfileCard";

type VeteranListProp = {
  volunteerId: string;
};

export function VeteranList({ volunteerId }: VeteranListProp) {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    getVeteransByVolunteer(volunteerId)
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
              assignedVeterans: user.assignedVeterans,
              assignedVolunteers: user.assignedVolunteers,
            }}
          />
        ))}
      </div>
    </div>
  );
}
