import { updatePassword } from "firebase/auth";
import { useState } from "react";

import { useAuth } from "../contexts/AuthContext";

import { Button } from "./Button";
import styles from "./ChangePasswordModal.module.css";
import ErrorMessage from "./ErrorMessage";
import SuccessNotification from "./SuccessNotification";

export default function ChangePasswordModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => unknown;
}) {
  const [newPassword, setNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessNotif, setShowSuccessNotif] = useState(false);
  const { user } = useAuth();

  const onSubmit = async () => {
    if (!newPassword) {
      return;
    }

    setShowSuccessNotif(false);
    setErrorMessage("");

    if (!user) {
      setErrorMessage("Could not find user information");
      onClose();
      return;
    }
    try {
      await updatePassword(user, newPassword);
      setNewPassword("");
      setShowSuccessNotif(true);
      onClose();
    } catch (error) {
      setErrorMessage(`Error: ${String(error)}`);
    }
  };

  return (
    <>
      {isOpen ? (
        <>
          <div className={styles.overlay}></div>
          <div className={styles.modal}>
            <div className={styles.textGroup}>
              <span className={styles.title}>Change password</span>
              <span className={styles.subtitle}>
                Your new password will be saved to your profile.
              </span>
            </div>

            <div className={styles.inputGroup}>
              <span className={styles.inputLabel}>Enter new password</span>
              <input
                required
                className={styles.input}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                }}
                type="password"
              />
            </div>

            <div className={styles.buttons}>
              <Button label="Cancel" onClick={onClose} />
              <Button
                label="Save"
                filled
                type="button"
                onClick={() => {
                  void onSubmit();
                }}
              />
            </div>
          </div>
        </>
      ) : null}
      {errorMessage && <ErrorMessage message={errorMessage} />}
      {showSuccessNotif && <SuccessNotification message="Password Changed Successfully" />}
    </>
  );
}
