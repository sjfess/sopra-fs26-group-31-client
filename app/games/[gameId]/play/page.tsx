"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ApiService } from "@/api/apiService";
import GameChat from "@/gamelobby/[lobbyId]/GameChat";
import type { Game, GamePlayerScore, EventCardReveal, HandCard, PlacementResult } from "@/types/game";

interface FinalResult {
  userId: number;
  username: string;
  score: number;
  correctPlacements: number;
  incorrectPlacements: number;
  winner: boolean;
  bestStreak: number;
}

const S = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f2557 0%, #1a3570 100%)",
    color: "#fff",
    fontFamily: "Georgia, serif",
    padding: "16px",
  } as React.CSSProperties,

  center: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    flexDirection: "column" as const,
    gap: "16px",
  } as React.CSSProperties,

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
    padding: "12px 16px",
    background: "rgba(255,255,255,0.08)",
    borderRadius: "10px",
    flexWrap: "wrap" as const,
    gap: "8px",
  } as React.CSSProperties,

  title: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#e3cb2c",
    margin: 0,
  } as React.CSSProperties,

  gameGrid: {
    display: "grid",
    gridTemplateColumns: "210px 1fr 260px",
    gap: "14px",
    alignItems: "start",
  } as React.CSSProperties,

  panel: {
    background: "rgba(255,255,255,0.07)",
    borderRadius: "10px",
    padding: "14px",
  } as React.CSSProperties,

  panelTitle: {
    fontSize: "12px",
    fontWeight: "bold",
    color: "#e3cb2c",
    textTransform: "uppercase" as const,
    letterSpacing: "1px",
    marginBottom: "10px",
    borderBottom: "1px solid rgba(227,203,44,0.3)",
    paddingBottom: "6px",
  } as React.CSSProperties,

  playerRow: (active: boolean, isMe: boolean): React.CSSProperties => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 10px",
    marginBottom: "6px",
    borderRadius: "8px",
    background: active
        ? "rgba(227,203,44,0.2)"
        : isMe
            ? "rgba(255,255,255,0.1)"
            : "rgba(255,255,255,0.04)",
    border: active ? "1px solid #e3cb2c" : "1px solid transparent",
    fontSize: "12px",
  }),

  badge: {
    background: "#e3cb2c",
    color: "#0f2557",
    borderRadius: "4px",
    padding: "2px 6px",
    fontSize: "11px",
    fontWeight: "bold",
  } as React.CSSProperties,

  timelineArea: {
    background: "rgba(255,255,255,0.05)",
    borderRadius: "10px",
    padding: "14px",
    marginBottom: "14px",
  } as React.CSSProperties,

  timelineRow: {
    display: "flex",
    alignItems: "center",
    overflowX: "auto" as const,
    paddingBottom: "8px",
    minHeight: "130px",
    gap: "0",
  } as React.CSSProperties,

  timelineCard: {
    minWidth: "88px",
    maxWidth: "88px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "8px",
    padding: "6px",
    textAlign: "center" as const,
    fontSize: "10px",
    flexShrink: 0,
  } as React.CSSProperties,

  cardYear: {
    color: "#e3cb2c",
    fontWeight: "bold",
    fontSize: "12px",
    marginTop: "4px",
  } as React.CSSProperties,

  handRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap" as const,
    justifyContent: "center",
  } as React.CSSProperties,

  handCard: (selected: boolean): React.CSSProperties => ({
    width: "96px",
    background: selected ? "rgba(227,203,44,0.2)" : "rgba(255,255,255,0.08)",
    border: selected ? "2px solid #e3cb2c" : "2px solid rgba(255,255,255,0.12)",
    borderRadius: "10px",
    padding: "8px",
    textAlign: "center" as const,
    cursor: "pointer",
    fontSize: "11px",
    transition: "all 0.15s",
  }),

  btn: (variant: "primary" | "ghost"): React.CSSProperties => ({
    padding: "8px 20px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontFamily: "Georgia, serif",
    fontWeight: "bold",
    fontSize: "13px",
    background: variant === "primary" ? "#e3cb2c" : "rgba(255,255,255,0.15)",
    color: variant === "primary" ? "#0f2557" : "#fff",
  }),

  toast: (correct: boolean | null): React.CSSProperties => ({
    position: "fixed" as const,
    top: "72px",
    left: "50%",
    transform: "translateX(-50%)",
    background: correct === null ? "#666" : correct ? "#27ae60" : "#c0392b",
    color: "#fff",
    padding: "12px 28px",
    borderRadius: "10px",
    fontWeight: "bold",
    fontSize: "15px",
    zIndex: 1000,
    boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
    whiteSpace: "nowrap",
  }),

  resultsCard: {
    background: "rgba(255,255,255,0.07)",
    borderRadius: "12px",
    padding: "24px",
    maxWidth: "520px",
    width: "100%",
  } as React.CSSProperties,

  resultRow: (winner: boolean): React.CSSProperties => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 14px",
    borderRadius: "8px",
    marginBottom: "8px",
    background: winner ? "rgba(227,203,44,0.15)" : "rgba(255,255,255,0.05)",
    border: winner ? "1px solid #e3cb2c" : "1px solid transparent",
  }),

  cardImg: {
    width: "100%",
    height: "56px",
    objectFit: "cover" as const,
    borderRadius: "4px",
    marginBottom: "4px",
  } as React.CSSProperties,
};

export default function TimelineGamePage() {
  const { gameId } = useParams<{ gameId: string }>();
  const router = useRouter();
  const api = new ApiService();

  const [game, setGame] = useState<Game | null>(null);
  const [scores, setScores] = useState<GamePlayerScore[]>([]);
  const [timeline, setTimeline] = useState<EventCardReveal[]>([]);
  const [hand, setHand] = useState<HandCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [finalResults, setFinalResults] = useState<FinalResult[] | null>(null);
  const [toast, setToast] = useState<{ msg: string; correct: boolean | null } | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    const storedUsername = sessionStorage.getItem("username");

    if (storedUserId) {
      const parsed = Number(storedUserId);
      if (!Number.isNaN(parsed)) {
        setUserId(parsed);
      }
    }

    if (storedUsername) {
      setCurrentUsername(storedUsername);
    }
  }, []);

  function showToast(msg: string, correct: boolean | null) {
    setToast({ msg, correct });
    setTimeout(() => setToast(null), 2500);
  }

  const fetchAll = useCallback(async () => {
    try {
      const [g, s, tl] = await Promise.all([
        api.get<Game>(`/games/${gameId}`),
        api.get<GamePlayerScore[]>(`/games/${gameId}/scores`),
        api.get<EventCardReveal[]>(`/games/${gameId}/timeline`),
      ]);
      setGame(g);
      setScores(s);
      setTimeline(tl);

      if (g.status === "IN_PROGRESS" && userId !== null) {
        const h = await api.get<HandCard[]>(`/games/${gameId}/hand?userId=${userId}`);
        setHand(h);
      }

      if (g.status === "FINISHED") {
        try {
          const results = await api.post<FinalResult[]>(`/games/${gameId}/finalize`, {});
          setFinalResults(results);
        } catch {
          // ignore
        }
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }, [gameId, userId]);

  useEffect(() => {
    if (userId === null) return;

    fetchAll().finally(() => setLoading(false));
    pollingRef.current = setInterval(fetchAll, 2000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [fetchAll, userId]);

  useEffect(() => {
    if (game?.status === "FINISHED" && pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, [game?.status]);

  const myScore = scores.find((s) => s.userId === userId);
  const isMyTurn = myScore?.activeTurn ?? false;

  function handleSelectCard(deckIndex: number) {
    if (!isMyTurn) return;
    setSelectedCard((prev) => (prev === deckIndex ? null : deckIndex));
  }

  async function handlePlaceCard(position: number) {
    if (!isMyTurn || selectedCard === null) return;
    try {
      const result = await api.post<PlacementResult>(`/games/${gameId}/moves`, {
        cardIndex: selectedCard,
        position,
      });
      showToast(
          result.correct
              ? `✓ Correct! ${result.title} (${result.year})`
              : `✗ Wrong! ${result.title} was from ${result.year}`,
          result.correct,
      );
      setSelectedCard(null);
      await fetchAll();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Error placing card", null);
    }
  }

  if (loading) {
    return (
        <div style={S.center}>
          <div style={{ color: "#e3cb2c", fontSize: "18px" }}>Loading game…</div>
        </div>
    );
  }

  if (!game) {
    return (
        <div style={S.center}>
          <div style={{ color: "#e74c3c" }}>Game not found.</div>
          <button style={S.btn("ghost")} onClick={() => router.push("/")}>Back to Home</button>
        </div>
    );
  }

  if (game.status === "FINISHED") {
    if (!finalResults) {
      return <div style={S.center}><div style={{ color: "#e3cb2c" }}>Loading results…</div></div>;
    }
    const sorted = [...finalResults].sort((a, b) => b.score - a.score);
    return (
        <div style={S.center}>
          <h1 style={{ color: "#e3cb2c", marginBottom: "4px" }}>Game Over!</h1>
          <div style={S.resultsCard}>
            <div style={S.panelTitle}>Final Results</div>
            {sorted.map((r, i) => (
                <div key={r.userId} style={S.resultRow(r.winner)}>
              <span style={{ fontWeight: r.winner ? "bold" : "normal" }}>
                {i + 1}. {r.username} {r.winner ? "👑" : ""}
              </span>
                  <span style={{ color: "#e3cb2c", fontWeight: "bold" }}>{r.score} pts</span>
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>
                {r.correctPlacements}✓ / {r.incorrectPlacements}✗
              </span>
                </div>
            ))}
          </div>
          <button style={S.btn("primary")} onClick={() => router.push("/")}>Back to Home</button>
        </div>
    );
  }

  const activePlayer = scores.find((s) => s.activeTurn);

  return (
      <div style={S.page}>
        {toast && <div style={S.toast(toast.correct)}>{toast.msg}</div>}

        <div style={S.header}>
          <h1 style={S.title}>Timeline — {game.era}</h1>
          <div style={{ display: "flex", gap: "20px", fontSize: "13px", color: "rgba(255,255,255,0.8)" }}>
            <span>Deck: <strong style={{ color: "#e3cb2c" }}>{game.cardsRemaining}</strong> left</span>
            <span>Timeline: <strong style={{ color: "#e3cb2c" }}>{game.timelineSize}</strong></span>
            <span style={{ color: "#e3cb2c" }}>{game.difficulty}</span>
          </div>
          <div style={{ fontSize: "13px" }}>
            {isMyTurn
                ? <span style={{ color: "#e3cb2c", fontWeight: "bold" }}>⭐ Your turn!</span>
                : activePlayer
                    ? <span style={{ color: "rgba(255,255,255,0.7)" }}>Waiting for <strong style={{ color: "#fff" }}>{activePlayer.username}</strong></span>
                    : null}
          </div>
        </div>

        <div style={S.gameGrid}>
          <div style={S.panel}>
            <div style={S.panelTitle}>Players</div>
            {scores
                .slice()
                .sort((a, b) => a.turnOrder - b.turnOrder)
                .map((s) => (
                    <div key={s.userId} style={S.playerRow(s.activeTurn, s.userId === userId)}>
                      <div>
                        <div style={{ fontWeight: s.userId === userId ? "bold" : "normal" }}>
                          {s.username}{s.userId === userId ? " (you)" : ""}
                        </div>
                        <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)", marginTop: "2px" }}>
                          {s.cardsInHand} cards{s.correctStreak > 1 ? ` · 🔥${s.correctStreak}` : ""}
                        </div>
                      </div>
                      <span style={S.badge}>{s.score}</span>
                    </div>
                ))}
          </div>

          <div>
            <div style={S.timelineArea}>
              <div style={S.panelTitle}>
                Timeline
                {selectedCard !== null && isMyTurn && (
                    <span style={{ color: "rgba(255,255,255,0.6)", fontWeight: "normal", marginLeft: "8px" }}>
                  — click a slot to place
                </span>
                )}
              </div>
              <div style={S.timelineRow}>
                <SlotButton
                    position={0}
                    active={hoveredSlot === 0 && selectedCard !== null && isMyTurn}
                    canPlace={selectedCard !== null && isMyTurn}
                    onHover={setHoveredSlot}
                    onPlace={handlePlaceCard}
                />

                {timeline.map((card, i) => (
                    <div key={card.id ?? `${card.title}-${card.year}-${i}`} style={{ display: "flex", alignItems: "center" }}>
                      <div style={S.timelineCard}>
                        {card.imageUrl && (
                            <img src={card.imageUrl} alt={card.title} style={S.cardImg} />
                        )}
                        <div style={{ lineHeight: "1.3" }}>{card.title}</div>
                        <div style={S.cardYear}>{card.year}</div>
                      </div>
                      <SlotButton
                          position={i + 1}
                          active={hoveredSlot === i + 1 && selectedCard !== null && isMyTurn}
                          canPlace={selectedCard !== null && isMyTurn}
                          onHover={setHoveredSlot}
                          onPlace={handlePlaceCard}
                      />
                    </div>
                ))}

                {timeline.length === 0 && (
                    <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", margin: "auto", paddingLeft: "16px" }}>
                      No cards placed yet — place the first one!
                    </div>
                )}
              </div>
            </div>

            <div style={S.panel}>
              <div style={S.panelTitle}>
                Your Hand ({hand.length} cards)
                {!isMyTurn && (
                    <span style={{ color: "rgba(255,255,255,0.45)", fontWeight: "normal", marginLeft: "6px" }}>
                  — waiting for your turn
                </span>
                )}
              </div>
              {hand.length === 0 ? (
                  <div style={{ color: "rgba(255,255,255,0.45)", textAlign: "center", padding: "16px 0", fontSize: "13px" }}>
                    No cards in hand
                  </div>
              ) : (
                  <div style={S.handRow}>
                    {hand.map((card) => (
                        <div
                            key={card.deckIndex}
                            style={S.handCard(selectedCard === card.deckIndex)}
                            onClick={() => handleSelectCard(card.deckIndex)}
                            title={isMyTurn ? "Click to select, then click a timeline slot" : "Not your turn"}
                        >
                          {card.imageUrl && (
                              <img src={card.imageUrl} alt={card.title} style={S.cardImg} />
                          )}
                          <div style={{ lineHeight: "1.3" }}>{card.title}</div>
                          {selectedCard === card.deckIndex && (
                              <div style={{ color: "#e3cb2c", marginTop: "4px", fontSize: "10px" }}>✓ Selected</div>
                          )}
                        </div>
                    ))}
                  </div>
              )}
            </div>
          </div>

          <div style={S.panel}>
            <div style={S.panelTitle}>Your Stats</div>
            {myScore ? (
                <div style={{ fontSize: "13px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  <StatRow label="Score" value={<strong style={{ color: "#e3cb2c", fontSize: "15px" }}>{myScore.score}</strong>} />
                  <StatRow label="Cards in hand" value={myScore.cardsInHand} />
                  <StatRow label="Streak" value={`${myScore.correctStreak} 🔥`} />
                  <StatRow label="Best streak" value={myScore.bestStreak} />
                </div>
            ) : (
                <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "12px" }}>Not in this game</div>
            )}

            <div style={{ marginTop: "22px" }}>
              <div style={S.panelTitle}>How to Play</div>
              <ol style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)", paddingLeft: "16px", lineHeight: "1.9", margin: 0 }}>
                <li>On your turn, select a card from your hand</li>
                <li>Click a slot on the timeline to place it</li>
                <li>Correct → one less card in hand</li>
                <li>Wrong → card discarded, draw a new one</li>
                <li>Goal: be one of the first 3 players with 0 cards</li>
              </ol>
            </div>

            <div style={{ marginTop: "22px" }}>
              <GameChat
                  gameId={gameId}
                  userId={userId}
                  currentUsername={currentUsername}
              />
            </div>
          </div>
        </div>
      </div>
  );
}

function SlotButton({
                      position,
                      active,
                      canPlace,
                      onHover,
                      onPlace,
                    }: {
  position: number;
  active: boolean;
  canPlace: boolean;
  onHover: (pos: number | null) => void;
  onPlace: (pos: number) => void;
}) {
  return (
      <div
          style={{
            minWidth: active ? "16px" : "8px",
            height: "110px",
            background: active ? "rgba(227,203,44,0.35)" : "rgba(255,255,255,0.08)",
            border: active ? "2px dashed #e3cb2c" : "1px dashed rgba(255,255,255,0.15)",
            borderRadius: "6px",
            cursor: canPlace ? "pointer" : "default",
            flexShrink: 0,
            transition: "all 0.15s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            color: active ? "#e3cb2c" : "transparent",
          }}
          onClick={() => canPlace && onPlace(position)}
          onMouseEnter={() => canPlace && onHover(position)}
          onMouseLeave={() => onHover(null)}
      >
        {active ? "+" : ""}
      </div>
  );
}

function StatRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ color: "rgba(255,255,255,0.55)" }}>{label}</span>
        <span>{value}</span>
      </div>
  );
}