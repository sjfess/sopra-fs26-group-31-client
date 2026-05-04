"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Table, Spin, Alert, Button, Card, Empty } from "antd";
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

    const getTitleForPlayer = (record: LeaderboardEntry, index: number, totalPlayers: number) => {
        if (record.rank === 1) return { icon: "👑", title: "OverBoss", color: "#ffd700" };
        if (record.rank === 2) return { icon: "🧠", title: "MegaBirne", color: "#c0c0c0" };
        if (record.rank === 3) return { icon: "🐶", title: "GeileHund", color: "#cd7f32" };

        if (totalPlayers > 3 && index === totalPlayers - 1) {
            return { icon: "🍺", title: "Captain Alcohol", color: "#f6b73c" };
        }

        return { icon: "🃏", title: "Timeline Peasant", color: "#ffffff" };
    };

    const topThree = useMemo(() => leaderboard.slice(0, 3), [leaderboard]);
    const lastPlayer = useMemo(() => {
        if (leaderboard.length <= 3) return null;
        return leaderboard[leaderboard.length - 1];
    }, [leaderboard]);

    const columns: ColumnsType<LeaderboardEntry> = [
        {
            title: "Rank",
            dataIndex: "rank",
            key: "rank",
            width: 90,
            render: (rank) => (
                <span style={{ fontWeight: "bold", color: "#e3cb2c" }}>
                    #{rank}
                </span>
            ),
        },
        {
            title: "Player",
            dataIndex: "username",
            key: "username",
            render: (username, record, index) => {
                const badge = getTitleForPlayer(record, index, leaderboard.length);
                const isCurrentUser = String(record.userId) === String(loggedInUserId);

                return (
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <span style={{ fontWeight: isCurrentUser ? "bold" : "normal" }}>
                            {badge.icon} {username}
                            {isCurrentUser ? " (You)" : ""}
                        </span>
                        <span
                            style={{
                                color: badge.color,
                                fontSize: "0.8rem",
                                fontWeight: "bold",
                            }}
                        >
                            {badge.title}
                        </span>
                    </div>
                );
            },
        },
        {
            title: "Points",
            dataIndex: "totalPoints",
            key: "totalPoints",
            sorter: (a, b) => a.totalPoints - b.totalPoints,
            render: (points) => <strong>{points}</strong>,
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
        <div
            style={{
                background:
                    "radial-gradient(circle at top left, #263f85 0%, #0f2557 35%, #071633 100%)",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflow: "hidden",
            }}
        >
            <Navbar onLogout={handleLogout} />

            <div
                style={{
                    position: "absolute",
                    top: 135,
                    left: 26,
                    fontSize: 72,
                    opacity: 0.18,
                    transform: "rotate(-18deg)",
                    pointerEvents: "none",
                }}
            >
                🐉
            </div>

            <div
                style={{
                    position: "absolute",
                    top: 170,
                    right: 38,
                    fontSize: 82,
                    opacity: 0.16,
                    transform: "rotate(12deg)",
                    pointerEvents: "none",
                }}
            >
                🐲
            </div>

            <div
                style={{
                    position: "absolute",
                    bottom: 26,
                    left: 70,
                    fontSize: 68,
                    opacity: 0.13,
                    pointerEvents: "none",
                }}
            >
                🐺
            </div>

            <main style={{ padding: "24px 32px", flex: 1, position: "relative", zIndex: 1 }}>
                <Card
                    style={{
                        background:
                            "linear-gradient(145deg, rgba(26,53,112,0.97), rgba(20,42,92,0.97))",
                        border: "2px solid #e3cb2c",
                        color: "white",
                        boxShadow: "0 0 35px rgba(227, 203, 44, 0.18)",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 24,
                            gap: 24,
                        }}
                    >
                        <div>
                            <div
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 10,
                                    backgroundColor: "rgba(227, 203, 44, 0.12)",
                                    border: "1px solid rgba(227, 203, 44, 0.5)",
                                    borderRadius: 999,
                                    padding: "6px 14px",
                                    marginBottom: 12,
                                    color: "#e3cb2c",
                                    fontWeight: "bold",
                                }}
                            >
                                🐉 Royal Monster Ranking
                            </div>

                            <h1
                                style={{
                                    color: "#e3cb2c",
                                    marginBottom: 8,
                                    fontSize: "3rem",
                                    lineHeight: 1,
                                    textShadow: "0 3px 0 rgba(0,0,0,0.35)",
                                }}
                            >
                                Leaderboard
                            </h1>

                            <p style={{ color: "white", margin: 0, fontSize: "1.05rem" }}>
                                Compare points, wins, placement accuracy, and pure historical dominance.
                            </p>
                        </div>

                        {loggedInUserId && (
                            <Button
                                onClick={() => router.push(`/profile/${loggedInUserId}`)}
                                style={{
                                    fontWeight: "bold",
                                    borderRadius: 999,
                                    height: 46,
                                    padding: "0 22px",
                                }}
                            >
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
                    ) : leaderboard.length === 0 ? (
                        <Empty
                            description={
                                <span style={{ color: "white" }}>
                                    No warriors have entered the leaderboard yet.
                                </span>
                            }
                        />
                    ) : (
                        <>
                            <section
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                                    gap: 18,
                                    marginBottom: 28,
                                }}
                            >
                                {topThree.map((player, index) => {
                                    const badge = getTitleForPlayer(player, index, leaderboard.length);
                                    const isFirst = player.rank === 1;
                                    const isCurrentUser = String(player.userId) === String(loggedInUserId);

                                    return (
                                        <Card
                                            key={player.userId}
                                            style={{
                                                background: isFirst
                                                    ? "linear-gradient(160deg, rgba(227,203,44,0.95), rgba(255,244,151,0.9))"
                                                    : "linear-gradient(160deg, rgba(255,255,255,0.12), rgba(255,255,255,0.05))",
                                                border: isFirst
                                                    ? "2px solid #fff4a3"
                                                    : "1px solid rgba(255,255,255,0.25)",
                                                borderRadius: 18,
                                                minHeight: 190,
                                                boxShadow: isFirst
                                                    ? "0 0 30px rgba(227,203,44,0.45)"
                                                    : "0 0 20px rgba(0,0,0,0.2)",
                                                transform: isFirst ? "translateY(-8px)" : "none",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                    textAlign: "center",
                                                    color: isFirst ? "#0f2557" : "white",
                                                }}
                                            >
                                                <div style={{ fontSize: isFirst ? 58 : 46 }}>
                                                    {badge.icon}
                                                </div>

                                                <div
                                                    style={{
                                                        fontSize: "0.9rem",
                                                        fontWeight: "bold",
                                                        opacity: 0.85,
                                                        marginTop: 4,
                                                    }}
                                                >
                                                    Rank #{player.rank}
                                                </div>

                                                <h2
                                                    style={{
                                                        margin: "6px 0 2px",
                                                        color: isFirst ? "#0f2557" : "#e3cb2c",
                                                    }}
                                                >
                                                    {badge.title}
                                                </h2>

                                                <div
                                                    style={{
                                                        fontSize: "1.15rem",
                                                        fontWeight: "bold",
                                                        marginBottom: 8,
                                                    }}
                                                >
                                                    {player.username}
                                                    {isCurrentUser ? " (You)" : ""}
                                                </div>

                                                <div style={{ fontSize: "0.95rem" }}>
                                                    {player.totalPoints} pts · {player.totalWins} wins
                                                </div>
                                            </div>
                                        </Card>
                                    );
                                })}
                            </section>

                            {lastPlayer && (
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        gap: 16,
                                        background:
                                            "linear-gradient(90deg, rgba(246,183,60,0.18), rgba(255,255,255,0.05))",
                                        border: "1px dashed #f6b73c",
                                        borderRadius: 16,
                                        padding: "14px 18px",
                                        marginBottom: 26,
                                        color: "white",
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                                        <span style={{ fontSize: 34 }}>🍺</span>
                                        <div>
                                            <strong style={{ color: "#f6b73c" }}>
                                                Captain Alcohol detected
                                            </strong>
                                            <div style={{ fontSize: "0.95rem" }}>
                                                {lastPlayer.username} is bravely guarding the bottom of the leaderboard.
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ fontWeight: "bold", color: "#f6b73c" }}>
                                        Rank #{lastPlayer.rank}
                                    </div>
                                </div>
                            )}

                            <Table
                                rowKey="userId"
                                columns={columns}
                                dataSource={leaderboard}
                                pagination={{ pageSize: 10 }}
                                style={{
                                    backgroundColor: "rgba(255,255,255,0.04)",
                                    borderRadius: 12,
                                    overflow: "hidden",
                                }}
                                rowClassName={(record, index) => {
                                    if (record.rank === 1) return "leaderboard-row-first";
                                    if (record.rank === 2) return "leaderboard-row-second";
                                    if (record.rank === 3) return "leaderboard-row-third";
                                    if (leaderboard.length > 3 && index === leaderboard.length - 1) {
                                        return "leaderboard-row-last";
                                    }
                                    return "";
                                }}
                            />
                        </>
                    )}
                </Card>
            </main>

            <style jsx global>{`
                .ant-table {
                    background: transparent !important;
                    color: white !important;
                }

                .ant-table-thead > tr > th {
                    background: rgba(8, 22, 54, 0.92) !important;
                    color: #e3cb2c !important;
                    border-bottom: 1px solid rgba(227, 203, 44, 0.45) !important;
                    font-weight: 800 !important;
                }

                .ant-table-tbody > tr > td {
                    background: rgba(255, 255, 255, 0.035) !important;
                    color: white !important;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.12) !important;
                }

                .ant-table-tbody > tr:hover > td {
                    background: rgba(227, 203, 44, 0.12) !important;
                }

                .leaderboard-row-first > td {
                    background: rgba(227, 203, 44, 0.18) !important;
                }

                .leaderboard-row-second > td {
                    background: rgba(192, 192, 192, 0.13) !important;
                }

                .leaderboard-row-third > td {
                    background: rgba(205, 127, 50, 0.13) !important;
                }

                .leaderboard-row-last > td {
                    background: rgba(246, 183, 60, 0.09) !important;
                }

                .ant-pagination-item {
                    background: transparent !important;
                    border-color: #e3cb2c !important;
                }

                .ant-pagination-item a {
                    color: #e3cb2c !important;
                }

                .ant-pagination-item-active {
                    background: rgba(227, 203, 44, 0.18) !important;
                }

                .ant-table-column-sorter {
                    color: #e3cb2c !important;
                }
            `}</style>
        </div>
    );
};

export default LeaderboardPage;