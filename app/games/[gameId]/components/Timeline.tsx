"use client";

import React from "react";
import styles from "../game.module.css";
import { EventCardReveal } from "@/types/game";

interface TimelineProps {
  cards: EventCardReveal[];
  selectedPosition: number | null;
  onSelectPosition: (position: number) => void;
}

const Timeline: React.FC<TimelineProps> = ({ cards, selectedPosition, onSelectPosition }) => {
  const elements: React.ReactNode[] = [];

  for (let i = 0; i <= cards.length; i++) {
    const selected = selectedPosition === i;

    elements.push(
      <div key={`ins-${i}`} className={styles.insertMarker} onClick={() => onSelectPosition(i)}>
        <div className={selected ? styles.insertDotSelected : styles.insertDot}>
          {selected && <span className={styles.insertDotPlus}>+</span>}
        </div>
        <div className={selected ? styles.insertLineSelected : styles.insertLine} />
      </div>
    );

    if (i < cards.length) {
      elements.push(
        <div key={`card-${i}`} className={styles.timelineCard}>
          <div className={styles.timelineCardBox}>
            <span className={styles.timelineCardTitle}>{cards[i].title}</span>
          </div>
          <span className={styles.timelineCardYear}>{cards[i].year}</span>
        </div>
      );
    }
  }

  return (
    <div className={styles.timeline}>
      <div className={styles.timelineInner}>{elements}</div>
    </div>
  );
};

export default Timeline;
