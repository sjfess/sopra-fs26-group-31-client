"use client";

import { Button } from "antd";
import styles from "@/styles/page.module.css";
import React from "react";

interface VictorPopupProps {
    name: string;
    onClose: () => void;
}

export default function VictorPopup({ name, onClose }: VictorPopupProps) {
    return (
        <div
            onClick={onClose}
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.75)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
                cursor: "pointer",
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: "#102b6a",
                    border: "3px solid #e3cb2c",
                    borderRadius: 12,
                    padding: "32px 40px",
                    maxWidth: 500,
                    width: "90%",
                    textAlign: "center",
                    fontFamily: "Georgia, serif",
                    boxShadow: "0 8px 48px rgba(0,0,0,0.8)",
                    animation: "popIn 0.35s cubic-bezier(0.34,1.56,0.64,1)",
                }}
            >
                <p
                    style={{
                        color: "#e3cb2c",
                        fontSize: "2rem",
                        fontWeight: "bold",
                        marginBottom: 16,
                        letterSpacing: 2,
                        textShadow: "0 0 20px #e3cb2c88",
                    }}
                >
                    ⚔️ VICTOR ES TU! ⚔️
                </p>

                <img
                    src="/victor.png"
                    alt="Roman emperor celebrating victory"
                    style={{
                        width: "100%",
                        borderRadius: 8,
                        border: "2px solid #e3cb2c44",
                        marginBottom: 16,
                    }}
                />

                <p style={{ color: "#cdd8f0", fontSize: "1.1rem", marginBottom: 20 }}>
                    Congratulations,{" "}
                    <strong style={{ color: "#e3cb2c" }}>{name}</strong>!
                </p>

                <Button
                    className={styles.btnPrimary}
                    style={{ borderRadius: 999 }}
                    onClick={onClose}
                >
                    Gloria! 🏛️
                </Button>
            </div>

            <style>{`
        @keyframes popIn {
          from { transform: scale(0.6); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
      `}</style>
        </div>
    );
}