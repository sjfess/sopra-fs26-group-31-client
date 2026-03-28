"use client";

import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { Button } from "antd";
import styles from "@/styles/page.module.css";

interface PlayerResult {
  userId: string;
  username: string;
  score: number;
  rank: number;
}

const MEDAL = ["🥇", "🥈", "🥉"];

const STATIC_RESULTS: PlayerResult[] = [
  { userId: "1", username: "HistoryBuff42", score: 4850, rank: 1 },
  { userId: "2", username: "ChronoMaster",  score: 3920, rank: 2 },
  { userId: "3", username: "TimeTraveler",  score: 3100, rank: 3 },
  { userId: "4", username: "EraExplorer",   score: 2450, rank: 4 },
  { userId: "5", username: "PastSeeker",    score: 1800, rank: 5 },
];

export default function ResultsPage() {
  const router = useRouter();
  const { gameId } = useParams() as { gameId: string };

  const [results] = useState<PlayerResult[]>(STATIC_RESULTS);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  // TODO: fetch /games/${gameId}/results and populate results

  const handleRematch = () => {
    // TODO: POST /games/${gameId}/rematch and navigate to /lobby/${newId}
  };

  return (
    <div className={styles.page}>
      <nav className={styles.navbar}>
        <span className={styles.navTitle}>Historical Reconstruction</span>
        <div className={styles.navLinks}>
          <span onClick={() => router.push("/lobby")}>Play Again</span>
          <span onClick={() => router.push("/leaderboard")}>Leaderboard</span>
        </div>
      </nav>

      <main className={styles.main}>
        <h1 className={styles.title}>Game Over</h1>
        <p className={styles.subtitle}>Final Rankings</p>

        {loading && <p className={styles.description}>Loading results…</p>}
        {error && <p className={styles.description}>{error}</p>}
        {!loading && !error && results.length === 0 && (
          <p className={styles.description}>No results available.</p>
        )}

        {!loading && !error && results.map((player, idx) => (
          <div key={player.userId} className={styles.description}>
            {idx < 3 ? MEDAL[idx] : `#${player.rank}`} {player.username} — {player.score} pts
          </div>
        ))}

        <div className={styles.buttons}>
          <Button size="large" className={styles.btnPrimary} onClick={handleRematch}>
            Rematch
          </Button>
          <Button size="large" className={styles.btnSecondary} onClick={() => router.push("/profile")}>
            Main Menu
          </Button>
        </div>
      </main>
    </div>
  );
}
