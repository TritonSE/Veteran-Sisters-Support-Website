"use client";
import VolunteerAssigningDialog from "./volunteerAssigningDialog";

const isOpen = true;
const program = "advocacy";
const veteranEmail = "user3@email.com";

export default function VeteranProfile() {
  return (
    <VolunteerAssigningDialog
      isOpen={isOpen}
      program={program}
      veteranEmail={veteranEmail}
    ></VolunteerAssigningDialog>
  );
}
