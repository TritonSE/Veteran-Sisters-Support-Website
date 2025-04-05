"use client";
import { useEffect, useState } from "react";

import {
  Role as RoleEnum,
  UserProfile as UserProfileType,
  getUserProfile,
} from "../api/profileApi";

import NavigateBack from "./NavigateBack";
import { ProfileHeader } from "./ProfileHeader";
import { UserList } from "./UserList";
import styles from "./UserProfile.module.css";
import { VeteranDocuments } from "./VeteranProfileDocuments";
import { VolunteerNotes } from "./VolunteerNotes";

import { useAuth } from "@/app/contexts/AuthContext";

type ProfileRenderingContext = {
  invalidContext: boolean;
  showVolunteerNotes: boolean;
  showUserList: boolean;
  userListTitle: string;
  userListEditable: boolean;
  viewingPersonalProfile: boolean;
  isProgramAndRoleEditable: boolean;
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
    showUserList: false,
    userListTitle: "",
    userListEditable: false,
    viewingPersonalProfile: false,
    isProgramAndRoleEditable: false,
  };

  const { ADMIN, STAFF, VOLUNTEER, VETERAN } = RoleEnum;
  const isPersonalView = viewerId === viewingId;
  // veteran personal profile view
  if (isPersonalView && viewerRole === VETERAN && viewingRole === VETERAN) {
    context.showUserList = true;
    context.userListTitle = "Assigned Volunteers";
    context.viewingPersonalProfile = true;
    return context;
  }
  // volunteer personal profile view
  else if (isPersonalView && viewerRole === VOLUNTEER && viewingRole === VOLUNTEER) {
    context.showUserList = true;
    context.userListTitle = "Assigned Veterans";
    context.viewingPersonalProfile = true;
    return context;
  }
  // staff personal profile view
  else if (isPersonalView && viewerRole === STAFF && viewingRole === STAFF) {
    context.showUserList = true;
    context.userListTitle = "Veterans Under Point of Contact";
    context.viewingPersonalProfile = true;
    return context;
  }
  // admin personal profile view
  else if (isPersonalView && viewerRole === ADMIN && viewingRole === ADMIN) {
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

export default function UserProfile({ profileUserId }: { profileUserId: string }) {
  const { userId, userRole } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfileType | undefined>(undefined);
  const [profileRenderingContext, setProfileRenderingContext] = useState(
    getProfileRenderingContext(null, null, userId, userRole),
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
              firstName={userProfile.firstName}
              lastName={userProfile.lastName}
              role={userProfile.role}
              assignedPrograms={userProfile.assignedPrograms}
              yearJoined={userProfile.yearJoined}
              age={userProfile.age}
              phoneNumber={userProfile.phoneNumber}
              gender={userProfile.roleSpecificInfo?.serviceInfo?.gender}
              email={userProfile.email}
              isPersonalProfile={profileRenderingContext.viewingPersonalProfile}
              isProgramAndRoleEditable={profileRenderingContext.isProgramAndRoleEditable}
            />
            <div className={styles.userProfileInnerContent}>
              {profileRenderingContext.showVolunteerNotes && (
                <VolunteerNotes profileUserId={profileUserId} />
              )}
              {profileRenderingContext.showUserList && (
                <UserList
                  userProfile={userProfile}
                  title={profileRenderingContext.userListTitle}
                  editable={profileRenderingContext.userListEditable}
                  minimized={profileRenderingContext.showVolunteerNotes}
                />
              )}
            </div>
            {userProfile.role === RoleEnum.VETERAN && (
              <div style={{ width: "100%" }}>
                <VeteranDocuments uploader={profileUserId} />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
