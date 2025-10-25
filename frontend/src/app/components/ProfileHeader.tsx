import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { AssignedProgram as AssignedProgramEnum, Role as RoleEnum } from "../api/profileApi";

import styles from "./ProfileHeader.module.css";

import { Button } from "@/app/components/Button";
import { ProfilePicture } from "@/app/components/ProfilePicture";
import { Program } from "@/app/components/Program";
import { Role } from "@/app/components/Role";

export function ProfileHeader(params: {
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
  const fullName = `${firstName ?? "Unknown"} ${lastName ?? "Unknown"}`;
  const joinedText = `Joined: ${yearJoined?.toString() ?? "Unknown"}`;
  const ageText = `Age: ${age?.toString() ?? "Unknown"}`;
  const genderText = `Gender: ${gender ?? "Unknown"}`;
  assignedPrograms?.sort();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return (
    <div className={styles.profileHeader}>
      <div className={styles.profileContent}>
        <ProfilePicture firstName={firstName} />
        <div className={styles.userInfo}>
          <div className={styles.userInfoHeader}>
            <div className={styles.userFullName}>{fullName}</div>
            <Role role={role} />
            {assignedPrograms?.map((program) => (
              <Program program={program} key={program} />
            ))}
          </div>
          <div className={styles.userMetadata}>
            <div className={styles.metadataSubsection}>
              <div>{joinedText}</div>
              <Image src="/vertical_divider.svg" width={20} height={20} alt="divider" />
              <div>{ageText}</div>
              <Image src="/vertical_divider.svg" width={20} height={20} alt="divider" />
              <div>{genderText}</div>
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
        {isPersonalProfile ? (
          <Button
            label="Edit profile"
            onClick={() => {
              const linkSearchParams = new URLSearchParams(searchParams);
              router.push(`${pathname}/edit?${linkSearchParams.toString()}`);
            }}
          />
        ) : isProgramAndRoleEditable ? (
          <>
            <Button label={"Edit Program"} /> <Button label={"Change Role"} />
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
