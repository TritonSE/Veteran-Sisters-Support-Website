import Image from "next/image";
import { useEffect, useState } from "react";

import { User, getNonAdminUsers } from "../api/users";

import { AdminStaffUserItem } from "./AdminStaffUserItem";
import styles from "./AdminStaffUserTable.module.css";
import { Tabs } from "./Tabs";

export function AdminStaffUserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [page, setPage] = useState<number>(0);
  const pageSize = 8;

  const handleChangeProgram = (program: string) => {
    if (program === "all") {
      setUsers(allUsers);
    } else {
      setUsers(allUsers.filter((user) => user.assignedPrograms.includes(program)));
    }
    setPage(0);
  };

  const compare = (a: User, b: User) => {
    if (a.firstName < b.firstName) return -1;
    if (a.firstName > b.firstName) return 1;
    return 0;
  };

  const sortUsers = (userList: User[]) => {
    const unassigned: User[] = [];
    const assigned: User[] = [];
    userList.forEach((user) => {
      if (user.assignedUsers.length === 0 && user.role !== "staff") {
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
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.member}>
        <span className={styles.memberTitle}>Members</span>
        <div className={styles.memberCountFrame}>
          <span>{allUsers.length}</span>
        </div>
      </div>
      <Tabs
        OnAll={() => {
          handleChangeProgram("all");
        }}
        OnBattleBuddies={() => {
          handleChangeProgram("battle buddies");
        }}
        OnAdvocacy={() => {
          handleChangeProgram("advocacy");
        }}
        OnOperationWellness={() => {
          handleChangeProgram("operation wellness");
        }}
      />
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
          {users.slice(page * pageSize, (page + 1) * pageSize).map((user) => (
            <AdminStaffUserItem
              key={user._id}
              user={{
                _id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                assignedPrograms: user.assignedPrograms,
                assignedUsers: user.assignedUsers,
              }}
            />
          ))}
        </div>
      </div>
      {users.length > 8 && (
        <div className={styles.pageSelect}>
          {page === Math.floor(users.length / pageSize) ? (
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
    </div>
  );
}
