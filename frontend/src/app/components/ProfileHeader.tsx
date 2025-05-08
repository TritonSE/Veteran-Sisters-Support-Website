import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import {
  AssignedProgram as AssignedProgramEnum,
  BranchOfService,
  CurrentMilitaryStatus,
  Role as RoleEnum,
} from "../api/profileApi";

import ProfileActions from "./EditProfileDialog";
import styles from "./ProfileHeader.module.css";
import { ProfilePicture } from "./ProfilePicture";
import { Program } from "./Program";
import { Role } from "./Role";

export function ProfileHeader(params: {
  firstName: string | undefined;
  lastName: string | undefined;
  role: RoleEnum | undefined;
  zipcode: number;
  assignedPrograms: AssignedProgramEnum[] | undefined;
  yearJoined?: number | undefined;
  age?: number | undefined;
  branchOfService?: BranchOfService;
  currentMilitaryStatus?: CurrentMilitaryStatus;
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
    zipcode,
    assignedPrograms,
    yearJoined,
    age,
    branchOfService,
    currentMilitaryStatus,
    phoneNumber,
    gender,
    email,
    isProgramAndRoleEditable,
    isPersonalProfile,
  } = params;
  const fullName = `${firstName ?? "Unknown"} ${lastName ?? "Unknown"}`;
  const joinedText = yearJoined?.toString() ?? "Unknown";
  const ageText = `Age: ${age?.toString() ?? "Unknown"}`;
  const genderText = gender ?? "Unknown";
  const zipCodeText = zipcode?.toString() ?? "Unknown";
  assignedPrograms?.sort();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedRole, setSelectedRole] = useState<RoleEnum | undefined>(role);
  const [openProfileEdit, setOpenProfileEdit] = useState<boolean>(false);

  const handleRoleNext = (newRole: RoleEnum) => {
    setSelectedRole(newRole); // remember it
    console.log(ageText);
  };

  return (
    <div className={styles.profileHeader}>
      <div className={styles.profileContent}>
        <ProfilePicture firstName={firstName} />
        <div className={styles.userInfo}>
          <div className={styles.userInfoHeader}>
            <div className={styles.userFullName}>{fullName}</div>
            <Role role={role} />
          </div>
          <div className={styles.userMetadata}>
            <span style={{ display: "flex", flexDirection: "row", gap: "8px" }}>
              {assignedPrograms && assignedPrograms.length > 0 ? (
                assignedPrograms.map((program) => <Program program={program} key={program} />)
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
              <div>{branchOfService}</div>
              <Image src="/vertical_divider.svg" width={20} height={20} alt="divider" />
              <div>{currentMilitaryStatus}</div>
            </div>

            <div className={styles.metadataSubsection}>
              <div className={styles.smallMetadata}>{email}</div>
              <Image src="/vertical_divider.svg" width={20} height={20} alt="divider" />
              <div className={styles.smallMetadata}>{phoneNumber}</div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.profileContentControls}>
        <ProfileActions
          isPersonalProfile={isPersonalProfile}
          isProgramAndRoleEditable={isProgramAndRoleEditable}
          searchParams={searchParams}
          router={router}
          pathname={pathname}
          firstName={firstName}
          email={email}
          role={role}
          selectedRole={selectedRole}
          handleRoleNext={handleRoleNext}
          callback={() => {
            setOpenProfileEdit(!openProfileEdit);
          }}
        />
      </div>
    </div>
  );
}
