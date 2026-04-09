"use client";

import React from "react";
import styles from "../play/game.module.css";

interface StatsPanelProps {
  score: number;
  cardsRemaining: number;
  streak: number;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ score, cardsRemaining, streak }) => (
  <div className={styles.panel}>
    <h3 className={styles.panelTitle}>Stats</h3>
    <div className={styles.statRow}>
      <span className={styles.statLabel}>Score</span>
      <span className={styles.statValue}>{score} points</span>
    </div>
    <div className={styles.statRow}>
      <span className={styles.statLabel}>Cards Left</span>
      <span className={styles.statValue}>{cardsRemaining}</span>
    </div>
    <div className={styles.statRowLast}>
      <span className={styles.statLabel}>Streak</span>
      <span className={styles.statValue}>{streak}</span>
    </div>
  </div>
);

export default StatsPanel;
