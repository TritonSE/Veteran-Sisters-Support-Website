import { useState } from "react";

import styles from "./Tabs.module.css";

type TabsProp = {
  OnAll: () => void;
  OnBattleBuddies: () => void;
  OnAdvocacy: () => void;
  OnOperationWellness: () => void;
};

export function Tabs({ OnAll, OnBattleBuddies, OnAdvocacy, OnOperationWellness }: TabsProp) {
  const [tab, setTab] = useState<string>("all");

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabs}>
        <div
          className={tab === "all" ? styles.selectedTabItem : styles.tabItem}
          onClick={() => {
            OnAll();
            setTab("all");
          }}
        >
          <span>All</span>
        </div>
        <div
          className={tab === "battle buddies" ? styles.selectedTabItem : styles.tabItem}
          onClick={() => {
            OnBattleBuddies();
            setTab("battle buddies");
          }}
        >
          <span>Battle Buddies</span>
        </div>
        <div
          className={tab === "advocacy" ? styles.selectedTabItem : styles.tabItem}
          onClick={() => {
            OnAdvocacy();
            setTab("advocacy");
          }}
        >
          <span>Advocacy</span>
        </div>
        <div
          className={tab === "operation wellness" ? styles.selectedTabItem : styles.tabItem}
          onClick={() => {
            OnOperationWellness();
            setTab("operation wellness");
          }}
        >
          <span>Operation Wellness</span>
        </div>
      </div>
    </div>
  );
}
