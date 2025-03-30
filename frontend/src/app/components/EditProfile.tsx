"use client";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

import CustomDropdown from "./CustomDropdown";
import styles from "./EditProfile.module.css";
import NavigateBack from "./NavigateBack";

import {
  Gender,
  UserProfile as UserProfileType,
  getUserProfile,
  updateUserProfile,
} from "@/app/api/profileApi";
import { Button } from "@/app/components/Button";

function Field(params: { label: string; children: ReactNode }) {
  const { children, label } = params;
  return (
    <div className={styles.field}>
      <div className={styles.fieldLabelContainer}>
        <div className={styles.fieldLabel}>{label}</div>
      </div>
      {children}
    </div>
  );
}

export default function EditProfile({ userId }: { userId: string }) {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfileType | undefined>(undefined);
  const [genderSelectOpen, setGenderSelectOpen] = useState(false);

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

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
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
      gender: userProfile?.roleSpecificInfo?.serviceInfo?.gender ?? "",
    };

    const form = document.querySelector("form");
    if (form && !form.reportValidity()) {
      return; // Prevent navigation if validation fails
    }

    const response = await updateUserProfile(
      userId,
      formData?.firstName,
      formData?.lastName,
      formData?.email,
      formData?.phoneNumber,
      formData?.age,
      formData?.gender,
    );

    if (!response.success) {
      return; // TODO: show some error UI
    }

    router.back();
  };

  return (
    <form className={styles.editProfile}>
      <NavigateBack />
      <div className={styles.editProfileHeader}>Edit profile information</div>

      <div className={styles.editProfileFormContent}>
        <div className={styles.editName}>
          <Field label="First Name">
            <input
              defaultValue={userProfile?.firstName}
              required
              className={styles.fieldInput}
            ></input>
          </Field>
          <Field label="Last Name">
            <input
              defaultValue={userProfile?.lastName}
              required
              className={styles.fieldInput}
            ></input>
          </Field>
        </div>
        <Field label="Email">
          <input
            required
            defaultValue={userProfile?.email}
            type="email"
            className={styles.fieldInput}
          ></input>
        </Field>

        <Field label="Phone Number">
          <input
            required
            defaultValue={userProfile?.phoneNumber ?? ""}
            placeholder="xxx-xxx-xxxx"
            type="tel"
            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
            title="Please enter a phone number in the format: xxx-xxx-xxxx"
            className={styles.fieldInput}
          ></input>
        </Field>
        <Field label="Age">
          <input
            required
            className={styles.fieldInput}
            defaultValue={userProfile?.age ?? undefined}
            type="number"
          ></input>
        </Field>
        <Field label="Gender">
          <CustomDropdown
            toggleDropdown={() => {
              setGenderSelectOpen((genderSelectOpenLocal) => !genderSelectOpenLocal);
            }}
            isOpen={genderSelectOpen}
            options={["Male", "Female", "Other"]}
            fullWidth={true}
            onSelect={(option) => {
              setUserProfile((userProfileLocal) => {
                return userProfileLocal
                  ? {
                      ...userProfileLocal,
                      roleSpecificInfo: {
                        ...userProfileLocal?.roleSpecificInfo,
                        serviceInfo: {
                          ...userProfileLocal?.roleSpecificInfo?.serviceInfo,
                          gender: option as Gender,
                        },
                      },
                    }
                  : undefined;
              });
            }}
            selected={userProfile?.roleSpecificInfo?.serviceInfo?.gender}
          ></CustomDropdown>
        </Field>
      </div>
      <div className={styles.formControls}>
        <Button
          label="Click to change password"
          onClick={(event) => {
            event.preventDefault();
          }}
        />
        <div className={styles.formSubmissionControls}>
          <Button
            label="Cancel"
            onClick={(event) => {
              event.preventDefault();
              router.back();
            }}
          />
          <Button label="Save" filled={true} onClick={handleSubmit} type="submit" />
        </div>
      </div>
    </form>
  );
}
