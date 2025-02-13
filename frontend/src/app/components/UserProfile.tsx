"use client";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  AssignedProgram as AssignedProgramEnum,
  ProfileComment,
  ProfileCommentPostRequest,
  Role as RoleEnum,
  UserProfile as UserProfileType,
  exampleUsers,
  getComments,
  getUserProfile,
  postComment,
} from "../api/profileApi";

// import { Program } from "./Program";

import NavigateBack from "./NavigateBack";
import styles from "./UserProfile.module.css";

import { Program } from "@/app/components//Program";
import { Button } from "@/app/components/Button";
import { Role } from "@/app/components/Role";

interface ProfileRenderingContext {
  invalidContext: boolean;
  showVolunteerNotes: boolean;
  showUserList: boolean;
  userListTitle: string;
  userListEditable: boolean;
  viewingPersonalProfile: boolean;
  isProgramAndRoleEditable: boolean;
}

function getProfileRenderingContext(
  viewerRole: string,
  viewingRole: string,
): ProfileRenderingContext {
  const context: ProfileRenderingContext = {
    invalidContext: false,
    showVolunteerNotes: false,
    showUserList: false,
    userListTitle: "",
    userListEditable: false,
    viewingPersonalProfile: false,
    isProgramAndRoleEditable: false,
  };
  const { ADMIN, STAFF, VOLUNTEER, VETERAN } = RoleEnum;
  // veteran personal profile view
  if (viewerRole === VETERAN && viewingRole === VETERAN) {
    context.showUserList = true;
    context.userListTitle = "Assigned Volunteers";
    context.viewingPersonalProfile = true;
    return context;
  }
  // volunteer personal profile view
  else if (viewerRole === VOLUNTEER && viewingRole === VOLUNTEER) {
    context.showUserList = true;
    context.userListTitle = "Assigned Veterans";
    context.viewingPersonalProfile = true;
    return context;
  }
  // staff personal profile view
  else if (viewerRole === STAFF && viewingRole === STAFF) {
    context.showUserList = true;
    context.userListTitle = "Veterans Under Point of Contact";
    context.viewingPersonalProfile = true;
    return context;
  }
  // admin personal profile view
  else if (viewerRole === ADMIN && viewingRole === ADMIN) {
    context.viewingPersonalProfile = true;
    return context;
  }
  // admin views staff
  else if (viewerRole === ADMIN && viewingRole === STAFF) {
    context.showUserList = true;
    context.userListTitle = "Veterans Under Point of Contact";
    context.isProgramAndRoleEditable = true;
    return context;
  }
  // admin/staff view volunteer
  else if ((viewerRole === ADMIN || viewerRole === STAFF) && viewingRole === VOLUNTEER) {
    context.showUserList = true;
    context.userListEditable = true;
    context.userListTitle = "Assigned Veterans";
    context.isProgramAndRoleEditable = true;
    return context;
  }
  // admin/staff view veteran
  else if ((viewerRole === ADMIN || viewerRole === STAFF) && viewingRole === VETERAN) {
    context.showUserList = true;
    context.userListEditable = true;
    context.userListTitle = "Assigned Volunteers";
    context.isProgramAndRoleEditable = true;
    context.showVolunteerNotes = true;
    return context;
  }
  // volunteer view veteran
  else if (viewerRole === VOLUNTEER && viewingRole === VETERAN) {
    context.showUserList = true;
    context.userListTitle = "Assigned Volunteers";
    context.showVolunteerNotes = true;
    return context;
  }
  // veteran view volunteer
  else if (viewerRole === VETERAN && viewingRole === VOLUNTEER) {
    return context;
  }
  context.invalidContext = true;
  return context;
}

function VolunteerNotes({ userId }: { userId: string }) {
  const [profileNotes, setProfileNotes] = useState<ProfileComment[] | undefined>([]);
  const [currentComment, setCurrentComment] = useState<string>("");
  // use this to trigger a re-fetch of the notes when new note posted
  const [profileNotesChanged, setProfileNotesChanged] = useState<boolean>(false);

  useEffect(() => {
    const fetchProfileNotes = async () => {
      const res = await getComments(userId);
      if (res.success) {
        return res.data;
      }
    };
    fetchProfileNotes()
      .then((res) => {
        setProfileNotes(res);
      })
      .catch((err: unknown) => {
        console.error(err);
      });
  }, [profileNotesChanged]);

  const postProfileNote = async (comment: ProfileCommentPostRequest) => {
    const res = await postComment(comment);
    if (res.success) {
      setProfileNotesChanged(!profileNotesChanged);
    }
  };
  return (
    <div className={styles.volunteerNotes}>
      <div className={styles.noteHeader}>Notes from Volunteers</div>
      <div className={styles.noteSection}>
        <div className={styles.postNoteSection}>
          <input
            className={styles.postNoteInputField}
            placeholder="Add a comment..."
            value={currentComment}
            onChange={(event) => {
              setCurrentComment(event.target.value);
            }}
          ></input>
          <button
            onClick={(event) => {
              event.preventDefault();
              const comment = {
                profileId: userId,
                commenterId: "67a4255fc7beaa03529393dc",
                comment: currentComment,
                datePosted: new Date(),
              };
              postProfileNote(comment)
                .then(() => {
                  console.log("Comment posted");
                })
                .catch((err: unknown) => {
                  console.error(err);
                });
            }}
            className={styles.postNoteButton}
          >
            Post
          </button>
        </div>
        <div className={styles.postedNotes}>
          {profileNotes && profileNotes.length > 0 ? (
            profileNotes.map((comment, ind) => {
              return (
                <div key={ind} className={styles.postedNote}>
                  <ProfilePicture firstName={comment.user} size="small" />
                  <div className={styles.noteContent}>
                    <div className={styles.noteHeader}>
                      <div className={styles.noteAuthor}>{comment.user}</div>
                      <div className={styles.notePostedDate}>
                        {Math.floor(
                          (new Date().getTime() - new Date(comment.datePosted).getTime()) /
                            (1000 * 60 * 60 * 24),
                        )}{" "}
                        days ago
                      </div>
                    </div>
                    <div className={styles.noteBody}>{comment.comment}</div>
                  </div>
                </div>
              );
            })
          ) : (
            <div>No notes</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function UserProfile({ userId }: { userId: string }) {
  const defaultViewingRole = RoleEnum.VETERAN as string;
  const defaultViewerRole = RoleEnum.ADMIN as string;

  const [viewingRole, setViewingRole] = useState(defaultViewingRole);
  const [veiwerRole, setViewerRole] = useState(defaultViewerRole);
  const [userProfile, setUserProfile] = useState<UserProfileType | undefined>(undefined);
  const [profileRenderingContext, setProfileRenderingContext] = useState(
    getProfileRenderingContext(defaultViewerRole, defaultViewingRole),
  );

  useEffect(() => {
    const fetchUserProfile = async () => {
      const res = await getUserProfile(userId);
      if (res.success) {
        return res.data;
      }
    };
    fetchUserProfile()
      .then((res) => {
        setUserProfile(res);
      })
      .catch((err: unknown) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    setProfileRenderingContext(getProfileRenderingContext(veiwerRole, viewingRole));
  }, [viewingRole, veiwerRole]);

  // Users for user list
  const emptyUserGroups: { [key: string]: UserProfileType[] } = (
    userProfile?.assignedPrograms ?? []
  ).reduce((accumulator: { [key: string]: UserProfileType[] }, program: string) => {
    accumulator[program] = [];
    return accumulator;
  }, {});

  const assignedUsers = exampleUsers || [];
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

  return (
    <>
      <div className={styles.viewerViewingSelector}>
        <label htmlFor="viewerRole">Viewer Role</label>
        <select
          id="viewerRole"
          value={viewingRole}
          onChange={(event) => {
            setViewerRole(event.target.value);
          }}
        >
          <option value={RoleEnum.ADMIN}>Admin</option>
          <option value={RoleEnum.STAFF}>Staff</option>
          <option value={RoleEnum.VOLUNTEER}>Volunteer</option>
          <option value={RoleEnum.VETERAN}>Veteran</option>
        </select>
        <label htmlFor="roleViewing">Role Viewing</label>
        <select
          id="roleViewing"
          value={viewingRole}
          onChange={(event) => {
            setViewingRole(event.target.value);
          }}
        >
          <option value={RoleEnum.ADMIN}>Admin</option>
          <option value={RoleEnum.STAFF}>Staff</option>
          <option value={RoleEnum.VOLUNTEER}>Volunteer</option>
          <option value={RoleEnum.VETERAN}>Veteran</option>
        </select>
      </div>
      {profileRenderingContext.invalidContext ? (
        <h1>Error: Invalid Profile Rendering Context</h1>
      ) : (
        <div className={styles.userProfile}>
          {profileRenderingContext.viewingPersonalProfile ? (
            <div className={styles.profileHeading}>Profile Information</div>
          ) : (
            <NavigateBack />
          )}
          <div className={styles.userProfileContent}>
            <ProfileHeader
              firstName={userProfile?.firstName}
              lastName={userProfile?.lastName}
              role={userProfile?.role}
              assignedPrograms={userProfile?.assignedPrograms}
              yearJoined={userProfile?.yearJoined}
              age={userProfile?.age}
              phoneNumber={userProfile?.phoneNumber}
              gender={userProfile?.gender}
              email={userProfile?.email}
              isPersonalProfile={profileRenderingContext.viewingPersonalProfile}
              isProgramAndRoleEditable={profileRenderingContext.isProgramAndRoleEditable}
            />
            <div className={styles.userProfileInnerContent}>
              {profileRenderingContext.showVolunteerNotes && <VolunteerNotes userId={userId} />}
              {profileRenderingContext.showUserList && (
                <UserList
                  userGroups={sortedUserGroups}
                  title={profileRenderingContext.userListTitle}
                  editable={profileRenderingContext.userListEditable}
                  minimized={profileRenderingContext.showVolunteerNotes}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ProfilePicture(params: { firstName?: string; size?: string }) {
  const { firstName, size } = params;
  const sizeClass = size === "small" ? "small" : "large";

  const firstLetter = firstName && firstName.length > 0 ? firstName[0] : "?";
  return <div className={`${styles.profilePicture} ${styles[sizeClass]}`}>{firstLetter}</div>;
}

function Divider() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M9.75 1C9.94891 1 10.1397 1.07902 10.2803 1.21967C10.421 1.36032 10.5 1.55109 10.5 1.75V18.25C10.5 18.4489 10.421 18.6397 10.2803 18.7803C10.1397 18.921 9.94891 19 9.75 19C9.55109 19 9.36032 18.921 9.21967 18.7803C9.07902 18.6397 9 18.4489 9 18.25V1.75C9 1.55109 9.07902 1.36032 9.21967 1.21967C9.36032 1.07902 9.55109 1 9.75 1Z"
        fill="#60696F"
      />
    </svg>
  );
}

function ProfileHeader(params: {
  firstName: string | undefined;
  lastName: string | undefined;
  role: RoleEnum | undefined;
  assignedPrograms: AssignedProgramEnum[] | undefined;
  yearJoined?: number | undefined;
  age?: number | undefined;
  phoneNumber?: string | undefined;
  gender?: string | undefined;
  email: string | undefined;
  isProgramAndRoleEditable: boolean;
  isPersonalProfile: boolean;
}) {
  const {
    firstName,
    lastName,
    role,
    assignedPrograms,
    yearJoined,
    age,
    phoneNumber,
    gender,
    email,
    isProgramAndRoleEditable,
    isPersonalProfile,
  } = params;
  const fullName = `${firstName ?? "Unknown"} ${lastName ?? "Unkown"}`;
  const joinedText = `Joined: ${yearJoined ?? 0}`;
  const ageText = `Age: ${age ?? 0}`;
  const genderText = `Gender: ${gender ?? "Unknown"}`;
  assignedPrograms?.sort();
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div className={styles.profileHeader}>
      <div className={styles.profileContent}>
        <ProfilePicture firstName={firstName} />
        <div className={styles.userInfo}>
          <div className={styles.userInfoHeader}>
            <div className={styles.userFullName}>{fullName}</div>
            <Role role={role} />
            {assignedPrograms?.map((program) => <Program program={program} key={program} />)}
          </div>
          <div className={styles.userMetadata}>
            <div className={styles.metadataSubsection}>
              <div>{joinedText}</div>
              <Divider />
              <div>{ageText}</div>
              <Divider />
              <div>{genderText}</div>
            </div>

            <div className={styles.metadataSubsection}>
              <div className={styles.smallMetadata}>{email}</div>
              <Divider />
              <div className={styles.smallMetadata}>{phoneNumber}</div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.profileContentControls}>
        {isPersonalProfile ? (
          <Button
            text="Edit profile"
            onClick={() => {
              router.push(`${pathname}/edit`);
            }}
          />
        ) : isProgramAndRoleEditable ? (
          <>
            <Button text={"Edit Program"} /> <Button text={"Change Role"} />
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

function UserList(params: {
  userGroups: [string, UserProfileType[]][];
  title: string;
  editable: boolean;
  minimized: boolean;
}) {
  const { title, userGroups, editable, minimized } = params;

  const minimizedClassName = minimized ? styles.minimized : "";

  return (
    <div className={`${styles.userList} ${minimizedClassName}`}>
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
        {userGroups.map(([program, users]) => {
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
