"use client";

import React, { useState } from "react";
import Tacticals from "./tacticals/Tacticals";
import MatchOfficials from "./matchofficials/MatchOfficials";
import SavedLineups from "./savedlineups/SavedLineups";
import styles from "./Sidebar.module.css";

const Sidebar = ({ savedLineups, formations = [] }) => {
  const [activeTab, setActiveTab] = useState("tacticals");

  const homeTeam = savedLineups.find((lineup) => lineup.team === "Home") || {
    players: [],
    formation: null,
  };
  const awayTeam = savedLineups.find((lineup) => lineup.team === "Away") || {
    players: [],
    formation: null,
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.tabs}>
        <button
          onClick={() => setActiveTab("tacticals")}
          className={activeTab === "tacticals" ? styles.active : ""}
        >
          Tacticals
        </button>
        <button
          onClick={() => setActiveTab("matchOfficials")}
          className={activeTab === "matchOfficials" ? styles.active : ""}
        >
          Match Officials
        </button>
        <button
          onClick={() => setActiveTab("savedLineups")}
          className={activeTab === "savedLineups" ? styles.active : ""}
        >
          Saved Lineups
        </button>
      </div>
      <div className={styles.tabContent}>
        {activeTab === "tacticals" && (
          <Tacticals
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            formations={formations}
          />
        )}
        {activeTab === "matchOfficials" && <MatchOfficials />}
        {activeTab === "savedLineups" && (
          <SavedLineups lineups={savedLineups} />
        )}
      </div>
    </div>
  );
};

export default Sidebar;
