"use client";

import React from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/page.module.css";

interface TeamMember {
    name: string;
    github: string;
}

const TEAM: TeamMember[] = [
    { name: "Alex Wimmer",              github: "AlexWimmer1" },
    { name: "Arthur Csaky-Pallavicini", github: "milchazor"   },
    { name: "Colin Kreienbühl",         github: "Fanelock"    },
    { name: "Marco Büchel",             github: "marcokingo"  },
    { name: "Samuel Fessler",           github: "sjfess"      },
];

const HOW_TO_PLAY = [
    {
        step: "1",
        title: "Create or join a lobby",
        body: "Start a new game by choosing a historical era (Ancient, Medieval, Renaissance, Modern, or Information Age) and a difficulty. Share your lobby code with friends, or join theirs.",
    },
    {
        step: "2",
        title: "Build the timeline",
        body: "Each player holds a hand of five event cards drawn from history. On your turn, click a slot in the shared timeline to place your card in the correct chronological position.",
    },
    {
        step: "3",
        title: "Score points",
        body: "A correct placement earns 100 base points, plus a time bonus of up to 2 pts/second for how quickly you play within the turn time limit. Chain correct placements to build a streak: each consecutive hit adds an extra 10 points on top.",
    },
    {
        step: "4",
        title: "Wrong placement",
        body: "An incorrect placement resets your streak and your card is discarded. You immediately draw a replacement, so your hand stays full.",
    },
    {
        step: "5",
        title: "Game modes",
        body: "In competitive mode players race to outscore each other. In collaborative mode the whole team works together via the in-game chat to reconstruct history as one shared timeline.",
    },
    {
        step: "6",
        title: "Victory",
        body: "The game ends when the deck runs out. The player with the most points wins: check the results screen for full stats, accuracy, and longest streak.",
    },
];

export default function AboutPage() {
    const router = useRouter();

    return (
        <div className={styles.aboutPage}>

            <nav className="app-navbar">
                <span className="app-navbar-title">Historical Reconstruction</span>
                <div className="app-navbar-links">
                    <span onClick={() => router.push("/")}>Home</span>
                    <span onClick={() => router.push("/leaderboard")}>Leaderboard</span>
                </div>
            </nav>

            {/* Hero */}
            <div className={styles.aboutHero}>
                <h1 className={styles.aboutHeroTitle}>About Historical Reconstruction</h1>
                <p className={styles.aboutHeroSub}>
                    A turn-based historical card game built by five Computer Science
                    students at the University of Zurich as part of the SoPra FS26 course.
                    Test your knowledge of history, and your nerves under time pressure.
                </p>
            </div>

            {/* How to play */}
            <div className={styles.aboutSection}>
                <p className={styles.aboutSectionTitle}>How to Play</p>
                <div className={styles.aboutStepsGrid}>
                    {HOW_TO_PLAY.map((s) => (
                        <div key={s.step} className={styles.aboutStepCard}>
                            <div className={styles.aboutStepBadge}>{s.step}</div>
                            <p className={styles.aboutStepTitle}>{s.title}</p>
                            <p className={styles.aboutStepBody}>{s.body}</p>
                        </div>
                    ))}
                </div>
            </div>

            <hr className={styles.aboutDivider} />

            {/* Why we built it */}
            <div className={styles.aboutSection}>
                <p className={styles.aboutSectionTitle}>Why We Built This</p>
                <div className={styles.aboutWhyBox}>
                    We wanted to combine the satisfying click of a well-placed card game
                    with something genuinely educational. History is full of moments that
                    are hard to keep in order: the printing press, the moon landing, the
                    fall of Constantinople, and we thought putting them on a shared
                    timeline, under time pressure, against friends, would make them stick.
                    The competitive mode rewards speed and streaks; the collaborative mode
                    rewards discussion and consensus. Both reward knowing your history.
                </div>
            </div>

            <hr className={styles.aboutDivider} />

            {/* Team */}
            <div className={styles.aboutSection}>
                <p className={styles.aboutSectionTitle}>The Team</p>
                <div className={styles.aboutTeamGrid}>
                    {TEAM.map((m) => (
                        <div key={m.github} className={styles.aboutMemberCard}>
                            <p className={styles.aboutMemberName}>{m.name}</p>
                            <a
                                href={`https://github.com/${m.github}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.aboutMemberGithub}
                            >
                                @{m.github}
                            </a>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}