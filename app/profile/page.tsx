"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import { User } from "@/types/user";
import { Button, Input, Spin } from "antd";
import GameHub from "./components/GameHub";

const Profile: React.FC = () => {
  const router = useRouter();
  const apiService = useApi();
  const { value: token, clear: clearToken } = useLocalStorage<string>("token", "");
  const { value: userId, clear: clearUserId } = useLocalStorage<string>("userId", "");
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await apiService.get<User>(`/users/${userId}`);
        setUser(response);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, [mounted, token, userId]);

  const handleLogout = async () => {
    try {
      await apiService.post("/auth/logout", {});
    } catch {
      // proceed with logout even if request fails
    }
    clearToken();
    clearUserId();
    router.push("/login");
  };

  if (!user) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#0f2557" }}>
        <Spin size="large" />
      </div>
    );
  }

  const cardStyle: React.CSSProperties = {
    backgroundColor: "#0d1b4b",
    border: "1px solid #e3cb2c",
    borderRadius: "12px",
    padding: "24px",
  };

  const cardTitleStyle: React.CSSProperties = {
    color: "#e3cb2c",
    fontFamily: "Georgia, serif",
    fontSize: "1.1rem",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "16px",
  };

  const statBoxStyle: React.CSSProperties = {
    backgroundColor: "#0f2557",
    border: "1px solid #e3cb2c",
    borderRadius: "8px",
    padding: "12px",
    textAlign: "center",
    flex: 1,
  };

  return (
    <div style={{ backgroundColor: "#0f2557", minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* Navbar */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 32px", borderBottom: "1px solid #1e3a7a",
      }}>
        <span style={{ color: "#e3cb2c", fontFamily: "Georgia, serif", fontWeight: "bold", fontSize: "1.2rem" }}>
          Historical Reconstruction
        </span>
        <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
          <span onClick={() => router.push("/")} style={{ color: "white", cursor: "pointer" }}>Home</span>
          <span style={{ color: "white", borderBottom: "2px solid #e3cb2c", paddingBottom: "2px", cursor: "pointer" }}>Profile</span>
          <span onClick={() => router.push("/leaderboard")} style={{ color: "white", cursor: "pointer" }}>Leaderboard</span>
          <span onClick={() => router.push("/about")} style={{ color: "white", cursor: "pointer" }}>About</span>
        </div>
        <Button
          onClick={handleLogout}
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

      {/* Main 3-column layout */}
      <div style={{ display: "flex", gap: "24px", padding: "24px 32px", flex: 1 }}>

        {/* Left: User Profile */}
        <div style={{ ...cardStyle, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
          <h2 style={cardTitleStyle}>User Profile</h2>

          {/* Avatar */}
          <div style={{
            width: "120px", height: "80px",
            backgroundColor: "#c8a97e",
            borderRadius: "50%",
            marginBottom: "8px",
          }} />

          <div style={{ textAlign: "center" }}>
            <div style={{ color: "white", fontWeight: "bold", fontSize: "1.2rem" }}>{user.username}</div>
            <div style={{ color: "#4caf50", fontSize: "0.9rem" }}>{user.status === "ONLINE" ? "Online" : "Offline"}</div>
          </div>

          {/* Stats grid */}
          <div style={{ display: "flex", gap: "8px", width: "100%" }}>
            <div style={statBoxStyle}>
              <div style={{ color: "#cdd8f0", fontSize: "0.75rem" }}>Games Played</div>
              <div style={{ color: "#e3cb2c", fontWeight: "bold", fontSize: "1.4rem" }}>{user.totalGamesPlayed ?? 0}</div>
            </div>
            <div style={statBoxStyle}>
              <div style={{ color: "#cdd8f0", fontSize: "0.75rem" }}>Wins</div>
              <div style={{ color: "#e3cb2c", fontWeight: "bold", fontSize: "1.4rem" }}>{user.totalWins ?? 0}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px", width: "100%" }}>
            <div style={statBoxStyle}>
              <div style={{ color: "#cdd8f0", fontSize: "0.75rem" }}>Avg. Points</div>
              <div style={{ color: "#e3cb2c", fontWeight: "bold", fontSize: "1.4rem" }}>{user.totalGamesPlayed ? Math.round((user.totalPoints ?? 0) / user.totalGamesPlayed) : 0}</div>
            </div>
            <div style={statBoxStyle}>
              <div style={{ color: "#cdd8f0", fontSize: "0.75rem" }}>Accuracy</div>
              <div style={{ color: "#e3cb2c", fontWeight: "bold", fontSize: "1.4rem" }}>0%</div>
            </div>
          </div>
        </div>

        {/* Middle: Friends */}
        <div style={{ ...cardStyle, flex: 1.2, display: "flex", flexDirection: "column", gap: "12px" }}>
          <h2 style={cardTitleStyle}>Friends</h2>

          <Input placeholder="Add Friend" suffix={<span style={{ cursor: "pointer" }}>🔍</span>} />

          <div>
            <div style={{ color: "#e3cb2c", fontWeight: "bold", marginBottom: "8px" }}>Friend Requests</div>
            <div style={{ color: "#cdd8f0", fontSize: "0.85rem", fontStyle: "italic" }}>No pending requests</div>
          </div>

          <div>
            <div style={{ color: "#e3cb2c", fontWeight: "bold", marginBottom: "8px" }}>Friends List</div>
            <div style={{ color: "#cdd8f0", fontSize: "0.85rem", fontStyle: "italic" }}>No friends yet</div>
          </div>
        </div>

        {/* Right: Game Hub */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>
          <GameHub />
        </div>

      </div>
    </div>
  );
};

export default Profile;