"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

import {
  Role as RoleEnum,
  UserProfile as UserProfileType,
  getUserProfile,
} from "../api/profileApi";
import { useAuth } from "../contexts/AuthContext";

import ChangeProgramDialog from "./ChangeProgramDialog";
import NavigateBack from "./NavigateBack";
import { ProfileHeader } from "./ProfileHeader";
import ProfileInterests from "./ProfileInterests";
import { UserList } from "./UserList";
import styles from "./UserProfile.module.css";
import { VolunteerNotes } from "./VolunteerNotes";

type ProfileRenderingContext = {
  invalidContext: boolean;
  showVolunteerNotes: boolean;
  showVeteranDocuments: boolean;
  showProfileInterests: boolean;
  showUserList: boolean;
  userListTitle: string;
  userListEditable: boolean;
  viewingPersonalProfile: boolean;
  isProgramAndRoleEditable: boolean;
  isProfileEditable: boolean;
};

function getProfileRenderingContext(
  viewingRole: string | undefined | null,
  viewingId: string | undefined | null,
  viewerRole: string | undefined | null,
  viewerId: string | undefined | null,
): ProfileRenderingContext {
  const context: ProfileRenderingContext = {
    invalidContext: false,
    showVolunteerNotes: false,
    showVeteranDocuments: false,
    showUserList: false,
    showProfileInterests: false,
    userListTitle: "",
    userListEditable: false,
    viewingPersonalProfile: false,
    isProgramAndRoleEditable: false,
    isProfileEditable: false,
  };

  const { ADMIN, STAFF, VOLUNTEER, VETERAN } = RoleEnum;
  const isPersonalView = viewerId === viewingId;

  // veteran personal profile view
  if (isPersonalView && viewerRole === VETERAN && viewingRole === VETERAN) {
    context.showUserList = true;
    context.userListTitle = "Assigned Volunteers";
    context.viewingPersonalProfile = true;
    context.showVeteranDocuments = true;
    context.isProfileEditable = true;
    return context;
  }
  // volunteer personal profile view
  else if (isPersonalView && viewerRole === VOLUNTEER && viewingRole === VOLUNTEER) {
    context.showUserList = true;
    context.userListTitle = "Assigned Veterans";
    context.viewingPersonalProfile = true;
    context.isProfileEditable = true;
    return context;
  }
  // staff personal profile view
  else if (isPersonalView && viewerRole === STAFF && viewingRole === STAFF) {
    context.showUserList = true;
    context.userListTitle = "Veterans Under Point of Contact";
    context.viewingPersonalProfile = true;
    context.isProfileEditable = true;
    return context;
  }
  // admin personal profile view
  else if (isPersonalView && viewerRole === ADMIN && viewingRole === ADMIN) {
    context.viewingPersonalProfile = true;
    context.isProfileEditable = true;
    return context;
  }
  // admin views staff - can edit their profile, role, and program
  else if (viewerRole === ADMIN && viewingRole === STAFF) {
    context.showUserList = true;
    context.userListTitle = "Veterans Under Point of Contact";
    context.isProgramAndRoleEditable = true;
    context.isProfileEditable = true;
    return context;
    // admin views volunteer - can edit their profile, role, and program
  } else if (viewerRole === ADMIN && viewingRole === VOLUNTEER) {
    context.showUserList = true;
    context.userListEditable = true;
    context.userListTitle = "Assigned Veterans";
    context.isProgramAndRoleEditable = true;
    context.isProfileEditable = true;
    return context;
  } else if (viewerRole === ADMIN && viewingRole === VETERAN) {
    context.showUserList = true;
    context.userListEditable = true;
    context.showProfileInterests = true;
    context.userListTitle = "Assigned Volunteers";
    context.isProgramAndRoleEditable = true;
    context.isProfileEditable = true;
    context.showVolunteerNotes = true;
    context.showVeteranDocuments = true;
    return context;
  }
  // staff view volunteer - can't edit program and role
  else if (viewerRole === STAFF && viewingRole === VOLUNTEER) {
    context.showUserList = true;
    context.showProfileInterests = true;
    context.userListEditable = true;
    context.userListTitle = "Assigned Veterans";
    context.isProfileEditable = true;
    context.isProgramAndRoleEditable = true;
    return context;
  }
  // staff view veteran - can't edit program and role
  else if (viewerRole === STAFF && viewingRole === VETERAN) {
    context.showUserList = true;
    context.userListEditable = true;
    context.userListTitle = "Assigned Volunteers";
    context.isProfileEditable = true;
    context.showVolunteerNotes = true;
    context.showVeteranDocuments = true;
    context.isProgramAndRoleEditable = true;
    return context;
  }
  // volunteer view veteran
  else if (viewerRole === VOLUNTEER && viewingRole === VETERAN) {
    context.showUserList = true;
    context.showProfileInterests = true;
    context.userListTitle = "Assigned Volunteers";
    context.showVolunteerNotes = true;
    context.showVeteranDocuments = true;
    return context;
  }
  // veteran view volunteer
  else if (viewerRole === VETERAN && viewingRole === VOLUNTEER) {
    return context;
  }
  context.invalidContext = true;
  return context;
}

export default function UserProfile({ profileUserId }: { profileUserId: string }) {
  const { userId, userRole } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfileType | undefined>(undefined);
  const [profileRenderingContext, setProfileRenderingContext] = useState(
    getProfileRenderingContext(null, null, userRole, userId),
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [openProgramChange, setOpenProgramChange] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!profileUserId) {
          console.error("No profileUserId provided");
          setError("No user ID provided");
          setLoading(false);
          return;
        }

        const res = await getUserProfile(profileUserId);
        if (res.success) {
          console.log("Response data: ", res.data);
          setUserProfile(res.data);
          setProfileRenderingContext(
            getProfileRenderingContext(res.data.role, profileUserId, userRole, userId),
          );
        } else {
          console.error("Failed to fetch profile:", res.error);
          setError(res.error || "Failed to fetch user profile");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(
          err instanceof Error ? err.message : "An error occurred while fetching the profile",
        );
      } finally {
        setLoading(false);
      }
    };

    void fetchUserProfile();
  }, [profileUserId, userId, userRole]);

  if (loading) {
    return (
      <div className={styles.userProfile}>
        <div className={styles.loading}>Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.userProfile}>
        <div className={styles.error}>Error: {error}</div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className={styles.userProfile}>
        <div className={styles.error}>Profile not found</div>
      </div>
    );
  }

  return (
    <>
      {profileRenderingContext?.invalidContext ? (
        <h1>Error: Invalid Profile Rendering Context</h1>
      ) : (
        <div className={styles.userProfile}>
          {profileRenderingContext?.viewingPersonalProfile ? (
            <div className={styles.profileHeading}>Profile Information</div>
          ) : (
            <NavigateBack />
          )}
          <div className={styles.userProfileContent}>
            <ProfileHeader
              userProfile={userProfile}
              minimized={false}
              showDocuments={profileRenderingContext.showVeteranDocuments}
              isPersonalProfile={profileRenderingContext.viewingPersonalProfile}
              isProgramAndRoleEditable={profileRenderingContext.isProgramAndRoleEditable}
            />
            <div className={styles.userProfileInnerContent}>
              <div className={styles.userProfileRow2}>
                {profileRenderingContext.showProfileInterests && (
                  <ProfileInterests
                    minimized={false}
                    interests={userProfile.roleSpecificInfo?.interests}
                  />
                )}
                {profileRenderingContext.showUserList && (
                  <UserList
                    userProfile={userProfile}
                    minimized={false}
                    title={profileRenderingContext.userListTitle}
                    callback={setOpenProgramChange}
                    isProgramAndRoleEditable={profileRenderingContext.isProgramAndRoleEditable}
                    editable={profileRenderingContext.userListEditable}
                    setMessage={setMessage}
                  />
                )}
              </div>
              {profileRenderingContext.showVolunteerNotes && (
                <VolunteerNotes profileUserId={profileUserId} />
              )}
            </div>
            {message && (
              <div
                className={`${styles.messageContainer} ${message.includes("Successfully") ? styles.messageSuccess : styles.messageError}`}
              >
                {message.includes("Successfully") ? (
                  <Image src="/check.svg" alt="Check Symbol" width={20} height={20}></Image>
                ) : (
                  <Image src="/error_symbol.svg" alt="Error Symbol" width={20} height={20}></Image>
                )}
                <p>{message}</p>
              </div>
            )}
          </div>
        </div>
      )}
      {openProgramChange && (
        <div
          className={styles.modalOverlay}
          onClick={() => {
            setOpenProgramChange(false);
          }}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <ChangeProgramDialog
              firstName={userProfile?.firstName}
              email={userProfile?.email}
              role={userProfile?.role}
              userPrograms={userProfile?.assignedPrograms ?? []}
              callback={setOpenProgramChange}
            />
          </div>
        </div>
      )}
    </>
  );
}
