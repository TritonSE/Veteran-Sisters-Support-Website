"use client";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

import {
  Gender,
  UserProfile as UserProfileType,
  getUserProfile,
  updateUserProfile,
} from "../api/profileApi";

import { Button } from "./Button";
import ChangePasswordModal from "./ChangePasswordModal";
import CustomDropdown from "./CustomDropdown";
import styles from "./EditProfile.module.css";
import NavigateBack from "./NavigateBack";

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
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
  const [genderSelectOpen, setGenderSelectOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const age = Number(formData.get("age") as string);
    const gender = userProfile?.roleSpecificInfo?.serviceInfo?.gender ?? "";

    if (!firstName || !lastName || !email || !phoneNumber || !age) {
      setError("Please fill in all required fields");
      return;
    }

    const response = await updateUserProfile(
      userId,
      firstName,
      lastName,
      email,
      phoneNumber,
      age,
      gender,
    );

    if (!response.success) {
      setError(response.error ?? "Failed to update profile");
      return;
    }

    router.back();
  };

  if (error) {
    return (
      <div className={styles.editProfile}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <form className={styles.editProfile} onSubmit={(e) => void handleSubmit(e)}>
      <NavigateBack />
      <div className={styles.editProfileHeader}>Edit profile information</div>

      <div className={styles.editProfileFormContent}>
        <div className={styles.editName}>
          <Field label="First Name">
            <input
              name="firstName"
              defaultValue={userProfile?.firstName}
              required
              className={styles.fieldInput}
            />
          </Field>
          <Field label="Last Name">
            <input
              name="lastName"
              defaultValue={userProfile?.lastName}
              required
              className={styles.fieldInput}
            />
          </Field>
        </div>
        <Field label="Email">
          <input
            name="email"
            required
            defaultValue={userProfile?.email}
            type="email"
            className={styles.fieldInput}
          />
        </Field>

        <Field label="Phone Number">
          <input
            name="phoneNumber"
            required
            defaultValue={userProfile?.phoneNumber ?? ""}
            placeholder="xxx-xxx-xxxx"
            type="tel"
            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
            title="Please enter a phone number in the format: xxx-xxx-xxxx"
            className={styles.fieldInput}
          />
        </Field>
        <Field label="Age">
          <input
            name="age"
            required
            className={styles.fieldInput}
            defaultValue={userProfile?.age ?? undefined}
            type="number"
          />
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
                if (!userProfileLocal) return null;
                const updatedProfile: UserProfileType = {
                  ...userProfileLocal,
                  roleSpecificInfo: {
                    ...userProfileLocal.roleSpecificInfo,
                    serviceInfo: {
                      ...userProfileLocal.roleSpecificInfo?.serviceInfo,
                      gender: option as Gender,
                    },
                  },
                };
                return updatedProfile;
              });
            }}
            selected={userProfile?.roleSpecificInfo?.serviceInfo?.gender}
          />
        </Field>
      </div>
      <div className={styles.formControls}>
        <Button
          label="Click to change password"
          onClick={() => {
            setChangePasswordModalOpen(true);
          }}
          type="button"
        />
        <div className={styles.formSubmissionControls}>
          <Button
            label="Cancel"
            onClick={(event) => {
              event.preventDefault();
              router.back();
            }}
            type="button"
          />
          <Button label="Save" filled={true} type="submit" />
        </div>
      </div>
      <ChangePasswordModal
        isOpen={changePasswordModalOpen}
        onClose={() => {
          setChangePasswordModalOpen(false);
        }}
      />
    </form>
  );
}
