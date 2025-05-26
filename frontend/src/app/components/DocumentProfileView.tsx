import React, { useEffect, useState } from "react";

import {
  Role as RoleEnum,
  UserProfile as UserProfileType,
  getUserProfile,
} from "../api/profileApi";
import { useAuth } from "../contexts/AuthContext";

import styles from "./DocumentProfileView.module.css";
import NavigateBack from "./NavigateBack";
import { ProfileHeader } from "./ProfileHeader";
import ProfileInterests from "./ProfileInterests";
import { UserList } from "./UserList";
import { VeteranFilesTable } from "./VeteranFilesTable";

type DocumentProfileViewProps = {
  profileId: string;
};

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

export function DocumentProfileView({ profileId }: DocumentProfileViewProps) {
  const { userId, userRole } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfileType | undefined>(undefined);
  const [profileRenderingContext, setProfileRenderingContext] = useState(
    getProfileRenderingContext(null, null, userRole, userId),
  );
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!profileId) {
          console.error("No profileUserId provided");
          setError("No user ID provided");
          setLoading(false);
          return;
        }

        const res = await getUserProfile(profileId);
        if (res.success) {
          console.log("Response data: ", res.data);
          setUserProfile(res.data);
          setProfileRenderingContext(
            getProfileRenderingContext(res.data.role, profileId, userRole, userId),
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
  }, [profileId, userId, userRole]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>There was an error</div>;
  }

  return (
    <div className={styles.profileView}>
      <NavigateBack />
      <div className={styles.leftDiv}>
        <ProfileHeader
          userProfile={userProfile}
          showDocuments={false}
          minimized={true}
          isPersonalProfile={false}
          isProgramAndRoleEditable={false}
        />
        <UserList
          userProfile={userProfile}
          title="Assigned Volunteers"
          isProgramAndRoleEditable={profileRenderingContext.isProgramAndRoleEditable}
          editable={false}
        />
        <ProfileInterests minimized={true} interests={userProfile?.roleSpecificInfo?.interests} />
      </div>
      <div className={styles.mainDiv}>
        <VeteranFilesTable veteranId={userId} refresh={false} />
      </div>
    </div>
  );
}
