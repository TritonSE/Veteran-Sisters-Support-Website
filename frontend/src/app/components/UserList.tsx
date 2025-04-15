import Image from "next/image";
import { useEffect, useState } from "react";

import { getAssignedUsers, removeVolunteerFromVeteran } from "../api/activeVolunteers";
import { Role, UserProfile as UserProfileType } from "../api/profileApi";

import { Program } from "./Program";
import styles from "./UserList.module.css";
import UserAssigningDialog from "./userAssigningDialog";

export function UserList(params: {
  userProfile: UserProfileType | undefined;
  title: string;
  editable: boolean;
  minimized: boolean;
}) {
  const { title, userProfile, editable, minimized } = params;
  const userPrograms = Object.fromEntries(
    userProfile?.assignedPrograms?.map((program) => [program, []]) ?? [],
  ) as Record<string, UserProfileType[]>;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogProgram, setDialogProgram] = useState("");
  const [currentUsers, setCurrentUsers] = useState<Record<string, UserProfileType[]>>(userPrograms);

  const openDialog = (program: string) => {
    setIsDialogOpen(true);
    setDialogProgram(program);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    window.location.reload();
  };

  const removeVolunteer = (selectedEmail: string, program: string) => {
    if (userProfile) {
      const vetEmail = userProfile.role === Role.VETERAN ? userProfile.email : selectedEmail;
      const volEmail = userProfile.role === Role.VETERAN ? selectedEmail : userProfile.email;

      removeVolunteerFromVeteran(volEmail, vetEmail, program)
        .then(() => {
          window.location.reload();
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

      setCurrentUsers((prevUsers) => {
        const updatedUsers = { ...prevUsers };

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
  }, []);

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
        />
      )}
      <div className={styles.userListHeader}>
        <div className={styles.userListHeading}>{title}</div>
      </div>
      <div className={styles.userListContent}>
        {sortedUserGroups.map(([program, users]) => {
          return (
            <div key={program} className={styles.programSection}>
              <div className={styles.programSectionHeader}>
                <div className={styles.programSectionHeaderSectionInfo}>
                  <Program program={program} />
                </div>
                {editable && (
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
        })}
      </div>
    </div>
  );
}
