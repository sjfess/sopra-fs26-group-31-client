"use client";

import React from "react";
import { User } from "@/types/user";

interface UserProfileCardProps {
    user: User;
    isOwnProfile: boolean;
}

const cardStyle: React.CSSProperties = {
    backgroundColor: "#1a3570",
    border: "1px solid #e3cb2c",
    borderRadius: "8px",
    padding: "24px",
};

const cardTitleStyle: React.CSSProperties = {
    color: "#e3cb2c",
    fontFamily: "Georgia, serif",
    fontSize: "1.1rem",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "16px",
};

const statBoxStyle: React.CSSProperties = {
    backgroundColor: "#0f2557",
    border: "1px solid rgba(227, 203, 44, 0.4)",
    borderRadius: "4px",
    padding: "12px",
    textAlign: "center",
    flex: 1,
};

const UserProfileCard: React.FC<UserProfileCardProps> = ({ user }) => {
    const avgPoints = user.totalGamesPlayed
        ? Math.round((user.totalPoints ?? 0) / user.totalGamesPlayed)
        : 0;

    return (
        <div
            style={{
                ...cardStyle,
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px",
            }}
        >
            <h2 style={cardTitleStyle}>User Profile</h2>

            {/* Avatar */}
            <div
                style={{
                    width: "96px",
                    height: "96px",
                    backgroundColor: "#0f2557",
                    border: "1px solid #e3cb2c",
                    color: "#e3cb2c",
                    borderRadius: "50%",
                    marginBottom: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "Georgia, serif",
                    fontWeight: "bold",
                    fontSize: "2.2rem",
                }}
            >
                {(user.username ?? "?").charAt(0).toUpperCase()}
            </div>

            <div style={{ textAlign: "center" }}>
                <div style={{ color: "white", fontWeight: "bold", fontSize: "1.2rem" }}>
                    {user.username}
                </div>
                <div style={{ color: "#4caf50", fontSize: "0.9rem" }}>
                    {user.status === "ONLINE" ? "Online" : "Offline"}
                </div>
            </div>

            {/* Stats grid — row 1 */}
            <div style={{ display: "flex", gap: "8px", width: "100%" }}>
                <div style={statBoxStyle}>
                    <div style={{ color: "#cdd8f0", fontSize: "0.75rem" }}>Games Played</div>
                    <div style={{ color: "#e3cb2c", fontWeight: "bold", fontSize: "1.4rem" }}>
                        {user.totalGamesPlayed ?? 0}
                    </div>
                </div>
                <div style={statBoxStyle}>
                    <div style={{ color: "#cdd8f0", fontSize: "0.75rem" }}>Wins</div>
                    <div style={{ color: "#e3cb2c", fontWeight: "bold", fontSize: "1.4rem" }}>
                        {user.totalWins ?? 0}
                    </div>
                </div>
            </div>

            {/* Stats grid — row 2 */}
            <div style={{ display: "flex", gap: "8px", width: "100%" }}>
                <div style={statBoxStyle}>
                    <div style={{ color: "#cdd8f0", fontSize: "0.75rem" }}>Avg. Points</div>
                    <div style={{ color: "#e3cb2c", fontWeight: "bold", fontSize: "1.4rem" }}>
                        {avgPoints}
                    </div>
                </div>
                <div style={statBoxStyle}>
                    <div style={{ color: "#cdd8f0", fontSize: "0.75rem" }}>Accuracy</div>
                    <div style={{ color: "#e3cb2c", fontWeight: "bold", fontSize: "1.4rem" }}>
                        {(() => {
                            const correct = user.totalCorrectPlacements ?? 0;
                            const incorrect = user.totalIncorrectPlacements ?? 0;
                            const total = correct + incorrect;
                            return total > 0 ? `${Math.round((correct / total) * 100)}%` : "N/A";
                        })()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfileCard;