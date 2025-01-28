"use client"; // TODO: why is this required?
import { getUserProfile, Role } from "../api/profileApi";
import { useEffect, useState } from "react";
import ProfileHeader from "@/app/components/ProfileHeader";
import styles from "./UserProfile.module.css";

export default function UserProfile({ userId }: { userId: string }) {
  const [viewingRole, setViewingRole] = useState(Role.STAFF as string);
  const [veiwerRole, setViewerRole] = useState(Role.STAFF as string);
  const [userProfile, setUserProfile] = useState(getUserProfile(viewingRole));

  useEffect(() => {
    setUserProfile(getUserProfile(viewingRole));
  }, [viewingRole]);

  return (
    <div className={styles.userProfile}>
      <div className={styles.viewerViewingSelector}>
        <label htmlFor="roleViewing">Role Viewing</label>
        <select
          id="roleViewing"
          value={viewingRole}
          onChange={(event) => setViewingRole(event.target.value)}
        >
          <option value={Role.STAFF}>Staff</option>
          <option value={Role.VOLUNTEER}>Volunteer</option>
        </select>
        <label htmlFor="roleViewing">Viewer Role</label>
        <select
          id="roleViewing"
          value={viewingRole}
          onChange={(event) => setViewerRole(event.target.value)}
        >
          <option value={Role.ADMIN}>Admin</option>
        </select>
      </div>
      <div className={styles.profileHeading}>Profile Information</div>
      <ProfileHeader
        firstName={userProfile.firstName}
        lastName={userProfile.lastName}
        role={userProfile.role}
        assignedPrograms={userProfile.assignedPrograms}
        yearJoined={userProfile.yearJoined}
        age={userProfile.age}
        phoneNumber={userProfile.phoneNumber}
        gender={userProfile.gender}
        email={userProfile.email}
      />
    </div>
  );
}
