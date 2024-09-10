import React, { useRef, useEffect } from "react";
import styles from "./FootballPitch.module.css";

const FootballPitch = ({ formation, selectedPlayers }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    drawPitch(ctx, rect.width, rect.height);
    if (formation) {
      drawPlayers(ctx, rect.width, rect.height, formation, selectedPlayers);
    }
  }, [formation, selectedPlayers]);

  const drawPitch = (ctx, width, height) => {
    // Grass texture
    const grassPattern = ctx.createLinearGradient(0, 0, 0, height);
    grassPattern.addColorStop(0, "#038c03");
    grassPattern.addColorStop(1, "#025902");
    ctx.fillStyle = grassPattern;
    ctx.fillRect(0, 0, width, height);

    // Field lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.lineWidth = 2;

    // Outline
    ctx.strokeRect(0, 0, width, height);

    // Halfway line
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();

    // Center circle
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, height / 10, 0, Math.PI * 2);
    ctx.stroke();

    // Penalty areas
    const penaltyAreaWidth = width / 5;
    const penaltyAreaHeight = height / 2.5;
    ctx.strokeRect(
      0,
      (height - penaltyAreaHeight) / 2,
      penaltyAreaWidth,
      penaltyAreaHeight
    );
    ctx.strokeRect(
      width - penaltyAreaWidth,
      (height - penaltyAreaHeight) / 2,
      penaltyAreaWidth,
      penaltyAreaHeight
    );

    // Goal areas
    const goalAreaWidth = width / 10;
    const goalAreaHeight = height / 5;
    ctx.strokeRect(
      0,
      (height - goalAreaHeight) / 2,
      goalAreaWidth,
      goalAreaHeight
    );
    ctx.strokeRect(
      width - goalAreaWidth,
      (height - goalAreaHeight) / 2,
      goalAreaWidth,
      goalAreaHeight
    );

    // Goals
    ctx.lineWidth = 4;
    ctx.strokeStyle = "white";
    ctx.strokeRect(-2, height / 2 - height / 20, 2, height / 10);
    ctx.strokeRect(width, height / 2 - height / 20, 2, height / 10);
  };

  const drawPlayers = (ctx, width, height, formation, selectedPlayers) => {
    if (!formation || !formation.name || !formation.position) return;

    const formationLines = formation.name.split("-").map(Number);
    const totalLines = formationLines.length;
    const positions = formation.position;

    // Draw goalkeeper first
    const goalkeeperPos = positions[0];
    drawPlayer(
      ctx,
      width * 0.05,
      height / 2,
      goalkeeperPos,
      selectedPlayers ? selectedPlayers[0] : null
    );

    let currentIndex = 1;
    for (let line = 0; line < totalLines; line++) {
      const playersInLine = formationLines[line];
      for (let i = playersInLine - 1; i >= 0; i--) {
        // Reverse the order within each line
        const x = width * (0.2 + 0.6 * (line / (totalLines - 1)));
        const y = height * ((i + 1) / (playersInLine + 1));
        const pos = positions[currentIndex];
        const selectedPlayer = selectedPlayers
          ? selectedPlayers[currentIndex]
          : null;
        drawPlayer(ctx, x, y, pos, selectedPlayer);
        currentIndex++;
      }
    }
  };

  const drawPlayer = (ctx, x, y, position, player) => {
    // Player circle
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.fill();
    ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Position letter or shirt number
    ctx.fillStyle = "#000";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(player ? player.shirt_number : position.index, x, y);

    // Player name or position name
    const displayName = player
      ? player.display_name || player.name
      : position.name;
    ctx.fillStyle = "white";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(displayName, x, y + 20);
  };

  return (
    <div className={styles.pitchContainer}>
      <canvas ref={canvasRef} className={styles.pitch} />
    </div>
  );
};

export default FootballPitch;
