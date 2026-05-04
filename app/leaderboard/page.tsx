"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Table, Spin, Alert, Button, Card } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useApi } from "@/hooks/useApi";
import useSessionStorage from "@/hooks/useSessionStorage";
import Navbar from "@/profile/[id]/components/Navbar";
import { LeaderboardEntry } from "@/types/user";

const LeaderboardPage: React.FC = () => {
    const router = useRouter();
    const apiService = useApi();

    const { value: token, clear: clearToken } = useSessionStorage<string>("token", "");
    const { value: loggedInUserId, clear: clearUserId } = useSessionStorage<string>("userId", "");

    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        if (!token) {
            router.push("/login");
            return;
        }

        const fetchLeaderboard = async () => {
            try {
                setLoading(true);
                const data = await apiService.get<LeaderboardEntry[]>("/leaderboard");
                setLeaderboard(data);
            } catch (err) {
                console.error("Failed to fetch leaderboard:", err);
                setError("Could not load leaderboard.");
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, [mounted, token, apiService, router]);

    const handleLogout = async () => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_PROD_API_URL ?? "http://localhost:8080"}/auth/logout`, {
                method: "POST",
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            });
        } catch {
            // proceed anyway
        }

        clearToken();
        clearUserId();
        router.push("/login");
    };

    const columns: ColumnsType<LeaderboardEntry> = [
        {
            title: "Rank",
            dataIndex: "rank",
            key: "rank",
            width: 90,
        },
        {
            title: "Player",
            dataIndex: "username",
            key: "username",
            render: (username, record) => (
                <span style={{ fontWeight: String(record.userId) === String(loggedInUserId) ? "bold" : "normal" }}>
                    {username}
                    {String(record.userId) === String(loggedInUserId) ? " (You)" : ""}
                </span>
            ),
        },
        {
            title: "Points",
            dataIndex: "totalPoints",
            key: "totalPoints",
            sorter: (a, b) => a.totalPoints - b.totalPoints,
        },
        {
            title: "Wins",
            dataIndex: "totalWins",
            key: "totalWins",
            sorter: (a, b) => a.totalWins - b.totalWins,
        },
        {
            title: "Games",
            dataIndex: "totalGamesPlayed",
            key: "totalGamesPlayed",
            sorter: (a, b) => a.totalGamesPlayed - b.totalGamesPlayed,
        },
        {
            title: "Correct",
            dataIndex: "totalCorrectPlacements",
            key: "totalCorrectPlacements",
        },
        {
            title: "Incorrect",
            dataIndex: "totalIncorrectPlacements",
            key: "totalIncorrectPlacements",
        },
    ];

    if (!mounted) {
        return null;
    }

    return (
        <div style={{ backgroundColor: "#0f2557", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Navbar onLogout={handleLogout} />

            <main style={{ padding: "24px 32px", flex: 1 }}>
                <Card
                    style={{
                        backgroundColor: "#1a3570",
                        border: "1px solid #e3cb2c",
                        color: "white",
                    }}
                >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                        <div>
                            <h1 style={{ color: "#e3cb2c", marginBottom: 8 }}>Leaderboard</h1>
                            <p style={{ color: "white", margin: 0 }}>
                                Compare total points, wins, and placement accuracy.
                            </p>
                        </div>

                        {loggedInUserId && (
                            <Button onClick={() => router.push(`/profile/${loggedInUserId}`)}>
                                Back to Profile
                            </Button>
                        )}
                    </div>

                    {error && (
                        <Alert
                            type="error"
                            message={error}
                            style={{ marginBottom: 16 }}
                        />
                    )}

                    {loading ? (
                        <div style={{ display: "flex", justifyContent: "center", padding: "48px" }}>
                            <Spin size="large" />
                        </div>
                    ) : (
                        <Table
                            rowKey="userId"
                            columns={columns}
                            dataSource={leaderboard}
                            pagination={{ pageSize: 10 }}
                        />
                    )}
                </Card>
            </main>
        </div>
    );
};

export default LeaderboardPage;