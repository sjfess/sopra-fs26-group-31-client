"use client";

import React from "react";
import { Button } from "antd";
import styles from "../game.module.css";

interface CurrentCardProps {
  card: { title: string; imageUrl: string } | null;
  onPlace: () => void;
  onEarlier: () => void;
  onLater: () => void;
}

const CurrentCard: React.FC<CurrentCardProps> = ({ card, onPlace, onEarlier, onLater }) => {
  if (!card) return <div className={styles.waitingText}>Waiting for your turn...</div>;

  return (
    <div className={styles.currentCardSection}>
      <span className={styles.currentCardLabel}>Current Card</span>
      <div className={styles.currentCardRow}>
        <Button className={styles.goldBtn} onClick={onEarlier}>Earlier</Button>
        <div className={styles.currentCardBox}>
          <span className={styles.currentCardTitle}>{card.title}</span>
        </div>
        <Button className={styles.goldBtn} onClick={onLater}>Later</Button>
      </div>
      <Button className={styles.placeBtn} onClick={onPlace}>Place Card</Button>
    </div>
  );
};

export default CurrentCard;
