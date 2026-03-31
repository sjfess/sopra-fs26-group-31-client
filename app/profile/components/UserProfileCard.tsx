"use client";

import React from "react";
import { User } from "@/types/user";

interface UserProfileCardProps {
    user: User;
}

const cardStyle: React.CSSProperties = {
    backgroundColor: "#0d1b4b",
    border: "1px solid #e3cb2c",
    borderRadius: "12px",
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
    border: "1px solid #e3cb2c",
    borderRadius: "8px",
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
                    width: "120px",
                    height: "80px",
                    backgroundColor: "#c8a97e",
                    borderRadius: "50%",
                    marginBottom: "8px",
                }}
            />

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
                        0%
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfileCard;