"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Input, Button, App } from "antd";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

interface FriendRequest {
    id: number;
    senderId: number;
    senderUsername: string;
    receiverId: number;
    receiverUsername: string;
    status: string;
}

interface Friend {
    id: number;
    username: string;
    status: string;
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

const FriendsPanel: React.FC = () => {
    const { message } = App.useApp();
    const [searchValue, setSearchValue] = useState("");
    const [friends, setFriends] = useState<Friend[]>([]);
    const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
    const [userId, setUserId] = useState<string | null>(null);

    // userId sicher im useEffect lesen (kein Hydration-Problem)
    useEffect(() => {
        setUserId(localStorage.getItem("userId"));
    }, []);

    const fetchFriends = useCallback(async () => {
        if (!userId) return;
        try {
            const res = await fetch(`${API_BASE}/users/${userId}/friends`);
            if (!res.ok) throw new Error();
            const data = await res.json();
            setFriends(data);
        } catch {
            message.error("Could not load friends.");
        }
    }, [userId, message]);

    const fetchFriendRequests = useCallback(async () => {
        if (!userId) return;
        try {
            const res = await fetch(`${API_BASE}/users/${userId}/friend-requests`);
            if (!res.ok) throw new Error();
            const data = await res.json();
            setFriendRequests(data);
        } catch {
            message.error("Could not load friend requests.");
        }
    }, [userId, message]);

    // Polling alle 10 Sekunden
    useEffect(() => {
        if (!userId) return;
        fetchFriends();
        fetchFriendRequests();

        const interval = setInterval(() => {
            fetchFriends();
            fetchFriendRequests();
        }, 10000);

        return () => clearInterval(interval);
    }, [userId, fetchFriends, fetchFriendRequests]);

    const handleSendRequest = async () => {
        if (!searchValue.trim()) return;
        try {
            const res = await fetch(`${API_BASE}/friend-requests`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    senderId: Number(userId),
                    receiverUsername: searchValue.trim(),
                }),
            });
            if (res.status === 404) throw new Error("User not found.");
            if (res.status === 409) throw new Error("Request already exists or already friends.");
            if (!res.ok) throw new Error("Could not send request.");
            message.success(`Friend request sent to ${searchValue}!`);
            setSearchValue("");
        } catch (e: any) {
            message.error(e.message);
        }
    };

    const handleRespond = async (requestId: number, action: "ACCEPT" | "DENY") => {
        try {
            const res = await fetch(`${API_BASE}/friend-requests/${requestId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ receiverId: Number(userId), action }),
            });
            if (!res.ok) throw new Error();
            fetchFriendRequests();
            fetchFriends();
        } catch {
            message.error("Could not respond to request.");
        }
    };

    const handleRemoveFriend = async (friendId: number) => {
        try {
            const res = await fetch(`${API_BASE}/users/${userId}/friends/${friendId}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error();
            setFriends((prev) => prev.filter((f) => f.id !== friendId));
        } catch {
            message.error("Could not remove friend.");
        }
    };

    return (
        <div style={{ ...cardStyle, flex: 1.2, display: "flex", flexDirection: "column", gap: "12px" }}>
            <h2 style={cardTitleStyle}>Friends</h2>

            <Input
                placeholder="Add Friend by username"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onPressEnter={handleSendRequest}
                suffix={
                    <span style={{ cursor: "pointer" }} onClick={handleSendRequest}>
                        🔍
                    </span>
                }
            />

            <div>
                <div style={{ color: "#e3cb2c", fontWeight: "bold", marginBottom: "8px" }}>
                    Friend Requests ({friendRequests.length})
                </div>
                {friendRequests.length === 0 ? (
                    <div style={{ color: "#cdd8f0", fontSize: "0.85rem", fontStyle: "italic" }}>
                        No pending requests
                    </div>
                ) : (
                    friendRequests.map((req) => (
                        <div key={req.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", color: "#cdd8f0" }}>
                            <span>{req.senderUsername}</span>
                            <div style={{ display: "flex", gap: "6px" }}>
                                <Button size="small" type="primary" onClick={() => handleRespond(req.id, "ACCEPT")}>✓</Button>
                                <Button size="small" danger onClick={() => handleRespond(req.id, "DENY")}>✗</Button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div>
                <div style={{ color: "#e3cb2c", fontWeight: "bold", marginBottom: "8px" }}>
                    Friends ({friends.length})
                </div>
                {friends.length === 0 ? (
                    <div style={{ color: "#cdd8f0", fontSize: "0.85rem", fontStyle: "italic" }}>
                        No friends yet
                    </div>
                ) : (
                    friends.map((friend) => (
                        <div key={friend.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", color: "#cdd8f0" }}>
                            <span>
                                <span style={{ marginRight: "6px" }}>
                                    {friend.status === "ONLINE" ? "🟢" : "⚪"}
                                </span>
                                {friend.username}
                            </span>
                            <Button size="small" danger onClick={() => handleRemoveFriend(friend.id)}>Remove</Button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default FriendsPanel;