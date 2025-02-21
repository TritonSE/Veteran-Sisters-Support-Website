"use client";

import { useEffect, useState } from "react";
import Select from "react-select";

import { User, assignVolunteerToProgram, getVolunteersByProgram } from "../api/activeVolunteers";

import styles from "./veteranProfile.module.css";

type VolunteerAssigningDialogProps = {
  //closeDialog: () => void;
  isOpen: boolean;
  program: string;
  veteranEmail: string;
};

type OptionType = {
  value: string;
  label: string;
};

export default function VolunteerAssigningDialog(props: VolunteerAssigningDialogProps) {
  const [hasMounted, setHasMounted] = useState(false);
  const [volunteers, setVolunteers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState<OptionType | null>(null);

  const availableVolunteers = () => {
    setIsLoading(true);
    getVolunteersByProgram(props.program)
      .then((response) => {
        setIsLoading(false);
        if (response.success) {
          setVolunteers(response.data);
        } else {
          console.error(response.error);
        }
      })
      .catch((err: unknown) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  const assignVolunteer = () => {
    if (!selectedVolunteer) {
      return null;
    }

    assignVolunteerToProgram(selectedVolunteer.value, props.veteranEmail, props.program)
      .then((response) => {
        if (response.success) {
          console.log("successfully assigned volunteer");
        } else {
          console.error(response.error);
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

  if (!hasMounted || !props.isOpen) {
    return null;
  }

  const formattedOptions = volunteers.map((v) => ({
    value: v.email,
    label: `${v.firstName} ${v.lastName} - ${String(v.assignedVeterans?.length ?? 0)} veterans`,
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
    <>
      <div className={styles.searchBar}>
        <Select
          placeholder="Choose a volunteer"
          options={formattedOptions}
          menuPortalTarget={document.body}
          formatOptionLabel={customLabel}
          onChange={setSelectedVolunteer}
        />
      </div>

      <button>Cancel</button>
      <button disabled={!selectedVolunteer} onClick={assignVolunteer}>
        Save
      </button>
    </>
  );
}
