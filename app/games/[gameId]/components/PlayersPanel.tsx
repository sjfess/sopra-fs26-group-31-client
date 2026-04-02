"use client";

import React from "react";
import styles from "../game.module.css";

interface Player {
  id: number;
  username: string;
  initial: string;
  online: boolean;
}

const PlayersPanel: React.FC<{ players: Player[] }> = ({ players }) => (
  <div className={styles.panel}>
    <h3 className={styles.panelTitle}>Players</h3>
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {players.map((p) => (
        <div key={p.id} className={styles.playerRow}>
          <div className={styles.playerAvatar}>{p.initial}</div>
          <div>
            <div className={styles.playerName}>{p.username}</div>
            <div className={p.online ? styles.playerStatusOnline : styles.playerStatusOffline}>
              {p.online ? "Online" : "Offline"}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default PlayersPanel;
