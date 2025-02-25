import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/app/components/Button";
import { Role } from "@/app/components/Role";
import { Program } from "@/app/components/Program";
import { ProfilePicture } from "@/app/components/ProfilePicture";
import { Role as RoleEnum, AssignedProgram as AssignedProgramEnum } from "../api/profileApi";
import styles from "./ProfileHeader.module.css";

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
