"use client"; // TODO: why is this required?
import {
  UserProfile as UserProfileType,
  getUserProfile,
  Role as RoleEnum,
  AssignedProgram as AssignedProgramEnum,
} from "../api/profileApi";

import Image from "next/image";
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

  // Users for user list
  const emptyUserGroups: { [key: string]: UserProfileType[] } = userProfile.assignedPrograms.reduce(
    (accumulator: { [key: string]: UserProfileType[] }, program: string) => {
      accumulator[program] = [];
      return accumulator;
    },
    {},
  );

  const assignedUsers = userProfile.assignedUsers || [];
  const userGroups: { [key: string]: UserProfileType[] } = assignedUsers.reduce(
    (accumulator, user) => {
      user.assignedPrograms.forEach((program: string) => {
        if (program in accumulator) {
          accumulator[program].push(user);
        }
      });
      return accumulator;
    },
    emptyUserGroups,
  );

  const sortedUserGroups: [string, UserProfileType[]][] = Object.entries(userGroups).slice().sort();

  const userListTitle =
    viewingRole == RoleEnum.STAFF ? "Veterans Under Point of Contact" : "Assigned Veterans";

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
        <UserList userGroups={sortedUserGroups} title={userListTitle} editable={true} />
      </div>
    </div>
  );
}

function UserList(params: {
  userGroups: [string, UserProfileType[]][];
  title: string;
  editable: boolean;
}) {
  const { title, userGroups, editable } = params;

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

  return (
    <div className={styles.userList}>
      <div className={styles.userListHeader}>
        <div className={styles.userListHeading}>{title}</div>
        {editable && (
          <div className={styles.addUser}>
            <Image
              src="/pajamas_assignee_icon.svg"
              width={16}
              height={16}
              alt="Assign User"
            ></Image>
          </div>
        )}
      </div>
      <div className={styles.userListContent}>
        {userGroups.map(([program, users]) => {
          return (
            <div key={program} className={styles.programSection}>
              <div className={styles.programSectionHeader}>
                <Program program={program} />
                <div className={`${styles.userCountBall} ${styles[programToClassName(program)]}`}>
                  {users.length}
                </div>
              </div>
              {users.length > 0 ? (
                users.map((user, ind) => {
                  const fullName = `${user.firstName} ${user.lastName}`;
                  return (
                    <div key={ind} className={styles.userInfo}>
                      <div>
                        <div className={styles.fullName}>{fullName}</div>
                        <div className={styles.email}>{user.email}</div>
                      </div>
                      {editable && (
                        <Image
                          src="/trash_icon.svg"
                          width={20}
                          height={20}
                          alt="Remove User"
                        ></Image>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className={styles.unassigned}>Unassigned</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
