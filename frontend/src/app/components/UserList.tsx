import Image from "next/image";
import { useState } from "react";

import { removeVolunteerFromVeteran } from "../api/activeVolunteers";
import { UserProfile as UserProfileType } from "../api/profileApi";

import { Program } from "./Program";
import styles from "./UserList.module.css";
import VolunteerAssigningDialog from "./volunteerAssigningDialog";

export function UserList(params: {
  userProfile: UserProfileType | undefined;
  title: string;
  editable: boolean;
  minimized: boolean;
}) {
  const { title, userProfile, editable, minimized } = params;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogProgram, setDialogProgram] = useState("");

  const openDialog = (program: string) => {
    setIsDialogOpen(true);
    setDialogProgram(program);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const removeVolunteer = (volunteerEmail: string, program: string) => {
    if (userProfile) {
      removeVolunteerFromVeteran(volunteerEmail, userProfile.email, program)
        .then(() => {
          window.location.reload();
        })
        .catch((err: unknown) => {
          console.error(err);
        });
    }
  };

  // Users for user list
  const emptyUserGroups: Record<string, UserProfileType[]> = (
    userProfile?.assignedPrograms ?? []
  ).reduce((accumulator: Record<string, UserProfileType[]>, program: string) => {
    accumulator[program] = [];
    return accumulator;
  }, {});

  const assignedUsers = userProfile?.assignedUsers ?? [];
  const userGroups: Record<string, UserProfileType[]> = assignedUsers.reduce(
    (accumulator, user) => {
      (user?.assignedPrograms ?? []).forEach((program: string) => {
        if (program in accumulator) {
          accumulator[program].push(user);
        }
      });
      return accumulator;
    },
    emptyUserGroups,
  );

  const sortedUserGroups: [string, UserProfileType[]][] = Object.entries(userGroups).slice().sort();

  return (
    <div className={`${styles.userList} ${minimized ? styles.minimized : ""}`}>
      {isDialogOpen && userProfile && (
        <VolunteerAssigningDialog
          isOpen={isDialogOpen}
          program={dialogProgram}
          veteran={userProfile}
          closeDialog={closeDialog}
        />
      )}
      <div className={styles.userListHeader}>
        <div className={styles.userListHeading}>{title}</div>
        {editable && !minimized && (
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
        {sortedUserGroups.map(([program, users]) => {
          return (
            <div key={program} className={styles.programSection}>
              <div className={styles.programSectionHeader}>
                <div className={styles.programSectionHeaderSectionInfo}>
                  <Program program={program} />
                </div>
                {editable && minimized && (
                  <div className={styles.addUser}>
                    <Image
                      src="/pajamas_assignee_icon.svg"
                      width={16}
                      height={16}
                      alt="Assign User"
                      onClick={() => {
                        openDialog(program);
                      }}
                    ></Image>
                  </div>
                )}
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
                          className={styles.removeUser}
                          onClick={() => {
                            removeVolunteer(user.email, program);
                          }}
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
