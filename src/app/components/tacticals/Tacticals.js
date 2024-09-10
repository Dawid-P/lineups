import React, { useState, useEffect } from "react";
import FootballPitch from "./FootballPitch";
import styles from "./Tacticals.module.css";

const Tacticals = ({ homeTeam, awayTeam, formations }) => {
  const [homeFormation, setHomeFormation] = useState(null);
  const [awayFormation, setAwayFormation] = useState(null);
  const [homeTeamPlayers, setHomeTeamPlayers] = useState([]);
  const [awayTeamPlayers, setAwayTeamPlayers] = useState([]);

  useEffect(() => {
    if (homeTeam && homeTeam.formation && formations) {
      const formation = formations.find(
        (f) => f.id === parseInt(homeTeam.formation)
      );
      setHomeFormation(formation);
      setHomeTeamPlayers(mapPlayersToFormation(homeTeam.players, formation));
    }
  }, [homeTeam, formations]);

  useEffect(() => {
    if (awayTeam && awayTeam.formation && formations) {
      const formation = formations.find(
        (f) => f.id === parseInt(awayTeam.formation)
      );
      setAwayFormation(formation);
      setAwayTeamPlayers(mapPlayersToFormation(awayTeam.players, formation));
    }
  }, [awayTeam, formations]);

  const mapPlayersToFormation = (players, formation) => {
    if (!formation || !formation.position) return [];

    return formation.position.map((pos, index) => {
      const player = players[index];
      return player
        ? {
            ...player,
            shirt_number: player.shirt_number || pos.index,
            display_name: player.display_name || player.name || pos.name,
          }
        : null;
    });
  };

  return (
    <div className={styles.tacticalsContainer}>
      <div className={styles.pitchContainer}>
        <h2>Home Team</h2>
        {homeFormation ? (
          <FootballPitch
            formation={homeFormation}
            selectedPlayers={homeTeamPlayers}
          />
        ) : (
          <p>No formation selected for Home Team</p>
        )}
      </div>

      <div className={styles.pitchContainer}>
        <h2>Away Team</h2>
        {awayFormation ? (
          <FootballPitch
            formation={awayFormation}
            selectedPlayers={awayTeamPlayers}
          />
        ) : (
          <p>No formation selected for Away Team</p>
        )}
      </div>
    </div>
  );
};

export default Tacticals;
