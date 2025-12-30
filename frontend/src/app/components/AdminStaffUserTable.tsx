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
import ErrorMessage from "./ErrorMessage";
import SuccessNotification from "./SuccessNotification";
import { Tabs } from "./Tabs";
import UserAssigningDialog, { DialogContext } from "./userAssigningDialog";

export function AdminStaffUserTable() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [page, setPage] = useState<number>(0);
  const [selectedProgram, setSelectedProgram] = useState<ProgramEnum | undefined>(undefined);
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

  const compareFirstName = (a: UserProfile, b: UserProfile) => {
    if (a.firstName < b.firstName) return -1;
    if (a.firstName > b.firstName) return 1;
    return 0;
  };

  // sorts by putting unassigned at front, then alphabetically by first name
  const sortUsersDefault = (userList: UserProfile[]) => {
    const unassigned: UserProfile[] = [];
    const assigned: UserProfile[] = [];
    userList.forEach((user) => {
      if (user.assignedUsers?.length === 0 && user.role !== RoleEnum.STAFF) {
        unassigned.push(user);
      } else {
        assigned.push(user);
      }
    });
    unassigned.sort(compareFirstName);
    assigned.sort(compareFirstName);
    unassigned.push(...assigned);
    return unassigned;
  };

  const sortByAssignment = (userList: UserProfile[]) => {
    return userList.sort((a, b) => {
      const aCount = a.assignedUsers ? a.assignedUsers.length : 0;
      const bCount = b.assignedUsers ? b.assignedUsers.length : 0;
      const diff = aCount - bCount;
      if (diff === 0) {
        return compareFirstName(a, b);
      }
      return diff;
    });
  };

  const sortByProgram = (userList: UserProfile[]) => {
    const battleBuddies: UserProfile[] = [];
    const advocacy: UserProfile[] = [];
    const operationWellness: UserProfile[] = [];
    const unassigned: UserProfile[] = [];
    userList.forEach((user) => {
      if (user.assignedPrograms?.includes(AssignedProgram.BATTLE_BUDDIES)) {
        battleBuddies.push(user);
      } else if (user.assignedPrograms?.includes(AssignedProgram.ADVOCACY)) {
        advocacy.push(user);
      } else if (user.assignedPrograms?.includes(AssignedProgram.OPERATION_WELLNESS)) {
        operationWellness.push(user);
      } else {
        unassigned.push(user);
      }
    });
    const sortedBattleBuddies = sortUsersDefault(battleBuddies);
    const sortedAdvocacy = sortUsersDefault(advocacy);
    const sortedOperationWellness = sortUsersDefault(operationWellness);
    unassigned.sort(compareFirstName);
    const combinedList = unassigned;
    combinedList.push(...sortedBattleBuddies);
    combinedList.push(...sortedAdvocacy);
    combinedList.push(...sortedOperationWellness);
    return combinedList;
  };

  const sort = (userList: UserProfile[], sortType: string) => {
    if (sortType === "Assignment") {
      return sortByAssignment(userList);
    } else if (sortType === "Program") {
      return sortByProgram(userList);
    } else {
      return sortUsersDefault(userList);
    }
  };

  const roleOptionToRoleEnum = (roleOption: string) => {
    if (roleOption === "Volunteer") {
      return RoleEnum.VOLUNTEER;
    } else if (roleOption === "Veteran") {
      return RoleEnum.VETERAN;
    } else if (roleOption === "Staff") {
      return RoleEnum.STAFF;
    }
    return RoleEnum.ADMIN;
  };

  const filterRole = (userList: UserProfile[], filteredRole: string) => {
    if (filteredRole === "None") {
      return userList;
    } else {
      return userList.filter((user) => user.role === roleOptionToRoleEnum(filteredRole));
    }
  };

  useEffect(() => {
    getNonAdminUsers()
      .then((result) => {
        if (result.success) {
          const sortedList = sortUsersDefault(result.data);
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

  useEffect(() => {
    let currUsers = allUsers;
    if (selectedProgram) {
      currUsers = allUsers.filter((user) => user.assignedPrograms?.includes(selectedProgram));
    }
    currUsers = filterRole(currUsers, filterDropdownValue);
    currUsers = sort(currUsers, sortDropdownValue);
    setUsers(currUsers);
    setPage(0);
  }, [selectedProgram, filterDropdownValue, sortDropdownValue]);

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
          tabs={["All", "Battle Buddies", "Advocacy", "Operation Wellness"]}
          handlers={[
            () => {
              setSelectedProgram(undefined);
            },
            () => {
              setSelectedProgram(AssignedProgram.BATTLE_BUDDIES);
            },
            () => {
              setSelectedProgram(AssignedProgram.ADVOCACY);
            },
            () => {
              setSelectedProgram(AssignedProgram.OPERATION_WELLNESS);
            },
          ]}
        />
        <div className={styles.filterSort}>
          <div>Filter by</div>
          <CustomDropdown
            options={["Veteran", "Volunteer", "Staff", "None"]}
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
      {message &&
        (message.includes("Successfully") ? (
          <SuccessNotification message={message} />
        ) : (
          <ErrorMessage message={message} />
        ))}
    </div>
  );
}
