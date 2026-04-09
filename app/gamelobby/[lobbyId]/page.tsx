"use client";

import { Game, PlayerSummary, ChatMessageGetDTO } from "@/types/game";
import type { Friend } from "@/types/user";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useApi } from "@/hooks/useApi";
import styles from "./GameLobbyPage.module.css";

type GameMode = "TIMELINE" | "HISTORY_UNO";
type Era = "ANCIENT" | "MEDIEVAL" | "RENAISSANCE" | "MODERN" | "INFORMATION";
type Difficulty = "EASY" | "MEDIUM" | "HARD";

const ERA_LABELS: Record<Era, string> = {
    ANCIENT: "🏛️ Ancient",
    MEDIEVAL: "⚔️ Medieval",
    RENAISSANCE: "🎨 Renaissance",
    MODERN: "🔬 Modern",
    INFORMATION: "💻 Information",
};

const ERAS = Object.keys(ERA_LABELS) as Era[];

const MODE_LABELS: Record<GameMode, string> = {
    TIMELINE: "Timeline Mode",
    HISTORY_UNO: "History Uno Mode",
};

const DIFFICULTY_LABELS: Difficulty[] = ["EASY", "MEDIUM", "HARD"];

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export default function GameLobbyPage() {
    const [game, setGame] = useState<Game | null>(null);
    const [loading, setLoading] = useState(true);
    const [isStarting, setIsStarting] = useState(false);
    const [chatInput, setChatInput] = useState("");
    const [friendSearch, setFriendSearch] = useState("");
    const [friends, setFriends] = useState<Friend[]>([]);
    const [chatMessages, setChatMessages] = useState<
        { from: string; text: string; mine: boolean }[]
    >([]);
    const [selectedMode, setSelectedMode] = useState<GameMode>("TIMELINE");
    const [selectedEra, setSelectedEra] = useState<Era>("ANCIENT");
    const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("EASY");
    const [toast, setToast] = useState<string | null>(null);
    const [codeCopied, setCodeCopied] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);
    const [currentUsername, setCurrentUsername] = useState<string | null>(null);

    const params = useParams();
    const lobbyId = params.lobbyId as string;
    const router = useRouter();
    const apiService = useApi();

    const apiRef = useRef(apiService);
    apiRef.current = apiService;

    const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const startedRef = useRef(false);
    const pendingSettingsRef = useRef(false);

    const showToast = useCallback((msg: string) => {
        setToast(msg);
        window.setTimeout(() => setToast(null), 2500);
    }, []);

    useEffect(() => {
        const stored = window.sessionStorage.getItem("userId");
        if (!stored) {
            setUserId(null);
            return;
        }

        const parsed = Number(stored);
        setUserId(Number.isNaN(parsed) ? null : parsed);

        const storedUsername = window.sessionStorage.getItem("username");
        if (storedUsername) {
            setCurrentUsername(storedUsername);
        }
    }, []);

    const isHost =
        game !== null && userId !== null && Number(game.hostId) === Number(userId);
    const canStart = (game?.players?.length ?? 0) >= 2;

    const fetchChat = useCallback(async () => {
        try {
            const messages = await apiRef.current.get<ChatMessageGetDTO[]>(
                `/games/${lobbyId}/chat`
            );

            setChatMessages(
                messages.map((m) => ({
                    from: m.username,
                    text: m.message,
                    mine: m.username === currentUsername,
                }))
            );
        } catch (error) {
            console.error("Failed to fetch chat:", error);
        }
    }, [lobbyId, currentUsername]);

    const fetchFriends = useCallback(async () => {
        if (!userId) return;

        try {
            const res = await fetch(`${API_BASE}/users/${userId}/friends`);
            if (!res.ok) throw new Error();

            const data = await res.json();
            setFriends(data);
        } catch (error) {
            console.error("Failed to fetch friends:", error);
        }
    }, [userId]);

    const fetchGame = useCallback(async () => {
        try {
            const response = await apiRef.current.get<Game>(`/games/${lobbyId}`);
            setGame(response);

            if (!pendingSettingsRef.current) {
                if (response.gameMode) setSelectedMode(response.gameMode as GameMode);
                if (response.era) setSelectedEra(response.era as Era);
                if (response.difficulty) {
                    setSelectedDifficulty(response.difficulty as Difficulty);
                }
            }

            if (response.status === "IN_PROGRESS" && !startedRef.current) {
                startedRef.current = true;

                if (pollingRef.current) clearInterval(pollingRef.current);

                const mode = (response.gameMode ?? "TIMELINE") as GameMode;
                router.push(
                    mode === "HISTORY_UNO"
                        ? `/games/${lobbyId}/play/uno`
                        : `/games/${lobbyId}/play`
                );
                return;
            }

            if (response.status === "CLOSED") {
                if (pollingRef.current) clearInterval(pollingRef.current);
                showToast("Host closed the lobby.");
                window.setTimeout(() => router.push("/dashboard"), 1500);
            }
        } catch (error: any) {
            if (error?.status === 404 || error?.info?.status === 404) {
                if (pollingRef.current) clearInterval(pollingRef.current);
                showToast("The lobby no longer exists.");
                window.setTimeout(() => router.push("/dashboard"), 1500);
                return;
            }

            console.error("Failed to load game:", error);
            showToast("Failed to load lobby.");
        } finally {
            setLoading(false);
        }
    }, [lobbyId, router, showToast]);

    useEffect(() => {
        void fetchFriends();
    }, [fetchFriends]);

    useEffect(() => {
        void fetchGame();
        void fetchChat();

        pollingRef.current = setInterval(() => {
            void fetchGame();
            void fetchChat();
        }, 2000);

        return () => {
            if (pollingRef.current) clearInterval(pollingRef.current);
        };
    }, [fetchGame, fetchChat]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages]);

    const handleSelectMode = async (mode: GameMode) => {
        if (!isHost) return;

        const previous = selectedMode;
        setSelectedMode(mode);
        pendingSettingsRef.current = true;

        try {
            await apiRef.current.put(`/games/${lobbyId}/settings`, { gameMode: mode });
        } catch (error) {
            console.error("Could not update game mode:", error);
            setSelectedMode(previous);
            showToast("Could not update game mode.");
        } finally {
            pendingSettingsRef.current = false;
        }
    };

    const handleSelectEra = async (era: Era) => {
        if (!isHost) return;

        const previous = selectedEra;
        setSelectedEra(era);
        pendingSettingsRef.current = true;

        try {
            await apiRef.current.put(`/games/${lobbyId}/settings`, { era });
        } catch (error) {
            console.error("Could not update era:", error);
            setSelectedEra(previous);
            showToast("Could not update era.");
        } finally {
            pendingSettingsRef.current = false;
        }
    };

    const handleSelectDifficulty = async (difficulty: Difficulty) => {
        if (!isHost) return;

        const previous = selectedDifficulty;
        setSelectedDifficulty(difficulty);
        pendingSettingsRef.current = true;

        try {
            await apiRef.current.put(`/games/${lobbyId}/settings`, { difficulty });
        } catch (error) {
            console.error("Could not update difficulty:", error);
            setSelectedDifficulty(previous);
            showToast("Could not update difficulty.");
        } finally {
            pendingSettingsRef.current = false;
        }
    };

    const handleStartGame = async () => {
        if (!isHost || !canStart || isStarting) return;

        setIsStarting(true);
        try {
            await apiRef.current.put(`/games/${lobbyId}/start?deckSize=20`, {});
        } catch (error) {
            console.error("Failed to start game:", error);
            showToast("Failed to start game. Please try again.");
            setIsStarting(false);
        }
    };

    const handleLeave = async () => {
        if (!game || userId === null) return;

        try {
            await apiRef.current.delete(`/games/leave/${game.lobbyCode}?userId=${userId}`);

            if (pollingRef.current) clearInterval(pollingRef.current);
            router.push(`/profile/${userId}`);
        } catch (error) {
            console.error("Failed to leave lobby:", error);
            showToast("Failed to leave lobby. Please try again.");
        }
    };

    const handleCopyCode = async () => {
        if (!game?.lobbyCode) return;

        try {
            await navigator.clipboard.writeText(game.lobbyCode);
            setCodeCopied(true);
            showToast(`Code "${game.lobbyCode}" copied!`);
            window.setTimeout(() => setCodeCopied(false), 2000);
        } catch (error) {
            console.error("Failed to copy lobby code:", error);
            showToast("Could not copy lobby code.");
        }
    };

    const handleSendChat = async () => {
        const text = chatInput.trim();
        if (!text || !game || !userId) return;

        setChatInput("");

        try {
            await apiRef.current.post(`/games/${lobbyId}/chat`, {
                playerId: userId,
                message: text,
            });
            void fetchChat();
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    const handleInvite = async () => {
        const toUsername = friendSearch.trim();
        if (!toUsername || userId === null) return;

        if (
            currentUsername &&
            toUsername.toLowerCase() === currentUsername.toLowerCase()
        ) {
            showToast("You cannot invite yourself.");
            return;
        }

        try {
            await apiRef.current.post(`/games/${lobbyId}/invite`, {
                fromUserId: userId,
                toUsername,
            });

            showToast(`Invitation sent to "${toUsername}"!`);
            setFriendSearch("");
        } catch (error: any) {
            console.error("Failed to send invite:", error);

            if (error?.status === 409 || error?.info?.status === 409) {
                showToast("This user already has an invite for this game.");
                return;
            }

            if (error?.status === 404 || error?.info?.status === 404) {
                showToast("User not found.");
                return;
            }

            if (error?.status === 400 || error?.info?.status === 400) {
                showToast("You cannot invite yourself.");
                return;
            }

            showToast("Could not send invitation.");
        }
    };

    const normalizedFriendSearch = friendSearch.trim().toLowerCase();

    const filteredFriends = normalizedFriendSearch
        ? friends.filter((friend) =>
            friend.username.toLowerCase().includes(normalizedFriendSearch)
        )
        : friends;

    const hostName =
        game?.players?.find(
            (p: PlayerSummary) => Number(p.id) === Number(game?.hostId)
        )?.username ?? "—";

    if (loading) {
        return (
            <div className={styles.loadingScreen}>
                <div className={styles.loadingSpinner} />
                <p>Loading lobby…</p>
            </div>
        );
    }

    if (!game) {
        return (
            <div className={styles.loadingScreen}>
                <p>Lobby could not be loaded.</p>
            </div>
        );
    }

    return (
        <div className={styles.root}>
            <nav className={styles.navbar} aria-label="Main navigation">
                <div className={styles.navLogo}>Historical Reconstruction</div>
                <ul className={styles.navLinks} role="list">
                    <li>
                        <a href="/dashboard" className={styles.navLinkActive}>
                            Home
                        </a>
                    </li>
                    <li>
                        <a href="/leaderboard">Leaderboard</a>
                    </li>
                </ul>
            </nav>

            <div className={styles.lobbyBanner}>
                <div className={styles.motto} aria-hidden="true">
                    Semper victor est,
                    <br />
                    qui se scientiae dedicat.
                </div>

                <div className={styles.lobbyTitleBlock}>
                    <h1 className={styles.lobbyTitle}>Game Lobby</h1>
                    <p className={styles.lobbySubtitle}>
                        Invite your friends and prepare the match
                    </p>
                </div>

                <div className={styles.lobbyMeta}>
                    <div className={styles.lobbyCodeRow}>
                        <span>Lobby Code:</span>
                        <strong className={styles.lobbyCode}>{game.lobbyCode}</strong>
                        <button
                            className={`${styles.copyBtn} ${codeCopied ? styles.copyBtnCopied : ""}`}
                            onClick={handleCopyCode}
                            aria-label="Copy lobby code"
                        >
                            {codeCopied ? "✓ Copied" : "Copy"}
                        </button>
                    </div>
                    <div>
                        <span>Host: </span>
                        <strong>{hostName}</strong>
                    </div>
                </div>
            </div>

            <main className={styles.lobbyGrid}>
                <section className={styles.panel} aria-labelledby="players-heading">
                    <div className={styles.panelHeader}>
                        <h2 id="players-heading">
                            Players
                            <span className={styles.playerCount}>
                                {game.players?.length ?? 0} / {game.maxPlayers ?? "8"}
                            </span>
                        </h2>
                    </div>

                    <div className={styles.panelBody}>
                        {game.players?.map((player: PlayerSummary) => (
                            <div key={player.id} className={styles.playerRow}>
                                <div className={styles.avatar} aria-hidden="true">
                                    {player.username.charAt(0).toUpperCase()}
                                </div>

                                <div className={styles.playerInfo}>
                                    <div className={styles.playerName}>
                                        {player.username}
                                        {Number(player.id) === Number(userId) && (
                                            <span className={styles.youBadge}>You</span>
                                        )}
                                    </div>
                                    <div className={styles.playerStatus}>
                                        <span
                                            className={`${styles.statusDot} ${styles.online}`}
                                            aria-hidden="true"
                                        />
                                        <span>Online</span>
                                    </div>
                                </div>

                                <div
                                    className={`${styles.playerRole} ${
                                        Number(player.id) === Number(game.hostId)
                                            ? styles.hostRole
                                            : ""
                                    }`}
                                >
                                    {Number(player.id) === Number(game.hostId)
                                        ? "👑 Host"
                                        : "Player"}
                                </div>
                            </div>
                        ))}

                        {game.maxPlayers &&
                            Array.from({
                                length: Math.max(
                                    0,
                                    game.maxPlayers - (game.players?.length ?? 0)
                                ),
                            }).map((_, i) => (
                                <div key={`empty-${i}`} className={styles.playerRowEmpty}>
                                    <div className={styles.avatarEmpty} aria-hidden="true" />
                                    <span className={styles.waitingSlot}>
                                        Waiting for player…
                                    </span>
                                </div>
                            ))}
                    </div>

                    <div className={styles.panelFooter}>
                        <button
                            className={styles.btnLeave}
                            onClick={handleLeave}
                            aria-label="Leave this lobby and return to dashboard"
                        >
                            Leave Lobby
                        </button>
                    </div>
                </section>

                <section className={styles.panel} aria-labelledby="settings-heading">
                    <div className={styles.panelHeader}>
                        <h2 id="settings-heading">Game Settings</h2>
                        {!isHost && (
                            <p className={styles.hostOnlyHint} role="status">
                                Only the host can change settings
                            </p>
                        )}
                    </div>

                    <div className={styles.panelBody}>
                        <div className={styles.settingsSection}>
                            <div className={styles.settingsLabel} id="mode-label">
                                Game Mode
                            </div>
                            <div
                                className={`${styles.tabGroup} ${
                                    !isHost ? styles.tabGroupReadonly : ""
                                }`}
                                role="group"
                                aria-labelledby="mode-label"
                            >
                                {(Object.keys(MODE_LABELS) as GameMode[]).map((mode) => (
                                    <button
                                        key={mode}
                                        className={`${styles.tabBtn} ${
                                            selectedMode === mode ? styles.tabBtnActive : ""
                                        }`}
                                        onClick={() => handleSelectMode(mode)}
                                        disabled={!isHost}
                                        aria-pressed={selectedMode === mode}
                                        title={
                                            !isHost ? "Only the host can change this" : undefined
                                        }
                                    >
                                        {MODE_LABELS[mode]}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div
                            className={`${styles.settingsSection} ${styles.settingsSectionPadTop}`}
                        >
                            <div className={styles.settingsLabel} id="era-label">
                                Historical Era
                            </div>
                            <div
                                className={`${styles.eraGroup} ${
                                    !isHost ? styles.tabGroupReadonly : ""
                                }`}
                                role="group"
                                aria-labelledby="era-label"
                            >
                                {ERAS.map((era) => (
                                    <button
                                        key={era}
                                        className={`${styles.eraBtn} ${
                                            selectedEra === era ? styles.eraBtnActive : ""
                                        }`}
                                        onClick={() => handleSelectEra(era)}
                                        disabled={!isHost}
                                        aria-pressed={selectedEra === era}
                                        title={
                                            !isHost ? "Only the host can change this" : undefined
                                        }
                                    >
                                        {ERA_LABELS[era]}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div
                            className={`${styles.settingsSection} ${styles.settingsSectionPadTop}`}
                        >
                            <div className={styles.settingsLabel} id="diff-label">
                                Difficulty
                            </div>
                            <div
                                className={`${styles.tabGroup} ${
                                    !isHost ? styles.tabGroupReadonly : ""
                                }`}
                                role="group"
                                aria-labelledby="diff-label"
                            >
                                {DIFFICULTY_LABELS.map((diff) => (
                                    <button
                                        key={diff}
                                        className={`${styles.tabBtn} ${
                                            selectedDifficulty === diff ? styles.tabBtnActive : ""
                                        }`}
                                        onClick={() => handleSelectDifficulty(diff)}
                                        disabled={!isHost}
                                        aria-pressed={selectedDifficulty === diff}
                                        title={
                                            !isHost ? "Only the host can change this" : undefined
                                        }
                                    >
                                        {diff.charAt(0) + diff.slice(1).toLowerCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={styles.settingRows}>
                            <div className={styles.settingRow}>
                                <span className={styles.settingKey}>Max Players</span>
                                <span className={styles.settingVal}>
                                    {game.maxPlayers ?? "?"}
                                </span>
                            </div>
                            <div className={styles.settingRow}>
                                <span className={styles.settingKey}>Turn Time</span>
                                <span className={styles.settingVal}>30 seconds</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.panelFooter}>
                        {isHost ? (
                            <>
                                {!canStart && (
                                    <p className={styles.notEnoughPlayers}>
                                        Need at least 2 players to start.
                                    </p>
                                )}
                                <button
                                    className={`${styles.btnStart} ${
                                        isStarting ? styles.btnStartLoading : ""
                                    }`}
                                    onClick={handleStartGame}
                                    disabled={!canStart || isStarting}
                                    aria-busy={isStarting}
                                >
                                    {isStarting ? "Starting…" : "Start Game"}
                                </button>
                            </>
                        ) : (
                            <p className={styles.waitingText} role="status">
                                ⏳ Waiting for host to start…
                            </p>
                        )}
                    </div>
                </section>

                <section className={styles.panel} aria-labelledby="invite-heading">
                    <div className={styles.panelHeader}>
                        <h2 id="invite-heading">Invite Friends</h2>
                    </div>

                    <div className={`${styles.panelBody} ${styles.panelBodyNogap}`}>
                        <div className={styles.inviteSection}>
                            <input
                                className={styles.searchInput}
                                type="text"
                                placeholder="Search username…"
                                value={friendSearch}
                                onChange={(e) => setFriendSearch(e.target.value)}
                                aria-label="Search friend username"
                            />

                            {normalizedFriendSearch && filteredFriends.length > 0 && (
                                <div
                                    className={styles.friendList}
                                    role="listbox"
                                    aria-label="Friend suggestions"
                                >
                                    {filteredFriends.map((friend) => (
                                        <div
                                            key={friend.id}
                                            className={styles.friendItem}
                                            role="option"
                                            aria-selected={friendSearch === friend.username}
                                            tabIndex={0}
                                            onClick={() => setFriendSearch(friend.username)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" || e.key === " ") {
                                                    e.preventDefault();
                                                    setFriendSearch(friend.username);
                                                }
                                            }}
                                        >
                                            {friend.username}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <button
                                className={styles.btnInvite}
                                onClick={handleInvite}
                                disabled={!friendSearch.trim()}
                            >
                                Invite
                            </button>
                        </div>

                        <div className={styles.chatSection}>
                            <div className={styles.chatHeader} id="chat-label">
                                Lobby Chat
                            </div>

                            <div
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
                                    chatMessages.map((msg, i) => (
                                        <div
                                            key={i}
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
                                <div ref={chatEndRef} />
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
                                    disabled={!chatInput.trim()}
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {toast && (
                <div className={styles.toast} role="status" aria-live="polite">
                    {toast}
                </div>
            )}
        </div>
    );
}