"use client";

import React, { useState } from "react";
import { Input } from "antd";

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

const FriendsPanel: React.FC = () => {
    const [searchValue, setSearchValue] = useState("");

    const handleSearch = () => {
        if (!searchValue.trim()) return;
        // TODO: implement friend request API call
        console.log("Searching for:", searchValue);
    };

    return (
        <div
            style={{
                ...cardStyle,
                flex: 1.2,
                display: "flex",
                flexDirection: "column",
                gap: "12px",
            }}
        >
            <h2 style={cardTitleStyle}>Friends</h2>

            <Input
                placeholder="Add Friend"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onPressEnter={handleSearch}
                suffix={
                    <span style={{ cursor: "pointer" }} onClick={handleSearch}>
            🔍
          </span>
                }
            />

            <div>
                <div style={{ color: "#e3cb2c", fontWeight: "bold", marginBottom: "8px" }}>
                    Friend Requests
                </div>
                {/* TODO: map over pending requests here */}
                <div style={{ color: "#cdd8f0", fontSize: "0.85rem", fontStyle: "italic" }}>
                    No pending requests
                </div>
            </div>

            <div>
                <div style={{ color: "#e3cb2c", fontWeight: "bold", marginBottom: "8px" }}>
                    Friends List
                </div>
                {/* TODO: map over friends with online/offline status here */}
                <div style={{ color: "#cdd8f0", fontSize: "0.85rem", fontStyle: "italic" }}>
                    No friends yet
                </div>
            </div>
        </div>
    );
};

export default FriendsPanel;