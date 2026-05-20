"use client";

import { useRouter } from "next/navigation";
import { Button } from "antd";
import styles from "@/styles/page.module.css";
import AppNavbar from "@/components/AppNavbar";

export default function Home() {
  const router = useRouter();

  return (
      <div className={styles.page}>
        <AppNavbar
            variant="minimal"
            minimalLinks={[
              { label: "About", href: "/about" },
              { label: "Leaderboard", href: "/leaderboard" },
              { label: "Home", href: "/" },
            ]}
        />

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
              <Button
                  size="large"
                  className={styles.btnSecondary}
                  onClick={() => router.push("/tutorial")}
              >
                  Tutorial
              </Button>
          </div>
        </main>
      </div>
  );
}