"use client";

import { useRouter } from "next/navigation";
import { Button } from "antd";
import styles from "@/styles/page.module.css";

export default function Navbar() {
    const router = useRouter();

    return (
        <nav className={styles.navbar}>
            <span className={styles.navTitle}>Historical Reconstruction</span>

            <div className={styles.navLinks}>
                {["Home", "Profile", "Leaderboard", "About"].map((label) => (
                    <span key={label} onClick={() => router.push(`/${label.toLowerCase()}`)}>
            {label}
          </span>
                ))}
            </div>

            <Button
                className={styles.btnPrimary}
                style={{ height: 36, padding: "0 20px", fontSize: "0.9rem" }}
                onClick={() => router.push("/gamelobby")}
            >
                Play
            </Button>
        </nav>
    );
}