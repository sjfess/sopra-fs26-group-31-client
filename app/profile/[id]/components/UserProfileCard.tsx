"use client";

import React from "react";
import { User } from "@/types/user";

interface UserProfileCardProps {
    user: User;
    isOwnProfile: boolean;
}

function getRankLabel(wins: number): string {
    if (wins >= 25) return "Legend";
    if (wins >= 10) return "Professor";
    if (wins >= 3)  return "Scholar";
    return "Historian";
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ user }) => {
    const wins            = user.totalWins ?? 0;
    const gamesPlayed     = user.totalGamesPlayed ?? 0;
    const correct         = user.totalCorrectPlacements ?? 0;
    const incorrect       = user.totalIncorrectPlacements ?? 0;
    const totalPlacements = correct + incorrect;
    const accuracyPct     = totalPlacements > 0 ? Math.round((correct / totalPlacements) * 100) : 0;
    const winRatePct      = gamesPlayed > 0 ? Math.round((wins / gamesPlayed) * 100) : 0;
    const avgPoints       = gamesPlayed > 0 ? Math.round((user.totalPoints ?? 0) / gamesPlayed) : 0;
    const isOnline        = user.status === "ONLINE";
    const isInGame        = user.status === "IN_GAME";
    const statusClassName = isOnline ? "online" : isInGame ? "in-game" : "offline";
    const statusLabel     = isOnline ? "Online" : isInGame ? "In Game" : "Offline";
    const statusColor     = isOnline ? "#81c784" : isInGame ? "#f6c36a" : "#8da4cc";
    const rank            = getRankLabel(wins);
    const initial         = (user.username ?? "?").charAt(0).toUpperCase();

    return (
        <div className="panel-card" style={{ flex: 1, alignItems: "stretch", gap: "0px" }}>
            <h2 className="panel-title">User Profile</h2>

            {/* Identity block */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                <div style={{ position: "relative" }}>
                    <div className="panel-avatar">{initial}</div>
                    <span
                        className={`panel-status-dot ${statusClassName}`}
                        style={{
                            position: "absolute",
                            bottom: 4,
                            right: 4,
                            width: 14,
                            height: 14,
                            border: "2px solid #1a3570",
                        }}
                    />
                </div>

                <div style={{ textAlign: "center", lineHeight: 1.45 }}>
                    <div style={{ color: "#ffffff", fontWeight: "bold", fontSize: "1.2rem", fontFamily: "Georgia, serif" }}>
                        {user.username}
                    </div>
                    <div style={{ color: statusColor, fontSize: "0.82rem", fontFamily: "Georgia, serif" }}>
                        {statusLabel}
                    </div>
                    {/* Rank as subtle gold caption — fits the palette */}
                    <div style={{
                        color: "#e3cb2c",
                        fontSize: "0.72rem",
                        fontFamily: "Georgia, serif",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        marginTop: 6,
                        opacity: 0.9,
                    }}>
                        {rank}
                    </div>
                </div>
            </div>

            {/* Stats bars */}
            <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                    <div style={{
                        display: "flex", justifyContent: "space-between",
                        fontFamily: "Georgia, serif", fontSize: "0.8rem", marginBottom: 6,
                    }}>
                        <span style={{ color: "#cdd8f0" }}>Win Rate</span>
                        <span style={{ color: "#e3cb2c", fontWeight: "bold" }}>{winRatePct}%</span>
                    </div>
                    <div className="panel-bar-track">
                        <div className="panel-bar-fill" style={{ width: `${winRatePct}%` }} />
                    </div>
                </div>

                <div>
                    <div style={{
                        display: "flex", justifyContent: "space-between",
                        fontFamily: "Georgia, serif", fontSize: "0.8rem", marginBottom: 6,
                    }}>
                        <span style={{ color: "#cdd8f0" }}>Accuracy</span>
                        <span style={{ color: "#e3cb2c", fontWeight: "bold" }}>
                            {totalPlacements > 0 ? `${accuracyPct}%` : "—"}
                        </span>
                    </div>
                    <div className="panel-bar-track">
                        <div
                            className="panel-bar-fill"
                            style={{ width: `${accuracyPct}%`, opacity: 0.75, animationDelay: "0.1s" }}
                        />
                    </div>
                </div>
            </div>

            {/* Stat tiles */}
            <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
                <div className="panel-stat-tile">
                    <div className="stat-value">{gamesPlayed}</div>
                    <div className="stat-label">Games</div>
                </div>
                <div className="panel-stat-tile">
                    <div className="stat-value">{wins}</div>
                    <div className="stat-label">Wins</div>
                </div>
                <div className="panel-stat-tile">
                    <div className="stat-value">{avgPoints}</div>
                    <div className="stat-label">Avg Pts</div>
                </div>
            </div>
        </div>
    );
};

export default UserProfileCard;
