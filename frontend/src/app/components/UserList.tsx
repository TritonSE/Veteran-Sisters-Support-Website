import Image from "next/image";
import { useEffect, useState } from "react";

import { getAssignedUsers, removeVolunteerFromVeteran } from "../api/activeVolunteers";
import { Role, UserProfile as UserProfileType } from "../api/profileApi";

import { Program } from "./Program";
import styles from "./UserList.module.css";
import UserAssigningDialog, { DialogContext } from "./userAssigningDialog";

export function UserList(params: {
  userProfile: UserProfileType | undefined;
  title: string;
  editable: boolean;
  minimized: boolean;
  setMessage?: (message: string) => void;
  callback?: (openProgramChange: boolean) => void;
}) {
  const { title, userProfile, callback, editable, minimized } = params;
  const userPrograms = Object.fromEntries(
    userProfile?.assignedPrograms?.map((program) => [program, []]) ?? [],
  ) as Record<string, UserProfileType[]>;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [dialogProgram, setDialogProgram] = useState<string[]>([]);
  const [currentUsers, setCurrentUsers] = useState<Record<string, UserProfileType[]>>(userPrograms);

  const openDialog = (program: string) => {
    setIsDialogOpen(true);
    setDialogProgram([program]);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setRefreshFlag((prev) => !prev);
  };

  const removeVolunteer = (selectedEmail: string, program: string) => {
    if (userProfile) {
      const vetEmail = userProfile.role === Role.VETERAN ? userProfile.email : selectedEmail;
      const volEmail = userProfile.role === Role.VETERAN ? selectedEmail : userProfile.email;

      removeVolunteerFromVeteran(volEmail, vetEmail, program)
        .then(() => {
          setRefreshFlag((prev) => !prev);
        })
        .catch((err: unknown) => {
          console.error(err);
        });
    }
  };

  const fetchUserProfiles = async (user: UserProfileType) => {
    try {
      const res = await getAssignedUsers(user);
      if (!res.success || !Array.isArray(res.data)) {
        throw new Error("Failed to fetch volunteers");
      }

      const users: [string, UserProfileType][] = res.data.map((profile) => {
        const activeUser =
          userProfile?.role === Role.VETERAN ? profile.volunteerUser : profile.veteranUser;
        return [profile.assignedProgram, activeUser];
      });

      setCurrentUsers(() => {
        const updatedUsers = Object.fromEntries(
          (userProfile?.assignedPrograms ?? []).map((program) => [program, []]),
        ) as Record<string, UserProfileType[]>;
        for (const [key, userObj] of users) {
          if (!updatedUsers[key].some((vol) => vol.email === userObj.email)) {
            updatedUsers[key].push(userObj);
          }
        }
        return updatedUsers;
      });
    } catch (error) {
      console.error("Error fetching volunteer profiles:", error);
      throw new Error("Failed to fetch volunteers");
    }
  };

  useEffect(() => {
    const fetchProfiles = async () => {
      if (userProfile?.email) {
        await fetchUserProfiles(userProfile);
      }
    };
    void fetchProfiles();
  }, [refreshFlag]);

  const sortedUserGroups: [string, UserProfileType[]][] = Object.entries(currentUsers)
    .slice()
    .sort();

  return (
    <div className={`${styles.userList} ${minimized ? styles.minimized : ""}`}>
      {isDialogOpen && userProfile && (
        <UserAssigningDialog
          isOpen={isDialogOpen}
          program={dialogProgram}
          user={userProfile}
          closeDialog={closeDialog}
          setMessage={params.setMessage ? params.setMessage : () => undefined}
          context={DialogContext.USER_PROFILE}
        />
      )}
      <div className={styles.userListHeader}>
        <div className={styles.userListHeading}>{title}</div>
      </div>
      <div className={styles.userListContent}>
        {userProfile?.assignedPrograms && userProfile.assignedPrograms.length > 0 ? (
          sortedUserGroups.map(([program, users]: [string, UserProfileType[]]) => {
            return (
              <div key={program} className={styles.programSection}>
                <div className={styles.programSectionHeader}>
                  <div className={styles.programSectionHeaderSectionInfo}>
                    <Program program={program} />
                  </div>
                  {editable && (
                    <div className={styles.addUser}>
                      <Image
                        src="/add_icon.svg"
                        width={14}
                        height={14}
                        alt="Assign User"
                        onClick={() => {
                          openDialog(program);
                        }}
                      ></Image>
                    </div>
                  )}
                </div>
                {users.length > 0 ? (
                  users.map((user: UserProfileType, ind: number) => {
                    const fullName = `${user.firstName} ${user.lastName}`;
                    return (
                      <div key={ind} className={styles.userInfo}>
                        <div>
                          <div className={styles.fullName}>{fullName}</div>
                          <div className={styles.email}>{user.email}</div>
                        </div>
                        {editable && (
                          <Image
                            src="/trash_icon_3.svg"
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
          })
        ) : (
          <div className={styles.programUnassignedWrapper}>
            <div className={styles.progUnassignedHeader}>No assigments yet</div>
            <div className={styles.progUnassignedText}>Assign member a program to begin</div>
            <button
              className={styles.progUnassignedButton}
              onClick={() => {
                callback?.(true);
              }}
            >
              Assign a program
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
