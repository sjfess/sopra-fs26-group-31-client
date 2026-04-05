"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "antd";

interface NavbarProps {
    onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
    const router = useRouter();

    const navLinkStyle: React.CSSProperties = {
        color: "white",
        cursor: "pointer",
        fontSize: "0.95rem",
    };

    const activeLinkStyle: React.CSSProperties = {
        ...navLinkStyle,
        borderBottom: "2px solid #e3cb2c",
        paddingBottom: "2px",
    };

    return (
        <nav
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 32px",
                borderBottom: "1px solid #1e3a7a",
            }}
        >
      <span
          style={{
              color: "#e3cb2c",
              fontFamily: "Georgia, serif",
              fontWeight: "bold",
              fontSize: "1.2rem",
          }}
      >
        Historical Reconstruction
      </span>

            <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
        <span onClick={() => router.push("/")} style={navLinkStyle}>
          Home
        </span>
                <span style={activeLinkStyle}>Profile</span>
                <span onClick={() => router.push("/leaderboard")} style={navLinkStyle}>
          Leaderboard
        </span>
                <span onClick={() => router.push("/about")} style={navLinkStyle}>
          About
        </span>
            </div>

            <Button
                onClick={onLogout}
                style={{
                    borderRadius: "999px",
                    backgroundColor: "#e3cb2c",
                    borderColor: "#e3cb2c",
                    color: "#0f2557",
                    fontWeight: "bold",
                }}
            >
                Log Out
            </Button>
        </nav>
    );
};

export default Navbar;