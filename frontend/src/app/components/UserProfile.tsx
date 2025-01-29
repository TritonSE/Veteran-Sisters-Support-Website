"use client"; // TODO: why is this required?
import {
  UserProfile as UserProfileType,
  getUserProfile,
  Role as RoleEnum,
  AssignedProgram as AssignedProgramEnum,
  Role,
} from "../api/profileApi";
import { useEffect, useState } from "react";
import ProfileHeader from "@/app/components/ProfileHeader";
import styles from "./UserProfile.module.css";
import { Program } from "./Program";

export default function UserProfile({ userId }: { userId: string }) {
  const [viewingRole, setViewingRole] = useState(RoleEnum.STAFF as string);
  const [veiwerRole, setViewerRole] = useState(RoleEnum.ADMIN as string);
  const [userProfile, setUserProfile] = useState(getUserProfile(viewingRole));

  useEffect(() => {
    setUserProfile(getUserProfile(viewingRole));
  }, [viewingRole]);

  return (
    <div className={styles.userProfile}>
      <div className={styles.viewerViewingSelector}>
        <label htmlFor="viewerRole">Viewer Role</label>
        <select
          id="viewerRole"
          value={viewingRole}
          onChange={(event) => setViewerRole(event.target.value)}
        >
          <option value={RoleEnum.ADMIN}>Admin</option>
        </select>
        <label htmlFor="roleViewing">Role Viewing</label>
        <select
          id="roleViewing"
          value={viewingRole}
          onChange={(event) => setViewingRole(event.target.value)}
        >
          <option value={RoleEnum.STAFF}>Staff</option>
          <option value={RoleEnum.VOLUNTEER}>Volunteer</option>
        </select>
      </div>
      {viewingRole === veiwerRole && (
        <div className={styles.profileHeading}>Profile Information</div>
      )}
      <div className={styles.userProfileContent}>
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
        <UserList users={userProfile.assignedUsers || []} title="Veterans Under Point of Contact" />
      </div>
    </div>
  );
}

function UserList(params: { users: UserProfileType[]; title: string }) {
  const { title, users } = params;

  function programToClassName(program: string) {
    switch (program) {
      case AssignedProgramEnum.BATTLE_BUDDIES:
        return "battleBuddies";
      case AssignedProgramEnum.ADVOCACY:
        return "advocacy";
      case AssignedProgramEnum.OPERATION_WELLNESS:
        return "operationalWellness";
      default:
        return "";
    }
  }

  const groupedUserItems = users.reduce(
    (accumulator: { [key: string]: UserProfileType[] }, user: UserProfileType) => {
      user.assignedPrograms.forEach((program) => {
        if (!(program in accumulator)) {
          accumulator[program] = [];
        }
        accumulator[program].push(user);
      });
      return accumulator;
    },
    {},
  );

  const sortedUserGroups: [string, UserProfileType[]][] = Object.entries(groupedUserItems).map(
    ([program, users]) => [program, users],
  );
  sortedUserGroups.sort();

  return (
    <div className={styles.userList}>
      <div className={styles.userListHeading}>{title}</div>
      <div className={styles.userListContent}>
        {sortedUserGroups.map(([program, users]) => {
          return (
            <div className={styles.programSection}>
              <div className={styles.programSectionHeader}>
                <Program program={program} />
                <div className={`${styles.userCountBall} ${styles[programToClassName(program)]}`}>
                  {users.length}
                </div>
              </div>
              {users.map((user) => {
                const fullName = `${user.firstName} ${user.lastName}`;
                return (
                  <div className={styles.userInfo}>
                    <div className={styles.fullName}>{fullName}</div>
                    <div className={styles.email}>{user.email}</div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
