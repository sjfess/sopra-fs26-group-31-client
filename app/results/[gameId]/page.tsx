"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "antd";
import styles from "@/styles/page.module.css";

import Navbar from "@/results/[gameId]/components/Navbar";
import VictorPopup from "@/results/[gameId]/components/VictorPopup";

import { useGameResults } from "@/hooks/useGameResults";
import { useGameDuration } from "@/hooks/useGameDuration";
import { getApiDomain } from "@/utils/domain";
import useSessionStorage from "@/hooks/useSessionStorage";

// Display-name mappings

const ERA_LABELS: Record<string, string> = {
  ANCIENT: "Ancient",
  MEDIEVAL: "Medieval",
  RENAISSANCE: "Renaissance",
  MODERN: "Modern",
  INFORMATION: "Information Age",
};

const MODE_LABELS: Record<string, string> = {
  TIMELINE: "Timeline",
  HISTORY_UNO: "History Uno",
};

// Component

export default function ResultsPage() {
  const router = useRouter();
  const { gameId } = useParams() as { gameId: string };

  const [mounted, setMounted] = useState(false);
  const { value: token } = useSessionStorage<string>("token", "");

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!token) {
      router.push("/login");
    }
  }, [mounted, token]);

  const {
    results,
    game,
    loading,
    error,
    showPopup,
    setShowPopup,
  } = useGameResults(gameId);

  const duration = useGameDuration(gameId);

  const winners = useMemo(
      () => results.filter((r) => r.winner),
      [results]
  );

  const handleRematch = async () => {
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      console.error("No userId in sessionStorage — cannot request rematch.");
      return;
    }

    try {
      const res = await fetch(`${getApiDomain()}/games/${gameId}/rematch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: Number(userId) }),
      });

      if (!res.ok) {
        console.error("Rematch request failed:", res.status);
        return;
      }

      const newGame = await res.json();
      router.push(`/gamelobby/${newGame.id}`);
    } catch (e) {
      console.error("Rematch error:", e);
    }
  };

  if (loading) {
    return (
        <div className={styles.page}>
          <Navbar />
          <main className={styles.main}>
            <p className={styles.description}>Loading results…</p>
          </main>
        </div>
    );
  }

  if (error) {
    return (
        <div className={styles.page}>
          <Navbar />
          <main className={styles.main}>
            <p className={styles.description} style={{ color: "#e74c3c" }}>
              {error}
            </p>
          </main>
        </div>
    );
  }

  return (
      <div className={styles.page}>
        <Navbar />

        <main className={styles.main} style={{ padding: "32px 16px" }}>
          <div className={styles.resultsCard}>

            <h1 className={styles.resultsCardTitle}>Match Results</h1>

            <p className={styles.resultsCardSubtitle}>
              {game
                  ? `${ERA_LABELS[game.era]} · ${MODE_LABELS[game.gameMode]} Mode`
                  : ""}
            </p>

            {winners.length > 0 && (
                <div className={styles.resultsWinnerBox}>
                  <div className={styles.resultsWinnerBadge}>1</div>
                  <div>
                    <p className={styles.resultsWinnerName}>
                      {winners.length === 1 ? "Winner" : "Winners"}:{" "}
                      {winners.map((w) => w.username).join(", ")}
                    </p>
                    <p className={styles.resultsWinnerStats}>
                      {winners[0].score.toLocaleString()} pts ·{" "}
                      {winners[0].correctPlacements} correct placements · Accuracy{" "}
                      {Math.round(
                          (winners[0].correctPlacements /
                              Math.max(winners[0].correctPlacements + winners[0].incorrectPlacements, 1)) * 100
                      )}%
                    </p>
                  </div>
                </div>
            )}

            <div className={styles.resultsContentRow}>
              <div className={styles.resultsTableWrap}>
                <table className={styles.resultsTable}>
                  <thead>
                  <tr>
                    <th className={styles.resultsTh}>Rank</th>
                    <th className={styles.resultsTh}>Player</th>
                    <th className={styles.resultsTh}>Points</th>
                    <th className={styles.resultsThCenter}>Correct</th>
                  </tr>
                  </thead>

                  <tbody>
                  {results.map((r, i) => (
                      <tr key={r.userId}>
                        <td className={styles.resultsTd}>{i + 1}</td>
                        <td className={styles.resultsTd}>{r.username}</td>
                        <td className={styles.resultsTd}>
                          {r.score.toLocaleString()}
                        </td>
                        <td className={styles.resultsTdCenter}>
                          {r.correctPlacements}
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>

              {game && (
                  <div className={styles.resultsSummaryBox}>
                    <p className={styles.resultsSummaryTitle}>Match Summary</p>

                    <div className={styles.resultsSummaryRow}>
                      <span className={styles.resultsSummaryLabel}>Mode</span>
                      <span className={styles.resultsSummaryValue}>
                    {MODE_LABELS[game.gameMode]}
                  </span>
                    </div>

                    {duration !== null && (
                        <div className={styles.resultsSummaryRow}>
                          <span className={styles.resultsSummaryLabel}>Duration</span>
                          <span className={styles.resultsSummaryValue}>
                      {duration} min
                    </span>
                        </div>
                    )}

                    <div className={styles.resultsSummaryRow}>
                      <span className={styles.resultsSummaryLabel}>Era</span>
                      <span className={styles.resultsSummaryValue}>
                    {ERA_LABELS[game.era]}
                  </span>
                    </div>

                    <div className={styles.resultsSummaryRow}>
                      <span className={styles.resultsSummaryLabel}>Difficulty</span>
                      <span className={styles.resultsSummaryValue}>
                    {game.difficulty.charAt(0) +
                        game.difficulty.slice(1).toLowerCase()}
                  </span>
                    </div>
                    {winners.length > 0 && (
                      <div className={styles.resultsSummaryRow}>
                        <span className={styles.resultsSummaryLabel}>
                          {winners.length === 1 ? "Winner" : "Winners"}
                        </span>
                        <span className={styles.resultsSummaryValue}>
                          {winners.map((w) => w.username).join(", ")}
                        </span>
                      </div>
                    )}
                  </div>
              )}
            </div>

            <div className={styles.buttons} style={{ marginTop: 28 }}>
              <Button
                  size="large"
                  className={styles.resultsBtnRematch}
                  onClick={handleRematch}
              >
                Rematch
              </Button>

              <Button
                  size="large"
                  className={styles.btnPrimary}
                  onClick={() => {
                    const raw = sessionStorage.getItem("userId");
                    const userId = raw ? JSON.parse(raw) : null;
                    router.push(userId ? `/profile/${userId}` : "/login");
                  }}
              >
                Main Menu
              </Button>

              <Button
                  size="large"
                  className={styles.btnSecondary}
                  onClick={() => router.push("/leaderboard")}
              >
                Leaderboard
              </Button>
            </div>

          </div>
        </main>

        {showPopup && winners.length > 0 && (
            <VictorPopup
                name={winners.map((w) => w.username).join(" & ")}
                onClose={() => setShowPopup(false)}
            />
        )}
      </div>
  );
}