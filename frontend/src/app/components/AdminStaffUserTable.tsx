import Image from "next/image";
import { useEffect, useState } from "react";

import {
  AssignedProgram,
  AssignedProgram as ProgramEnum,
  Role as RoleEnum,
  UserProfile,
} from "../api/profileApi";
import { getNonAdminUsers } from "../api/userApi";

import { AdminStaffUserItem } from "./AdminStaffUserItem";
import styles from "./AdminStaffUserTable.module.css";
import CustomDropdown from "./CustomDropdown";
import { Tabs } from "./Tabs";
import UserAssigningDialog, { DialogContext } from "./userAssigningDialog";

export function AdminStaffUserTable() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [page, setPage] = useState<number>(0);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [filterDropdownValue, setFilterDropdownValue] = useState("None");
  const [sortDropdownValue, setSortDropdownValue] = useState("None");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [message, setMessage] = useState("");
  const [dialogUser, setDialogUsers] = useState<UserProfile>();
  const pageSize = 8;

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setRefreshFlag((prev) => !prev);
  };

  const handleChangeProgram = (program: ProgramEnum | undefined) => {
    if (!program) {
      setUsers(allUsers);
    } else {
      setUsers(allUsers.filter((user) => user.assignedPrograms?.includes(program)));
    }
    setPage(0);
  };

  const compare = (a: UserProfile, b: UserProfile) => {
    if (a.firstName < b.firstName) return -1;
    if (a.firstName > b.firstName) return 1;
    return 0;
  };

  const sortUsers = (userList: UserProfile[]) => {
    const unassigned: UserProfile[] = [];
    const assigned: UserProfile[] = [];
    userList.forEach((user) => {
      if (user.assignedUsers?.length === 0 && user.role !== RoleEnum.STAFF) {
        unassigned.push(user);
      } else {
        assigned.push(user);
      }
    });
    unassigned.sort(compare);
    assigned.sort(compare);
    unassigned.push(...assigned);
    return unassigned;
  };

  useEffect(() => {
    getNonAdminUsers()
      .then((result) => {
        if (result.success) {
          const sortedList = sortUsers(result.data);
          setAllUsers(sortedList);
          setUsers(sortedList);
        } else {
          console.error(result.error);
        }
      })
      .catch((reason: unknown) => {
        console.error(reason);
      });
  }, [refreshFlag]);

  return (
    <div className={styles.container}>
      <div className={styles.member}>
        <span className={styles.memberTitle}>Members</span>
        <div className={styles.memberCountFrame}>
          <span>{allUsers.length}</span>
        </div>
      </div>
      <div className={styles.filterSortContainer}>
        <Tabs
          OnAll={() => {
            handleChangeProgram(undefined);
          }}
          OnBattleBuddies={() => {
            handleChangeProgram(AssignedProgram.BATTLE_BUDDIES);
          }}
          OnAdvocacy={() => {
            handleChangeProgram(AssignedProgram.ADVOCACY);
          }}
          OnOperationWellness={() => {
            handleChangeProgram(AssignedProgram.OPERATION_WELLNESS);
          }}
        />
        <div className={styles.filterSort}>
          <div>Filter by</div>
          <CustomDropdown
            options={["Role", "Program", "None"]}
            toggleDropdown={() => {
              setFilterDropdownOpen((prev) => !prev);
            }}
            isOpen={filterDropdownOpen}
            onSelect={(option) => {
              setFilterDropdownValue(option);
            }}
            selected={filterDropdownValue}
            dropdownWidth="100"
          />
          <div>Sort by</div>
          <CustomDropdown
            options={["Assignment", "Program", "None"]}
            toggleDropdown={() => {
              setSortDropdownOpen((prev) => !prev);
            }}
            isOpen={sortDropdownOpen}
            onSelect={(option) => {
              setSortDropdownValue(option);
            }}
            selected={sortDropdownValue}
            dropdownWidth="130"
          />
        </div>
      </div>
      <div className={styles.table}>
        <div className={styles.tableContent}>
          <div className={styles.tableHeader}>
            <div className={styles.verticalDivider}></div>
            <div className={styles.allMember}>
              <span className={styles.tableHeaderText}>All Members</span>
            </div>
            <div className={styles.role}>
              <span className={styles.tableHeaderText}>Role</span>
            </div>
            <div className={styles.program}>
              <span className={styles.tableHeaderText}>Program</span>
            </div>
            <div className={styles.assigned}>
              <span className={styles.tableHeaderText}>Assigned to</span>
            </div>
          </div>
          <div className={styles.tableItems}>
            {users.slice(page * pageSize, (page + 1) * pageSize).map((user) => (
              <AdminStaffUserItem
                key={user._id}
                user={{
                  _id: user._id,
                  email: user.email,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  zipCode: user.zipCode,
                  role: user.role,
                  assignedPrograms: user.assignedPrograms,
                  assignedUsers: user.assignedUsers,
                }}
                openDialog={() => {
                  setDialogUsers(user);
                  openDialog();
                }}
              />
            ))}
          </div>
        </div>
      </div>
      {users.length > 8 && (
        <div className={styles.pageSelect}>
          {page === Math.floor((users.length - 1) / pageSize) ? (
            <div className={styles.arrowBoxDisabled}>
              <Image
                src="/caret_right_disabled.svg"
                alt="Right Arrow"
                width={20}
                height={20}
              ></Image>
            </div>
          ) : (
            <div
              className={styles.arrowBox}
              onClick={() => {
                setPage(page + 1);
              }}
            >
              <Image src="/caret_right.svg" alt="Right Arrow" width={20} height={20}></Image>
            </div>
          )}
          <span
            className={styles.pageNumber}
          >{`${(page + 1).toString()} of ${Math.ceil(users.length / pageSize).toString()}`}</span>
          {page === 0 ? (
            <div className={styles.arrowBoxDisabled}>
              <Image src="/caret_left_disabled.svg" alt="Left Arrow" width={20} height={20}></Image>
            </div>
          ) : (
            <div
              className={styles.arrowBox}
              onClick={() => {
                setPage(page - 1);
              }}
            >
              <Image src="/caret_left.svg" alt="Left Arrow" width={20} height={20}></Image>
            </div>
          )}
        </div>
      )}
      {isDialogOpen && dialogUser?.assignedPrograms && (
        <UserAssigningDialog
          isOpen={isDialogOpen}
          program={dialogUser.assignedPrograms}
          user={dialogUser}
          closeDialog={closeDialog}
          setMessage={setMessage}
          context={DialogContext.ADMIN_DASHBOARD}
        />
      )}
      {message && (
        <div
          className={`${styles.messageContainer} ${message.includes("Successfully") ? styles.messageSuccess : styles.messageError}`}
        >
          {message.includes("Successfully") ? (
            <Image src="/check.svg" alt="Check Symbol" width={20} height={20}></Image>
          ) : (
            <Image src="/error_symbol.svg" alt="Error Symbol" width={20} height={20}></Image>
          )}
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}
