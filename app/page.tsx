"use client";

import { useRouter } from "next/navigation";
import { Button } from "antd";
import styles from "@/styles/page.module.css";

export default function Home() {
  const router = useRouter();

  return (
      <div className={styles.page}>
        <nav className={styles.navbar}>
          <span className={styles.navTitle}>Historical Reconstruction</span>
          <div className={styles.navLinks}>
            <span onClick={() => router.push("/about")}>About</span>
            <span onClick={() => router.push("/leaderboard")}>Leaderboard</span>
          </div>
        </nav>

        <main className={styles.main}>
          <div className={styles.logo}>
            <span className={styles.logoText}>HR</span>
            <span className={styles.logoSub}>FS26</span>
          </div>

          <h1 className={styles.title}>Historical Reconstruction</h1>
          <p className={styles.subtitle}>Rebuild the past, card by card.</p>
          <p className={styles.description}>
            Compete with friends by placing historical events in the correct order.
          </p>

          <div className={styles.buttons}>
            <Button
                size="large"
                className={styles.btnPrimary}
                onClick={() => router.push("/login")}
            >
              Log In
            </Button>
            <Button
                size="large"
                className={styles.btnSecondary}
                onClick={() => router.push("/register")}
            >
              Register
            </Button>
          </div>
        </main>
      </div>
  );
}