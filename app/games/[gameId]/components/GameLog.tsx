"use client";

import React from "react";
import styles from "../game.module.css";

interface LogEntry {
  player: string;
  action: string;
}

const GameLog: React.FC<{ logs: LogEntry[] }> = ({ logs }) => (
  <div className={styles.logPanel}>
    <h3 className={styles.panelTitle}>Game Log</h3>
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {logs.map((log, i) => (
        <div key={i} className={styles.logEntry}>
          <span className={styles.logPlayer}>{log.player}</span>
          <span className={styles.logAction}>{log.action}</span>
        </div>
      ))}
    </div>
  </div>
);

export default GameLog;
