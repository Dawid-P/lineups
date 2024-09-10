import React from "react";
import styles from "./FormationSelector.module.css";

const FormationSelector = ({ onSelect, currentFormation, formations }) => {
  return (
    <div className={styles.formationSelector}>
      <label className={styles.label} htmlFor="formation-select">
        Formation:
      </label>
      <select
        id="formation-select"
        value={currentFormation}
        onChange={(e) => onSelect(e.target.value)}
        className={styles.select}
      >
        <option value="">Select Formation</option>
        {formations.map((formation) => (
          <option key={formation.id} value={formation.id}>
            {formation.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FormationSelector;
