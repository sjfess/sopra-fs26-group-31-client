"use client";

import { useRouter } from "next/navigation";
import { Button } from "antd";
import styles from "@/styles/page.module.css";

export default function Navbar() {
    const router = useRouter();

    const goToProfile = () => {
        const raw = sessionStorage.getItem("userId");
        const userId = raw ? JSON.parse(raw) : null;
        if (userId) {
            router.push(`/profile/${userId}`);
        } else {
            router.push("/login");
        }
    };

    const navItems: { label: string; action: () => void }[] = [
        { label: "Home", action: goToProfile },
        { label: "Profile", action: goToProfile },
        { label: "Leaderboard", action: () => router.push("/leaderboard") },
        { label: "About", action: () => router.push("/about") },
    ];

    return (
        <nav className={styles.navbar}>
            <span className={styles.navTitle}>Historical Reconstruction</span>

            <div className={styles.navLinks}>
                {navItems.map((item) => (
                    <span key={item.label} onClick={item.action}>
                        {item.label}
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