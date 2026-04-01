"use client";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { Button, Form, Input, Select, ConfigProvider } from "antd";
import React, { useState } from "react";

const GameHub: React.FC = () => {
    const [gameEra, setGameEra] = useState("");
    const [gameDifficulty, setGameDifficulty] = useState("");
    const [lobbyCode, setLobbyCode] = useState("");
    const apiService = useApi();
    const router = useRouter();
    const userId = Number(localStorage.getItem("userId"));

    const handleCreateGame = async () => {
        try {

            if (!userId) {
                alert("No userId found. Please log in again.");
                return;
            }

            if (!gameEra || !gameDifficulty) {
                alert("Please select era and difficulty.");
                return;
            }
            const response = await apiService.post<{ id: number }>("/games?era=" + gameEra + "&difficulty=" + gameDifficulty + "&userId=" + userId, null);
            router.push("/gamelobby/" + response.id);
        } catch (error) {
            if (error instanceof Error) {
                alert(`Something went wrong during the creation of the game:\n${error.message}`);
            } else {
                console.error("An unknown error occurred during login.");
            }
        }
    };

    const handleJoinGame = async () => {
        try {
            const userId = localStorage.getItem("userId"); // oder woher du die userId holst
            const response = await apiService.post<{ id: number }>(
                `/games/join/${lobbyCode}`,
                { userId: Number(userId) }
            );
            router.push("/gamelobby/" + response.id);
        } catch (error) {
            if (error instanceof Error) {
                alert(`Something went wrong while joining the game:\n${error.message}`);
            } else {
                console.error("An unknown error occurred while joining the game.");
            }
        }
    };
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ backgroundColor: "#0d1b4b", border: "1px solid #e3cb2c", borderRadius: "16px", padding: "100px"}}>
                <h2 style={{ color: "#e3cb2c", textAlign: "center" }}>Create Game</h2>
                <ConfigProvider theme={{ token: { colorTextPlaceholder: "rgba(227, 203, 44, 0.6)" } }}>
                    <Form layout="vertical">
                        <Form.Item label={"Era"}>
                            <Select
                                classNames={{ popup: { root: "custom-select-dropdown" } }}
                                style={{ width: "100%", color: gameEra ? "#e3cb2c" : "#a0a0a0" }}
                                placeholder="Select Era"
                                onChange={(val) => setGameEra(val)}
                                options={[
                                    {value: "ANCIENT", label: "Ancient"},
                                    { value: "MEDIEVAL", label: "Medieval" },
                                    { value: "RENAISSANCE", label: "Renaissance" },
                                    { value: "MODERN", label: "Modern" },
                                    { value: "INFORMATION", label: "Information" }
                                ]}
                            />

                        </Form.Item>
                        <Form.Item label={"Game Difficulty"}>
                            <Select
                                classNames={{ popup: { root: "custom-select-dropdown" } }}
                                style={{ width: "100%", color: gameDifficulty ? "#e3cb2c" : "#a0a0a0" }}
                                placeholder={"Select Game Difficulty"}
                                onChange={(val) => setGameDifficulty(val)}
                                options={[
                                    { value: "EASY", label: "Easy" },
                                    { value: "MEDIUM", label: "Medium" },
                                    { value: "HARD", label: "Hard" }
                                ]}
                            />

                        </Form.Item>
                        <Button
                            type="primary"
                            block
                            style={{ backgroundColor: "#b56464", color: "#f5ebd5" }}
                            onClick={handleCreateGame}
                        >
                            Create Game
                        </Button>
                    </Form>
                </ConfigProvider>
            </div>

            <div style={{ backgroundColor: "#0d1b4b", border: "1px solid #e3cb2c", borderRadius: "16px", padding: "100px" }}>
                <h2 style={{ color: "#e3cb2c", textAlign: "center" }}>Join Game</h2>
                <ConfigProvider theme={{ token: { colorTextPlaceholder: "rgba(227, 203, 44, 0.6)" } }}>
                    <Form layout="vertical">
                        <Form.Item label={"Lobby Code"} name="Lobby Code">
                            <Input
                                placeholder={"Please input your Lobby Code!"}
                                onChange={(e) => setLobbyCode(e.target.value)}
                            />
                        </Form.Item>
                        <Button
                            type="primary"
                            block
                            style={{ backgroundColor: "#b56464", color: "#f5ebd5" }}
                            onClick={handleJoinGame}
                        >
                            Join Game
                        </Button>
                    </Form>
                </ConfigProvider>
            </div>
        </div>
    );
};

export default GameHub;