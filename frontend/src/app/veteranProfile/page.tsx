"use client";
import { useState } from "react";

import { User } from "../api/users";

import styles from "./veteranProfile.module.css";
import VolunteerAssigningDialog from "./volunteerAssigningDialog";

const isOpen = true;
const program = "advocacy";
const user3: User = {
  _id: "678ef34b664181e8e671cdb1",
  email: "user3@email.com",
  firstName: "user3",
  lastName: "user3",
  role: "staff",
  assignedPrograms: ["battle buddies", "advocacy", "operation wellness"],
  assignedVeterans: [],
  assignedVolunteers: [],
};

export default function VeteranProfile() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  // Function to close the dialog
  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className={`${styles.pageContainer} ${isDialogOpen ? styles.blurred : ""}`}>
      <button onClick={openDialog}>Click to open dialog</button>

      {isDialogOpen && (
        <VolunteerAssigningDialog
          isOpen={isOpen}
          program={program}
          veteran={user3}
          closeDialog={closeDialog}
        />
      )}
    </div>
  );
}
