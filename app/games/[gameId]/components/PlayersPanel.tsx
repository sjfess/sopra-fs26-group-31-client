"use client";

import React from "react";
import styles from "../play/game.module.css";
import { GamePlayerScore } from "@/types/game";

interface PlayersPanelProps {
  scores: GamePlayerScore[];
  currentUserId: number;
}

const PlayersPanel: React.FC<PlayersPanelProps> = ({ scores, currentUserId }) => (
  <div className={styles.panel}>
    <h3 className={styles.panelTitle}>Players</h3>
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {scores.map((p) => (
        <div key={p.userId} className={styles.playerRow}>
          <div className={styles.playerAvatar}>{p.username.charAt(0).toUpperCase()}</div>
          <div>
            <div className={styles.playerName}>
              {p.username}
              {p.userId === currentUserId ? " (You)" : ""}
            </div>
            <div className={p.activeTurn ? styles.playerStatusOnline : styles.playerStatusOffline}>
              {p.activeTurn ? "Active Turn" : `${p.score} pts`}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default PlayersPanel;
