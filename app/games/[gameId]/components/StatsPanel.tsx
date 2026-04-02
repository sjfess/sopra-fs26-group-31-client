"use client";

import React from "react";
import styles from "../game.module.css";

const StatsPanel: React.FC<{ score: number; timer: number; round: number }> = ({ score, timer, round }) => (
  <div className={styles.panel}>
    <h3 className={styles.panelTitle}>Stats</h3>
    <div className={styles.statRow}>
      <span className={styles.statLabel}>Score</span>
      <span className={styles.statValue}>{score} points</span>
    </div>
    <div className={styles.statRow}>
      <span className={styles.statLabel}>Timer</span>
      <span className={styles.statValue}>{timer} sec</span>
    </div>
    <div className={styles.statRowLast}>
      <span className={styles.statLabel}>Round</span>
      <span className={styles.statValue}>{round}</span>
    </div>
  </div>
);

export default StatsPanel;
