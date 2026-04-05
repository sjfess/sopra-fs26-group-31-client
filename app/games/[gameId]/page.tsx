"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Spin, message } from "antd";
import { useApi } from "@/hooks/useApi";
import PlayersPanel from "./components/PlayersPanel";
import StatsPanel from "./components/StatsPanel";
import Timeline from "./components/Timeline";
import CurrentCard from "./components/CurrentCard";
import GameLog from "./components/GameLog";
import styles from "./game.module.css";
import {
  Game as GameType,
  EventCardGet,
  EventCardReveal,
  PlacementResult,
  GamePlayerScore,
} from "@/types/game";

export interface LogEntry {
  player: string;
  action: string;
}

const Game: React.FC = () => {
  const router = useRouter();
  const { gameId } = useParams() as { gameId: string };
  const apiService = useApi();
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [game, setGame] = useState<GameType | null>(null);
  const [timeline, setTimeline] = useState<EventCardReveal[]>([]);
  const [scores, setScores] = useState<GamePlayerScore[]>([]);
  const [currentCard, setCurrentCard] = useState<EventCardGet | null>(null);
  const [cardIndex, setCardIndex] = useState<number | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [lastResult, setLastResult] = useState<PlacementResult | null>(null);

  const userId = Number(localStorage.getItem("userId"));

  const isMyTurn = scores.find((s) => s.activeTurn)?.userId === userId;

  const fetchGameState = useCallback(async () => {
    try {
      const [gameData, timelineData, scoresData] = await Promise.all([
        apiService.get<GameType>(`/games/${gameId}`),
        apiService.get<EventCardReveal[]>(`/games/${gameId}/timeline`),
        apiService.get<GamePlayerScore[]>(`/games/${gameId}/scores`),
      ]);
      setGame(gameData);
      setTimeline(timelineData);
      setScores(scoresData);
      setLoading(false);
      return { gameData, scoresData };
    } catch (error) {
      console.error("Failed to fetch game state:", error);
      setLoading(false);
      return null;
    }
  }, [apiService, gameId]);

  const drawCard = useCallback(async () => {
    if (currentCard) return;
    try {
      const card = await apiService.post<EventCardGet>(`/games/${gameId}/draw`, {});
      setCurrentCard(card);
      setCardIndex(card.id);
      setSelectedPosition(null);
      setLastResult(null);
    } catch (error) {
      console.error("Failed to draw card:", error);
    }
  }, [apiService, gameId, currentCard]);

  // Initial fetch + polling
  useEffect(() => {
    const init = async () => {
      const result = await fetchGameState();
      if (result) {
        const myScore = result.scoresData.find((s: GamePlayerScore) => s.userId === userId);
        if (myScore?.activeTurn) {
          await drawCard();
        }
      }
    };
    void init();

    pollingRef.current = setInterval(() => {
      void fetchGameState();
    }, 2000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId]);

  // Auto-draw when it becomes my turn
  useEffect(() => {
    if (isMyTurn && !currentCard && !placing) {
      void drawCard();
    }
  }, [isMyTurn, currentCard, placing, drawCard]);

  const handlePlace = async () => {
    if (selectedPosition === null || cardIndex === null || placing) return;

    setPlacing(true);
    try {
      const result = await apiService.post<PlacementResult>(`/games/${gameId}/moves`, {
        cardIndex,
        position: selectedPosition,
      });

      setLastResult(result);

      const activePlayer = scores.find((s) => s.activeTurn);
      const playerName = activePlayer?.username ?? "Unknown";
      setLogs((prev) => [
        ...prev,
        {
          player: playerName,
          action: `placed ${result.title} (${result.year}) — ${result.correct ? "Correct" : "Incorrect"}`,
        },
      ]);

      if (result.correct) {
        message.success(`Correct! ${result.title} — ${result.year}`);
      } else {
        message.error(`Incorrect! ${result.title} was actually ${result.year}`);
      }

      setCurrentCard(null);
      setCardIndex(null);
      setSelectedPosition(null);

      await fetchGameState();
    } catch (error) {
      console.error("Failed to place card:", error);
      if (error instanceof Error) {
        message.error(error.message);
      }
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.page} style={{ justifyContent: "center", alignItems: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  const myScore = scores.find((s) => s.userId === userId);

  return (
    <div className={styles.page}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <span className={styles.modeLabel}>Timeline Mode</span>
          <span className={styles.topicLabel}>{game?.era ?? ""}</span>
          <span className={styles.lobbyCode}>Lobby Code: {game?.lobbyCode ?? ""}</span>
        </div>
        <div className={styles.topBarRight}>
          <span className={styles.turnsLeft}>{game?.cardsRemaining ?? 0} cards left</span>
          <Button className={styles.leaveBtn} onClick={() => router.push("/profile")}>
            Leave Game
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        <div className={styles.leftSidebar}>
          <PlayersPanel scores={scores} currentUserId={userId} />
          <StatsPanel
            score={myScore?.score ?? 0}
            cardsRemaining={game?.cardsRemaining ?? 0}
            streak={myScore?.correctStreak ?? 0}
          />
        </div>

        <div className={styles.center}>
          <Timeline cards={timeline} selectedPosition={selectedPosition} onSelectPosition={setSelectedPosition} />
          {lastResult && (
            <div style={{ color: lastResult.correct ? "#4caf50" : "#f44336", fontWeight: "bold", fontSize: "0.9rem" }}>
              {lastResult.correct ? "Correct!" : "Incorrect!"} {lastResult.title} — {lastResult.year}
            </div>
          )}
          <CurrentCard
            card={isMyTurn ? currentCard : null}
            onPlace={handlePlace}
            onEarlier={() => setSelectedPosition((p) => (p !== null && p > 0 ? p - 1 : 0))}
            onLater={() => setSelectedPosition((p) => (p !== null && p < timeline.length ? p + 1 : timeline.length))}
            placing={placing}
            disabled={selectedPosition === null}
          />
        </div>

        <div className={styles.rightSidebar}>
          <GameLog logs={logs} />
        </div>
      </div>
    </div>
  );
};

export default Game;
