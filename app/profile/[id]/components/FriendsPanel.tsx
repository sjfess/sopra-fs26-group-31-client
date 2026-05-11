"use client";

import React, { useState, useEffect, useCallback } from "react";
import { App, ConfigProvider, Input } from "antd";
import { useRouter } from "next/navigation";
import type { GameInvite } from "@/types/game";
import type { Friend, FriendRequest } from "@/types/user";

const API_BASE = process.env.NEXT_PUBLIC_PROD_API_URL ?? "http://localhost:8080";

const statusClass = (status: string) =>
    status === "ONLINE" ? "online" : status === "IN_GAME" ? "in-game" : "offline";

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
        message.error({ content: <span style={{ color: "#000000" }}>{text}</span>, duration: 3 });
    const showSuccess = (text: string) =>
        message.success({ content: <span style={{ color: "#000000" }}>{text}</span>, duration: 3 });

    const fetchFriends = useCallback(async () => {
        if (!userId) return;
        try {
            const res = await fetch(`${API_BASE}/users/${userId}/friends`);
            if (!res.ok) throw new Error();
            setFriends(await res.json());
        } catch { showError("Could not load friends."); }
    }, [userId, message]);

    const fetchFriendRequests = useCallback(async () => {
        if (!userId) return;
        try {
            const res = await fetch(`${API_BASE}/users/${userId}/friend-requests`);
            if (!res.ok) throw new Error();
            setFriendRequests(await res.json());
        } catch { showError("Could not load friend requests."); }
    }, [userId, message]);

    const fetchGameInvites = useCallback(async () => {
        if (!userId) return;
        try {
            const res = await fetch(`${API_BASE}/games/invites/${userId}`);
            if (!res.ok) throw new Error();
            setGameInvites(await res.json());
        } catch { showError("Could not load game invites."); }
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
                body: JSON.stringify({ senderId: Number(userId), receiverUsername: searchValue.trim() }),
            });
            if (res.status === 404) throw new Error("User not found.");
            if (res.status === 409) throw new Error("Request already exists or already friends.");
            if (!res.ok) throw new Error("Could not send request.");
            showSuccess(`Friend request sent to ${searchValue}!`);
            setSearchValue("");
            void fetchFriendRequests();
        } catch (e: any) { showError(e.message); }
    };

    const handleRespond = async (requestId: number, action: "ACCEPT" | "DENY") => {
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
        } catch { showError("Could not respond to request."); }
    };

    const handleRemoveFriend = async (friendId: number) => {
        if (!userId) return;
        try {
            const res = await fetch(`${API_BASE}/users/${userId}/friends/${friendId}`, { method: "DELETE" });
            if (!res.ok) throw new Error();
            setFriends((prev) => prev.filter((f) => f.id !== friendId));
        } catch { showError("Could not remove friend."); }
    };

    const handleDeclineInvite = async (inviteId: number) => {
        try {
            const res = await fetch(`${API_BASE}/games/invites/${inviteId}`, { method: "DELETE" });
            if (!res.ok) throw new Error();
            showSuccess("Game invite declined.");
            void fetchGameInvites();
        } catch { showError("Could not decline game invite."); }
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
            const deleteRes = await fetch(`${API_BASE}/games/invites/${invite.id}`, { method: "DELETE" });
            if (!deleteRes.ok) throw new Error("Joined lobby, but could not remove invite.");
            showSuccess(`Joined lobby ${invite.lobbyCode}`);
            void fetchGameInvites();
            router.push(`/gamelobby/${invite.gameId}`);
        } catch (e: any) { showError(e.message ?? "Could not accept game invite."); }
    };

    return (
        <div className="panel-card" style={{ flex: 1.2 }}>
            <h2 className="panel-title">Friends</h2>

            <ConfigProvider theme={{ token: { colorTextPlaceholder: "rgba(227, 203, 44, 0.6)" } }}>
                <Input
                    className="friends-search-input"
                    placeholder="Add friend by username"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onPressEnter={handleSendRequest}
                    suffix={
                        <span
                            style={{ cursor: "pointer", color: "#e3cb2c" }}
                            onClick={handleSendRequest}
                            role="button"
                            aria-label="Send friend request"
                        >
                            🔍
                        </span>
                    }
                />
            </ConfigProvider>

            {/* Game invites */}
            <div className="panel-section-title">
                Game Invites ({gameInvites.length})
            </div>
            {gameInvites.length === 0 ? (
                <div className="panel-empty">No game invites</div>
            ) : (
                gameInvites.map((invite) => (
                    <div key={invite.id} className="panel-list-row">
                        <span className="row-name">
                            <span style={{ color: "#cdd8f0" }}>
                                <strong style={{ color: "#e3cb2c" }}>{invite.fromUsername}</strong>
                                {" → lobby "}
                                <span style={{ color: "#e3cb2c" }}>{invite.lobbyCode}</span>
                            </span>
                        </span>
                        <span className="row-actions">
                            <button className="panel-icon-btn accept" onClick={() => handleAcceptInvite(invite)}>
                                Accept
                            </button>
                            <button className="panel-icon-btn deny" onClick={() => handleDeclineInvite(invite.id)}>
                                Decline
                            </button>
                        </span>
                    </div>
                ))
            )}

            {/* Friend requests */}
            <div className="panel-section-title">
                Friend Requests ({friendRequests.length})
            </div>
            {friendRequests.length === 0 ? (
                <div className="panel-empty">No pending requests</div>
            ) : (
                friendRequests.map((req) => (
                    <div key={req.id} className="panel-list-row">
                        <span className="row-name">
                            <span style={{ color: "#cdd8f0" }}>{req.senderUsername}</span>
                        </span>
                        <span className="row-actions">
                            <button
                                className="panel-icon-btn accept"
                                title="Accept"
                                onClick={() => handleRespond(req.id, "ACCEPT")}
                            >
                                ✓
                            </button>
                            <button
                                className="panel-icon-btn deny"
                                title="Deny"
                                onClick={() => handleRespond(req.id, "DENY")}
                            >
                                ✗
                            </button>
                        </span>
                    </div>
                ))
            )}

            {/* Friends list */}
            <div className="panel-section-title">
                Friends ({friends.length})
            </div>
            {friends.length === 0 ? (
                <div className="panel-empty">No friends yet</div>
            ) : (
                friends.map((friend) => (
                    <div key={friend.id} className="panel-list-row">
                        <span className="row-name">
                            <span className={`panel-status-dot ${statusClass(friend.status)}`} />
                            <span>{friend.username}</span>
                        </span>
                        <button
                            className="panel-icon-btn deny"
                            onClick={() => handleRemoveFriend(friend.id)}
                        >
                            Remove
                        </button>
                    </div>
                ))
            )}
        </div>
    );
};

export default FriendsPanel;
