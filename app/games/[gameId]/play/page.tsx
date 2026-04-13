"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ApiService } from "@/api/apiService";
import GameChat from "@/gamelobby/[lobbyId]/GameChat";
import type {
  Game,
  GamePlayerScore,
  EventCardReveal,
  HandCard,
  PlacementResult,
} from "@/types/game";

interface FinalResult {
  userId: number;
  username: string;
  score: number;
  correctPlacements: number;
  incorrectPlacements: number;
  winner: boolean;
  bestStreak: number;
}

type ScreenSize = "mobile" | "tablet" | "desktop";

function useScreenSize(): ScreenSize {
  const [screen, setScreen] = useState<ScreenSize>("desktop");

  useEffect(() => {
    function updateScreen() {
      const width = window.innerWidth;
      if (width < 768) setScreen("mobile");
      else if (width < 1200) setScreen("tablet");
      else setScreen("desktop");
    }

    updateScreen();
    window.addEventListener("resize", updateScreen);
    return () => window.removeEventListener("resize", updateScreen);
  }, []);

  return screen;
}

function getStyles(screen: ScreenSize) {
  const isMobile = screen === "mobile";
  const isTablet = screen === "tablet";

  const colors = {
    bgTop: "#0a1c44",
    bgMid: "#132f63",
    bgBottom: "#214a84",
    gold: "#e3cb2c",
    goldSoft: "rgba(227,203,44,0.18)",
    goldGlow: "rgba(227,203,44,0.28)",
    whiteSoft: "rgba(255,255,255,0.08)",
    whiteMid: "rgba(255,255,255,0.12)",
    whiteStrong: "rgba(255,255,255,0.18)",
    textSoft: "rgba(255,255,255,0.72)",
    textMuted: "rgba(255,255,255,0.52)",
    borderSoft: "rgba(255,255,255,0.10)",
    borderStrong: "rgba(255,255,255,0.16)",
    panelBg: "rgba(10, 18, 38, 0.30)",
    panelBgStrong: "rgba(255,255,255,0.07)",
  };

  return {
    page: {
      minHeight: "100vh",
      background: `
        radial-gradient(circle at top left, rgba(227,203,44,0.08), transparent 22%),
        radial-gradient(circle at top right, rgba(255,255,255,0.06), transparent 18%),
        linear-gradient(145deg, ${colors.bgTop} 0%, ${colors.bgMid} 55%, ${colors.bgBottom} 100%)
      `,
      color: "#fff",
      fontFamily: "Georgia, serif",
      padding: isMobile ? "10px" : isTablet ? "14px" : "20px",
    } as React.CSSProperties,

    center: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      flexDirection: "column" as const,
      gap: "16px",
      padding: "16px",
      textAlign: "center" as const,
    } as React.CSSProperties,

    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: isMobile ? "flex-start" : "center",
      flexDirection: isMobile ? ("column" as const) : ("row" as const),
      marginBottom: isMobile ? "12px" : "20px",
      padding: isMobile ? "14px" : "18px 22px",
      background: "linear-gradient(180deg, rgba(255,255,255,0.09), rgba(255,255,255,0.05))",
      border: `1px solid ${colors.borderStrong}`,
      borderRadius: "16px",
      flexWrap: "wrap" as const,
      gap: "12px",
      boxShadow: "0 16px 40px rgba(0,0,0,0.22)",
      backdropFilter: "blur(10px)",
    } as React.CSSProperties,

    title: {
      fontSize: isMobile ? "20px" : isTablet ? "24px" : "28px",
      fontWeight: "bold",
      color: colors.gold,
      margin: 0,
      letterSpacing: "0.4px",
      textShadow: "0 2px 12px rgba(227,203,44,0.18)",
    } as React.CSSProperties,

    headerStats: {
      display: "flex",
      gap: isMobile ? "10px" : "20px",
      fontSize: isMobile ? "12px" : "13px",
      color: colors.textSoft,
      flexWrap: "wrap" as const,
    } as React.CSSProperties,

    gameGrid: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr" : "220px minmax(0, 1.55fr) 290px",
      gap: isMobile ? "12px" : "18px",
      alignItems: "start",
    } as React.CSSProperties,

    mobileTopStats: {
      display: isMobile || isTablet ? "grid" : "none",
      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
      gap: "12px",
      marginBottom: "12px",
    } as React.CSSProperties,

    desktopSidePanel: {
      display: isMobile || isTablet ? "none" : "block",
    } as React.CSSProperties,

    panel: {
      background: `linear-gradient(180deg, ${colors.panelBgStrong}, ${colors.panelBg})`,
      border: `1px solid ${colors.borderSoft}`,
      borderRadius: "16px",
      padding: isMobile ? "12px" : "16px",
      boxShadow: "0 14px 34px rgba(0,0,0,0.18)",
      backdropFilter: "blur(10px)",
    } as React.CSSProperties,

    panelTitle: {
      fontSize: "12px",
      fontWeight: "bold",
      color: colors.gold,
      textTransform: "uppercase" as const,
      letterSpacing: "1.2px",
      marginBottom: "12px",
      borderBottom: "1px solid rgba(227,203,44,0.22)",
      paddingBottom: "8px",
    } as React.CSSProperties,

    playerRow: (active: boolean, isMe: boolean): React.CSSProperties => ({
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 12px",
      marginBottom: "8px",
      borderRadius: "12px",
      background: active
          ? "linear-gradient(180deg, rgba(227,203,44,0.18), rgba(227,203,44,0.10))"
          : isMe
              ? "rgba(255,255,255,0.10)"
              : "rgba(255,255,255,0.04)",
      border: active ? `1px solid ${colors.gold}` : `1px solid rgba(255,255,255,0.05)`,
      fontSize: "12px",
      boxShadow: active ? "0 10px 24px rgba(227,203,44,0.10)" : "none",
      position: "relative" as const,
    }),

    badge: {
      background: colors.gold,
      color: "#0f2557",
      borderRadius: "999px",
      padding: "4px 9px",
      fontSize: "11px",
      fontWeight: "bold",
      minWidth: "36px",
      textAlign: "center" as const,
      boxShadow: "0 4px 12px rgba(227,203,44,0.18)",
    } as React.CSSProperties,

    timelineArea: {
      background: "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.05))",
      border: `1px solid ${colors.borderStrong}`,
      borderRadius: "18px",
      padding: isMobile ? "12px" : "20px",
      marginBottom: "18px",
      boxShadow: "0 18px 42px rgba(0,0,0,0.22)",
      backdropFilter: "blur(10px)",
    } as React.CSSProperties,

    timelineRow: {
      display: "flex",
      alignItems: "center",
      overflowX: "auto" as const,
      padding: "12px 4px 16px 4px",
      minHeight: isMobile ? "182px" : "204px",
      gap: "6px",
      scrollbarWidth: "thin" as const,
    } as React.CSSProperties,

    timelineCard: {
      minWidth: isMobile ? "112px" : "132px",
      maxWidth: isMobile ? "112px" : "132px",
      minHeight: isMobile ? "156px" : "176px",
      background: "linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0.08))",
      border: `1px solid ${colors.whiteStrong}`,
      borderRadius: "14px",
      padding: isMobile ? "8px" : "10px",
      textAlign: "center" as const,
      fontSize: isMobile ? "11px" : "12px",
      lineHeight: "1.35",
      flexShrink: 0,
      boxShadow: "0 14px 28px rgba(0,0,0,0.22)",
      backdropFilter: "blur(6px)",
    } as React.CSSProperties,

    cardYear: {
      color: colors.gold,
      fontWeight: "bold",
      fontSize: isMobile ? "13px" : "15px",
      marginTop: "8px",
      textShadow: "0 1px 8px rgba(227,203,44,0.18)",
    } as React.CSSProperties,

    handRow: {
      display: "flex",
      gap: isMobile ? "10px" : "14px",
      flexWrap: "wrap" as const,
      justifyContent: "center",
    } as React.CSSProperties,

    handCard: (selected: boolean, isMyTurn: boolean): React.CSSProperties => ({
      width: isMobile ? "122px" : isTablet ? "130px" : "140px",
      minHeight: isMobile ? "176px" : "198px",
      background: selected
          ? "linear-gradient(180deg, rgba(227,203,44,0.28), rgba(255,255,255,0.10))"
          : "linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0.06))",
      border: selected ? `2px solid ${colors.gold}` : `1px solid ${colors.borderStrong}`,
      borderRadius: "16px",
      padding: isMobile ? "8px" : "10px",
      textAlign: "center" as const,
      cursor: isMyTurn ? "pointer" : "default",
      fontSize: isMobile ? "11px" : "12px",
      lineHeight: "1.35",
      transition: "all 0.18s ease",
      boxShadow: selected
          ? "0 16px 34px rgba(227,203,44,0.20)"
          : "0 10px 24px rgba(0,0,0,0.18)",
      transform: selected ? "translateY(-5px) scale(1.025)" : "translateY(0)",
      opacity: isMyTurn ? 1 : 0.72,
      filter: isMyTurn ? "none" : "grayscale(0.12)",
    }),

    btn: (variant: "primary" | "ghost"): React.CSSProperties => ({
      padding: "10px 22px",
      borderRadius: "12px",
      border: variant === "ghost" ? `1px solid ${colors.borderStrong}` : "none",
      cursor: "pointer",
      fontFamily: "Georgia, serif",
      fontWeight: "bold",
      fontSize: "13px",
      background: variant === "primary"
          ? "linear-gradient(180deg, #f0d84b, #e3cb2c)"
          : "rgba(255,255,255,0.10)",
      color: variant === "primary" ? "#0f2557" : "#fff",
      boxShadow: variant === "primary" ? "0 10px 22px rgba(227,203,44,0.22)" : "none",
      width: isMobile ? "100%" : "auto",
    }),

    toast: (correct: boolean | null): React.CSSProperties => ({
      position: "fixed" as const,
      top: isMobile ? "16px" : "72px",
      left: "50%",
      transform: "translateX(-50%)",
      background: correct === null ? "#5f6672" : correct ? "#239b56" : "#b03a2e",
      color: "#fff",
      padding: isMobile ? "10px 16px" : "12px 28px",
      borderRadius: "12px",
      fontWeight: "bold",
      fontSize: isMobile ? "13px" : "15px",
      zIndex: 1000,
      boxShadow: "0 12px 28px rgba(0,0,0,0.30)",
      whiteSpace: "nowrap",
      maxWidth: "90vw",
      overflow: "hidden",
      textOverflow: "ellipsis",
      border: "1px solid rgba(255,255,255,0.10)",
    }),

    resultsCard: {
      background: "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.05))",
      borderRadius: "16px",
      padding: isMobile ? "16px" : "24px",
      maxWidth: "540px",
      width: "100%",
      border: `1px solid ${colors.borderSoft}`,
      boxShadow: "0 14px 34px rgba(0,0,0,0.18)",
    } as React.CSSProperties,

    resultRow: (winner: boolean): React.CSSProperties => ({
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1fr auto auto",
      alignItems: isMobile ? "start" : "center",
      gap: "8px",
      padding: "12px 14px",
      borderRadius: "12px",
      marginBottom: "8px",
      background: winner
          ? "linear-gradient(180deg, rgba(227,203,44,0.15), rgba(227,203,44,0.08))"
          : "rgba(255,255,255,0.05)",
      border: winner ? `1px solid ${colors.gold}` : `1px solid rgba(255,255,255,0.06)`,
      boxShadow: winner ? "0 8px 20px rgba(227,203,44,0.08)" : "none",
    }),

    cardImg: {
      width: "100%",
      height: isMobile ? "72px" : "88px",
      objectFit: "cover" as const,
      borderRadius: "10px",
      marginBottom: "8px",
      border: "1px solid rgba(255,255,255,0.08)",
    } as React.CSSProperties,

    statsBlock: {
      fontSize: "13px",
      display: "flex",
      flexDirection: "column" as const,
      gap: "10px",
    } as React.CSSProperties,

    infoList: {
      fontSize: "11px",
      color: colors.textSoft,
      paddingLeft: "16px",
      lineHeight: "1.9",
      margin: 0,
    } as React.CSSProperties,
  };
}

function PlayersPanel({
                        scores,
                        userId,
                        S,
                      }: {
  scores: GamePlayerScore[];
  userId: number | null;
  S: ReturnType<typeof getStyles>;
}) {
  return (
      <div style={S.panel}>
        <div style={S.panelTitle}>Players</div>
        {scores
            .slice()
            .sort((a, b) => a.turnOrder - b.turnOrder)
            .map((s) => (
                <div key={s.userId} style={S.playerRow(s.activeTurn, s.userId === userId)}>
                  <div>
                    <div style={{ fontWeight: s.userId === userId ? "bold" : "normal" }}>
                      {s.username}
                      {s.userId === userId ? " (you)" : ""}
                    </div>
                    <div
                        style={{
                          fontSize: "10px",
                          color: "rgba(255,255,255,0.5)",
                          marginTop: "2px",
                        }}
                    >
                      {s.cardsInHand} cards
                      {s.correctStreak > 1 ? ` · 🔥${s.correctStreak}` : ""}
                    </div>
                  </div>
                  <span style={S.badge}>{s.score}</span>
                </div>
            ))}
      </div>
  );
}

function StatsPanel({
                      myScore,
                      S,
                    }: {
  myScore: GamePlayerScore | undefined;
  S: ReturnType<typeof getStyles>;
}) {
  return (
      <div style={S.panel}>
        <div style={S.panelTitle}>Your Stats</div>
        {myScore ? (
            <div style={S.statsBlock}>
              <StatRow
                  label="Score"
                  value={<strong style={{ color: "#e3cb2c", fontSize: "15px" }}>{myScore.score}</strong>}
              />
              <StatRow label="Cards in hand" value={myScore.cardsInHand} />
              <StatRow label="Streak" value={`${myScore.correctStreak} 🔥`} />
              <StatRow label="Best streak" value={myScore.bestStreak} />
            </div>
        ) : (
            <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "12px" }}>Not in this game</div>
        )}
      </div>
  );
}

function HowToPlayPanel({ S }: { S: ReturnType<typeof getStyles> }) {
  return (
      <div style={S.panel}>
        <div style={S.panelTitle}>How to Play</div>
        <ol style={S.infoList}>
          <li>On your turn, select a card from your hand</li>
          <li>Click a slot on the timeline to place it</li>
          <li>Correct → one less card in hand</li>
          <li>Wrong → card discarded, draw a new one</li>
          <li>Goal: be one of the first 3 players with 0 cards</li>
        </ol>
      </div>
  );
}

function FinalResultsView({
                            finalResults,
                            router,
                            S,
                          }: {
  finalResults: FinalResult[];
  router: ReturnType<typeof useRouter>;
  S: ReturnType<typeof getStyles>;
}) {
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

        <button style={S.btn("primary")} onClick={() => router.push("/")}>
          Back to Home
        </button>
      </div>
  );
}

function TimelineSection({
                           timeline,
                           selectedCard,
                           isMyTurn,
                           hoveredSlot,
                           setHoveredSlot,
                           handlePlaceCard,
                           screen,
                           S,
                         }: {
  timeline: EventCardReveal[];
  selectedCard: number | null;
  isMyTurn: boolean;
  hoveredSlot: number | null;
  setHoveredSlot: (value: number | null) => void;
  handlePlaceCard: (position: number) => void;
  screen: ScreenSize;
  S: ReturnType<typeof getStyles>;
}) {
  return (
      <div style={S.timelineArea}>
        <div style={S.panelTitle}>
          Timeline
          {selectedCard !== null && isMyTurn && (
              <span
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    fontWeight: "normal",
                    marginLeft: "8px",
                    textTransform: "none",
                    letterSpacing: "normal",
                  }}
              >
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
              mobile={screen === "mobile"}
          />

          {timeline.map((card, i) => (
              <div
                  key={card.id ?? `${card.title}-${card.year}-${i}`}
                  style={{ display: "flex", alignItems: "center" }}
              >
                <div style={S.timelineCard}>
                  {card.imageUrl && <img src={card.imageUrl} alt={card.title} style={S.cardImg} />}
                  <div style={{ lineHeight: "1.3" }}>{card.title}</div>
                  <div style={S.cardYear}>{card.year}</div>
                </div>

                <SlotButton
                    position={i + 1}
                    active={hoveredSlot === i + 1 && selectedCard !== null && isMyTurn}
                    canPlace={selectedCard !== null && isMyTurn}
                    onHover={setHoveredSlot}
                    onPlace={handlePlaceCard}
                    mobile={screen === "mobile"}
                />
              </div>
          ))}

          {timeline.length === 0 && (
              <div
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontSize: "13px",
                    margin: "auto",
                    paddingLeft: "16px",
                    textAlign: "center",
                  }}
              >
                No cards placed yet — place the first one!
              </div>
          )}
        </div>
      </div>
  );
}

function HandSection({
                       hand,
                       selectedCard,
                       isMyTurn,
                       handleSelectCard,
                       S,
                     }: {
  hand: HandCard[];
  selectedCard: number | null;
  isMyTurn: boolean;
  handleSelectCard: (deckIndex: number) => void;
  S: ReturnType<typeof getStyles>;
}) {
  return (
      <div style={S.panel}>
        <div style={S.panelTitle}>
          Your Hand ({hand.length} cards)
          {!isMyTurn && (
              <span
                  style={{
                    color: "rgba(255,255,255,0.45)",
                    fontWeight: "normal",
                    marginLeft: "6px",
                    textTransform: "none",
                    letterSpacing: "normal",
                  }}
              >
            — waiting for your turn
          </span>
          )}
        </div>

        {hand.length === 0 ? (
            <div
                style={{
                  color: "rgba(255,255,255,0.45)",
                  textAlign: "center",
                  padding: "16px 0",
                  fontSize: "13px",
                }}
            >
              No cards in hand
            </div>
        ) : (
            <div style={S.handRow}>
              {hand.map((card) => (
                  <div
                      key={card.deckIndex}
                      style={S.handCard(selectedCard === card.deckIndex, isMyTurn)}
                      onClick={() => handleSelectCard(card.deckIndex)}
                      title={isMyTurn ? "Click to select a card" : "Not your turn"}
                  >
                    {card.imageUrl && <img src={card.imageUrl} alt={card.title} style={S.cardImg} />}
                    <div style={{ lineHeight: "1.3" }}>{card.title}</div>

                    {selectedCard === card.deckIndex && (
                        <div
                            style={{
                              color: "#e3cb2c",
                              marginTop: "6px",
                              fontSize: "10px",
                              fontWeight: "bold",
                            }}
                        >
                          ✓ Selected
                        </div>
                    )}
                  </div>
              ))}
            </div>
        )}
      </div>
  );
}

export default function TimelineGamePage() {
  const { gameId } = useParams<{ gameId: string }>();
  const router = useRouter();
  const apiRef = useRef(new ApiService());
  const api = apiRef.current;
  const screen = useScreenSize();
  const S = getStyles(screen);

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
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    const storedUsername = sessionStorage.getItem("username");

    if (storedUserId) {
      const parsed = Number(storedUserId);
      if (!Number.isNaN(parsed)) setUserId(parsed);
    }

    if (storedUsername) {
      setCurrentUsername(storedUsername);
    }
  }, []);

  function showToast(msg: string, correct: boolean | null) {
    setToast({ msg, correct });

    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 2500);
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

      if (g.status === "FINISHED") return;

      if (g.status === "IN_PROGRESS" && userId !== null) {
        const h = await api.get<HandCard[]>(`/games/${gameId}/hand?userId=${userId}`);
        setHand(h);
      } else {
        setHand([]);
      }

    } catch (err) {
      console.error("Fetch error:", err);
    }
  }, [api, gameId, userId]);

  useEffect(() => {
    if (userId === null) return;

    fetchAll().finally(() => setLoading(false));
    pollingRef.current = setInterval(fetchAll, 2000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, [fetchAll, userId]);

  useEffect(() => {
    if (game?.status === "FINISHED") {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
      router.push(`/results/${gameId}`);
    }
  }, [game?.status, gameId, router]);

  const myScore = scores.find((s) => s.userId === userId);
  const isMyTurn = myScore?.activeTurn ?? false;
  const activePlayer = scores.find((s) => s.activeTurn);

  useEffect(() => {
    if (!isMyTurn) {
      setSelectedCard(null);
      setHoveredSlot(null);
      return;
    }

    const backendSelected = myScore?.currentCardIndex ?? null;
    setSelectedCard(backendSelected);
  }, [isMyTurn, myScore?.currentCardIndex]);

  async function handleSelectCard(deckIndex: number) {
    if (!isMyTurn || userId === null) return;

    try {
      await api.post<unknown>(`/games/${gameId}/draw`, {
        userId,
        deckIndex,
      });

      setSelectedCard(deckIndex);
    } catch (err: unknown) {
      console.error("Select card error:", err);

      if (typeof err === "object" && err !== null && "message" in err) {
        showToast(String((err as { message: unknown }).message), null);
      } else {
        showToast("Error selecting card", null);
      }
    }
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
      setHoveredSlot(null);
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
          <button style={S.btn("ghost")} onClick={() => router.push("/")}>
            Back to Home
          </button>
        </div>
    );
  }



  return (
      <div style={S.page}>
        {toast && <div style={S.toast(toast.correct)}>{toast.msg}</div>}

        <div style={S.header}>
          <h1 style={S.title}>Timeline — {game.era}</h1>

          <div style={S.headerStats}>
          <span>
            Deck: <strong style={{ color: "#e3cb2c" }}>{game.cardsRemaining}</strong> left
          </span>
            <span>
            Timeline: <strong style={{ color: "#e3cb2c" }}>{game.timelineSize}</strong>
          </span>
            <span style={{ color: "#e3cb2c" }}>{game.difficulty}</span>
          </div>

          <div style={{ fontSize: screen === "mobile" ? "12px" : "13px" }}>
            {isMyTurn ? (
                <span style={{ color: "#e3cb2c", fontWeight: "bold" }}>⭐ Your turn!</span>
            ) : activePlayer ? (
                <span style={{ color: "rgba(255,255,255,0.7)" }}>
              Waiting for <strong style={{ color: "#fff" }}>{activePlayer.username}</strong>
            </span>
            ) : null}
          </div>
        </div>

        {(screen === "mobile" || screen === "tablet") && (
            <div style={S.mobileTopStats}>
              <PlayersPanel scores={scores} userId={userId} S={S} />
              <StatsPanel myScore={myScore} S={S} />
            </div>
        )}

        <div style={S.gameGrid}>
          <div style={S.desktopSidePanel}>
            <PlayersPanel scores={scores} userId={userId} S={S} />
          </div>

          <div>
            <TimelineSection
                timeline={timeline}
                selectedCard={selectedCard}
                isMyTurn={isMyTurn}
                hoveredSlot={hoveredSlot}
                setHoveredSlot={setHoveredSlot}
                handlePlaceCard={handlePlaceCard}
                screen={screen}
                S={S}
            />

            <HandSection
                hand={hand}
                selectedCard={selectedCard}
                isMyTurn={isMyTurn}
                handleSelectCard={handleSelectCard}
                S={S}
            />
          </div>

          <div style={S.desktopSidePanel}>
            <StatsPanel myScore={myScore} S={S} />
            <div style={{ height: "12px" }} />
            <HowToPlayPanel S={S} />
            <div style={{ height: "12px" }} />
            <div style={S.panel}>
              <GameChat
                  gameId={gameId}
                  userId={userId}
                  currentUsername={currentUsername}
              />
            </div>
          </div>

          {(screen === "mobile" || screen === "tablet") && (
              <div style={{ display: "grid", gap: "12px" }}>
                <HowToPlayPanel S={S} />
                <div style={S.panel}>
                  <GameChat
                      gameId={gameId}
                      userId={userId}
                      currentUsername={currentUsername}
                  />
                </div>
              </div>
          )}
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
                      mobile,
                    }: {
  position: number;
  active: boolean;
  canPlace: boolean;
  onHover: (pos: number | null) => void;
  onPlace: (pos: number) => void;
  mobile: boolean;
}) {
  return (
      <div
          style={{
            minWidth: active ? (mobile ? "20px" : "24px") : mobile ? "12px" : "14px",
            height: mobile ? "132px" : "148px",
            background: active ? "rgba(227,203,44,0.30)" : "rgba(255,255,255,0.08)",
            border: active ? "2px dashed #e3cb2c" : "1px dashed rgba(255,255,255,0.16)",
            borderRadius: "8px",
            cursor: canPlace ? "pointer" : "default",
            flexShrink: 0,
            transition: "all 0.15s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: mobile ? "14px" : "16px",
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
      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
        <span style={{ color: "rgba(255,255,255,0.55)" }}>{label}</span>
        <span>{value}</span>
      </div>
  );
}