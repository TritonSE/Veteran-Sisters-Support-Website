"use client";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Role as RoleEnum, UserProfile as UserProfileType } from "../api/profileApi";

import ProfileActions from "./EditProfileDialog";
import styles from "./ProfileHeader.module.css";
import { ProfilePicture } from "./ProfilePicture";
import { Program } from "./Program";
import { Role } from "./Role";

export function ProfileHeader(params: {
  userProfile?: UserProfileType;
  showDocuments: boolean;
  minimized: boolean;
  isProgramAndRoleEditable: boolean;
  isProfileEditable: boolean;
  programsChanged: (programChanged: boolean) => void;
  didProgramChange: boolean;
}) {
  const { userProfile, showDocuments, minimized, isProgramAndRoleEditable, isProfileEditable} =
    params;
  const branchOfService = userProfile?.roleSpecificInfo?.serviceInfo?.branchOfService;
  const militaryStatus = userProfile?.roleSpecificInfo?.serviceInfo?.currentMilitaryStatus;
  const fullName = `${userProfile?.firstName ?? "Unknown"} ${userProfile?.lastName ?? "Unknown"}`;
  const joinedText = userProfile?.yearJoined?.toString() ?? "Year Joined: Unknown";
  const ageText = `Age: ${userProfile?.age?.toString() ?? " Age: Unknown"}`;
  const genderText =
    userProfile?.gender && userProfile.gender !== "" ? userProfile.gender : "Gender: Unknown";
  const zipCodeText = userProfile?.zipCode?.toString() ?? "Zipcode: Unknown";
  const serviceBranchText = branchOfService ?? "Service Branch: Unknown";
  const militaryStatusText = militaryStatus ?? "Military Status: Unknown";
  const assignedPrograms = userProfile?.assignedPrograms?.sort() ?? [];
  const [userPrograms, setUserPrograms] = useState<string[]>(
    assignedPrograms ? assignedPrograms.map((program) => program.toString()) : [],
  );
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedRole, setSelectedRole] = useState<RoleEnum | undefined>(userProfile?.role);
  const [openProfileEdit, setOpenProfileEdit] = useState<boolean>(false);

  const handleRoleNext = (newRole: RoleEnum) => {
    setSelectedRole(newRole); // remember it
    console.log(ageText);
  };

  return (
    <>
      {minimized ? (
        <div className={styles.minLayout}>
          {/* 1) Picture */}
          <ProfilePicture firstName={userProfile?.firstName} size="small" />

          {/* 2) Name */}
          <div className={styles.userFullName}>{fullName}</div>

          {/* 3) Role / Gender / Joined */}
          <div className={styles.minRow}>
            <Role role={userProfile?.role} />
            <Image src="/vertical_divider.svg" width={20} height={20} alt="divider" />
            <div className={styles.rowElement}>{genderText}</div>
            <Image src="/vertical_divider.svg" width={20} height={20} alt="divider" />
            <div className={styles.rowElement}>{joinedText}</div>
          </div>

          {/* 4) Zip / Branch / Status */}
          <div className={styles.minRow}>
            <div className={styles.rowElement}>{zipCodeText}</div>
            <Image src="/vertical_divider.svg" width={20} height={20} alt="divider" />
            <div className={styles.rowElement}>{serviceBranchText}</div>
            <Image src="/vertical_divider.svg" width={20} height={20} alt="divider" />
            <div className={styles.rowElement}>{militaryStatusText}</div>
          </div>

          {/* 5) Email */}
          <div className={styles.minRow} style={{ color: "#057E6F" }}>
            {userProfile?.email}
          </div>

          {/* 6) Phone */}
          <div className={styles.minRow} style={{ color: "#057E6F" }}>
            {userProfile?.phoneNumber}
          </div>
        </div>
      ) : (
        <div className={styles.profileHeader}>
          <div className={styles.profileContent}>
            <ProfilePicture
              firstName={userProfile?.firstName}
              size={minimized ? "small" : "large"}
            />
            <div className={styles.userInfo}>
              <div className={styles.userInfoHeader}>
                <div className={styles.userFullName}>{fullName}</div>
                <Role role={userProfile?.role} />
              </div>
              <div className={styles.userMetadata}>
                <span style={{ display: "flex", flexDirection: "row", gap: "8px" }}>
                  {userPrograms && userPrograms.length > 0 ? (
                    userPrograms.map((program) => <Program program={program} key={program} />)
                  ) : (
                    <Program program={"unassigned"} textOnly={true} />
                  )}
                </span>
                <div className={styles.metadataSubsection}>
                  <div>{genderText}</div>
                  <Image src="/vertical_divider.svg" width={20} height={20} alt="divider" />
                  <div>{joinedText}</div>
                  <Image src="/vertical_divider.svg" width={20} height={20} alt="divider" />
                  <div>{zipCodeText}</div>
                  <Image src="/vertical_divider.svg" width={20} height={20} alt="divider" />
                  <div>{userProfile?.roleSpecificInfo?.serviceInfo?.branchOfService}</div>
                  <Image src="/vertical_divider.svg" width={20} height={20} alt="divider" />
                  <div>{userProfile?.roleSpecificInfo?.serviceInfo?.currentMilitaryStatus}</div>
                </div>

                <div className={styles.metadataSubsection}>
                  <div className={styles.smallMetadata}>{userProfile?.email}</div>
                  <Image src="/vertical_divider.svg" width={20} height={20} alt="divider" />
                  <div className={styles.smallMetadata}>{userProfile?.phoneNumber}</div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.profileContentControls}>
            <ProfileActions
              isProfileEditable={isProfileEditable}
              isProgramAndRoleEditable={isProgramAndRoleEditable}
              minimized={minimized}
              showDocuments={showDocuments}
              searchParams={searchParams}
              router={router}
              pathname={pathname}
              firstName={userProfile?.firstName}
              email={userProfile?.email}
              role={userProfile?.role}
              userPrograms={userPrograms}
              didProgramChange={params.didProgramChange}
              programsChanged={params.programsChanged}
              handleProgramsChange={setUserPrograms}
              selectedRole={selectedRole}
              handleRoleNext={handleRoleNext}
              callback={() => {
                setOpenProfileEdit(!openProfileEdit);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
