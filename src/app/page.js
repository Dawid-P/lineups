"use client";

import React, { useState, useEffect } from "react";
import Slots from "./components/slots/Slots";
import Sidebar from "./components/Sidebar";
import styles from "./page.module.css";

const MainPage = () => {
  const [savedLineups, setSavedLineups] = useState({
    Home: null,
    Away: null,
  });
  const [formations, setFormations] = useState([]);

  useEffect(() => {
    // Load formations data
    const loadFormations = async () => {
      try {
        const response = await fetch("/data/formations.json");
        if (!response.ok) {
          throw new Error("Failed to fetch formations");
        }
        const data = await response.json();
        setFormations(data.formation);
      } catch (error) {
        console.error("Error loading formations:", error);
      }
    };

    loadFormations();
  }, []);

  const handleSaveLineup = (lineup) => {
    setSavedLineups((prevLineups) => ({
      ...prevLineups,
      [lineup.team]: lineup,
    }));
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.slotsContainer}>
        <Slots onSaveLineup={handleSaveLineup} formations={formations} />
      </div>
      <div className={styles.sidebarContainer}>
        <Sidebar
          savedLineups={Object.values(savedLineups).filter(Boolean)}
          formations={formations}
        />
      </div>
    </div>
  );
};

export default MainPage;
