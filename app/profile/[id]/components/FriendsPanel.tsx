"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Input, Button, App } from "antd";
import { useRouter } from "next/navigation";
import type { GameInvite } from "@/types/game";
import type { Friend, FriendRequest } from "@/types/user";


const API_BASE = process.env.NEXT_PUBLIC_PROD_API_URL ?? "http://localhost:8080";

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
    const router = useRouter();

    const [searchValue, setSearchValue] = useState("");
    const [friends, setFriends] = useState<Friend[]>([]);
    const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [gameInvites, setGameInvites] = useState<GameInvite[]>([]);

    useEffect(() => {
        setUserId(sessionStorage.getItem("userId"));
    }, []);

    const showError = (text: string) =>
        message.error({
            content: <span style={{ color: "#000000" }}>{text}</span>,
            duration: 3,
        });

    const showSuccess = (text: string) =>
        message.success({
            content: <span style={{ color: "#000000" }}>{text}</span>,
            duration: 3,
        });

    const fetchFriends = useCallback(async () => {
        if (!userId) return;
        try {
            const res = await fetch(`${API_BASE}/users/${userId}/friends`);
            if (!res.ok) throw new Error();
            const data = await res.json();
            setFriends(data);
        } catch {
            showError("Could not load friends.");
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
            showError("Could not load friend requests.");
        }
    }, [userId, message]);

    const fetchGameInvites = useCallback(async () => {
        if (!userId) return;
        try {
            const res = await fetch(`${API_BASE}/games/invites/${userId}`);
            if (!res.ok) throw new Error();
            const data = await res.json();
            setGameInvites(data);
        } catch {
            showError("Could not load game invites.");
        }
    }, [userId, message]);

    useEffect(() => {
        if (!userId) return;

        void fetchFriends();
        void fetchFriendRequests();
        void fetchGameInvites();

        const interval = setInterval(() => {
            void fetchFriends();
            void fetchFriendRequests();
            void fetchGameInvites();
        }, 5000);

        return () => clearInterval(interval);
    }, [userId, fetchFriends, fetchFriendRequests, fetchGameInvites]);

    const handleSendRequest = async () => {
        if (!searchValue.trim() || !userId) return;

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
            if (res.status === 409) {
                throw new Error("Request already exists or already friends.");
            }
            if (!res.ok) throw new Error("Could not send request.");

            showSuccess(`Friend request sent to ${searchValue}!`);
            setSearchValue("");
            void fetchFriendRequests();
        } catch (e: any) {
            showError(e.message);
        }
    };

    const handleRespond = async (
        requestId: number,
        action: "ACCEPT" | "DENY"
    ) => {
        if (!userId) return;

        try {
            const res = await fetch(`${API_BASE}/friend-requests/${requestId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ receiverId: Number(userId), action }),
            });
            if (!res.ok) throw new Error();

            void fetchFriendRequests();
            void fetchFriends();
        } catch {
            showError("Could not respond to request.");
        }
    };

    const handleRemoveFriend = async (friendId: number) => {
        if (!userId) return;

        try {
            const res = await fetch(`${API_BASE}/users/${userId}/friends/${friendId}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error();

            setFriends((prev) => prev.filter((f) => f.id !== friendId));
        } catch {
            showError("Could not remove friend.");
        }
    };

    const handleDeclineInvite = async (inviteId: number) => {
        try {
            const res = await fetch(`${API_BASE}/games/invites/${inviteId}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error();

            showSuccess("Game invite declined.");
            void fetchGameInvites();
        } catch {
            showError("Could not decline game invite.");
        }
    };

    const handleAcceptInvite = async (invite: GameInvite) => {
        if (!userId) return;

        try {
            const joinRes = await fetch(`${API_BASE}/games/join/${invite.lobbyCode}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: Number(userId) }),
            });

            if (!joinRes.ok) {
                if (joinRes.status === 404) throw new Error("Lobby not found.");
                if (joinRes.status === 409) throw new Error("Could not join lobby.");
                throw new Error("Could not accept invite.");
            }

            const deleteRes = await fetch(`${API_BASE}/games/invites/${invite.id}`, {
                method: "DELETE",
            });

            if (!deleteRes.ok) {
                throw new Error("Joined lobby, but could not remove invite.");
            }

            showSuccess(`Joined lobby ${invite.lobbyCode}`);
            void fetchGameInvites();
            router.push(`/gamelobby/${invite.gameId}`);
        } catch (e: any) {
            showError(e.message ?? "Could not accept game invite.");
        }
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
                <div
                    style={{
                        color: "#e3cb2c",
                        fontWeight: "bold",
                        marginBottom: "8px",
                    }}
                >
                    Game Invites ({gameInvites.length})
                </div>
                {gameInvites.length === 0 ? (
                    <div
                        style={{
                            color: "#cdd8f0",
                            fontSize: "0.85rem",
                            fontStyle: "italic",
                        }}
                    >
                        No game invites
                    </div>
                ) : (
                    gameInvites.map((invite) => (
                        <div
                            key={invite.id}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "8px",
                                color: "#cdd8f0",
                            }}
                        >
                            <span>
                                {invite.fromUsername} invited you to lobby{" "}
                                {invite.lobbyCode}
                            </span>
                            <div style={{ display: "flex", gap: "6px" }}>
                                <Button
                                    size="small"
                                    type="primary"
                                    onClick={() => handleAcceptInvite(invite)}
                                >
                                    Accept
                                </Button>
                                <Button
                                    size="small"
                                    danger
                                    onClick={() => handleDeclineInvite(invite.id)}
                                >
                                    Decline
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div>
                <div
                    style={{
                        color: "#e3cb2c",
                        fontWeight: "bold",
                        marginBottom: "8px",
                    }}
                >
                    Friend Requests ({friendRequests.length})
                </div>
                {friendRequests.length === 0 ? (
                    <div
                        style={{
                            color: "#cdd8f0",
                            fontSize: "0.85rem",
                            fontStyle: "italic",
                        }}
                    >
                        No pending requests
                    </div>
                ) : (
                    friendRequests.map((req) => (
                        <div
                            key={req.id}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "8px",
                                color: "#cdd8f0",
                            }}
                        >
                            <span>{req.senderUsername}</span>
                            <div style={{ display: "flex", gap: "6px" }}>
                                <Button
                                    size="small"
                                    type="primary"
                                    onClick={() => handleRespond(req.id, "ACCEPT")}
                                >
                                    ✓
                                </Button>
                                <Button
                                    size="small"
                                    danger
                                    onClick={() => handleRespond(req.id, "DENY")}
                                >
                                    ✗
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div>
                <div
                    style={{
                        color: "#e3cb2c",
                        fontWeight: "bold",
                        marginBottom: "8px",
                    }}
                >
                    Friends ({friends.length})
                </div>
                {friends.length === 0 ? (
                    <div
                        style={{
                            color: "#cdd8f0",
                            fontSize: "0.85rem",
                            fontStyle: "italic",
                        }}
                    >
                        No friends yet
                    </div>
                ) : (
                    friends.map((friend) => (
                        <div
                            key={friend.id}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "8px",
                                color: "#cdd8f0",
                            }}
                        >
                            <span>
                                <span style={{ marginRight: "6px" }}>
                                    <span
                                        style={{
                                            display: "inline-block",
                                            width: "10px",
                                            height: "10px",
                                            borderRadius: "50%",
                                            backgroundColor:
                                                friend.status === "ONLINE"
                                                    ? "#52c41a"
                                                    : "#ff4d4f",
                                            marginRight: "6px",
                                        }}
                                    />
                                </span>
                                {friend.username}
                            </span>
                            <Button
                                size="small"
                                danger
                                onClick={() => handleRemoveFriend(friend.id)}
                            >
                                Remove
                            </Button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default FriendsPanel;