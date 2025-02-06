"use client";
import { getUserProfile, Role as RoleEnum } from "@/app/api/profileApi";
import { Button } from "@/app/components/Button";
import styles from "./EditProfile.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function EditProfile({ userId }: { userId: string }) {
  const router = useRouter();
  const user = getUserProfile(RoleEnum.VETERAN);
  return (
    <div className={styles.editProfile}>
      <div className={styles.navigateBack} onClick={() => router.back()}>
        <Image src="/back_arrow_icon.svg" width={18} height={18} alt="Go back" />
        <div> Back</div>
      </div>
      <div className={styles.editProfileHeader}>Edit profile information</div>
      <div className={styles.editProfileFormContent}>
        <div className={styles.editName}>
          <Field required={true} label="First Name" defaultValue={user.firstName} />
          <Field required={true} label="Last Name" defaultValue={user.lastName} />
        </div>
        <Field required={true} label="Email" defaultValue={user.email} />
        <Field
          required={true}
          label="Password"
          defaultValue={"xxxxxxxxxxxxxxxxxxxxxx"}
          type="password"
        />
        <Field required={false} label="Phone Number" defaultValue={user.phoneNumber || ""} />
        <Field required={false} label="Age" defaultValue={user.age || null} type="number" />
        <Field required={false} label="Gender" defaultValue={user.gender || ""} />
      </div>
      <div className={styles.formControls}>
        <Button text="Cancel" />
        <Button text="Save" />
      </div>
    </div>
  );
}

function Field(params: { label: string; defaultValue: any; required: boolean; type?: string }) {
  const { label, defaultValue, required, type } = params;
  return (
    <div className={styles.field}>
      <div className={styles.fieldLabelContainer}>
        <div className={styles.fieldLabel}>{label}</div>
        {type === "password" && <div className={styles.changePassword}>Change password?</div>}
      </div>
      <input
        className={styles.fieldInput}
        type={type || "text"}
        defaultValue={defaultValue}
        required={required}
      ></input>
    </div>
  );
}
