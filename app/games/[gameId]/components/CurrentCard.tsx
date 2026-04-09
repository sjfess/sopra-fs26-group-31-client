"use client";

import React from "react";
import { Button } from "antd";
import styles from "../play/game.module.css";
import { EventCardGet } from "@/types/game";

interface CurrentCardProps {
  drawnCard: EventCardGet | null;
  isMyTurn: boolean;
  onDraw: () => void;
  drawing?: boolean;
  onPlace: () => void;
  onEarlier: () => void;
  onLater: () => void;
  placing?: boolean;
  disabled?: boolean;
}

const CurrentCard: React.FC<CurrentCardProps> = ({
  drawnCard,
  isMyTurn,
  onDraw,
  drawing,
  onPlace,
  onEarlier,
  onLater,
  placing,
  disabled,
}) => {
  if (!isMyTurn) {
    return <div className={styles.waitingText}>Waiting for your turn...</div>;
  }

  if (!drawnCard) {
    return (
      <div className={styles.currentCardSection}>
        <Button className={styles.goldBtn} onClick={onDraw} loading={drawing}>
          Draw Card
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.currentCardSection}>
      <div className={styles.currentCardRow}>
        <Button className={styles.goldBtn} onClick={onEarlier}>Earlier</Button>
        <div className={styles.currentCardBox}>
          <span className={styles.currentCardTitle}>{drawnCard.title}</span>
        </div>
        <Button className={styles.goldBtn} onClick={onLater}>Later</Button>
      </div>
      <Button
        className={styles.placeBtn}
        onClick={onPlace}
        loading={placing}
        disabled={disabled}
      >
        Place Card
      </Button>
    </div>
  );
};

export default CurrentCard;
