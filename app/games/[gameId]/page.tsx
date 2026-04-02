"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "antd";
import PlayersPanel from "./components/PlayersPanel";
import StatsPanel from "./components/StatsPanel";
import Timeline from "./components/Timeline";
import CurrentCard from "./components/CurrentCard";
import GameLog from "./components/GameLog";
import styles from "./game.module.css";

// Dummy data for UI development
const dummyPlayers = [
  { id: 1, username: "AlexWimmert", initial: "A", online: true },
  { id: 2, username: "milchazor", initial: "M", online: true },
  { id: 3, username: "Colin_dev", initial: "C", online: true },
  { id: 4, username: "sjfess", initial: "S", online: true },
];

const dummyTimeline = [
  { title: "Tiberius Gracchus Reform Attempts", year: "133 BC", imageUrl: "" },
  { title: "Assassination of Tiberius Gracchus", year: "133 BC", imageUrl: "" },
  { title: "Sulla Becomes Dictator", year: "82 BC", imageUrl: "" },
  { title: "Julius Caesar Crosses the Rubicon", year: "49 BC", imageUrl: "" },
  { title: "Caesar's Civil War", year: "49-45 BC", imageUrl: "" },
];

const dummyCurrentCard = { title: "Battle of Actium", imageUrl: "" };

const dummyLogs = [
  { player: "AlexWimmert", action: "joined" },
  { player: "milchazor", action: "joined" },
  { player: "sjfess", action: "joined" },
  { player: "Colin_dev", action: "joined" },
  { player: "AlexWimmert", action: "played Julius Caesar crosses the Rubicon" },
  { player: "Colin_dev", action: "played Caesar's Civil War" },
];

const Game: React.FC = () => {
  const router = useRouter();
  const { gameId } = useParams();
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);

  return (
    <div className={styles.page}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <span className={styles.modeLabel}>Timeline Mode</span>
          <span className={styles.topicLabel}>Fall of the Roman Republic</span>
          <span className={styles.lobbyCode}>Lobby Code: ABC123</span>
        </div>
        <div className={styles.topBarRight}>
          <span className={styles.turnsLeft}>2 turns left</span>
          <Button className={styles.leaveBtn} onClick={() => router.push("/profile")}>
            Leave Game
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        <div className={styles.leftSidebar}>
          <PlayersPanel players={dummyPlayers} />
          <StatsPanel score={68} timer={18} round={1} />
        </div>

        <div className={styles.center}>
          <Timeline cards={dummyTimeline} selectedPosition={selectedPosition} onSelectPosition={setSelectedPosition} />
          <CurrentCard
            card={dummyCurrentCard}
            onPlace={() => {}}
            onEarlier={() => setSelectedPosition((p) => (p !== null && p > 0 ? p - 1 : 0))}
            onLater={() => setSelectedPosition((p) => (p !== null && p < dummyTimeline.length ? p + 1 : dummyTimeline.length))}
          />
        </div>

        <div className={styles.rightSidebar}>
          <GameLog logs={dummyLogs} />
        </div>
      </div>
    </div>
  );
};

export default Game;
