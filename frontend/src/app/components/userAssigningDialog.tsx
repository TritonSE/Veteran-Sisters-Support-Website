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

type UserAssigningDialogProps = {
  closeDialog: () => void;
  isOpen: boolean;
  program: string;
  user: UserProfileType;
};

type OptionType = {
  value: UserProfileType;
  label: string;
};

export default function UserAssigningDialog(props: UserAssigningDialogProps) {
  const [hasMounted, setHasMounted] = useState(false);
  const [message, setMessage] = useState("");
  const [volunteers, setVolunteers] = useState<UserProfileType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedVolunteerOption, setSelectedVolunteerOption] = useState<OptionType | null>(null);

  const availableVolunteers = () => {
    setIsLoading(true);
    //if user is veteran, the dialog will show volunteers
    if (props.user.role === RoleEnum.VETERAN) {
      getVolunteersByProgram(props.program)
        .then((response) => {
          setIsLoading(false);
          if (response.success) {
            setVolunteers(response.data);
          } else {
            console.log(response.error);
          }
        })
        .catch((err: unknown) => {
          console.error(err);
          setIsLoading(false);
        });
    } else if (props.user.role === RoleEnum.VOLUNTEER) {
      //if user is volunteer, the dialog will show veterans
      getVeteransByProgram(props.program)
        .then((response) => {
          setIsLoading(false);
          if (response.success) {
            setVolunteers(response.data);
          } else {
            console.log(response.error);
          }
        })
        .catch((err: unknown) => {
          console.error(err);
          setIsLoading(false);
        });
    }
  };

  const assignVolunteer = () => {
    if (!selectedVolunteerOption?.value._id || !props.user._id) {
      return null;
    }
    const volunteerEmail =
      props.user.role === RoleEnum.VETERAN ? selectedVolunteerOption.value.email : props.user.email;
    const veteranEmail =
      props.user.role === RoleEnum.VETERAN ? props.user.email : selectedVolunteerOption.value.email;
    const volunteerId =
      props.user.role === RoleEnum.VETERAN ? selectedVolunteerOption.value._id : props.user._id;
    const veteranId =
      props.user.role === RoleEnum.VETERAN ? props.user._id : selectedVolunteerOption.value._id;

    assignUserToProgram(volunteerEmail, veteranEmail, props.program, volunteerId, veteranId)
      .then((response) => {
        if (response.success) {
          setMessage("Successfully assigned user!");
        } else {
          setMessage("Failed to assign user. Ensure user is not already assigned to this person.");
        }
      })
      .catch((err: unknown) => {
        console.error(err);
      });
  };

  useEffect(() => {
    setHasMounted(true);
    if (props.isOpen) {
      availableVolunteers();
    }
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 2000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [message]);

  if (!hasMounted || !props.isOpen) {
    return null;
  }

  const formattedOptions = volunteers.map((v) => ({
    value: v,
    label: `${v.firstName} ${v.lastName} - ${String(v.assignedUsers?.length ?? 0)} ${
      props.user.role === RoleEnum.VETERAN ? "veterans" : "volunteers"
    }`,
  }));

  const customLabel = (option: OptionType) => (
    <>
      <div>{option.label.split(" - ")[0]}</div>
      <div style={{ color: "gray" }}>{option.label.split(" - ")[1]}</div>
    </>
  );

  if (isLoading || !formattedOptions.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.dialogContainer}>
      <div className={styles.dialog}>
        <div className={styles.headerInfoContainer}>
          <div className={styles.headerInfo}>
            {`Assign: ${props.user.firstName}`}
            <Role role={props.user.role} />
            {selectedVolunteerOption
              ? ` to ${selectedVolunteerOption.value.firstName} ${selectedVolunteerOption.value.lastName}`
              : " to ..."}
            {selectedVolunteerOption && <Role role={selectedVolunteerOption.value.role} />}
          </div>
          <Program program={props.program} />
        </div>

        <div className={styles.searchBar}>
          <Select
            placeholder={
              props.user.role === RoleEnum.VOLUNTEER ? "Choose a veteran" : "Choose a volunteer"
            }
            options={formattedOptions}
            menuPortalTarget={document.body}
            formatOptionLabel={customLabel}
            onChange={setSelectedVolunteerOption}
          />
        </div>

        {selectedVolunteerOption && (
          <div className={styles.volunteerInfoContainer}>
            <div className={styles.profilePicLetter}>
              {selectedVolunteerOption.value.firstName[0]}
            </div>
            <div className={styles.volunteerInfo}>
              <div className={styles.headerInfo}>
                {selectedVolunteerOption.value.firstName} {selectedVolunteerOption.value.lastName}
                <Role role={selectedVolunteerOption.value.role} />
                <Program program={props.program} />
              </div>
              <p>
                Joined: {selectedVolunteerOption.value.yearJoined} &nbsp; | &nbsp; Age:{" "}
                {selectedVolunteerOption.value.age} &nbsp; | &nbsp; Gender:{" "}
                {selectedVolunteerOption.value.gender}
              </p>
              <p>
                <a
                  href={`mailto:${selectedVolunteerOption.value.email}`}
                  className={styles.coloredInfo}
                >
                  {selectedVolunteerOption.value.email}
                </a>{" "}
                &nbsp; | &nbsp;
                <span className={styles.coloredInfo}>
                  {selectedVolunteerOption.value.phoneNumber}
                </span>
              </p>
            </div>
            <a
              className={styles.profileLink}
              href={`/profile/${selectedVolunteerOption.value._id ?? ""}`}
            >
              View Profile
            </a>
          </div>
        )}

        <div className={styles.buttons}>
          <button className={styles.cancel} onClick={props.closeDialog}>
            Cancel
          </button>
          <button
            disabled={!selectedVolunteerOption}
            onClick={assignVolunteer}
            className={styles.save}
          >
            Save
          </button>
        </div>

        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
}
