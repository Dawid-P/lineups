import React from "react";
import styles from "./PlayerSlot.module.css";

const PlayerSlot = ({
  index,
  player,
  position,
  onClick,
  isActive,
  children,
}) => {
  return (
    <div
      className={`${styles.slot} ${isActive ? styles.active : ""}`}
      onClick={onClick}
    >
      <div className={styles.playerInfo}>
        {player ? (
          <>
            <span className={styles.shirtNumber}>
              {player.shirt_number || "?"}
            </span>
            <span className={styles.playerName}>
              {player.display_name || player.name}
            </span>
          </>
        ) : (
          <span className={styles.emptySlot}>Player {index + 1}</span>
        )}
        {position && <span className={styles.position}>{position}</span>}
      </div>
      <div className={styles.selectorWrapper}>{children}</div>
    </div>
  );
};

export default PlayerSlot;
