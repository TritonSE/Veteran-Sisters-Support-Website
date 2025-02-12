"use client";
import { getUserProfile, Role as RoleEnum } from "@/app/api/profileApi";
import { Button } from "@/app/components/Button";
import styles from "./EditProfile.module.css";
import NavigateBack from "./NavigateBack";
import { useRouter } from "next/navigation";

export default function EditProfile({ userId }: { userId: string }) {
  const router = useRouter();
  const user = getUserProfile(RoleEnum.VETERAN);
  return (
    <form className={styles.editProfile}>
      <NavigateBack />
      <div className={styles.editProfileHeader}>Edit profile information</div>

      <div className={styles.editProfileFormContent}>
        <div className={styles.editName}>
          <Field required={true} label="First Name" defaultValue={user.firstName} />
          <Field required={true} label="Last Name" defaultValue={user.lastName} />
        </div>
        <Field required={true} label="Email" defaultValue={user.email} type="email" />
        <Field required={true} label="Phone Number" defaultValue={user.phoneNumber || ""} />
        <Field required={true} label="Age" defaultValue={user.age || null} type="number" />
        <Field required={true} label="Gender" defaultValue={user.gender || ""} />
      </div>
      <div className={styles.formControls}>
        <Button
          text="Click to change password"
          onClick={(event) => {
            event.preventDefault();
          }}
        />
        <div className={styles.formSubmissionControls}>
          <Button
            text="Cancel"
            onClick={(event) => {
              event.preventDefault();
              router.back();
            }}
          />
          <Button
            text="Save"
            filled={true}
            onClick={(event) => {
              event.preventDefault();

              const inputs: any = document.querySelectorAll(`input.${styles.fieldInput}`);

              const formData = {
                firstName: inputs[0]?.value,
                lastName: inputs[1]?.value,
                email: inputs[2]?.value,
                phoneNumber: inputs[3]?.value,
                age: Number(inputs[4]?.value),
                gender: inputs[5]?.value,
              };

              const form = document.querySelector("form");
              if (form && !form.reportValidity()) {
                return; // Prevent navigation if validation fails
              }

              // TODO: call updateProfile api with form data
              router.back();
            }}
          />
        </div>
      </div>
    </form>
  );
}

function Field(params: { label: string; defaultValue: any; required?: boolean; type?: string }) {
  const { label, defaultValue, required, type } = params;
  return (
    <div className={styles.field}>
      <div className={styles.fieldLabelContainer}>
        <div className={styles.fieldLabel}>{label}</div>
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
