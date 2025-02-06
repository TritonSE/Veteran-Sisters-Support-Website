"use client";
import { getUserProfile, Role as RoleEnum } from "@/app/api/profileApi";
import { Button } from "@/app/components/Button";
import styles from "./EditProfile.module.css";
import NavigateBack from "./NavigateBack";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

export default function EditProfile({ userId }: { userId: string }) {
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const user = getUserProfile(RoleEnum.VETERAN);
  return (
    <div className={styles.editProfile}>
      <NavigateBack />
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
          openModal={() => setModalOpen(true)}
        />
        <Field required={false} label="Phone Number" defaultValue={user.phoneNumber || ""} />
        <Field required={false} label="Age" defaultValue={user.age || null} type="number" />
        <Field required={false} label="Gender" defaultValue={user.gender || ""} />
      </div>
      <div className={styles.formControls}>
        <Button text="Cancel" onClick={() => router.back()} />
        <Button
          text="Save"
          filled={true}
          onClick={() => {
            // TODO: call updateProfile api
            router.back();
          }}
        />
      </div>
      <ConfirmPasswordModal showModal={modalOpen} closeModal={() => setModalOpen(false)} />
    </div>
  );
}

function ConfirmPasswordModal(params: { showModal: boolean; closeModal: () => void }) {
  const { showModal, closeModal } = params;

  return (
    <>
      {showModal && (
        <div className={styles.confirmPasswordModal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <div className={styles.modalInfo}>
                <div className={styles.modalHeading}>Change your password</div>
                <div className={styles.modalSubtext}>
                  Your new password will be saved to your profile information.
                </div>
              </div>
              <Image
                className={styles.closeModal}
                src="/close_button.svg"
                alt="Close modal"
                width={24}
                height={24}
                onClick={closeModal}
              />
            </div>
            <Field
              label="Enter new password"
              defaultValue="xxxxxxxxxxxxxxxxxxxxxx"
              type="password"
              required={true}
            />
            <div className={styles.modalControls}>
              <Button text="Cancel" onClick={closeModal} />
              <Button text="Save" filled={true} onClick={closeModal} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Field(params: {
  label: string;
  defaultValue: any;
  required?: boolean;
  type?: string;
  openModal?: () => void;
}) {
  const { label, defaultValue, required, type, openModal } = params;
  return (
    <div className={styles.field}>
      <div className={styles.fieldLabelContainer}>
        <div className={styles.fieldLabel}>{label}</div>
        {openModal && (
          <div className={styles.changePassword} onClick={openModal}>
            Change password?
          </div>
        )}
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
