import React from "react";
import styles from "./SavedLineups.module.css";

const SavedLineups = ({ lineups }) => {
  if (lineups.length === 0) {
    return <div className={styles.noLineups}>No lineups saved yet.</div>;
  }

  return (
    <div className={styles.savedLineups}>
      {lineups.map((lineup, index) => (
        <div key={index} className={styles.lineup}>
          <h3>{lineup.team} Team</h3>
          <p>Formation: {lineup.formation || "Not selected"}</p>
          <ul>
            {lineup.players.map((player, playerIndex) => (
              <li key={playerIndex}>
                {player ? (
                  <>
                    {player.shirt_number && `#${player.shirt_number} `}
                    {player.display_name || player.name}
                  </>
                ) : (
                  "Empty"
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default SavedLineups;
