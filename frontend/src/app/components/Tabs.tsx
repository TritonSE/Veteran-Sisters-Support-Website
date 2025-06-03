import { useState } from "react";

import styles from "./Tabs.module.css";

type TabsProp = {
  tabs: string[];
  handlers: (() => void)[];
};

export function Tabs({ tabs, handlers }: TabsProp) {
  const [tab, setTab] = useState<number>(0);
  return (
    <div className={styles.tabsContainer}>
      {tabs.map((tabName, idx) => (
        <div className={styles.tabs} key={idx}>
          <div
            className={tab === idx ? styles.selectedTabItem : styles.tabItem}
            onClick={() => {
              handlers[idx]();
              setTab(idx);
            }}
          >
            <span>{tabName}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
