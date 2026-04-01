"use client";

import { Game, PlayerSummary } from "@/types/game";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { useApi } from "@/hooks/useApi";

export default function GameLobbyPage() {
    const [game, setGame] = useState<Game | null>(null);
    const [loading, setLoading] = useState(true);
    const params = useParams();
    const lobbyId = params.lobbyId;
    const router = useRouter();
    const apiService = useApi();
    const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const userId = Number(localStorage.getItem("userId"));
    const isHost = game?.hostId === userId;

    useEffect(() => {
        const fetchGame = async () => {
            try {
                const response = await apiService.get<Game>(`/games/${lobbyId}`);
                setGame(response);
                setLoading(false);

                if (response.status === "IN_PROGRESS") {
                    clearInterval(pollingRef.current!);
                    router.push(`/games/${lobbyId}/play`);
                }
            } catch (error) {
                console.error("Failed to load game:", error);
            }
        };

        void fetchGame();
        pollingRef.current = setInterval(() => { void fetchGame(); }, 2000);

        return () => clearInterval(pollingRef.current!);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lobbyId]);

    const handleStartGame = async () => {
        try {
            await apiService.put(`/games/${lobbyId}/start?deckSize=20`, {});
        } catch (error) {
            console.error("Failed to start game:", error);
        }
    };

    const handleLeave = async () => {
        try {
            await apiService.delete(`/games/leave/${game!.lobbyCode}`, { userId });
            router.push("/dashboard");
        } catch (error) {
            console.error("Failed to leave game:", error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1>Game Lobby</h1>
            <p>Lobby Code: <strong>{game?.lobbyCode}</strong></p>
            <p>Era: {game?.era}</p>
            <p>Status: {game?.status}</p>

            <h2>Players ({game?.players?.length ?? 0})</h2>
            <ul>
                {game?.players?.map((player: PlayerSummary) => (
                    <li key={player.id}>
                        {player.username}
                        {player.id === game.hostId ? " 👑" : ""}
                    </li>
                ))}
            </ul>

            {isHost && (
                <button
                    onClick={handleStartGame}
                    disabled={(game?.players?.length ?? 0) < 2}
                >
                    Start Game
                </button>
            )}

            <button onClick={handleLeave}>
                Leave Lobby
            </button>
        </div>
    );
}