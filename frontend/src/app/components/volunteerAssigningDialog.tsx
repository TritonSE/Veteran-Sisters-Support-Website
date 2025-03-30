"use client";

import { useEffect, useState } from "react";
import Select from "react-select";

import { assignVolunteerToProgram, getVolunteersByProgram } from "../api/activeVolunteers";
import { UserProfile as UserProfileType } from "../api/profileApi";
import { Program } from "../components/Program";
import { Role } from "../components/Role";

import styles from "./veteranProfile.module.css";

type VolunteerAssigningDialogProps = {
  closeDialog: () => void;
  isOpen: boolean;
  program: string;
  veteran: UserProfileType;
};

type OptionType = {
  value: UserProfileType;
  label: string;
};

export default function VolunteerAssigningDialog(props: VolunteerAssigningDialogProps) {
  const [hasMounted, setHasMounted] = useState(false);
  const [message, setMessage] = useState("");
  const [volunteers, setVolunteers] = useState<UserProfileType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedVolunteerOption, setSelectedVolunteerOption] = useState<OptionType | null>(null);

  const availableVolunteers = () => {
    setIsLoading(true);
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
  };

  const assignVolunteer = () => {
    if (!selectedVolunteerOption?.value._id) {
      return null;
    }

    assignVolunteerToProgram(
      selectedVolunteerOption.value.email,
      props.veteran.email,
      props.program,
      selectedVolunteerOption.value._id,
    )
      .then((response) => {
        if (response.success) {
          setMessage("Successfully assigned volunteer!");
        } else {
          setMessage(
            "Failed to assign volunteer. Ensure volunteer is not already assigned to veteran.",
          );
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
    label: `${v.firstName} ${v.lastName} - ${String(v.assignedUsers?.length ?? 0)} veterans`,
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
            {`Assign: ${props.veteran.firstName}`}
            <Role role="veteran" />
            {selectedVolunteerOption
              ? ` to ${selectedVolunteerOption.value.firstName} ${selectedVolunteerOption.value.lastName}`
              : " to ..."}
            {selectedVolunteerOption && <Role role="volunteer" />}
          </div>
          <Program program={props.program} />
        </div>

        <div className={styles.searchBar}>
          <Select
            placeholder="Choose a volunteer"
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
                <Role role="volunteer" />
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
            {/* TODO: link to volunteer profile page when done */}
            <a className={styles.profileLink} href="google.com">
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
