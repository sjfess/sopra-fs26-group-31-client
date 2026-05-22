"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useSessionStorage from "@/hooks/useSessionStorage";

type ScreenSize = "mobile" | "tablet" | "desktop";

type TutorialStage =
    | "intro"
    | "select-printing-press"
    | "place-printing-press"
    | "feedback-printing-press"
    | "select-french-revolution-wrong"
    | "place-french-revolution-wrong"
    | "feedback-wrong-placement"
    | "select-replacement-card"
    | "place-replacement-card"
    | "finished";

interface TutorialCard {
    id: number;
    deckIndex: number;
    title: string;
    year: number;
    symbol: "rome" | "moon" | "print" | "france" | "declaration";
}

interface TutorialStep {
    title: string;
    body: string;
}

function useScreenSize(): ScreenSize {
    const [screen, setScreen] = useState<ScreenSize>("desktop");

    useEffect(() => {
        function updateScreen() {
            const width = window.innerWidth;
            if (width < 768) setScreen("mobile");
            else if (width < 1200) setScreen("tablet");
            else setScreen("desktop");
        }

        updateScreen();
        window.addEventListener("resize", updateScreen);
        return () => window.removeEventListener("resize", updateScreen);
    }, []);

    return screen;
}

function getStyles(screen: ScreenSize) {
    const isMobile = screen === "mobile";
    const isTablet = screen === "tablet";

    const colors = {
        bgTop: "#0a1c44",
        bgMid: "#132f63",
        bgBottom: "#214a84",
        gold: "#e3cb2c",
        borderSoft: "rgba(255,255,255,0.10)",
        borderStrong: "rgba(255,255,255,0.16)",
        panelBg: "rgba(10, 18, 38, 0.30)",
        panelBgStrong: "rgba(255,255,255,0.07)",
        textSoft: "rgba(255,255,255,0.72)",
        textMuted: "rgba(255,255,255,0.52)",
        whiteStrong: "rgba(255,255,255,0.18)",
    };

    return {
        page: {
            minHeight: "100vh",
            background: `
                radial-gradient(circle at top left, rgba(227,203,44,0.08), transparent 22%),
                radial-gradient(circle at top right, rgba(255,255,255,0.06), transparent 18%),
                linear-gradient(145deg, ${colors.bgTop} 0%, ${colors.bgMid} 55%, ${colors.bgBottom} 100%)
            `,
            color: "#fff",
            fontFamily: "Georgia, serif",
            padding: isMobile ? "10px" : isTablet ? "14px" : "20px",
            paddingBottom: "150px",
        } as React.CSSProperties,

        header: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: isMobile ? "flex-start" : "center",
            flexDirection: isMobile ? ("column" as const) : ("row" as const),
            marginBottom: isMobile ? "12px" : "20px",
            padding: isMobile ? "14px" : "18px 22px",
            background: "linear-gradient(180deg, rgba(255,255,255,0.09), rgba(255,255,255,0.05))",
            border: `1px solid ${colors.borderStrong}`,
            borderRadius: "16px",
            gap: "12px",
            boxShadow: "0 16px 40px rgba(0,0,0,0.22)",
            backdropFilter: "blur(10px)",
        } as React.CSSProperties,

        title: {
            fontSize: isMobile ? "20px" : isTablet ? "24px" : "28px",
            fontWeight: "bold",
            color: colors.gold,
            margin: 0,
            letterSpacing: "0.4px",
            textShadow: "0 2px 12px rgba(227,203,44,0.18)",
        } as React.CSSProperties,

        subtitle: {
            margin: "6px 0 0",
            color: colors.textSoft,
            fontSize: isMobile ? "12px" : "14px",
            lineHeight: 1.5,
        } as React.CSSProperties,

        grid: {
            display: "grid",
            gridTemplateColumns: isMobile || isTablet ? "1fr" : "260px minmax(0, 1.5fr) 300px",
            gap: isMobile ? "12px" : "18px",
            alignItems: "start",
        } as React.CSSProperties,

        panel: {
            background: `linear-gradient(180deg, ${colors.panelBgStrong}, ${colors.panelBg})`,
            border: `1px solid ${colors.borderSoft}`,
            borderRadius: "16px",
            padding: isMobile ? "12px" : "16px",
            boxShadow: "0 14px 34px rgba(0,0,0,0.18)",
            backdropFilter: "blur(10px)",
        } as React.CSSProperties,

        panelTitle: {
            fontSize: "12px",
            fontWeight: "bold",
            color: colors.gold,
            textTransform: "uppercase" as const,
            letterSpacing: "1.2px",
            marginBottom: "12px",
            borderBottom: "1px solid rgba(227,203,44,0.22)",
            paddingBottom: "8px",
        } as React.CSSProperties,

        timelineArea: {
            background: "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.05))",
            border: `1px solid ${colors.borderStrong}`,
            borderRadius: "18px",
            padding: isMobile ? "12px" : "20px",
            marginBottom: "18px",
            boxShadow: "0 18px 42px rgba(0,0,0,0.22)",
            backdropFilter: "blur(10px)",
        } as React.CSSProperties,

        timelineRow: {
            display: "flex",
            alignItems: "center",
            overflowX: "auto" as const,
            padding: "12px 4px 16px 4px",
            minHeight: isMobile ? "182px" : "204px",
            gap: "6px",
            scrollbarWidth: "thin" as const,
        } as React.CSSProperties,

        timelineCard: {
            minWidth: isMobile ? "112px" : "132px",
            maxWidth: isMobile ? "112px" : "132px",
            minHeight: isMobile ? "156px" : "176px",
            background: "linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0.08))",
            border: `1px solid ${colors.whiteStrong}`,
            borderRadius: "14px",
            padding: isMobile ? "8px" : "10px",
            textAlign: "center" as const,
            fontSize: isMobile ? "11px" : "12px",
            lineHeight: "1.35",
            flexShrink: 0,
            boxShadow: "0 14px 28px rgba(0,0,0,0.22)",
            backdropFilter: "blur(6px)",
        } as React.CSSProperties,

        cardYear: {
            color: colors.gold,
            fontWeight: "bold",
            fontSize: isMobile ? "13px" : "15px",
            marginTop: "8px",
            textShadow: "0 1px 8px rgba(227,203,44,0.18)",
        } as React.CSSProperties,

        handRow: {
            display: "flex",
            gap: isMobile ? "10px" : "14px",
            flexWrap: "wrap" as const,
            justifyContent: "center",
        } as React.CSSProperties,

        handCard: (selected: boolean): React.CSSProperties => ({
            width: isMobile ? "122px" : isTablet ? "130px" : "140px",
            minHeight: isMobile ? "176px" : "198px",
            background: selected
                ? "linear-gradient(180deg, rgba(227,203,44,0.28), rgba(255,255,255,0.10))"
                : "linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0.06))",
            border: selected ? `2px solid ${colors.gold}` : `1px solid ${colors.borderStrong}`,
            borderRadius: "16px",
            padding: isMobile ? "8px" : "10px",
            textAlign: "center" as const,
            cursor: "pointer",
            fontSize: isMobile ? "11px" : "12px",
            lineHeight: "1.35",
            transition: "all 0.18s ease",
            boxShadow: selected
                ? "0 16px 34px rgba(227,203,44,0.20)"
                : "0 10px 24px rgba(0,0,0,0.18)",
            transform: selected ? "translateY(-5px) scale(1.025)" : "translateY(0)",
        }),

        highlightedCard: {
            outline: "3px solid #e3cb2c",
            boxShadow: "0 0 0 6px rgba(227,203,44,0.18), 0 18px 40px rgba(227,203,44,0.28)",
            transform: "translateY(-6px) scale(1.04)",
        } as React.CSSProperties,

        btn: (variant: "primary" | "ghost" | "danger"): React.CSSProperties => ({
            padding: "10px 18px",
            borderRadius: "12px",
            border:
                variant === "primary"
                    ? "none"
                    : variant === "danger"
                        ? "1px solid rgba(231,76,60,0.45)"
                        : `1px solid ${colors.borderStrong}`,
            cursor: "pointer",
            fontFamily: "Georgia, serif",
            fontWeight: "bold",
            fontSize: "13px",
            background:
                variant === "primary"
                    ? "linear-gradient(180deg, #f0d84b, #e3cb2c)"
                    : variant === "danger"
                        ? "rgba(231,76,60,0.12)"
                        : "rgba(255,255,255,0.10)",
            color: variant === "primary" ? "#0f2557" : variant === "danger" ? "#e74c3c" : "#fff",
            boxShadow: variant === "primary" ? "0 10px 22px rgba(227,203,44,0.22)" : "none",
            width: isMobile ? "100%" : "auto",
        }),

        toast: (correct: boolean | null): React.CSSProperties => ({
            position: "fixed" as const,
            top: isMobile ? "16px" : "72px",
            left: "50%",
            transform: "translateX(-50%)",
            background: correct === null ? "#5f6672" : correct ? "#239b56" : "#b03a2e",
            color: "#fff",
            padding: isMobile ? "10px 16px" : "12px 28px",
            borderRadius: "12px",
            fontWeight: "bold",
            fontSize: isMobile ? "13px" : "15px",
            zIndex: 4000,
            boxShadow: "0 12px 28px rgba(0,0,0,0.30)",
            whiteSpace: "nowrap",
            maxWidth: "90vw",
            overflow: "hidden",
            textOverflow: "ellipsis",
            border: "1px solid rgba(255,255,255,0.10)",
        }),

        stepBox: {
            fontSize: "13px",
            color: colors.textSoft,
            lineHeight: 1.6,
        } as React.CSSProperties,

        stepBadge: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "28px",
            height: "28px",
            borderRadius: "999px",
            background: colors.gold,
            color: "#0f2557",
            fontWeight: "bold",
            marginRight: "8px",
        } as React.CSSProperties,

        smallMuted: {
            fontSize: "12px",
            color: colors.textMuted,
            lineHeight: 1.6,
        } as React.CSSProperties,
    };
}

const INITIAL_TIMELINE: TutorialCard[] = [
    {
        id: 1,
        deckIndex: 1,
        title: "Fall of the Western Roman Empire",
        year: 476,
        symbol: "rome",
    },
    {
        id: 2,
        deckIndex: 2,
        title: "Moon Landing",
        year: 1969,
        symbol: "moon",
    },
];

const INITIAL_HAND: TutorialCard[] = [
    {
        id: 3,
        deckIndex: 101,
        title: "Invention of the Printing Press",
        year: 1440,
        symbol: "print",
    },
    {
        id: 4,
        deckIndex: 102,
        title: "French Revolution Begins",
        year: 1789,
        symbol: "france",
    },
];

const REPLACEMENT_CARD: TutorialCard = {
    id: 5,
    deckIndex: 103,
    title: "Declaration of Independence",
    year: 1776,
    symbol: "declaration",
};

const STAGE_TEXT: Record<TutorialStage, TutorialStep> = {
    intro: {
        title: "Welcome to Timeline Mode",
        body: "You will now play a guided mini-round. The tutorial tells you exactly where to click.",
    },
    "select-printing-press": {
        title: "Step 1: Select a card",
        body: "Click the highlighted card: Invention of the Printing Press.",
    },
    "place-printing-press": {
        title: "Step 2: Place the card correctly",
        body: "The Printing Press happened after 476 and before 1969. Click the highlighted slot between both cards.",
    },
    "feedback-printing-press": {
        title: "Correct placement",
        body: "Great. The card stayed in the timeline and its year was revealed.",
    },
    "select-french-revolution-wrong": {
        title: "Step 3: Try a wrong placement",
        body: "Now select the French Revolution card. This time the tutorial will show what happens after a wrong move.",
    },
    "place-french-revolution-wrong": {
        title: "Step 4: Place it incorrectly",
        body: "For the tutorial, click the highlighted wrong slot before 476. This is intentionally incorrect.",
    },
    "feedback-wrong-placement": {
        title: "Wrong placement",
        body: "The card was removed, your wrong counter increased, and a new replacement card was drawn.",
    },
    "select-replacement-card": {
        title: "Step 5: Select the new card",
        body: "Now select the newly drawn Declaration of Independence card.",
    },
    "place-replacement-card": {
        title: "Step 6: Place the new card correctly",
        body: "The Declaration of Independence happened after the Printing Press and before the Moon Landing. Click the highlighted slot.",
    },
    finished: {
        title: "Tutorial complete",
        body: "You now know both outcomes: correct placements stay in the timeline, wrong placements are discarded and replaced.",
    },
};

export default function TutorialPage() {
    const router = useRouter();
    const screen = useScreenSize();
    const S = getStyles(screen);
    const { value: storedUserId } = useSessionStorage<string>("userId", "");

    const [timeline, setTimeline] = useState<TutorialCard[]>(INITIAL_TIMELINE);
    const [hand, setHand] = useState<TutorialCard[]>(INITIAL_HAND);
    const [selectedCard, setSelectedCard] = useState<TutorialCard | null>(null);
    const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);
    const [stage, setStage] = useState<TutorialStage>("intro");
    const [toast, setToast] = useState<{ msg: string; correct: boolean | null } | null>(null);
    const [score, setScore] = useState(0);
    const [correctPlacements, setCorrectPlacements] = useState(0);
    const [incorrectPlacements, setIncorrectPlacements] = useState(0);
    const [finished, setFinished] = useState(false);

    const activeStep = STAGE_TEXT[stage];

    function showToast(msg: string, correct: boolean | null) {
        setToast({ msg, correct });
        window.setTimeout(() => setToast(null), 2300);
    }

    function goToProfile() {
        if (storedUserId && !Number.isNaN(Number(storedUserId))) {
            router.push(`/profile/${storedUserId}`);
            return;
        }

        router.push("/login");
    }

    function resetTutorial() {
        setTimeline(INITIAL_TIMELINE);
        setHand(INITIAL_HAND);
        setSelectedCard(null);
        setHoveredSlot(null);
        setStage("intro");
        setScore(0);
        setCorrectPlacements(0);
        setIncorrectPlacements(0);
        setFinished(false);
        setToast(null);
    }

    function isCorrectPlacement(card: TutorialCard, position: number) {
        const left = timeline[position - 1];
        const right = timeline[position];

        const afterLeft = !left || card.year > left.year;
        const beforeRight = !right || card.year < right.year;

        return afterLeft && beforeRight;
    }

    function isHighlightedHandCard(card: TutorialCard) {
        return (
            (stage === "select-printing-press" &&
                card.title === "Invention of the Printing Press") ||
            (stage === "select-french-revolution-wrong" &&
                card.title === "French Revolution Begins") ||
            (stage === "select-replacement-card" &&
                card.title === "Declaration of Independence")
        );
    }

    function isHighlightedSlot(position: number) {
        return (
            (stage === "place-printing-press" && position === 1) ||
            (stage === "place-french-revolution-wrong" && position === 0) ||
            (stage === "place-replacement-card" && position === 2)
        );
    }

    function handleSelectCard(card: TutorialCard) {
        if (finished) return;

        if (stage === "intro") {
            showToast("Press Start Tutorial first.", null);
            return;
        }

        if (stage === "select-printing-press" && card.title !== "Invention of the Printing Press") {
            showToast("For this step, select the Printing Press card.", null);
            return;
        }

        if (stage === "select-french-revolution-wrong" && card.title !== "French Revolution Begins") {
            showToast("Now select the French Revolution card.", null);
            return;
        }

        if (stage === "select-replacement-card" && card.title !== "Declaration of Independence") {
            showToast("Now select the replacement card.", null);
            return;
        }

        if (
            stage !== "select-printing-press" &&
            stage !== "select-french-revolution-wrong" &&
            stage !== "select-replacement-card"
        ) {
            showToast("Follow the tutorial popup first.", null);
            return;
        }

        setSelectedCard(card);

        if (stage === "select-printing-press") {
            setStage("place-printing-press");
        }

        if (stage === "select-french-revolution-wrong") {
            setStage("place-french-revolution-wrong");
        }

        if (stage === "select-replacement-card") {
            setStage("place-replacement-card");
        }
    }

    function handlePlaceCard(position: number) {
        if (!selectedCard || finished) {
            showToast("Select a card first.", null);
            return;
        }

        if (stage === "place-printing-press" && position !== 1) {
            showToast("Place it between 476 and 1969.", null);
            return;
        }

        if (stage === "place-french-revolution-wrong" && position !== 0) {
            showToast("For this tutorial step, click the wrong slot before 476.", null);
            return;
        }

        if (stage === "place-replacement-card" && position !== 2) {
            showToast("Place it between 1440 and 1969.", null);
            return;
        }

        if (
            stage !== "place-printing-press" &&
            stage !== "place-french-revolution-wrong" &&
            stage !== "place-replacement-card"
        ) {
            showToast("Follow the tutorial popup first.", null);
            return;
        }

        if (stage === "place-french-revolution-wrong") {
            setIncorrectPlacements((prev) => prev + 1);

            setHand((prev) => [
                ...prev.filter((card) => card.deckIndex !== selectedCard.deckIndex),
                REPLACEMENT_CARD,
            ]);

            showToast(
                `✗ Wrong! ${selectedCard.title} was from ${selectedCard.year}. A new card was drawn.`,
                false
            );

            setSelectedCard(null);
            setHoveredSlot(null);
            setStage("feedback-wrong-placement");
            return;
        }

        const correct = isCorrectPlacement(selectedCard, position);

        if (!correct) {
            setIncorrectPlacements((prev) => prev + 1);
            showToast(`✗ Not quite. ${selectedCard.title} was from ${selectedCard.year}.`, false);
            return;
        }

        const newTimeline = [...timeline];
        newTimeline.splice(position, 0, selectedCard);
        newTimeline.sort((a, b) => a.year - b.year);

        setTimeline(newTimeline);
        setHand((prev) => prev.filter((card) => card.deckIndex !== selectedCard.deckIndex));
        setScore((prev) => prev + 120);
        setCorrectPlacements((prev) => prev + 1);
        showToast(`✓ Correct! ${selectedCard.title} was from ${selectedCard.year}.`, true);

        if (stage === "place-printing-press") {
            setStage("feedback-printing-press");
        }

        if (stage === "place-replacement-card") {
            setFinished(true);
            setStage("finished");
        }

        setSelectedCard(null);
        setHoveredSlot(null);
    }

    return (
        <div style={S.page}>
            {toast && <div style={S.toast(toast.correct)}>{toast.msg}</div>}

            <div style={S.header}>
                <div>
                    <h1 style={S.title}>Timeline Tutorial</h1>
                    <p style={S.subtitle}>
                        A guided walkthrough that shows you exactly where to click.
                    </p>
                </div>

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <button style={S.btn("ghost")} onClick={goToProfile}>
                        {storedUserId ? "Profile" : "Login"}
                    </button>
                    <button style={S.btn("ghost")} onClick={() => router.push("/about")}>
                        About
                    </button>
                    <button style={S.btn("primary")} onClick={resetTutorial}>
                        Restart Tutorial
                    </button>
                </div>
            </div>

            <div style={S.grid}>
                <div style={S.panel}>
                    <div style={S.panelTitle}>Current Instruction</div>

                    <div style={S.stepBox}>
                        <p style={{ marginTop: 0 }}>
                            <span style={S.stepBadge}>
                                {stage === "intro"
                                    ? 1
                                    : stage === "select-printing-press"
                                        ? 2
                                        : stage === "place-printing-press"
                                            ? 3
                                            : stage === "feedback-printing-press"
                                                ? 4
                                                : stage === "select-french-revolution-wrong"
                                                    ? 5
                                                    : stage === "place-french-revolution-wrong"
                                                        ? 6
                                                        : stage === "feedback-wrong-placement"
                                                            ? 7
                                                            : stage === "select-replacement-card"
                                                                ? 8
                                                                : stage === "place-replacement-card"
                                                                    ? 9
                                                                    : 10}
                            </span>
                            <strong style={{ color: "#fff" }}>{activeStep.title}</strong>
                        </p>
                        <p>{activeStep.body}</p>
                    </div>

                    <div style={{ height: "12px" }} />

                    <div style={S.panelTitle}>Progress</div>
                    <div style={S.smallMuted}>
                        <div>Selected card: {selectedCard ? selectedCard.title : "none"}</div>
                        <div>Timeline cards: {timeline.length}</div>
                        <div>Cards in hand: {hand.length}</div>
                        <div>Stage: {stage}</div>
                    </div>
                </div>

                <main>
                    <div style={S.timelineArea}>
                        <div style={S.panelTitle}>
                            Timeline
                            {selectedCard && (
                                <span
                                    style={{
                                        color: "rgba(255,255,255,0.6)",
                                        fontWeight: "normal",
                                        marginLeft: "8px",
                                        textTransform: "none",
                                        letterSpacing: "normal",
                                    }}
                                >
                                    — click the highlighted slot
                                </span>
                            )}
                        </div>

                        <div style={S.timelineRow}>
                            <SlotButton
                                position={0}
                                active={hoveredSlot === 0 && selectedCard !== null}
                                canPlace={selectedCard !== null}
                                highlight={isHighlightedSlot(0)}
                                onHover={setHoveredSlot}
                                onPlace={handlePlaceCard}
                                mobile={screen === "mobile"}
                            />

                            {timeline.map((card, i) => (
                                <div key={card.id} style={{ display: "flex", alignItems: "center" }}>
                                    <div style={S.timelineCard}>
                                        <CardVisual symbol={card.symbol} />
                                        <div>{card.title}</div>
                                        <div style={S.cardYear}>{card.year}</div>
                                    </div>

                                    <SlotButton
                                        position={i + 1}
                                        active={hoveredSlot === i + 1 && selectedCard !== null}
                                        canPlace={selectedCard !== null}
                                        highlight={isHighlightedSlot(i + 1)}
                                        onHover={setHoveredSlot}
                                        onPlace={handlePlaceCard}
                                        mobile={screen === "mobile"}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={S.panel}>
                        <div style={S.panelTitle}>
                            Your Hand ({hand.length} cards)
                            {finished && (
                                <span
                                    style={{
                                        color: "rgba(255,255,255,0.6)",
                                        fontWeight: "normal",
                                        marginLeft: "8px",
                                        textTransform: "none",
                                        letterSpacing: "normal",
                                    }}
                                >
                                    — tutorial complete
                                </span>
                            )}
                        </div>

                        {hand.length === 0 ? (
                            <div
                                style={{
                                    color: "rgba(255,255,255,0.55)",
                                    textAlign: "center",
                                    padding: "18px 0",
                                    fontSize: "13px",
                                }}
                            >
                                No cards left. You completed the tutorial.
                            </div>
                        ) : (
                            <div style={S.handRow}>
                                {hand.map((card) => {
                                    const highlighted = isHighlightedHandCard(card);

                                    return (
                                        <div
                                            key={card.deckIndex}
                                            style={{
                                                ...S.handCard(selectedCard?.deckIndex === card.deckIndex),
                                                ...(highlighted ? S.highlightedCard : {}),
                                                opacity:
                                                    stage === "select-printing-press" ||
                                                    stage === "select-french-revolution-wrong" ||
                                                    stage === "select-replacement-card"
                                                        ? highlighted
                                                            ? 1
                                                            : 0.45
                                                        : 1,
                                            }}
                                            onClick={() => handleSelectCard(card)}
                                            title="Click to select this card"
                                        >
                                            <CardVisual symbol={card.symbol} />
                                            <div>{card.title}</div>

                                            {selectedCard?.deckIndex === card.deckIndex && (
                                                <div
                                                    style={{
                                                        color: "#e3cb2c",
                                                        marginTop: "6px",
                                                        fontSize: "10px",
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    ✓ Selected
                                                </div>
                                            )}

                                            <div
                                                style={{
                                                    color: "rgba(255,255,255,0.45)",
                                                    marginTop: "8px",
                                                    fontSize: "10px",
                                                }}
                                            >
                                                Year hidden
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </main>

                <aside style={{ display: "grid", gap: "12px" }}>
                    <div style={S.panel}>
                        <div style={S.panelTitle}>Your Tutorial Stats</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
                            <StatRow label="Score" value={<strong style={{ color: "#e3cb2c" }}>{score}</strong>} />
                            <StatRow label="Correct" value={`${correctPlacements} ✓`} />
                            <StatRow label="Wrong" value={`${incorrectPlacements} ✗`} />
                            <StatRow label="Mode" value="Timeline" />
                        </div>
                    </div>

                    <div style={S.panel}>
                        <div style={S.panelTitle}>How to Play</div>
                        <ol
                            style={{
                                fontSize: "11px",
                                color: "rgba(255,255,255,0.72)",
                                paddingLeft: "16px",
                                lineHeight: "1.9",
                                margin: 0,
                            }}
                        >
                            <li>Select the highlighted card.</li>
                            <li>Click the highlighted timeline slot.</li>
                            <li>The year is revealed after placement.</li>
                            <li>Correct cards stay in the timeline.</li>
                            <li>Score points and continue.</li>
                        </ol>
                    </div>

                    {finished && (
                        <div style={S.panel}>
                            <div style={S.panelTitle}>Finished</div>
                            <p style={S.smallMuted}>
                                You now know the main gameplay loop. In a real game, this happens with
                                multiple players, turn timers, scores, and live updates.
                            </p>
                            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "12px" }}>
                                <button style={S.btn("primary")} onClick={goToProfile}>
                                    Back to Profile
                                </button>
                                <button style={S.btn("ghost")} onClick={resetTutorial}>
                                    Try Again
                                </button>
                            </div>
                        </div>
                    )}
                </aside>
            </div>

            {stage === "intro" && (
                <CoachBubble
                    title="Welcome to the tutorial"
                    body="You will play a short guided round. The tutorial highlights exactly what you need to click."
                >
                    <button style={S.btn("primary")} onClick={() => setStage("select-printing-press")}>
                        Start Tutorial
                    </button>
                </CoachBubble>
            )}

            {stage === "select-printing-press" && (
                <CoachBubble
                    title="Step 1: Select a card"
                    body="Click the highlighted card: “Invention of the Printing Press”."
                />
            )}

            {stage === "place-printing-press" && (
                <CoachBubble
                    title="Step 2: Place the card"
                    body="Click the highlighted slot between 476 and 1969."
                />
            )}

            {stage === "feedback-printing-press" && (
                <CoachBubble
                    title="Correct!"
                    body="The card stayed in the timeline and its year was revealed. Next, you will see what happens after a wrong placement."
                >
                    <button style={S.btn("primary")} onClick={() => setStage("select-french-revolution-wrong")}>
                        Continue
                    </button>
                </CoachBubble>
            )}

            {stage === "select-french-revolution-wrong" && (
                <CoachBubble
                    title="Step 3: Select the next card"
                    body="Click the highlighted card: “French Revolution Begins”."
                />
            )}

            {stage === "place-french-revolution-wrong" && (
                <CoachBubble
                    title="Step 4: Wrong placement"
                    body="For this tutorial step, click the highlighted slot before 476. This is intentionally wrong."
                />
            )}

            {stage === "feedback-wrong-placement" && (
                <CoachBubble
                    title="Wrong!"
                    body="The card was discarded and a new card was drawn. This is what happens in the real game after an incorrect placement."
                >
                    <button style={S.btn("primary")} onClick={() => setStage("select-replacement-card")}>
                        Continue
                    </button>
                </CoachBubble>
            )}

            {stage === "select-replacement-card" && (
                <CoachBubble
                    title="Step 5: Select the new card"
                    body="Click the highlighted replacement card: “Declaration of Independence”."
                />
            )}

            {stage === "place-replacement-card" && (
                <CoachBubble
                    title="Step 6: Place the new card"
                    body="Click the highlighted slot between 1440 and 1969."
                />
            )}

            {stage === "finished" && (
                <CoachBubble
                    title="Tutorial complete"
                    body="You now know what happens after both correct and wrong placements."
                >
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                        <button style={S.btn("primary")} onClick={goToProfile}>
                            Back to Profile
                        </button>
                        <button style={S.btn("ghost")} onClick={resetTutorial}>
                            Try Again
                        </button>
                    </div>
                </CoachBubble>
            )}
        </div>
    );
}

function CardVisual({ symbol }: { symbol: TutorialCard["symbol"] }) {
    const config: Record<
        TutorialCard["symbol"],
        {
            label: string;
            mark: string;
            lines: number;
            seal?: boolean;
            star?: boolean;
        }
    > = {
        rome: {
            label: "ROMA",
            mark: "IV",
            lines: 3,
        },
        moon: {
            label: "APOLLO",
            mark: "XI",
            lines: 2,
            star: true,
        },
        print: {
            label: "PRESS",
            mark: "G",
            lines: 4,
        },
        france: {
            label: "PARIS",
            mark: "FR",
            lines: 3,
        },
        declaration: {
            label: "1776",
            mark: "US",
            lines: 4,
            seal: true,
        },
    };

    const item = config[symbol];

    return (
        <div
            style={{
                width: "100%",
                height: "88px",
                borderRadius: "10px",
                marginBottom: "8px",
                border: "1px solid rgba(255,255,255,0.12)",
                background:
                    "linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.035))",
                position: "relative",
                overflow: "hidden",
                boxShadow: "inset 0 0 18px rgba(255,255,255,0.035)",
            }}
        >
            {/* inner frame */}
            <div
                style={{
                    position: "absolute",
                    inset: "9px",
                    border: "1px solid rgba(227,203,44,0.20)",
                    borderRadius: "7px",
                }}
            />

            {/* subtle watermark */}
            <div
                style={{
                    position: "absolute",
                    right: "-10px",
                    top: "-12px",
                    width: "54px",
                    height: "54px",
                    borderRadius: "50%",
                    border: "1px solid rgba(227,203,44,0.10)",
                    background: "rgba(227,203,44,0.035)",
                }}
            />

            {/* document block */}
            <div
                style={{
                    position: "absolute",
                    left: "18px",
                    top: "17px",
                    width: "52px",
                    height: "48px",
                    borderRadius: "5px",
                    border: "1px solid rgba(255,255,255,0.18)",
                    background: "rgba(10,28,68,0.20)",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: "8px",
                        left: "8px",
                        color: "rgba(227,203,44,0.72)",
                        fontSize: "13px",
                        fontWeight: "bold",
                        letterSpacing: "0.08em",
                    }}
                >
                    {item.mark}
                </div>

                {Array.from({ length: item.lines }).map((_, index) => (
                    <div
                        key={index}
                        style={{
                            position: "absolute",
                            left: "8px",
                            top: `${28 + index * 6}px`,
                            width: `${28 - index * 3}px`,
                            height: "2px",
                            borderRadius: "2px",
                            background: "rgba(255,255,255,0.22)",
                        }}
                    />
                ))}

                {item.seal && (
                    <div
                        style={{
                            position: "absolute",
                            right: "7px",
                            bottom: "7px",
                            width: "12px",
                            height: "12px",
                            borderRadius: "50%",
                            border: "2px solid rgba(227,203,44,0.55)",
                        }}
                    />
                )}

                {item.star && (
                    <div
                        style={{
                            position: "absolute",
                            right: "8px",
                            top: "8px",
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: "rgba(227,203,44,0.58)",
                            boxShadow:
                                "10px 8px 0 rgba(255,255,255,0.22), -4px 18px 0 rgba(255,255,255,0.18)",
                        }}
                    />
                )}
            </div>

            {/* label */}
            <div
                style={{
                    position: "absolute",
                    right: "10px",
                    bottom: "8px",
                    fontSize: "8px",
                    letterSpacing: "0.14em",
                    color: "rgba(227,203,44,0.58)",
                    fontWeight: "bold",
                }}
            >
                {item.label}
            </div>
        </div>
    );
}

function RomeIcon() {
    return (
        <div style={{ display: "flex", alignItems: "flex-end", gap: "5px" }}>
            {[0, 1, 2, 3].map((i) => (
                <div
                    key={i}
                    style={{
                        width: "9px",
                        height: "34px",
                        borderRadius: "2px 2px 0 0",
                        background: "rgba(255,255,255,0.72)",
                        boxShadow: "0 0 10px rgba(255,255,255,0.08)",
                    }}
                />
            ))}
            <div
                style={{
                    position: "absolute",
                    width: "62px",
                    height: "7px",
                    transform: "translateY(-38px)",
                    borderRadius: "2px",
                    background: "rgba(227,203,44,0.72)",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    width: "72px",
                    height: "6px",
                    transform: "translateY(6px)",
                    borderRadius: "2px",
                    background: "rgba(227,203,44,0.42)",
                }}
            />
        </div>
    );
}

function MoonIcon() {
    return (
        <div style={{ position: "relative", width: "70px", height: "48px" }}>
            <div
                style={{
                    position: "absolute",
                    left: "6px",
                    top: "6px",
                    width: "34px",
                    height: "34px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.78)",
                    boxShadow: "0 0 18px rgba(255,255,255,0.16)",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    right: "10px",
                    bottom: "5px",
                    width: "22px",
                    height: "30px",
                    borderRadius: "10px 10px 5px 5px",
                    border: "2px solid rgba(227,203,44,0.75)",
                    background: "rgba(10,28,68,0.55)",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    right: "16px",
                    bottom: "0px",
                    width: "10px",
                    height: "10px",
                    borderLeft: "2px solid rgba(227,203,44,0.65)",
                    borderBottom: "2px solid rgba(227,203,44,0.65)",
                    transform: "rotate(-45deg)",
                }}
            />
        </div>
    );
}

function PrintingPressIcon() {
    return (
        <div style={{ position: "relative", width: "74px", height: "52px" }}>
            <div
                style={{
                    position: "absolute",
                    top: "8px",
                    left: "14px",
                    width: "46px",
                    height: "8px",
                    borderRadius: "3px",
                    background: "rgba(227,203,44,0.75)",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    top: "18px",
                    left: "18px",
                    width: "38px",
                    height: "24px",
                    borderRadius: "4px",
                    border: "2px solid rgba(255,255,255,0.65)",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    top: "25px",
                    left: "25px",
                    width: "24px",
                    height: "2px",
                    background: "rgba(255,255,255,0.55)",
                    boxShadow:
                        "0 6px 0 rgba(255,255,255,0.45), 0 12px 0 rgba(255,255,255,0.35)",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    bottom: "3px",
                    left: "10px",
                    width: "54px",
                    height: "6px",
                    borderRadius: "2px",
                    background: "rgba(227,203,44,0.45)",
                }}
            />
        </div>
    );
}

function RevolutionIcon() {
    return (
        <div style={{ position: "relative", width: "70px", height: "52px" }}>
            <div
                style={{
                    position: "absolute",
                    left: "34px",
                    top: "8px",
                    width: "3px",
                    height: "36px",
                    background: "rgba(255,255,255,0.70)",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    left: "37px",
                    top: "10px",
                    width: "26px",
                    height: "18px",
                    borderRadius: "2px 8px 8px 2px",
                    background:
                        "linear-gradient(90deg, rgba(255,255,255,0.82), rgba(227,203,44,0.65))",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    left: "13px",
                    bottom: "6px",
                    width: "44px",
                    height: "8px",
                    borderRadius: "50% 50% 3px 3px",
                    background: "rgba(227,203,44,0.52)",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    left: "18px",
                    bottom: "14px",
                    width: "34px",
                    height: "14px",
                    borderRadius: "50% 50% 0 0",
                    borderTop: "2px solid rgba(255,255,255,0.62)",
                }}
            />
        </div>
    );
}

function DeclarationIcon() {
    return (
        <div style={{ position: "relative", width: "66px", height: "54px" }}>
            <div
                style={{
                    position: "absolute",
                    left: "13px",
                    top: "6px",
                    width: "40px",
                    height: "42px",
                    borderRadius: "4px",
                    background: "rgba(255,255,255,0.74)",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    left: "20px",
                    top: "16px",
                    width: "26px",
                    height: "2px",
                    background: "rgba(10,28,68,0.52)",
                    boxShadow:
                        "0 7px 0 rgba(10,28,68,0.42), 0 14px 0 rgba(10,28,68,0.32)",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    right: "9px",
                    bottom: "8px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    border: "2px solid rgba(227,203,44,0.85)",
                }}
            />
        </div>
    );
}

function CoachBubble({
                         title,
                         body,
                         children,
                     }: {
    title: string;
    body: string;
    children?: React.ReactNode;
}) {
    return (
        <div
            style={{
                position: "fixed",
                left: "50%",
                bottom: "28px",
                transform: "translateX(-50%)",
                width: "min(520px, calc(100vw - 28px))",
                background: "linear-gradient(180deg, rgba(19,47,99,0.98), rgba(10,28,68,0.98))",
                border: "1px solid rgba(227,203,44,0.55)",
                borderRadius: "18px",
                padding: "18px 20px",
                boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
                zIndex: 3000,
                color: "#fff",
                fontFamily: "Georgia, serif",
            }}
        >
            <div
                style={{
                    color: "#e3cb2c",
                    fontWeight: "bold",
                    fontSize: "15px",
                    marginBottom: "8px",
                    letterSpacing: "0.04em",
                }}
            >
                {title}
            </div>

            <div
                style={{
                    color: "rgba(255,255,255,0.74)",
                    fontSize: "13px",
                    lineHeight: 1.6,
                    marginBottom: children ? "14px" : 0,
                }}
            >
                {body}
            </div>

            {children}
        </div>
    );
}

function SlotButton({
                        position,
                        active,
                        canPlace,
                        highlight = false,
                        onHover,
                        onPlace,
                        mobile,
                    }: {
    position: number;
    active: boolean;
    canPlace: boolean;
    highlight?: boolean;
    onHover: (pos: number | null) => void;
    onPlace: (pos: number) => void;
    mobile: boolean;
}) {
    return (
        <div
            style={{
                minWidth: active || highlight ? (mobile ? "22px" : "28px") : mobile ? "12px" : "14px",
                height: mobile ? "132px" : "148px",
                background: active || highlight ? "rgba(227,203,44,0.30)" : "rgba(255,255,255,0.08)",
                border: active || highlight ? "2px dashed #e3cb2c" : "1px dashed rgba(255,255,255,0.16)",
                borderRadius: "8px",
                cursor: canPlace ? "pointer" : "default",
                flexShrink: 0,
                transition: "all 0.15s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: mobile ? "14px" : "16px",
                color: active || highlight ? "#e3cb2c" : "transparent",
                boxShadow: highlight
                    ? "0 0 0 6px rgba(227,203,44,0.18), 0 0 28px rgba(227,203,44,0.35)"
                    : "none",
                transform: highlight ? "scale(1.05)" : "scale(1)",
            }}
            onClick={() => canPlace && onPlace(position)}
            onMouseEnter={() => canPlace && onHover(position)}
            onMouseLeave={() => onHover(null)}
        >
            {active || highlight ? "+" : ""}
        </div>
    );
}

function StatRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
            <span style={{ color: "rgba(255,255,255,0.55)" }}>{label}</span>
            <span>{value}</span>
        </div>
    );
}