import React, { useEffect, useState } from "react";

import { UserProfile as UserProfileType, getUserProfile } from "../api/profileApi";

import styles from "./DocumentProfileView.module.css";
import { ProfileHeader } from "./ProfileHeader";
import ProfileInterests from "./ProfileInterests";
import { UserList } from "./UserList";
import { VeteranFilesTable } from "./VeteranFilesTable";

type DocumentProfileViewProps = {
  userId: string;
};

export function DocumentProfileView({ userId }: DocumentProfileViewProps) {
  const [userProfile, setUserProfile] = useState<UserProfileType>();
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const res = await getUserProfile(userId);
      if (res.success) {
        return res.data;
      }
    };
    fetchUserProfile()
      .then((res) => {
        if (res) {
          setUserProfile(res);
        }
      })
      .catch((err: unknown) => {
        console.error(err);
        setError("Failed to load profile");
      });
  }, [userId]);

  if (error) {
    return <div>There was an error</div>;
  }

  return (
    <div className={styles.profileView}>
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
          editable={false}
          minimized={true}
        />
        <ProfileInterests interests={userProfile?.roleSpecificInfo?.interests} />
      </div>
      <VeteranFilesTable veteranId={userId} refresh={false} />
    </div>
  );
}
