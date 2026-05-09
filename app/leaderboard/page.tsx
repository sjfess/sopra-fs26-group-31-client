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
        if (record.rank === 1) return { icon: "👑", title: "UltraHistoryBoss", color: "#ffd700" };
        if (record.rank === 2) return { icon: "🧠", title: "MegaBrain", color: "#c0c0c0" };
        if (record.rank === 3) return { icon: "🐶", title: "CrazyDawg", color: "#cd7f32" };

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
                                🐉 Royal Ranking of Histomaniacs 🐉
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
                                    position: "relative",
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                                    gap: 22,
                                    marginBottom: 34,
                                    padding: "28px 18px 18px",
                                    borderRadius: 24,
                                    background:
                                        "radial-gradient(circle at top, rgba(227,203,44,0.20), rgba(255,255,255,0.04) 45%, rgba(0,0,0,0.10))",
                                    border: "1px solid rgba(227,203,44,0.35)",
                                    overflow: "hidden",
                                }}
                            >
                                <div className="chaos-orbit chaos-orbit-left">🐉</div>
                                <div className="chaos-orbit chaos-orbit-right">🦄</div>
                                <div className="chaos-orbit chaos-orbit-bottom">🧌</div>

                                <div
                                    style={{
                                        position: "absolute",
                                        top: 10,
                                        left: 18,
                                        color: "#e3cb2c",
                                        fontWeight: "bold",
                                        letterSpacing: 1.2,
                                        fontSize: "0.8rem",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    Hall of absolutely questionable greatness
                                </div>

                                {topThree.map((player, index) => {
                                    const badge = getTitleForPlayer(player, index, leaderboard.length);
                                    const isFirst = player.rank === 1;
                                    const isSecond = player.rank === 2;
                                    const isThird = player.rank === 3;
                                    const isCurrentUser = String(player.userId) === String(loggedInUserId);

                                    return (
                                        <Card
                                            key={player.userId}
                                            className={
                                                isFirst
                                                    ? "podium-card podium-card-first"
                                                    : isSecond
                                                        ? "podium-card podium-card-second"
                                                        : isThird
                                                            ? "podium-card podium-card-third"
                                                            : "podium-card"
                                            }
                                            onClick={() => router.push(`/profile/${player.userId}`)}
                                            style={{
                                                borderRadius: 24,
                                                minHeight: isFirst ? 135 : 155,
                                                maxWidth: isFirst ? 560 : undefined,
                                                width: isFirst ? "70%" : "100%",
                                                justifySelf: isFirst ? "center" : "stretch",
                                                transform: isFirst ? "translateY(8px) scale(0.88)" : "translateY(8px)",
                                            }}
                                        >
                                            <div className="podium-confetti">
                                                {isFirst ? "⚡ 👑 🔥 🐉 ⚡" : isSecond ? "🧠 ✨ 🧪 ✨ 🧠" : "🐶 🔥 🦴 🔥 🐶"}
                                            </div>

                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                    textAlign: "center",
                                                    position: "relative",
                                                    zIndex: 2,
                                                }}
                                            >
                                                <div className={isFirst ? "boss-icon" : "mini-boss-icon"}>
                                                    {badge.icon}
                                                </div>

                                                <div className="rank-pill">
                                                    Rank #{player.rank}
                                                </div>

                                                <h2
                                                    style={{
                                                        margin: "10px 0 4px",
                                                        color: isFirst ? "#0f2557" : "#e3cb2c",
                                                        fontSize: isFirst ? "2rem" : "1.55rem",
                                                        textShadow: isFirst
                                                            ? "0 2px 0 rgba(255,255,255,0.4)"
                                                            : "0 3px 0 rgba(0,0,0,0.35)",
                                                    }}
                                                >
                                                    {badge.title}
                                                </h2>

                                                <div
                                                    style={{
                                                        fontSize: isFirst ? "1.35rem" : "1.1rem",
                                                        fontWeight: "bold",
                                                        color: isFirst ? "#0f2557" : "#ffffff",
                                                        marginBottom: 10,
                                                    }}
                                                >
                                                    {player.username}
                                                    {isCurrentUser ? " (You)" : ""}
                                                </div>

                                                <div className={isFirst ? "boss-score" : "mini-score"}>
                                                    {player.totalPoints} pts
                                                </div>

                                                <div
                                                    style={{
                                                        marginTop: 8,
                                                        color: isFirst ? "#0f2557" : "rgba(255,255,255,0.88)",
                                                        fontWeight: 700,
                                                    }}
                                                >
                                                    {player.totalWins} wins · {player.totalGamesPlayed} games
                                                </div>
                                            </div>
                                        </Card>
                                    );
                                })}
                            </section>

                            {lastPlayer && (
                                <div className="captain-alcohol-banner">
                                    <div className="beer-bubble">🍺</div>
                                    <div className="beer-bubble beer-bubble-two">🍻</div>

                                    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                                        <span className="captain-icon">🍺</span>
                                        <div>
                                            <strong className="captain-title">
                                                Captain Alcohol has entered the tavern
                                            </strong>
                                            <div style={{ fontSize: "1rem", color: "rgba(255,255,255,0.92)" }}>
                                                {lastPlayer.username} is bravely protecting the leaderboard basement from total collapse.
                                            </div>
                                        </div>
                                    </div>

                                    <div className="captain-rank">
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
                .ant-card-body {
                    position: relative;
                }

                .ant-table {
                    background: transparent !important;
                    color: white !important;
                }

                .ant-table-thead > tr > th {
                    background: rgba(8, 22, 54, 0.96) !important;
                    color: #e3cb2c !important;
                    border-bottom: 1px solid rgba(227, 203, 44, 0.45) !important;
                    font-weight: 900 !important;
                    text-transform: uppercase;
                    letter-spacing: 0.8px;
                }

                .ant-table-tbody > tr > td {
                    background: rgba(255, 255, 255, 0.035) !important;
                    color: white !important;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.12) !important;
                }

                .ant-table-tbody > tr:hover > td {
                    background: rgba(227, 203, 44, 0.16) !important;
                }

                .leaderboard-row-first > td {
                    background: rgba(227, 203, 44, 0.18) !important;
                    font-weight: bold;
                }

                .leaderboard-row-second > td {
                    background: rgba(192, 192, 192, 0.13) !important;
                }

                .leaderboard-row-third > td {
                    background: rgba(205, 127, 50, 0.13) !important;
                }

                .leaderboard-row-last > td {
                    background: rgba(246, 183, 60, 0.11) !important;
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
                    box-shadow: 0 0 12px rgba(227, 203, 44, 0.4);
                }

                .ant-table-column-sorter {
                    color: #e3cb2c !important;
                }

                .podium-card {
                    position: relative;
                    overflow: hidden;
                    border: 1px solid rgba(255,255,255,0.25) !important;
                    background: linear-gradient(160deg, rgba(255,255,255,0.14), rgba(255,255,255,0.04)) !important;
                    box-shadow: 0 18px 38px rgba(0,0,0,0.25);
                    transition: transform 0.25s ease, box-shadow 0.25s ease;
                }

                .podium-card:hover {
                    transform: translateY(-4px) scale(1.025) !important;
                    box-shadow: 0 24px 50px rgba(0,0,0,0.35);
                }

                .podium-card-first {
                    border: 3px solid #fff4a3 !important;
                    background: linear-gradient(150deg, #e3cb2c, #fff4a3 45%, #f3b700) !important;
                    box-shadow:
                            0 0 22px rgba(227,203,44,0.75),
                            0 0 60px rgba(227,203,44,0.35),
                            0 24px 55px rgba(0,0,0,0.35);
                    animation: bossPulse 2.1s infinite ease-in-out;
                }

                .podium-card-second {
                    border: 2px solid rgba(210, 230, 255, 0.75) !important;
                    box-shadow:
                            0 0 24px rgba(180,220,255,0.28),
                            0 18px 38px rgba(0,0,0,0.25);
                }

                .podium-card-third {
                    border: 2px solid rgba(255, 173, 89, 0.75) !important;
                    box-shadow:
                            0 0 24px rgba(255, 150, 65, 0.25),
                            0 18px 38px rgba(0,0,0,0.25);
                }

                .podium-confetti {
                    position: absolute;
                    top: 10px;
                    left: 0;
                    right: 0;
                    text-align: center;
                    font-size: 1rem;
                    opacity: 0.55;
                    pointer-events: none;
                }

                .boss-icon {
                    font-size: 76px;
                    line-height: 1;
                    animation: crownBounce 1.7s infinite ease-in-out;
                    filter: drop-shadow(0 8px 10px rgba(0,0,0,0.25));
                }

                .mini-boss-icon {
                    font-size: 54px;
                    line-height: 1;
                    filter: drop-shadow(0 8px 10px rgba(0,0,0,0.25));
                }

                .rank-pill {
                    margin-top: 10px;
                    padding: 5px 13px;
                    border-radius: 999px;
                    background: rgba(15,37,87,0.82);
                    color: #e3cb2c;
                    font-weight: 900;
                    font-size: 0.78rem;
                    letter-spacing: 0.8px;
                    text-transform: uppercase;
                    border: 1px solid rgba(227,203,44,0.5);
                }

                .boss-score {
                    padding: 9px 18px;
                    border-radius: 999px;
                    background: #0f2557;
                    color: #e3cb2c;
                    font-weight: 900;
                    font-size: 1.1rem;
                    box-shadow: 0 0 18px rgba(15,37,87,0.45);
                }

                .mini-score {
                    padding: 8px 16px;
                    border-radius: 999px;
                    background: rgba(227,203,44,0.16);
                    color: #e3cb2c;
                    font-weight: 900;
                    font-size: 1rem;
                    border: 1px solid rgba(227,203,44,0.4);
                }

                .chaos-orbit {
                    position: absolute;
                    pointer-events: none;
                    opacity: 0.18;
                    z-index: 0;
                    font-size: 90px;
                    filter: blur(0.2px);
                }

                .chaos-orbit-left {
                    left: -12px;
                    top: 60px;
                    animation: floatyDragon 5s infinite ease-in-out;
                }

                .chaos-orbit-right {
                    right: 18px;
                    top: 28px;
                    animation: floatyDragon 6s infinite ease-in-out reverse;
                }

                .chaos-orbit-bottom {
                    bottom: -18px;
                    left: 46%;
                    animation: goblinWiggle 3.5s infinite ease-in-out;
                }

                .captain-alcohol-banner {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 16px;
                    background:
                            linear-gradient(90deg, rgba(246,183,60,0.24), rgba(255,255,255,0.05)),
                            radial-gradient(circle at left, rgba(255,210,90,0.25), transparent 35%);
                    border: 2px dashed #f6b73c;
                    border-radius: 22px;
                    padding: 18px 22px;
                    margin-bottom: 30px;
                    color: white;
                    overflow: hidden;
                    box-shadow: 0 0 25px rgba(246,183,60,0.16);
                }

                .captain-icon {
                    font-size: 46px;
                    animation: beerShake 1.8s infinite ease-in-out;
                    filter: drop-shadow(0 6px 8px rgba(0,0,0,0.25));
                }

                .captain-title {
                    display: block;
                    color: #f6b73c;
                    font-size: 1.15rem;
                    margin-bottom: 4px;
                    text-transform: uppercase;
                    letter-spacing: 0.7px;
                }

                .captain-rank {
                    position: relative;
                    z-index: 2;
                    font-weight: 900;
                    color: #0f2557;
                    background: #f6b73c;
                    border-radius: 999px;
                    padding: 10px 18px;
                    box-shadow: 0 0 16px rgba(246,183,60,0.45);
                    white-space: nowrap;
                }

                .beer-bubble {
                    position: absolute;
                    right: 90px;
                    top: -16px;
                    font-size: 38px;
                    opacity: 0.15;
                    animation: beerFloat 4s infinite ease-in-out;
                }

                .beer-bubble-two {
                    right: 160px;
                    top: 36px;
                    font-size: 32px;
                    animation-delay: 1.2s;
                }

                @keyframes bossPulse {
                    0%, 100% {
                        box-shadow:
                                0 0 22px rgba(227,203,44,0.75),
                                0 0 60px rgba(227,203,44,0.35),
                                0 24px 55px rgba(0,0,0,0.35);
                    }
                    50% {
                        box-shadow:
                                0 0 34px rgba(227,203,44,0.95),
                                0 0 85px rgba(227,203,44,0.50),
                                0 24px 55px rgba(0,0,0,0.35);
                    }
                }

                @keyframes crownBounce {
                    0%, 100% {
                        transform: translateY(0) rotate(-3deg);
                    }
                    50% {
                        transform: translateY(-8px) rotate(4deg);
                    }
                }

                @keyframes floatyDragon {
                    0%, 100% {
                        transform: translateY(0) rotate(-8deg);
                    }
                    50% {
                        transform: translateY(-18px) rotate(8deg);
                    }
                }

                @keyframes goblinWiggle {
                    0%, 100% {
                        transform: translateX(0) rotate(-7deg);
                    }
                    50% {
                        transform: translateX(20px) rotate(7deg);
                    }
                }

                @keyframes beerShake {
                    0%, 100% {
                        transform: rotate(-7deg);
                    }
                    50% {
                        transform: rotate(8deg) scale(1.08);
                    }
                }

                @keyframes beerFloat {
                    0%, 100% {
                        transform: translateY(0) rotate(-10deg);
                    }
                    50% {
                        transform: translateY(18px) rotate(12deg);
                    }
                }

                @media (max-width: 800px) {
                    .podium-card-first {
                        transform: none !important;
                    }

                    .captain-alcohol-banner {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .captain-rank {
                        align-self: flex-end;
                    }
                }
            `}</style>
        </div>
    );
};

export default LeaderboardPage;