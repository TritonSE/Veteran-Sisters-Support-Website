"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import styles from "./EditProfile.module.css";
import NavigateBack from "./NavigateBack";

import { UserProfile as UserProfileType, getUserProfile } from "@/app/api/profileApi";
import { Button } from "@/app/components/Button";

function Field(params: {
  label: string;
  defaultValue: string | number | undefined;
  required?: boolean;
  type?: string;
}) {
  const { label, defaultValue, required, type } = params;
  return (
    <div className={styles.field}>
      <div className={styles.fieldLabelContainer}>
        <div className={styles.fieldLabel}>{label}</div>
      </div>
      <input
        className={styles.fieldInput}
        type={type ?? "text"}
        defaultValue={defaultValue}
        required={required}
      ></input>
    </div>
  );
}

export default function EditProfile({ userId }: { userId: string }) {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfileType | undefined>(undefined);

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
      })
      .catch((err: unknown) => {
        console.error(err);
      });
  }, []);

  return (
    <form className={styles.editProfile}>
      <NavigateBack />
      <div className={styles.editProfileHeader}>Edit profile information</div>

      <div className={styles.editProfileFormContent}>
        <div className={styles.editName}>
          <Field required={true} label="First Name" defaultValue={userProfile?.firstName} />
          <Field required={true} label="Last Name" defaultValue={userProfile?.lastName} />
        </div>
        <Field required={true} label="Email" defaultValue={userProfile?.email} type="email" />
        <Field required={true} label="Phone Number" defaultValue={userProfile?.phoneNumber ?? ""} />
        <Field required={true} label="Age" defaultValue={userProfile?.age ?? undefined} type="number" />
        <Field required={true} label="Gender" defaultValue={userProfile?.gender ?? ""} />
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

              const inputs: NodeListOf<HTMLInputElement> = document.querySelectorAll(
                `input.${styles.fieldInput}`,
              );

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

              console.log(formData);

              // TODO: call updateProfile api with form data
              router.back();
            }}
          />
        </div>
      </div>
    </form>
  );
}
