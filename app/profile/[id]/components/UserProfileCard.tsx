"use client";

import React, { useState } from "react";
import { User } from "@/types/user";
import { getApiDomain } from "@/utils/domain";
import useSessionStorage from "@/hooks/useSessionStorage";
import AvatarPicker from "@/profile/[id]/components/AvatarPicker";

interface UserProfileCardProps {
    user: User;
    isOwnProfile: boolean;
    onAvatarUpdated: (newAvatarUrl: string) => void;
}

function getRankLabel(wins: number): string {
    if (wins >= 25) return "Legend";
    if (wins >= 10) return "Professor";
    if (wins >= 3)  return "Scholar";
    return "Historian";
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ user, isOwnProfile, onAvatarUpdated }) => {
    const [pickerOpen, setPickerOpen] = useState(false);
    const [saving, setSaving]         = useState(false);
    const { value: token }            = useSessionStorage<string>("token", "");

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

    const handleSaveAvatar = async (url: string) => {
        setSaving(true);
        try {
            const res = await fetch(`${getApiDomain()}/users/${user.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token,
                },
                body: JSON.stringify({ avatarUrl: url }),
            });
            if (!res.ok) throw new Error("Failed to update avatar");
            setPickerOpen(false);
            onAvatarUpdated(url);
        } catch (err) {
            console.error("Avatar update failed:", err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <div className="panel-card" style={{ flex: 1, alignItems: "stretch", gap: "0px" }}>
                <h2 className="panel-title">User Profile</h2>

                {/* Identity block */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                    <div style={{ position: "relative" }}>
                        {user.avatarUrl ? (
                            <img
                                src={user.avatarUrl}
                                alt="avatar"
                                style={{
                                    width: 96,
                                    height: 96,
                                    borderRadius: "50%",
                                    border: "2px solid #e3cb2c",
                                    display: "block",
                                    objectFit: "cover",
                                    backgroundColor: "#0f2557",
                                }}
                            />
                        ) : (
                            <div className="panel-avatar">{initial}</div>
                        )}
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

                    {isOwnProfile && (
                        <button
                            className="panel-icon-btn"
                            onClick={() => setPickerOpen(true)}
                            style={{ fontSize: "0.73rem", padding: "0 12px", height: 26, marginTop: -4 }}
                        >
                            Change Avatar
                        </button>
                    )}

                    <div style={{ textAlign: "center", lineHeight: 1.45 }}>
                        <div style={{ color: "#ffffff", fontWeight: "bold", fontSize: "1.2rem", fontFamily: "Georgia, serif" }}>
                            {user.username}
                        </div>
                        <div style={{ color: statusColor, fontSize: "0.82rem", fontFamily: "Georgia, serif" }}>
                            {statusLabel}
                        </div>
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

            <AvatarPicker
                open={pickerOpen}
                currentAvatarUrl={user.avatarUrl}
                saving={saving}
                onSave={handleSaveAvatar}
                onClose={() => setPickerOpen(false)}
            />
        </>
    );
};

export default UserProfileCard;
