"use client";

import React, { useState, useEffect, useRef } from "react";
import PlayerSlot from "./PlayerSlot";
import PlayerSelector from "./PlayerSelector";
import FormationSelector from "./FormationSelector";
import styles from "./Slots.module.css";

const Slots = ({ onSaveLineup }) => {
  const [homePlayers, setHomePlayers] = useState([]);
  const [awayPlayers, setAwayPlayers] = useState([]);
  const [selectedHomePlayers, setSelectedHomePlayers] = useState(
    Array(11).fill(null)
  );
  const [selectedAwayPlayers, setSelectedAwayPlayers] = useState(
    Array(11).fill(null)
  );
  const [homeFormation, setHomeFormation] = useState("");
  const [awayFormation, setAwayFormation] = useState("");
  const [formations, setFormations] = useState([]);
  const [activeSlot, setActiveSlot] = useState(null);
  const [activeTeam, setActiveTeam] = useState(null);
  const slotsRef = useRef(null);
  const activeSelectorRef = useRef(null);

  useEffect(() => {
    // Load players data
    const loadPlayers = async () => {
      try {
        const homeResponse = await fetch("/data/lech.json");
        const awayResponse = await fetch("/data/legia.json");

        if (!homeResponse.ok || !awayResponse.ok) {
          throw new Error("Failed to fetch player data");
        }

        const homeData = await homeResponse.json();
        const awayData = await awayResponse.json();

        setHomePlayers(homeData.GetPlayerListByTeamId.players || []);
        setAwayPlayers(awayData.GetPlayerListByTeamId.players || []);
      } catch (error) {
        console.error("Error loading player data:", error);
      }
    };

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

    loadPlayers();
    loadFormations();

    const handleClickOutside = (event) => {
      if (slotsRef.current && !slotsRef.current.contains(event.target)) {
        setActiveSlot(null);
        setActiveTeam(null);
      } else if (
        activeSelectorRef.current &&
        !activeSelectorRef.current.contains(event.target)
      ) {
        setActiveSlot(null);
        setActiveTeam(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getPositionsForFormation = (formationId) => {
    const formation = formations.find((f) => f.id === parseInt(formationId));
    return formation ? formation.position : [];
  };

  const handleFormationSelect = (team, formationId) => {
    const formation = formations.find((f) => f.id === parseInt(formationId));
    if (!formation) return;

    const updatedPlayers = (
      team === "home" ? selectedHomePlayers : selectedAwayPlayers
    ).map((player, index) => {
      const position = formation.position.find((p) => p.index === index + 1);
      return player
        ? { ...player, position: position ? position.name : null }
        : null;
    });

    if (team === "home") {
      setHomeFormation(formationId);
      setSelectedHomePlayers(updatedPlayers);
    } else {
      setAwayFormation(formationId);
      setSelectedAwayPlayers(updatedPlayers);
    }
  };

  const handleSlotClick = (index, team) => {
    if (activeSlot === index && activeTeam === team) {
      setActiveSlot(null);
      setActiveTeam(null);
    } else {
      setActiveSlot(index);
      setActiveTeam(team);
    }
  };

  const handleSelect = (player) => {
    const updatedPlayers =
      activeTeam === "home"
        ? [...selectedHomePlayers]
        : [...selectedAwayPlayers];
    const formation = formations.find(
      (f) =>
        f.id === parseInt(activeTeam === "home" ? homeFormation : awayFormation)
    );
    const position = formation
      ? formation.position.find((p) => p.index === activeSlot + 1)
      : null;

    updatedPlayers[activeSlot] = {
      ...player,
      position: position ? position.name : null,
    };

    if (activeTeam === "home") {
      setSelectedHomePlayers(updatedPlayers);
    } else {
      setSelectedAwayPlayers(updatedPlayers);
    }
  };

  const handleSaveLineup = (team) => {
    const lineup = {
      team: team,
      players: team === "Home" ? selectedHomePlayers : selectedAwayPlayers,
      formation: team === "Home" ? homeFormation : awayFormation,
    };
    onSaveLineup(lineup);
  };

  const filterPlayers = (teamPlayers, selectedPlayers) => {
    return teamPlayers.filter(
      (player) =>
        !selectedPlayers.some(
          (selectedPlayer) =>
            selectedPlayer &&
            selectedPlayer.plain_player_id === player.plain_player_id
        )
    );
  };

  const renderTeamSlots = (teamPlayers, selectedPlayers, team) => {
    const formationId = team === "home" ? homeFormation : awayFormation;
    const positions = getPositionsForFormation(formationId);

    return (
      <div className={styles.teamContainer}>
        <div className={styles.teamHeader}>
          <h2>{team === "home" ? "Home Team" : "Away Team"}</h2>
          <FormationSelector
            onSelect={(formationId) => handleFormationSelect(team, formationId)}
            currentFormation={formationId}
            formations={formations}
          />
        </div>
        <div className={styles.slotsContainer}>
          {Array(11)
            .fill()
            .map((_, index) => (
              <PlayerSlot
                key={`${team}-${index}`}
                index={index}
                player={selectedPlayers[index]}
                position={positions[index] ? positions[index].name : null}
                onClick={() => handleSlotClick(index, team)}
                isActive={activeSlot === index && activeTeam === team}
              >
                {activeSlot === index && activeTeam === team && (
                  <PlayerSelector
                    players={filterPlayers(teamPlayers, selectedPlayers)}
                    onSelect={handleSelect}
                    ref={activeSelectorRef}
                  />
                )}
              </PlayerSlot>
            ))}
        </div>
        <button
          onClick={() => handleSaveLineup(team === "home" ? "Home" : "Away")}
          className={styles.saveButton}
        >
          Save {team === "home" ? "Home" : "Away"} Lineup
        </button>
      </div>
    );
  };

  return (
    <div ref={slotsRef}>
      {renderTeamSlots(homePlayers, selectedHomePlayers, "home")}
      {renderTeamSlots(awayPlayers, selectedAwayPlayers, "away")}
    </div>
  );
};

export default Slots;
