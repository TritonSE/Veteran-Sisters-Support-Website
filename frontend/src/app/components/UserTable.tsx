import Image from "next/image";
import { useEffect, useState } from "react";

import { User, getNonAdminUsers } from "../api/users";

import { UserItem } from "./UserItem";
import styles from "./UserTable.module.css";

//TODO sorted list
export function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [tab, setTab] = useState<string>("all");
  const [userCount, setUserCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const pageSize = 8;

  const handleChangeProgram = (program: string) => {
    if (program === "all") {
      getNonAdminUsers()
        .then((result) => {
          if (result.success) {
            setUsers(result.data);
            setTab(program);
            setPage(0);
          } else {
            alert(result.error);
          }
        })
        .catch((reason: unknown) => {
          alert(reason);
        });
    } else {
      getNonAdminUsers(program)
        .then((result) => {
          if (result.success) {
            setUsers(result.data);
            setTab(program);
            setPage(0);
          } else {
            alert(result.error);
          }
        })
        .catch((reason: unknown) => {
          alert(reason);
        });
    }
  };

  useEffect(() => {
    handleChangeProgram("all");
  }, []);

  useEffect(() => {
    setUserCount(Math.max(userCount, users.length));
  }, [users]);

  return (
    <div className={styles.container}>
      <div className={styles.member}>
        <span className={styles.memberTitle}>Members</span>
        <div className={styles.memberCountFrame}>
          <span>{userCount}</span>
        </div>
      </div>
      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          <div
            className={tab === "all" ? styles.selectedTabItem : styles.tabItem}
            onClick={() => {
              handleChangeProgram("all");
            }}
          >
            <span>All</span>
          </div>
          <div
            className={tab === "battle buddies" ? styles.selectedTabItem : styles.tabItem}
            onClick={() => {
              handleChangeProgram("battle buddies");
            }}
          >
            <span>Battle Buddies</span>
          </div>
          <div
            className={tab === "advocacy" ? styles.selectedTabItem : styles.tabItem}
            onClick={() => {
              handleChangeProgram("advocacy");
            }}
          >
            <span>Advocacy</span>
          </div>
          <div
            className={tab === "operation wellness" ? styles.selectedTabItem : styles.tabItem}
            onClick={() => {
              handleChangeProgram("operation wellness");
            }}
          >
            <span>Operation Wellness</span>
          </div>
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
          {users.slice(page * pageSize, (page + 1) * pageSize).map((user) => (
            <UserItem
              key={user._id}
              user={{
                _id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                assignedPrograms: user.assignedPrograms,
                assignedVeterans: user.assignedVeterans,
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
