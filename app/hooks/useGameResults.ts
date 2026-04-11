"use client";

import { useEffect, useState } from "react";
import { getApiDomain } from "@/utils/domain";

export function useGameResults(gameId: string) {
    const [results, setResults] = useState<any[]>([]);
    const [game, setGame] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        if (!gameId) return;

        const load = async () => {
            try {
                // Try to finalize; if already FINISHED the backend returns 409
                const finalizeRes = await fetch(
                    `${getApiDomain()}/games/${gameId}/finalize`,
                    { method: "POST" }
                );

                let finalResults: any[];

                if (finalizeRes.ok) {
                    finalResults = await finalizeRes.json();
                } else if (finalizeRes.status === 409) {
                    // Game was already finalized — fall back to live scores
                    const scoresRes = await fetch(
                        `${getApiDomain()}/games/${gameId}/scores`
                    );
                    if (!scoresRes.ok) {
                        setError("Failed to load match data.");
                        setLoading(false);
                        return;
                    }
                    const scores = await scoresRes.json();

                    // Reconstruct winner flag: highest score wins
                    const maxScore = Math.max(...scores.map((s: any) => s.score ?? 0));
                    finalResults = scores.map((s: any) => ({
                        userId: s.userId,
                        username: s.username,
                        score: s.score ?? 0,
                        correctPlacements: s.correctPlacements ?? 0,
                        incorrectPlacements: s.incorrectPlacements ?? 0,
                        bestStreak: s.bestStreak ?? 0,
                        winner: (s.score ?? 0) === maxScore,
                    }));
                } else {
                    setError("Failed to load match data.");
                    setLoading(false);
                    return;
                }

                const gameRes = await fetch(`${getApiDomain()}/games/${gameId}`);
                if (!gameRes.ok) {
                    setError("Failed to load game data.");
                    setLoading(false);
                    return;
                }
                const gameData = await gameRes.json();

                const sorted = [...finalResults].sort((a, b) => b.score - a.score);
                setResults(sorted);
                setGame(gameData);

                const winner = sorted.find((r) => r.winner);
                if (winner && winner.username === sessionStorage.getItem("username")) {
                    setShowPopup(true);
                }
            } catch (e: unknown) {
                setError(e instanceof Error ? e.message : "Failed to load match data.");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [gameId]);

    return { results, game, loading, error, showPopup, setShowPopup };
}