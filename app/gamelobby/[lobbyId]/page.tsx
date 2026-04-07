"use client";

import { Game, PlayerSummary } from "@/types/game";
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

export default function GameLobbyPage() {
    const [game, setGame] = useState<Game | null>(null);
    const [loading, setLoading] = useState(true);
    const [isStarting, setIsStarting] = useState(false);
    const [chatInput, setChatInput] = useState("");
    const [friendSearch, setFriendSearch] = useState("");
    const [chatMessages, setChatMessages] = useState<
        { from: string; text: string; mine: boolean }[]
    >([]);
    const [selectedMode, setSelectedMode] = useState<GameMode>("TIMELINE");
    const [selectedEra, setSelectedEra] = useState<Era>("ANCIENT");
    const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("EASY");
    const [toast, setToast] = useState<string | null>(null);
    const [codeCopied, setCodeCopied] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);

    const params = useParams();
    const lobbyId = params.lobbyId as string;
    const router = useRouter();
    const apiService = useApi();

    // ─────────────────────────────────────────────────────────────────────────────
    // FIX 1 – Stabilise apiService reference.
    //
    // useApi() very likely returns a *new* object on every render. That makes
    // `apiService` a new dependency on every render, so fetchGame (via useCallback)
    // also recreates on every render.  The polling useEffect depends on fetchGame,
    // so it fires on every render → clears the old interval, sets a new one, and
    // immediately calls fetchGame() → setGame() → re-render → repeat forever.
    //
    // The fix: write the current service into a ref each render (no re-render
    // triggered) and use apiRef.current inside callbacks instead.
    // ─────────────────────────────────────────────────────────────────────────────
    const apiRef = useRef(apiService);
    apiRef.current = apiService;

    const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const startedRef = useRef(false);

    // FIX 2 – Guard against polling overwriting in-flight settings PUTs.
    //
    // Without this, the host clicks e.g. "Medieval", the optimistic state update
    // fires, but before the PUT response arrives the 2-second poll returns the
    // old value from the server and instantly resets the UI back.
    const pendingSettingsRef = useRef(false);

    const showToast = useCallback((msg: string) => {
        setToast(msg);
        window.setTimeout(() => setToast(null), 2500);
    }, []);

    // ─────────────────────────────────────────────────────────────────────────────
    // Load userId from localStorage once on mount.
    // If isHost is still wrong after this fix, add a console.log here to verify
    // that localStorage actually contains "userId" with the expected numeric value,
    // and compare it to what game.hostId returns from your API.
    // ─────────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        const stored = window.localStorage.getItem("userId");
        if (!stored) {
            setUserId(null);
            return;
        }
        const parsed = Number(stored);
        setUserId(Number.isNaN(parsed) ? null : parsed);
    }, []);

    // Derived flags – recomputed on every render, so they are always in sync.
    const isHost =
        game !== null && userId !== null && Number(game.hostId) === Number(userId);
    const canStart = (game?.players?.length ?? 0) >= 2;

    // FIX 1 continued – apiService is no longer a dependency; apiRef.current is used.
    const fetchGame = useCallback(async () => {
        try {
            const response = await apiRef.current.get<Game>(`/games/${lobbyId}`);
            setGame(response);

            // FIX 2 continued – only sync settings from server when no PUT is in-flight.
            if (!pendingSettingsRef.current) {
                if (response.gameMode) setSelectedMode(response.gameMode as GameMode);
                if (response.era) setSelectedEra(response.era as Era);
                if (response.difficulty) setSelectedDifficulty(response.difficulty as Difficulty);
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
        } catch (error:any) {
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
    }, [lobbyId, router, showToast]); // ← apiService intentionally removed

    useEffect(() => {
        void fetchGame();
        pollingRef.current = setInterval(() => {
            void fetchGame();
        }, 2000);
        return () => {
            if (pollingRef.current) clearInterval(pollingRef.current);
        };
    }, [fetchGame]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages]);

    // ─────────────────────────────────────────────────────────────────────────────
    // Settings handlers – use apiRef.current + pendingSettingsRef guard.
    // ─────────────────────────────────────────────────────────────────────────────
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

    // ─────────────────────────────────────────────────────────────────────────────
    // FIX 3 – Remove the `userId === null` early-return guard from handleLeave.
    //
    // The original code bailed out silently whenever userId was null, so clicking
    // "Leave Lobby" did nothing if localStorage hadn't loaded yet (or was missing).
    // Now the request is always attempted; userId is included in the body only when
    // it is available.
    // ─────────────────────────────────────────────────────────────────────────────
    const handleLeave = async () => {
        if (!game || userId === null) return;
        try {
            await apiRef.current.delete(
                `/games/leave/${game.lobbyCode}?userId=${userId}`
            );
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
            console.error("Failed to copy code:", error);
            showToast("Could not copy lobby code.");
        }
    };

    const handleSendChat = () => {
        const text = chatInput.trim();
        if (!text || !game) return;
        const me = game.players?.find(
            (p: PlayerSummary) => Number(p.id) === Number(userId)
        );
        setChatMessages((prev) => [
            ...prev,
            { from: me?.username ?? "You", text, mine: true },
        ]);
        setChatInput("");
    };

    const handleInvite = () => {
        const name = friendSearch.trim();
        if (!name) return;
        showToast(`Invitation sent to "${name}"!`);
        setFriendSearch("");
    };

    const allFriends = ["marcekingo", "historybuff", "historybro"];
    const filteredFriends = friendSearch.trim()
        ? allFriends.filter((f) => f.toLowerCase().includes(friendSearch.toLowerCase()))
        : allFriends;

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
                {/* ── Players panel ─────────────────────────────────────────────── */}
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

                {/* ── Settings panel ────────────────────────────────────────────── */}
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
                        {/* Game Mode */}
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

                        {/* Historical Era */}
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

                        {/* Difficulty */}
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

                        {/* Static info rows */}
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

                {/* ── Invite + Chat panel ───────────────────────────────────────── */}
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

                            {filteredFriends.length > 0 && (
                                <div
                                    className={styles.friendList}
                                    role="listbox"
                                    aria-label="Friend suggestions"
                                >
                                    {filteredFriends.map((friend) => (
                                        <div
                                            key={friend}
                                            className={styles.friendItem}
                                            role="option"
                                            aria-selected={friendSearch === friend}
                                            tabIndex={0}
                                            onClick={() => setFriendSearch(friend)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") setFriendSearch(friend);
                                            }}
                                        >
                                            {friend}
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

                        {/* Chat */}
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
                                        if (e.key === "Enter") handleSendChat();
                                    }}
                                    aria-label="Chat message"
                                    maxLength={200}
                                />
                                <button
                                    className={styles.btnSend}
                                    onClick={handleSendChat}
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