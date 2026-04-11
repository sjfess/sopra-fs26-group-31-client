"use client";

import { useEffect, useState } from "react";
import { getApiDomain } from "@/utils/domain";

// TODO: Remove mock data before pushing
// mock data (temporary)

const MOCK_RESULTS = [
    { userId: 1, username: "AlexWimmer1", score: 1240, correctPlacements: 6, incorrectPlacements: 2, winner: true,  bestStreak: 4 },
    { userId: 2, username: "milchazor",   score: 980,  correctPlacements: 5, incorrectPlacements: 3, winner: false, bestStreak: 3 },
    { userId: 3, username: "sjfess",      score: 910,  correctPlacements: 4, incorrectPlacements: 4, winner: false, bestStreak: 2 },
    { userId: 4, username: "Colin_dev",   score: 840,  correctPlacements: 4, incorrectPlacements: 4, winner: false, bestStreak: 2 },
];

const MOCK_GAME = {
    id: 1,
    lobbyCode: "MOCK01",
    era: "ANCIENT",
    gameMode: "TIMELINE",
    difficulty: "EASY",
    status: "FINISHED",
    hostId: 1,
    players: [
        { id: 1, username: "AlexWimmer1" },
        { id: 2, username: "milchazor" },
        { id: 3, username: "sjfess" },
        { id: 4, username: "Colin_dev" },
    ],
    deckSize: 80,
    cardsRemaining: 0,
    timelineSize: 6,
    maxPlayers: 4,
};

// Hook

export function useGameResults(gameId: string, forceMock: boolean) {
    const [results, setResults] = useState<any[]>([]);
    const [game, setGame] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isMock, setIsMock] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        if (!gameId) return;

        // mock demo
        if (forceMock) {
            const sorted = [...MOCK_RESULTS].sort((a, b) => b.score - a.score);

            setResults(sorted);
            setGame(MOCK_GAME);
            setIsMock(true);
            setLoading(false);

            const winner = sorted.find((r) => r.winner);
            if (winner?.username === "AlexWimmer1") {
                setShowPopup(true);
            }

            return;
        }

        // actual API-call
        const load = async () => {
            try {
                const [resA, resB] = await Promise.all([
                    fetch(`${getApiDomain()}/games/${gameId}/finalize`, { method: "POST" }),
                    fetch(`${getApiDomain()}/games/${gameId}`),
                ]);

                if (!resA.ok || !resB.ok) {
                    setError("Failed to load match data.");
                    setLoading(false);
                    return;
                }

                const finalResults = await resA.json();
                const gameData = await resB.json();

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
    }, [gameId, forceMock]);

    return { results, game, loading, error, isMock, showPopup, setShowPopup };
}