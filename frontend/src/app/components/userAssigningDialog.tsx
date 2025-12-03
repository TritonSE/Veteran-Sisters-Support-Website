"use client";

import { useEffect, useState } from "react";
import Select from "react-select";

import {
  assignUserToProgram,
  getVeteransByProgram,
  getVolunteersByProgram,
} from "../api/activeVolunteers";
import { Role as RoleEnum, UserProfile as UserProfileType } from "../api/profileApi";

import { Program } from "./Program";
import { Role } from "./Role";
import styles from "./veteranProfile.module.css";

export enum DialogContext {
  USER_PROFILE,
  ADMIN_DASHBOARD,
}

type UserAssigningDialogProps = {
  closeDialog: () => void;
  isOpen: boolean;
  program: string[];
  user: UserProfileType;
  setMessage: (message: string) => void;
  context: DialogContext;
};

type OptionType = {
  value: UserProfileType;
  label: string;
};

type ProgramOptionType = {
  value: string;
  label: string;
};

export default function UserAssigningDialog(props: UserAssigningDialogProps) {
  const [hasMounted, setHasMounted] = useState(false);
  const [volunteers, setVolunteers] = useState<UserProfileType[]>([]);
  const [selectedVolunteerOption, setSelectedVolunteerOption] = useState<OptionType[] | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<ProgramOptionType>();
  const [step, setStep] = useState(
    props.context === DialogContext.ADMIN_DASHBOARD && props.program.length > 1 ? 1 : 2,
  );

  useEffect(() => {
    props.setMessage("");
  }, []);

  const availableVolunteers = () => {
    //if user is veteran, the dialog will show volunteers
    if (props.user.role === RoleEnum.VETERAN) {
      getVolunteersByProgram(
        props.context === DialogContext.ADMIN_DASHBOARD && props.program.length > 1
          ? (selectedProgram?.value ?? props.program[0])
          : props.program[0],
      )
        .then((response) => {
          if (response.success) {
            setVolunteers(response.data);
          } else {
            console.log(response.error);
          }
        })
        .catch((err: unknown) => {
          console.error(err);
        });
    } else if (props.user.role === RoleEnum.VOLUNTEER) {
      //if user is volunteer, the dialog will show veterans
      getVeteransByProgram(
        props.context === DialogContext.ADMIN_DASHBOARD && props.program.length > 1
          ? (selectedProgram?.value ?? props.program[0])
          : props.program[0],
      )
        .then((response) => {
          if (response.success) {
            setVolunteers(response.data);
          } else {
            console.log(response.error);
          }
        })
        .catch((err: unknown) => {
          console.error(err);
        });
    }
  };

  const assignVolunteer = async () => {
    if (
      !Array.isArray(selectedVolunteerOption) ||
      selectedVolunteerOption.length === 0 ||
      !props.user._id
    ) {
      return;
    }

    const messages: string[] = [];

    const assignPromises = selectedVolunteerOption.map(async (option) => {
      const user = option.value;

      if (!user?._id || !user?.email) return;

      const volunteerEmail = props.user.role === RoleEnum.VETERAN ? user.email : props.user.email;
      const veteranEmail = props.user.role === RoleEnum.VETERAN ? props.user.email : user.email;
      const volunteerId = props.user.role === RoleEnum.VETERAN ? user._id : props.user._id;
      const veteranId = props.user.role === RoleEnum.VETERAN ? props.user._id : user._id;

      if (!volunteerId || !veteranId) {
        console.error("user id is undefined");
        return;
      }

      try {
        const response = await assignUserToProgram(
          volunteerEmail,
          veteranEmail,
          props.context === DialogContext.ADMIN_DASHBOARD && props.program.length > 1
            ? (selectedProgram?.value ?? props.program[0])
            : props.program[0],
          volunteerId,
          veteranId,
        );

        if (response.success) {
          messages.push(`Successfully assigned ${user.firstName} to ${props.user.firstName}.`);
        } else {
          messages.push(`Failed to assign ${user.firstName}. They may already be assigned.`);
        }
      } catch (err) {
        console.error(`Error assigning ${user.firstName}:`, err);
      }
    });
    await Promise.all(assignPromises);
    props.setMessage(messages.join("\n"));
  };

  useEffect(() => {
    setHasMounted(true);
    if (props.isOpen) {
      availableVolunteers();
    }
  }, []);

  if (!hasMounted || !props.isOpen) {
    return null;
  }

  const formattedOptions = volunteers.map((v) => ({
    value: v,
    label: `${v.firstName} ${v.lastName} - ${String(v.assignedUsers ? new Set(v.assignedUsers).size : 0)} ${
      props.user.role === RoleEnum.VETERAN ? "veterans" : "volunteers"
    }`,
  }));

  const formattedProgramOptions = props.program.map((v) => ({
    value: v,
    label: v,
  }));

  const customLabel = (option: OptionType) => (
    <>
      <div>{option.label.split(" - ")[0]}</div>
      <div style={{ color: "gray" }}>{option.label.split(" - ")[1]}</div>
    </>
  );

  return (
    <div className={styles.dialogContainer}>
      <div className={styles.dialog}>
        {step === 1 && (
          <div className={styles.programSelect}>
            <div className={styles.programSelectHeader}>
              <div>Select a program to match a volunteer with {props.user.firstName}</div>
              <Role role={props.user.role} />
            </div>
            <div className={styles.searchBar}>
              <Select
                placeholder="Choose program"
                options={formattedProgramOptions}
                menuPortalTarget={document.body}
                onChange={(selectedOption) => {
                  if (!selectedOption) return;
                  setSelectedProgram(selectedOption);
                }}
              />
            </div>
          </div>
        )}
        {step === 2 && (
          <>
            <div className={styles.headerInfoContainer}>
              <div
                className={styles.multiHeaderInfo}
                style={
                  selectedVolunteerOption && selectedVolunteerOption.length > 1
                    ? {}
                    : { display: "flex", gap: "0.5rem" }
                }
              >
                <div className={styles.userInfo}>
                  {`Assign: ${props.user.firstName}`}
                  <Role role={props.user.role} />
                </div>
                {selectedVolunteerOption && selectedVolunteerOption.length > 0 ? (
                  <div className={styles.optionsList}>
                    {" to "}
                    {selectedVolunteerOption.map((opt, idx) => (
                      <span key={idx} className={styles.nameWithRole}>
                        {opt.value.firstName} {opt.value.lastName} <Role role={opt.value.role} />
                        {idx < selectedVolunteerOption.length - 1 ? "\u00A0and\u00A0" : ""}
                      </span>
                    ))}
                  </div>
                ) : (
                  " to ..."
                )}
              </div>
              <Program
                program={
                  props.context === DialogContext.ADMIN_DASHBOARD && props.program.length > 1
                    ? (selectedProgram?.value ?? props.program[0])
                    : props.program[0]
                }
              />
            </div>

            <div className={styles.searchBar}>
              <Select
                placeholder={
                  props.user.role === RoleEnum.VOLUNTEER ? "Choose a veteran" : "Choose a volunteer"
                }
                options={formattedOptions}
                menuPortalTarget={document.body}
                formatOptionLabel={customLabel}
                onChange={(selectedOption) => {
                  if (!selectedOption) return;
                  setSelectedVolunteerOption(
                    Array.isArray(selectedOption) ? selectedOption : [selectedOption],
                  );
                }}
                isMulti={
                  props.context === DialogContext.ADMIN_DASHBOARD &&
                  props.user.role === RoleEnum.VOLUNTEER
                }
              />
            </div>

            {selectedVolunteerOption && props.context === DialogContext.USER_PROFILE && (
              <div className={styles.volunteerInfoContainer}>
                <div className={styles.profilePicLetter}>
                  {selectedVolunteerOption[0].value.firstName[0]}
                </div>
                <div className={styles.volunteerInfo}>
                  <div className={styles.headerInfo}>
                    {selectedVolunteerOption[0].value.firstName}{" "}
                    {selectedVolunteerOption[0].value.lastName}
                    <Role role={selectedVolunteerOption[0].value.role} />
                    <Program program={props.program[0]} />
                  </div>
                  <p>
                    Joined: {selectedVolunteerOption[0].value.yearJoined} &nbsp; | &nbsp; Age:{" "}
                    {selectedVolunteerOption[0].value.age} &nbsp; | &nbsp; Gender:{" "}
                    {selectedVolunteerOption[0].value.gender}
                  </p>
                  <p>
                    <a
                      href={`mailto:${selectedVolunteerOption[0].value.email}`}
                      className={styles.coloredInfo}
                    >
                      {selectedVolunteerOption[0].value.email}
                    </a>{" "}
                    &nbsp; | &nbsp;
                    <span className={styles.coloredInfo}>
                      {selectedVolunteerOption[0].value.phoneNumber}
                    </span>
                  </p>
                </div>
                <a
                  className={styles.profileLink}
                  href={`/profile/${selectedVolunteerOption[0].value._id ?? ""}`}
                >
                  View Profile
                </a>
              </div>
            )}
          </>
        )}
        <div className={styles.buttons}>
          <button className={styles.cancel} onClick={props.closeDialog}>
            Cancel
          </button>

          {step === 1 && (
            <button
              className={styles.save}
              disabled={!selectedProgram}
              onClick={() => {
                setStep(2);
                availableVolunteers();
              }}
            >
              Next
            </button>
          )}

          {step === 2 && (
            <button
              disabled={!selectedVolunteerOption}
              onClick={() => {
                void assignVolunteer().then(props.closeDialog);
              }}
              className={styles.save}
            >
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
