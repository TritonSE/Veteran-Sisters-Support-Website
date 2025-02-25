"use client";
import { useEffect, useState } from "react";

import {
  Role as RoleEnum,
  UserProfile as UserProfileType,
  getUserProfile,
} from "../api/profileApi";

import NavigateBack from "./NavigateBack";
import styles from "./UserProfile.module.css";

import { ProfileHeader } from "@/app/components/ProfileHeader";
import { VolunteerNotes } from "@/app/components/VolunteerNotes";
import { UserList } from "@/app/components/UserList";

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
  viewingRole: string | undefined | null,
  viewingId: string | undefined | null,
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
  const viewerId = localStorage.getItem("viewerId");
  const viewerRole = localStorage.getItem("viewerRole");

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

export default function UserProfile({ userId }: { userId: string }) {
  /**
   * NOTE: Because there is no authentication context at the moment,
   * this component uses the following localStorage values to determine
   * the logged in user's context:
   *
   * (1.) viewerId -> The id of the logged in user
   * (2.) viewerRole -> The role of the logged in user
   *
   * These values can be set via the Chrome Developer Inspector
   */

  const [userProfile, setUserProfile] = useState<UserProfileType | undefined>(undefined);
  const [profileRenderingContext, setProfileRenderingContext] = useState(
    getProfileRenderingContext(null, null),
  );
  const [loading, setLoading] = useState(true);

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
        setProfileRenderingContext(getProfileRenderingContext(res?.role, userId));
        setLoading(false);
      })
      .catch((err: unknown) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (!loading)
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
                    userProfile={userProfile}
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
