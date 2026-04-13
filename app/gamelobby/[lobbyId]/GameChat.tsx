"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useApi } from "@/hooks/useApi";
import type { ChatMessageGetDTO } from "@/types/game";
import styles from "./GameLobbyPage.module.css";

type GameChatProps = {
    gameId: string;
    userId: number | null;
    currentUsername: string | null;
};

export default function GameChat({
                                     gameId,
                                     userId,
                                     currentUsername,
                                 }: GameChatProps) {
    const api = useApi();

    const [chatInput, setChatInput] = useState("");
    const [chatMessages, setChatMessages] = useState<
        { id: string; from: string; text: string; mine: boolean }[]
    >([]);

    const chatContainerRef = useRef<HTMLDivElement>(null);
    const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const previousMessageCountRef = useRef(0);

    const fetchChat = useCallback(async () => {
        try {
            const messages = await api.get<ChatMessageGetDTO[]>(`/games/${gameId}/chat`);

            setChatMessages(
                messages.map((m, index) => ({
                    id: `${m.playerId}-${m.timestamp ?? index}-${index}`,
                    from: m.username,
                    text: m.message,
                    mine: m.username === currentUsername,
                }))
            );
        } catch (error) {
            console.error("Failed to fetch chat:", error);
        }
    }, [api, gameId, currentUsername]);

    useEffect(() => {
        void fetchChat();

        pollingRef.current = setInterval(() => {
            void fetchChat();
        }, 2000);

        return () => {
            if (pollingRef.current) clearInterval(pollingRef.current);
        };
    }, [fetchChat]);

    useEffect(() => {
        const chatContainer = chatContainerRef.current;
        if (!chatContainer) return;

        const shouldSmoothScroll = previousMessageCountRef.current > 0;
        chatContainer.scrollTo({
            top: chatContainer.scrollHeight,
            behavior: shouldSmoothScroll ? "smooth" : "auto",
        });

        previousMessageCountRef.current = chatMessages.length;
    }, [chatMessages]);

    const handleSendChat = async () => {
        const text = chatInput.trim();
        if (!text || !userId) return;

        setChatInput("");

        try {
            await api.post(`/games/${gameId}/chat`, {
                playerId: userId,
                message: text,
            });
            void fetchChat();
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    return (
        <div className={styles.chatSection}>
            <div className={styles.chatHeader} id="chat-label">
                Lobby Chat
            </div>

            <div
                ref={chatContainerRef}
                className={styles.chatMessages}
                role="log"
                aria-labelledby="chat-label"
                aria-live="polite"
            >
                {chatMessages.length === 0 ? (
                    <div className={styles.chatEmpty}>
                        No messages yet. Say hi! 👋
                    </div>
                ) : (
                    chatMessages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`${styles.chatMsg} ${
                                msg.mine ? styles.chatMsgMine : ""
                            }`}
                        >
                            <div className={styles.chatAvatar} aria-hidden="true">
                                {msg.from.charAt(0).toUpperCase()}
                            </div>
                            <div className={styles.chatBubble}>
                                <div className={styles.chatName}>{msg.from}</div>
                                <div className={styles.chatText}>{msg.text}</div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className={styles.chatInputRow}>
                <input
                    className={styles.chatInput}
                    type="text"
                    placeholder="Write a message…"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") void handleSendChat();
                    }}
                    aria-label="Chat message"
                    maxLength={200}
                />
                <button
                    className={styles.btnSend}
                    onClick={() => void handleSendChat()}
                    disabled={!chatInput.trim() || !userId}
                >
                    Send
                </button>
            </div>
        </div>
    );
}
