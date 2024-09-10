import React, { useState, useEffect, forwardRef } from "react";
import styles from "./PlayerSelector.module.css";

const PlayerSelector = forwardRef(({ players, onSelect }, ref) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPlayers, setFilteredPlayers] = useState(players);

  useEffect(() => {
    setFilteredPlayers(
      players.filter((player) => {
        const nameMatch = (player.display_name || player.name)
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

        const numberMatch =
          player.shirt_number && player.shirt_number.toString() === searchTerm;

        return nameMatch || numberMatch;
      })
    );
  }, [searchTerm, players]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className={styles.playerSelector} ref={ref}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search player"
        className={styles.searchInput}
        autoFocus
      />
      <ul className={styles.playerList}>
        {filteredPlayers.map((player) => (
          <li
            key={player.plain_player_id}
            onClick={() => onSelect(player)}
            className={styles.playerItem}
          >
            <span className={styles.shirtNumber}>
              {player.shirt_number || "?"}
            </span>
            <span className={styles.playerName}>
              {player.display_name || player.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
});

PlayerSelector.displayName = "PlayerSelector";

export default PlayerSelector;
